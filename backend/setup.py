import os
import sys

def setup_env():
    """Setup .env file with default configuration"""
    env_path = '.env'
    env_example_path = '.env.example'
    
    # Check if .env already exists
    if os.path.exists(env_path):
        print("✓ .env file already exists")
        response = input("Do you want to reconfigure? (y/n): ")
        if response.lower() != 'y':
            print("Setup cancelled.")
            return
    
    print("\n" + "="*60)
    print("ThagavalGPT Backend Setup")
    print("="*60)
    print("\nThis wizard will help you configure your environment.\n")
    
    # JWT Secret
    print("1. JWT Secret Key (for authentication)")
    print("   Press Enter to use auto-generated secure key")
    jwt_secret = input("   JWT Secret Key: ").strip()
    if not jwt_secret:
        import secrets
        jwt_secret = secrets.token_urlsafe(32)
        print(f"   ✓ Generated: {jwt_secret[:20]}...")
    
    # OpenAI API Key
    print("\n2. OpenAI API Key (optional)")
    print("   Get your key from: https://platform.openai.com/api-keys")
    print("   Press Enter to skip")
    openai_key = input("   OpenAI API Key: ").strip()
    if not openai_key:
        openai_key = "your-openai-api-key-here"
        print("   ⚠ Skipped - You can add this later")
    else:
        print("   ✓ OpenAI API key configured")
    
    # Gemini API Key
    print("\n3. Google Gemini API Key (optional)")
    print("   Get your key from: https://makersuite.google.com/app/apikey")
    print("   Press Enter to skip")
    gemini_key = input("   Gemini API Key: ").strip()
    if not gemini_key:
        gemini_key = "your-gemini-api-key-here"
        print("   ⚠ Skipped - You can add this later")
    else:
        print("   ✓ Gemini API key configured")
    
    # AI Provider
    print("\n4. Default AI Provider")
    print("   Options: auto (tries both), openai, gemini")
    provider = input("   Default Provider [auto]: ").strip().lower()
    if not provider or provider not in ['auto', 'openai', 'gemini']:
        provider = 'auto'
    print(f"   ✓ Using: {provider}")
    
    # Write .env file
    env_content = f"""# Flask Configuration
JWT_SECRET_KEY={jwt_secret}
FLASK_ENV=development

# AI API Keys
# OpenAI: https://platform.openai.com/api-keys
# Gemini: https://makersuite.google.com/app/apikey

OPENAI_API_KEY={openai_key}
GEMINI_API_KEY={gemini_key}

# Optional: Choose default AI provider (openai, gemini, or auto)
DEFAULT_AI_PROVIDER={provider}
"""
    
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        
        print("\n" + "="*60)
        print("✓ Configuration saved to .env")
        print("="*60)
        print("\nSetup complete! You can now run:")
        print("  python app.py")
        print("\nTo add API keys later, edit the .env file")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n✗ Error writing .env file: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    try:
        setup_env()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled by user.")
        sys.exit(0)
