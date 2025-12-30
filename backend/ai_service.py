import os
from openai import OpenAI
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.openai_client = None
        self.gemini_model = None
        
        # Initialize OpenAI if API key is available
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key and openai_key != 'your-openai-api-key-here':
            self.openai_client = OpenAI(api_key=openai_key)
        
        # Initialize Gemini if API key is available
        gemini_key = os.getenv('GEMINI_API_KEY')
        if gemini_key and gemini_key != 'your-gemini-api-key-here':
            genai.configure(api_key=gemini_key)
            self.gemini_model = genai.GenerativeModel('gemini-pro')
    
    def generate_response(self, message, history=None, provider='auto'):
        """
        Generate AI response using available provider
        
        Args:
            message: User message
            history: Conversation history
            provider: 'openai', 'gemini', or 'auto' (tries available providers)
        """
        if provider == 'auto':
            # Try OpenAI first, then Gemini
            if self.openai_client:
                return self._generate_openai(message, history)
            elif self.gemini_model:
                return self._generate_gemini(message, history)
            else:
                return self._generate_fallback(message)
        elif provider == 'openai':
            if self.openai_client:
                return self._generate_openai(message, history)
            else:
                raise ValueError("OpenAI API key not configured")
        elif provider == 'gemini':
            if self.gemini_model:
                return self._generate_gemini(message, history)
            else:
                raise ValueError("Gemini API key not configured")
        else:
            return self._generate_fallback(message)
    
    def _generate_openai(self, message, history=None):
        """Generate response using OpenAI API"""
        try:
            messages = []
            
            # Add conversation history if available
            if history:
                for msg in history[-10:]:  # Last 10 messages for context
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI error: {str(e)}")
            return self._generate_fallback(message)
    
    def _generate_gemini(self, message, history=None):
        """Generate response using Google Gemini API"""
        try:
            # Start chat with history if available
            chat = self.gemini_model.start_chat(history=[])
            
            if history:
                # Convert history to Gemini format
                for msg in history[-10:]:
                    if msg["role"] == "user":
                        chat.send_message(msg["content"])
            
            # Generate response
            response = chat.send_message(message)
            return response.text
        except Exception as e:
            print(f"Gemini error: {str(e)}")
            return self._generate_fallback(message)
    
    def _generate_fallback(self, message):
        """Fallback response when no AI provider is configured"""
        responses = {
            "hello": "Hello! I'm ThagavalGPT. How can I help you today?",
            "hi": "Hi there! What can I do for you?",
            "how are you": "I'm doing great! Thank you for asking. How can I assist you?",
            "bye": "Goodbye! Have a great day!",
            "thank": "You're welcome! Feel free to ask if you need anything else.",
        }
        
        message_lower = message.lower()
        for key, response in responses.items():
            if key in message_lower:
                return response
        
        return f"I received your message: '{message}'. To enable full AI capabilities, please configure your OpenAI or Gemini API key in the backend/.env file."

# Singleton instance
ai_service = AIService()
