from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
from django.conf import settings
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import threading
import time
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Create your views here.

class ChatbotQueryView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Configure Gemini once during initialization
        try:
            api_key = getattr(settings, 'GEMINI_API_KEY', 'YOUR_GEMINI_API_KEY')
            
            # Check if the API key is the placeholder
            if api_key == 'YOUR_GEMINI_API_KEY':
                logger.warning("Using placeholder Gemini API key. Chatbot will return mock responses.")
                self.is_initialized = False
                self.using_mock = True
            else:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel('gemini-pro')
                self.executor = ThreadPoolExecutor(max_workers=4)
                self.is_initialized = True
                self.using_mock = False
                logger.info("Gemini API initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini API: {str(e)}")
            self.is_initialized = False
            self.using_mock = True

    def generate_response(self, query, system_prompt):
        # If we're using the mock version, return a mock response
        if getattr(self, 'using_mock', True):
            logger.info("Generating mock response due to missing API key")
            return "This is a mock response because a valid Gemini API key is not configured. Please add your API key to settings.py."
            
        try:
            start_time = time.time()
            logger.info(f"Generating response for query: {query[:50]}...")
            
            # Using optimized parameters for informative yet responsive replies
            response = self.model.generate_content(
                f"{system_prompt}\n\nUser question: {query}",
                generation_config={
                    'temperature': 0.2,  # Slightly increased for more natural responses
                    'max_output_tokens': 150,  # Increased to allow more detailed responses
                    'top_p': 0.9,
                    'top_k': 10, 
                    'candidate_count': 1,
                }
            )
            
            generation_time = time.time() - start_time
            logger.info(f"Generation took {generation_time:.2f} seconds")
            
            # Return immediately if generation is too slow
            if generation_time > 8:
                return "I'm sorry, I'm having trouble generating a quick response right now. Please try again later or ask a simpler question."
                
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error in generate_response: {str(e)}")
            return f"Error generating response: {str(e)}"

    def post(self, request):
        query = request.data.get('query')
        
        if not query:
            return Response(
                {'error': 'Query is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # If we're using the mock version, return a mock response directly
        if getattr(self, 'using_mock', True):
            logger.info("Returning mock response due to missing API key")
            return Response({
                'response': "This is a mock response because a valid Gemini API key is not configured. To get real AI responses, please add your API key to settings.py."
            })

        # Provide fallback responses if API is not initialized
        if not getattr(self, 'is_initialized', False):
            logger.error("API not properly initialized, returning fallback response")
            return Response({
                'response': "I'm sorry, the chatbot service is currently unavailable. Please try again later."
            })

        try:
            # Shorten query if too long
            if len(query) > 100:
                query = query[:100] + "..."
                logger.info("Query was truncated because it was too long")

            # Initialize the context about HopeBridge - with comprehensive website information
            system_prompt = """
            You are the official assistant for HopeBridge, a platform connecting donors with people and causes in need.
            You should be helpful, friendly, and concise - aim for 1-3 sentences in your responses.
            
            HopeBridge Platform Information:
            - Mission: HopeBridge makes giving accessible, transparent, and impactful
            - Types of causes: Education, healthcare, disaster relief, community development, environment
            - Payment methods: Credit/debit cards (Visa, MasterCard, AmEx) via Stripe
            - Donation options: One-time or recurring (monthly, quarterly, annually)
            - Tax benefits: Donations to qualified nonprofits are tax-deductible
            - Security: Bank-level encryption, PCI compliance for payments, GDPR-compliant privacy

            For donors:
            - Browse causes by category, urgency, location, or organization
            - Set up recurring donations with customizable frequency and amount
            - Track impact of donations through updates from nonprofit organizations
            - Download tax receipts and donation history from account dashboard
            - Gift cards available for donation gifts

            For nonprofit organizations:
            - Receive donations directly through secure payment processing
            - Verified nonprofit partners receive 97% of donations (3% platform fee)
            - Provide updates to donors about how funds are being used
            
            If asked about current disaster relief, refugee support, or time-sensitive causes, 
            encourage users to visit the HopeBridge homepage for the most up-to-date giving opportunities.
            
            Always recommend users to create an account for the best experience, recurring donations,
            and to track their giving impact over time.
            
            IMPORTANT: HopeBridge does NOT offer campaign or fundraising services for individuals. 
            Only verified nonprofit organizations can receive donations through the platform.
            """
            
            # Use ThreadPoolExecutor to run with timeout
            start_time = time.time()
            logger.info(f"Starting request processing for query: {query[:50]}...")
            
            # First try with a very short timeout for fast failures
            future = self.executor.submit(self.generate_response, query, system_prompt)
            
            try:
                # Set a shorter timeout for a quick response
                ai_response = future.result(timeout=10)  # Reduced from 20s to 10s
                logger.info(f"Total request took {time.time() - start_time:.2f} seconds")
                
                if ai_response.startswith("Error generating response:"):
                    logger.error(f"Error response: {ai_response}")
                    return Response({
                        'response': "I'm sorry, I couldn't generate a response right now. Please try again with a simpler question."
                    })
                    
                return Response({'response': ai_response})
            except TimeoutError:
                logger.warning("Request timed out, providing topic-based fallback response")
                future.cancel()  # Cancel the future to prevent hanging threads
                
                # Provide a topic-based fallback response instead of a generic one
                fallback_responses = {
                    'donate': "You can donate through our platform by visiting the 'Donations' section. We support one-time and recurring donations to many worthy causes.",
                    'payment': "HopeBridge accepts credit/debit cards (Visa, MasterCard, American Express) via Stripe. Your payment information is securely stored.",
                    'tax': "Donations to qualified nonprofits are tax-deductible. You'll receive receipts for all donations in your account dashboard.",
                    'help': "We're here to help! Browse our available causes to support or contact support@hopebridge.org for assistance."
                }
                
                # Find the most relevant fallback based on query terms
                for keyword, response in fallback_responses.items():
                    if keyword in query.lower():
                        return Response({'response': response})
                
                # Default fallback if no keywords match
                return Response({
                    'response': "Thank you for your question. Please check our FAQ section for information about donations, campaigns, and our mission, or try rephrasing your question."
                })

        except Exception as e:
            logger.error(f"Error in post: {str(e)}")
            return Response({
                'response': "Something went wrong. Please try again with a different question."
            })
