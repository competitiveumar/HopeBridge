import React from 'react';
import AppContent from './components/AppContent';

// Add ErrorBoundary component to catch runtime errors including extension errors
class ChromeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Filter out the "Receiving end does not exist" chrome extension errors
    if (error.message && error.message.includes("Receiving end does not exist")) {
      console.log("Caught Chrome extension error - ignoring:", error.message);
      this.setState({ hasError: false }); // Reset to allow app to continue
    } else {
      console.error("Application error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif' 
        }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page to continue</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the main app with the error boundary
const App = () => {
  return (
    <ChromeErrorBoundary>
      <AppContent />
    </ChromeErrorBoundary>
  );
};

export default App; 