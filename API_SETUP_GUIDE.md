# API Configuration Guide

## Quick Setup (Recommended)

Run the automated setup wizard to configure your API keys:

```powershell
cd backend
python setup.py
```

The setup wizard will:
1. Generate a secure JWT secret key
2. Prompt you to enter your OpenAI API key (optional)
3. Prompt you to enter your Gemini API key (optional)
4. Save all configuration to the `.env` file

## Manual Configuration

If you prefer to manually configure your API keys, edit the `backend/.env` file:

```env
# JWT Configuration (required - already configured)
JWT_SECRET_KEY=your-generated-secret-key

# OpenAI Configuration (optional)
OPENAI_API_KEY=your-openai-api-key-here

# Gemini Configuration (optional)
GEMINI_API_KEY=your-gemini-api-key-here
```

## Getting API Keys

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it into your `.env` file

### Google Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the key and paste it into your `.env` file

## Testing Your Configuration

After configuring your API keys, restart the backend server:

```powershell
cd backend
.\.venv\Scripts\python.exe app.py
```

You should see:
- ✓ JWT Secret: Configured
- ✓ OpenAI API: Configured (if you added an OpenAI key)
- ✓ Gemini API: Configured (if you added a Gemini key)

## Important Notes

- At least one AI API key (OpenAI or Gemini) is required for the chatbot to work
- The `.env` file is already in `.gitignore` to protect your keys
- Never share your API keys publicly
- Each service has its own pricing model - check their websites for details
