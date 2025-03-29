import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, List, ListItem, Avatar, Zoom, Fab, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';

// Create a custom axios instance with better timeout handling
const chatbotApi = axios.create({
  timeout: 15000, // Reduced from 30s to 15s for faster failure
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add a baseURL to make sure we're consistent
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000',
  // Don't follow redirects
  maxRedirects: 0,
  // Don't retry
  retry: false,
  // Don't validate status (we'll handle errors ourselves)
  validateStatus: null,
  // Prevent any WebSocket connection attempts
  socketPath: null
});

// Fallback responses when backend is unavailable
const fallbackResponses = [
  "I'm sorry, I can't connect to the server right now. Please try again later.",
  "The server appears to be unavailable at the moment. Here are some things you can do with HopeBridge: donate to causes, browse fundraising campaigns, or create your own campaign.",
  "I'm having trouble reaching the server. HopeBridge is a platform that connects donors with people in need.",
  "Server connection issues detected. HopeBridge helps facilitate charitable giving and support.",
  "Sorry for the inconvenience, but I can't access the server. You can still explore the website while waiting.",
];

const getRandomFallbackResponse = () => {
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your HopeBridge assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'unknown', 'online', 'offline'
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const healthCheckTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cancel any pending requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
      // Clear any pending health check timeouts
      if (healthCheckTimeoutRef.current) {
        clearTimeout(healthCheckTimeoutRef.current);
      }
    };
  }, [abortController]);

  const simplifyQuery = (query) => {
    // Keep queries short and simple
    if (query.length > 100) {
      return query.substring(0, 100) + "...";
    }
    return query;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    // Cancel any previous pending requests
    if (abortController) {
      abortController.abort();
    }

    // Create a new abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const simplifiedQuery = simplifyQuery(userMessage);
      
      let response;
      // First try the direct endpoint first as it's faster
      try {
        response = await chatbotApi.post('/api/chatbot/direct/', 
          { query: simplifiedQuery },
          { signal: controller.signal }
        );
        
        // Check if we got a valid response
        if (response.status === 200 && response.data.response) {
          if (!controller.signal.aborted) {
            setMessages(prev => [...prev, { 
              text: response.data.response, 
              isBot: true 
            }]);
            setApiStatus('online');
          }
          return;
        }
      } catch (directError) {
        // If the direct endpoint fails, we'll try the AI endpoint below
        console.log('Direct endpoint failed:', directError);
        if (controller.signal.aborted) throw directError;
      }
      
      // If direct endpoint failed or returned invalid response, try the AI endpoint
      try {
        response = await chatbotApi.post('/api/chatbot/query/', 
          { query: simplifiedQuery },
          { signal: controller.signal }
        );
        
        if (!controller.signal.aborted) {
          if (response.data.error) {
            throw new Error(response.data.error);
          }

          setMessages(prev => [...prev, { 
            text: response.data.response || "Sorry, I couldn't generate a response.", 
            isBot: true 
          }]);
          
          setApiStatus('online');
        }
      } catch (aiError) {
        // Both endpoints failed
        console.error('Both chatbot endpoints failed:', aiError);
        throw aiError;
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Check if API is down
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500 || error.message === 'Request timed out') {
        setApiStatus('offline');
      }
      
      // Ignore socket.io related errors
      if (error.message && error.message.includes('socket.io')) {
        console.warn('Ignoring socket.io related error');
        return;
      }
      
      // Only show error if this request wasn't manually aborted
      if (!controller.signal.aborted) {
        // Use a random fallback response instead of a generic error message
        const fallbackResponse = getRandomFallbackResponse();

        setMessages(prev => [...prev, { 
          text: fallbackResponse,
          isBot: true,
          isError: true
        }]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setAbortController(null);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Cancel current request if user starts typing
  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // If user starts typing a new message while waiting for a response, cancel the current request
    if (isLoading && abortController) {
      abortController.abort();
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const toggleChat = () => {
    if (!isChatOpen) {
      setIsChatOpen(true);
      // Reset minimized state when reopening
      setIsMinimized(false);
    } else {
      // If chat is already open, close it
      setIsChatOpen(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chat toggle button (only visible when chat is closed) */}
      {!isChatOpen && (
        <Zoom in={!isChatOpen}>
          <Tooltip title="Open chat assistant">
            <Fab 
              color="primary" 
              aria-label="chat"
              onClick={toggleChat}
              sx={{ 
                position: 'fixed',
                bottom: 20,
                right: 20,
                boxShadow: 3
              }}
            >
              <ChatIcon />
            </Fab>
          </Tooltip>
        </Zoom>
      )}

      {/* Main chatbot component */}
      {isChatOpen && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            width: 350, 
            height: isMinimized ? 'auto' : 450,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: 3
          }}
        >
          <Box sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            pt: { xs: 2, sm: 2.5 },
            pb: { xs: 2, sm: 2.5 },
            backgroundColor: 'primary.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="h6">HopeBridge Assistant</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small" 
                onClick={toggleMinimize} 
                sx={{ 
                  color: 'white',
                  padding: '6px',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
                }}
              >
                {isMinimized ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
              <IconButton 
                size="small" 
                onClick={toggleChat} 
                sx={{ 
                  color: 'white', 
                  padding: '6px',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {!isMinimized && (
            <>
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                p: 2,
                backgroundColor: '#f5f5f5'
              }}>
                <List>
                  {messages.map((message, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                        mb: 1,
                        gap: 1
                      }}
                    >
                      {message.isBot && (
                        <Avatar 
                          src={undefined}
                          sx={{ 
                            bgcolor: message.isError ? 'error.main' : 'primary.main',
                            width: 32,
                            height: 32
                          }}
                        >
                          <SmartToyIcon fontSize="small" />
                        </Avatar>
                      )}
                      <Paper
                        sx={{
                          p: 1.5,
                          maxWidth: '75%',
                          backgroundColor: message.isBot 
                            ? message.isError ? '#FFF4F4' : 'white' 
                            : 'primary.main',
                          color: message.isBot 
                            ? message.isError ? 'error.dark' : 'text.primary'
                            : 'white',
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="body1">
                          {message.text}
                        </Typography>
                      </Paper>
                      {!message.isBot && (
                        <Avatar 
                          src={undefined}
                          sx={{ 
                            bgcolor: 'secondary.main',
                            width: 32,
                            height: 32
                          }}
                        >
                          <PersonIcon fontSize="small" />
                        </Avatar>
                      )}
                    </ListItem>
                  ))}
                  {isLoading && (
                    <ListItem sx={{ justifyContent: 'flex-start', gap: 1 }}>
                      <Avatar 
                        src={undefined}
                        sx={{ 
                          bgcolor: 'primary.main',
                          width: 32,
                          height: 32
                        }}
                      >
                        <SmartToyIcon fontSize="small" />
                      </Avatar>
                      <Paper sx={{ p: 1.5, backgroundColor: 'white', borderRadius: 2 }}>
                        <Typography>Thinking...</Typography>
                      </Paper>
                    </ListItem>
                  )}
                  <div ref={messagesEndRef} />
                </List>
              </Box>

              <Box sx={{ p: 2, backgroundColor: 'white', borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Type your question..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <IconButton 
                    color="primary" 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'action.disabledBackground',
                        color: 'action.disabled'
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      )}
    </>
  );
};

export default ChatBot; 