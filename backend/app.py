from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta
import os
from dotenv import load_dotenv
from ai_service import ai_service
from database import db

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

jwt = JWTManager(app)

# Token blacklist for logout
token_blacklist = set()


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in token_blacklist


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Backend is running",
        "ai_providers": {
            "openai": ai_service.openai_client is not None,
            "gemini": ai_service.gemini_model is not None
        }
    }), 200


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    user = db.get_user_by_email(email)
    if user and user['password'] == password:
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        
        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user['id'],
                "email": user['email'],
                "name": user['name']
            }
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    if not email or not password or not name:
        return jsonify({"error": "Email, password, and name are required"}), 400
    
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    
    user_id = db.create_user(email, password, name)
    
    if user_id is None:
        return jsonify({"error": "User already exists"}), 409
    
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)
    
    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user_id,
            "email": email,
            "name": name
        }
    }), 201


@app.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify({"access_token": access_token}), 200


@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout and blacklist token"""
    jti = get_jwt()['jti']
    token_blacklist.add(jti)
    return jsonify({"message": "Successfully logged out"}), 200


@app.route('/api/auth/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """Verify if token is valid"""
    current_user = get_jwt_identity()
    user = db.get_user_by_email(current_user)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "valid": True,
        "user": {
            "id": user['id'],
            "email": user['email'],
            "name": user['name']
        }
    }), 200


@app.route('/api/chat', methods=['POST'])
@jwt_required()
def chat():
    current_user = get_jwt_identity()
    user = db.get_user_by_email(current_user)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    message = data.get('message')
    session_id = data.get('session_id')
    
    if not message:
        return jsonify({"error": "Message is required"}), 400
    
    # Get or create session
    if not session_id:
        session_id = db.get_or_create_session(user['id'])
    
    # Add user message to database
    db.add_message(session_id, 'user', message)
    
    # Get recent messages for context (last 20 messages)
    messages = db.get_session_messages(session_id, limit=20)
    history = [{"role": msg['role'], "content": msg['content']} for msg in messages]
    
    # Generate AI response with full context (exclude the last user message from history for AI call)
    try:
        ai_response = ai_service.generate_response(message, history=history[:-1], provider='auto')
    except Exception as e:
        print(f"AI Error: {str(e)}")
        ai_response = "I apologize, but I encountered an error. Please try again."
    
    # Add AI response to database
    db.add_message(session_id, 'assistant', ai_response)
    
    # Get updated messages
    updated_messages = db.get_session_messages(session_id, limit=50)
    history = [{"role": msg['role'], "content": msg['content']} for msg in updated_messages]
    
    return jsonify({
        "response": ai_response,
        "session_id": session_id,
        "history": history
    }), 200


@app.route('/api/chat/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    current_user = get_jwt_identity()
    user = db.get_user_by_email(current_user)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    session_id = request.args.get('session_id')
    
    if session_id:
        messages = db.get_session_messages(int(session_id))
    else:
        # Get latest session
        session_id = db.get_or_create_session(user['id'])
        messages = db.get_session_messages(session_id)
    
    history = [{"role": msg['role'], "content": msg['content']} for msg in messages]
    
    return jsonify({
        "session_id": session_id,
        "history": history
    }), 200


@app.route('/api/chat/sessions', methods=['GET'])
@jwt_required()
def get_sessions():
    """Get all chat sessions for user"""
    current_user = get_jwt_identity()
    user = db.get_user_by_email(current_user)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    sessions = db.get_user_sessions(user['id'])
    return jsonify({"sessions": sessions}), 200


@app.route('/api/chat/clear', methods=['DELETE'])
@jwt_required()
def clear_chat_history():
    current_user = get_jwt_identity()
    user = db.get_user_by_email(current_user)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    session_id = request.args.get('session_id')
    
    if session_id:
        db.clear_session(int(session_id))
    else:
        # Clear latest session
        session_id = db.get_or_create_session(user['id'])
        db.clear_session(session_id)
    
    return jsonify({"message": "Chat history cleared"}), 200


@app.route('/api/chat/session/new', methods=['POST'])
@jwt_required()
def create_new_session():
    """Create a new chat session"""
    current_user = get_jwt_identity()
    user = db.get_user_by_email(current_user)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json() or {}
    title = data.get('title', 'New Chat')
    
    session_id = db.create_session(user['id'], title)
    
    return jsonify({
        "session_id": session_id,
        "message": "New session created"
    }), 201


# Error handlers
@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized access"}), 401


@app.errorhandler(403)
def forbidden(error):
    return jsonify({"error": "Forbidden"}), 403


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    print("=" * 50)
    print("ThagavalGPT Backend Starting...")
    print("=" * 50)
    print(f"JWT Secret: {'✓ Configured' if os.getenv('JWT_SECRET_KEY') else '✗ Not configured'}")
    print(f"OpenAI API: {'✓ Configured' if ai_service.openai_client else '✗ Not configured'}")
    print(f"Gemini API: {'✓ Configured' if ai_service.gemini_model else '✗ Not configured'}")
    print(f"Database: ✓ SQLite (chatbot.db)")
    print("=" * 50)
    print("Server running on http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)
