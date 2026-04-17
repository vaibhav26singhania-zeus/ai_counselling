# Token Expiration Fix

## What Was Fixed

✅ **Increased token expiration**: From 7 days to 30 days
✅ **Auto-redirect on expiration**: Automatically redirects to login when token expires
✅ **Token validation on app load**: Validates token when app starts
✅ **Better error messages**: Clear messages in both Hindi and English
✅ **Token refresh endpoint**: Can refresh token without re-login
✅ **Axios interceptors**: Automatically handles 401/403 errors

## How It Works Now

### 1. Token Expiration
- Tokens now last **30 days** instead of 7 days
- After 30 days, you'll need to login again

### 2. Automatic Handling
When your token expires:
1. API call fails with 401/403 error
2. Axios interceptor catches the error
3. Clears local storage (token + user data)
4. Redirects to login page automatically
5. Shows message: "Session expired. Please login again."

### 3. Token Validation
On app startup:
- Checks if stored token is valid
- If invalid, clears it automatically
- Prevents using expired tokens

## For Users

### If You See "Token Expired" Error

**Option 1: Just Login Again**
1. You'll be automatically redirected to login
2. Enter your email and password
3. You'll get a new 30-day token

**Option 2: Clear Browser Data** (if stuck)
1. Open browser console (F12)
2. Go to Application/Storage tab
3. Clear Local Storage
4. Refresh page
5. Login again

## For Developers

### Token Expiration Settings

Edit `server/auth.js`:

```javascript
const JWT_EXPIRES_IN = '30d'; // Change to '90d', '1y', etc.
```

Options:
- `'7d'` - 7 days
- `'30d'` - 30 days (current)
- `'90d'` - 90 days
- `'1y'` - 1 year
- `'24h'` - 24 hours

### Manual Token Refresh

If you want to refresh token without re-login:

```javascript
// Frontend
const refreshToken = async () => {
  const response = await fetch('http://localhost:4000/auth/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${currentToken}`
    }
  });
  
  const data = await response.json();
  // Save new token
  localStorage.setItem('authToken', data.token);
};
```

### Testing Token Expiration

**Option 1: Set short expiration**
```javascript
// In server/auth.js
const JWT_EXPIRES_IN = '10s'; // 10 seconds for testing
```

**Option 2: Use expired token**
```javascript
// In browser console
localStorage.setItem('authToken', 'expired-token-here');
```

## API Endpoints

### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer <current-token>

Response:
{
  "token": "new-jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Validate Token
```http
GET /auth/profile
Authorization: Bearer <token>

Success (200):
{
  "user": {...},
  "preferences": {...}
}

Expired (403):
{
  "error": "Invalid or expired token. Please login again."
}
```

## Error Messages

### English
- "Session expired. Please login again."
- "Invalid or expired token. Please login again."
- "Access token required"

### Hindi
- "सत्र समाप्त हो गया। कृपया फिर से लॉगिन करें।"

## Troubleshooting

### Problem: Keep getting logged out

**Cause**: Token expiring too quickly

**Solution**: Increase expiration time
```javascript
// server/auth.js
const JWT_EXPIRES_IN = '90d'; // 90 days
```

### Problem: Token not refreshing

**Cause**: Old token in localStorage

**Solution**: Clear and login again
```javascript
// Browser console
localStorage.clear();
location.reload();
```

### Problem: "Invalid token" immediately after login

**Cause**: JWT_SECRET mismatch or clock skew

**Solution**: 
1. Check JWT_SECRET is same in .env
2. Restart server
3. Clear browser storage
4. Login again

## Security Notes

### Production Recommendations

1. **Use HTTPS**: Always use HTTPS in production
2. **Secure JWT_SECRET**: Use strong, random secret
3. **Shorter expiration**: Consider 7-14 days for production
4. **Refresh tokens**: Implement refresh token pattern
5. **Token rotation**: Rotate tokens periodically

### Current Setup (Development)

- ✅ Bcrypt password hashing
- ✅ JWT token authentication
- ✅ 30-day expiration
- ✅ Auto-logout on expiration
- ⚠️ No refresh token (uses same token)
- ⚠️ No token rotation
- ⚠️ HTTP (not HTTPS)

## Summary

The token expiration issue is now fixed with:
- **30-day tokens** (instead of 7 days)
- **Automatic redirect** to login when expired
- **Clear error messages** in both languages
- **Token validation** on app startup
- **Refresh endpoint** for extending sessions

You should no longer see unexpected "token expired" errors during normal use!
