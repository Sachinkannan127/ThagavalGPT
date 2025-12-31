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
        """Generate response using OpenAI API with enhanced accuracy"""
        try:
            messages = [
                {
                    "role": "system",
                    "content": """You are ThagavalGPT, an intelligent and helpful AI assistant. Your goal is to provide accurate, clear, and comprehensive answers.

Guidelines:
- Provide accurate and factual information
- If you're unsure, acknowledge it honestly
- Break down complex topics into simple explanations
- Use examples when helpful
- Be concise but thorough
- For technical questions, provide working code examples
- For math questions, show step-by-step solutions
- Stay helpful, friendly, and professional"""
                }
            ]
            
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
                max_tokens=2000
            )
            
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI error: {str(e)}")
            # Try Gemini as fallback if available
            if self.gemini_model:
                return self._generate_gemini(message, history)
            return self._generate_fallback(message)
    
    def _generate_gemini(self, message, history=None):
        """Generate response using Google Gemini API with enhanced accuracy"""
        try:
            # Create system instruction for better responses
            system_instruction = """You are ThagavalGPT, a knowledgeable and helpful AI assistant. Provide accurate, detailed, and well-structured answers. 

Be clear, concise, and comprehensive. For technical questions, include examples. For complex topics, break them down step-by-step. Always aim to be helpful and informative."""
            
            # Start chat with system context
            chat = self.gemini_model.start_chat(history=[])
            
            # Build context with history
            if history:
                for msg in history[-10:]:
                    if msg["role"] == "user":
                        # Send user message and get response
                        chat.send_message(msg["content"])
            
            # Add system context to current message
            enhanced_message = f"{system_instruction}\n\nUser Question: {message}"
            
            # Generate response
            response = chat.send_message(enhanced_message)
            return response.text
        except Exception as e:
            print(f"Gemini error: {str(e)}")
            # Try OpenAI as fallback if available
            if self.openai_client:
                return self._generate_openai(message, history)
            return self._generate_fallback(message)
    
    def _generate_fallback(self, message):
        """Enhanced fallback with smart responses - provides actual answers for common questions"""
        import random
        from datetime import datetime
        
        message_lower = message.lower()
        
        # Greetings
        if any(word in message_lower for word in ["hello", "hi", "hey", "greetings"]):
            greetings = [
                "Hello! I'm ThagavalGPT. How can I help you today?",
                "Hi there! I'm here to assist you. What would you like to know?",
                "Hey! Welcome to ThagavalGPT. Feel free to ask me anything!",
            ]
            return random.choice(greetings)
        
        # Farewells
        if any(word in message_lower for word in ["bye", "goodbye", "see you"]):
            return "Goodbye! Have a wonderful day! 👋"
        
        # Thanks
        if any(word in message_lower for word in ["thank", "thanks", "appreciate"]):
            return "You're very welcome! I'm happy to help. Feel free to ask anything else!"
        
        # How are you
        if "how are you" in message_lower or "how're you" in message_lower:
            return "I'm functioning perfectly! Thanks for asking. How can I assist you today?"
        
        # What can you do
        if any(phrase in message_lower for phrase in ["what can you do", "help me", "what do you do", "your capabilities"]):
            return """I'm ThagavalGPT, your AI assistant! I can help you with:
• Answering questions on various topics
• Providing explanations and information
• Having conversations
• Problem-solving and brainstorming
• Code help and technical questions

💡 Add an API key for advanced AI capabilities!"""
        
        # Quantum Computing
        if "quantum" in message_lower and "comput" in message_lower:
            return """**Quantum Computing - Simple Explanation:**

Imagine a regular computer uses switches that are either ON (1) or OFF (0). A quantum computer uses quantum bits (qubits) that can be both ON and OFF at the same time!

**Key Concepts:**
• **Superposition**: Qubits can be in multiple states simultaneously
• **Entanglement**: Qubits can be connected, affecting each other instantly
• **Speed**: Can solve certain problems millions of times faster

**Real-World Example:**
Think of a maze: A regular computer tries one path at a time. A quantum computer explores ALL paths simultaneously!

**Uses:**
• Drug discovery
• Cryptography
• Weather forecasting
• Artificial intelligence

It's like having a super-powered computer that can test millions of solutions at once! 🚀"""
        
        # Python coding
        if "python" in message_lower and any(word in message_lower for word in ["learn", "start", "begin", "tutorial"]):
            return """**Getting Started with Python:**

```python
# Hello World
print("Hello, World!")

# Variables
name = "ThagavalGPT"
age = 2025

# Functions
def greet(name):
    return f"Hello, {name}!"

# Lists
fruits = ["apple", "banana", "orange"]

# Loops
for fruit in fruits:
    print(fruit)
```

**Next Steps:**
1. Install Python from python.org
2. Try basic commands in interactive mode
3. Learn variables, loops, and functions
4. Build small projects!

Need specific help? Ask me about any Python concept! 🐍"""
        
        # AI/Machine Learning
        if any(phrase in message_lower for phrase in ["machine learning", "artificial intelligence", "neural network", "deep learning"]):
            return """**Machine Learning Overview:**

Machine Learning is teaching computers to learn from data instead of explicit programming.

**Types:**
• **Supervised Learning**: Learn from labeled examples (like flashcards)
• **Unsupervised Learning**: Find patterns in unlabeled data
• **Reinforcement Learning**: Learn by trial and error (like training a pet)

**Common Applications:**
• Image recognition (Face ID)
• Voice assistants (Siri, Alexa)
• Recommendations (Netflix, YouTube)
• Self-driving cars
• Language translation

**Simple Analogy:**
Teaching a child to recognize cats:
1. Show many cat pictures (training data)
2. Child learns patterns (ears, whiskers, tail)
3. Child can identify new cats (prediction)

That's machine learning! 🤖"""
        
        # Web development
        if any(word in message_lower for word in ["html", "css", "javascript", "web dev", "website"]):
            return """**Web Development Basics:**

**The Three Pillars:**
• **HTML**: Structure (the skeleton)
• **CSS**: Style (the appearance)
• **JavaScript**: Behavior (the interactivity)

**Simple Example:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .button { color: blue; padding: 10px; }
    </style>
</head>
<body>
    <button class="button" onclick="alert('Hello!')">
        Click Me
    </button>
</body>
</html>
```

**Learning Path:**
1. Start with HTML structure
2. Add CSS for styling
3. Add JavaScript for interactivity
4. Learn frameworks (React, Vue)

Want to know more about any specific part? 🌐"""
        
        # Math calculations
        if any(word in message_lower for word in ["calculate", "what is", "solve"]) and any(char in message for char in ['+', '-', '*', '/', '=']):
            return """I can see you're asking about a calculation! 

For simple math:
• Addition: 5 + 3 = 8
• Subtraction: 10 - 4 = 6
• Multiplication: 6 × 7 = 42
• Division: 20 ÷ 4 = 5

For complex calculations and step-by-step solutions, add an OpenAI or Gemini API key for advanced math capabilities! 🔢"""
        
        # General coding question
        if any(word in message_lower for word in ["code", "programming", "function", "class", "variable", "error", "bug"]):
            return f"""**Coding Help**

I see you're asking about: "{message[:80]}{'...' if len(message) > 80 else ''}"

**General Programming Tips:**
• Break problems into smaller steps
• Use meaningful variable names
• Comment your code
• Test frequently
• Debug systematically

**Common Issues:**
• Syntax errors: Check brackets, quotes, semicolons
• Logic errors: Print values to trace execution
• Runtime errors: Handle edge cases

Need specific help? Add an API key for detailed code assistance and debugging! 💻"""
        
        # General questions with ?
        if "?" in message:
            # Try to provide helpful response based on keywords
            if any(word in message_lower for word in ["why", "how", "what", "when", "where", "who"]):
                return f"""That's a great question! You asked: "{message}"

I'm currently in demo mode and can answer common questions about:
• Technology (programming, AI, quantum computing)
• General knowledge topics
• Learning resources
• Problem-solving approaches

For in-depth, context-aware answers on any topic, add an OpenAI or Gemini API key to unlock full AI capabilities!

Want to try asking about something specific like Python, web development, or machine learning? 🤔"""
        
        # Default helpful response
        responses = [
            f"""I received: "{message[:80]}{'...' if len(message) > 80 else ''}"

I can help with:
• Python & programming basics
• Web development (HTML/CSS/JS)
• Machine Learning concepts
• Tech explanations
• General questions

For advanced AI responses on any topic, add an API key! 🚀""",
            
            f"""Interesting topic! You mentioned: "{message[:80]}{'...' if len(message) > 80 else ''}"

Try asking me about:
• "Explain quantum computing"
• "How do I learn Python?"
• "What is machine learning?"
• "Web development basics"

For comprehensive answers on any subject, configure an API key! 💡""",
        ]
        
        return random.choice(responses)

# Singleton instance
ai_service = AIService()
