# Authentication System Guide

## Overview

The chatbot now has a complete authentication system with:
- ✅ User registration (signup)
- ✅ User login (signin)
- ✅ JWT token-based authentication
- ✅ Bcrypt password hashing
- ✅ JSON file-based database
- ✅ Protected routes
- ✅ User preferences storage

## Features

### Security
- **Bcrypt**: Passwords are hashed with bcrypt (10 salt rounds)
- **JWT**: JSON Web Tokens for stateless authentication
- **Protected Routes**: All API endpoints require valid JWT token
- **Secure Storage**: Passwords never stored in plain text

### User Management
- **Registration**: Create new account with email, password, and optional name
- **Login**: Authenticate with email and password
- **Profile**: View user information and preferences
- **Preferences**: Store language and auto-speak settings per user

## How to Use

### 1. Start the Server

```bash
cd server
npm start
```

### 2. Create an Account

1. Open the app: http://localhost:5173
2. Click "Sign up" link
3. Enter:
   - Name (optional)
   - Email
   - Password (minimum 6 characters)
4. Click "Sign up"

### 3. Login

1. Enter your email and password
2. Click "Sign in"
3. You'll be redirected to the dashboard

### 4. Use the Chat

- Navigate to Chat from bottom navigation
- Toggle auto-speak with the speaker icon (🔊/🔇)
- Your preferences are saved automatically

## API Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "preferences": {
    "language": "hi",
    "auto_speak": true
  }
}
```

#### Update Preferences
```http
PUT /auth/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "en",
  "auto_speak": false
}

Response:
{
  "preferences": {
    "language": "en",
    "auto_speak": false
  }
}
```

### Protected Endpoints

All these require `Authorization: Bearer <token>` header:

- `POST /chat` - Send chat message
- `GET /dashboard` - Get dashboard data
- `GET /auth/profile` - Get user profile
- `PUT /auth/preferences` - Update preferences

## Database Structure

### users.json

```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "password": "$2b$10$...", // bcrypt hash
      "name": "John Doe",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "preferences": [
    {
      "id": 1,
      "user_id": 1,
      "language": "hi",
      "auto_speak": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## UI Features

### Login Page
- Email and password fields
- Link to signup page
- Error messages in selected language
- Responsive mobile design

### Signup Page
- Name (optional), email, and password fields
- Password minimum 6 characters
- Link back to login
- Error messages in selected language

### Chat Page
- Auto-speak toggle button in header (🔊/🔇)
- Persists preference per user
- Works in both Hindi and English
- Visual feedback when active

### Bottom Navigation
- Fixed at bottom of screen
- Includes Chat option (💬)
- Translates based on language selection
- Always accessible

## Security Best Practices

### Implemented
✅ Password hashing with bcrypt
✅ JWT token expiration (7 days)
✅ Protected API routes
✅ Input validation
✅ Minimum password length
✅ Email uniqueness check

### Recommended for Production
- [ ] HTTPS only
- [ ] Rate limiting
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Refresh tokens
- [ ] Account lockout after failed attempts
- [ ] Use environment variables for JWT_SECRET
- [ ] Use a real database (PostgreSQL, MongoDB)

## Configuration

### Environment Variables

Create `server/.env`:

```env
PORT=4000
JWT_SECRET=your-super-secret-key-change-this
OLLAMA_API=http://localhost:11434
MODEL_NAME=llama3.2:1b
```

**Important**: Change `JWT_SECRET` in production!

## Troubleshooting

### "Email already exists"
- User with that email is already registered
- Try logging in instead
- Or use a different email

### "Invalid email or password"
- Check email spelling
- Check password (case-sensitive)
- Ensure you've registered first

### "Access token required"
- Token expired (7 days)
- Login again to get new token
- Check Authorization header format

### Database file not found
- Server creates `users.json` automatically on first run
- Check `server/` directory
- Ensure write permissions

## Migration to SQLite (Optional)

If you want to use SQLite instead of JSON:

1. Install Visual Studio Build Tools (Windows)
2. Update `package.json`:
```json
"dependencies": {
  "better-sqlite3": "^9.2.2"
}
```
3. Use the original `database.js` with SQLite code
4. Run `npm install`

## Testing

### Manual Testing

1. **Register**:
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

2. **Login**:
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

3. **Chat** (use token from login):
```bash
curl -X POST http://localhost:4000/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"message":"What is SIP?","language":"en"}'
```

## Summary

You now have a fully functional authentication system with:
- Secure user registration and login
- JWT-based authentication
- Bcrypt password hashing
- User preferences storage
- Protected API routes
- Bilingual UI (Hindi/English)
- Auto-speak toggle per user
- Mobile-optimized interface

All user data is stored securely in `server/users.json` with hashed passwords!
