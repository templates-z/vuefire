# Environment Configuration

This project uses environment variables to configure various services, including Firebase.

## Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual configuration values in the `.env` file.

## Firebase Configuration

The following environment variables are required for Firebase:

- `VITE_FIREBASE_API_KEY` - Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain (usually `your-project-id.firebaseapp.com`)
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Your Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Your Firebase measurement ID (optional, for Analytics)

## Important Notes

- All environment variables for client-side code must be prefixed with `VITE_` to be accessible in Vite
- Never commit the `.env` file to version control - it's already added to `.gitignore`
- The application will validate that all required Firebase configuration is present on startup
- If any required environment variables are missing, the application will throw an error with details about what's missing

## Security

Environment variables prefixed with `VITE_` are embedded into the client-side bundle and are publicly accessible. Only put non-sensitive configuration that can be safely exposed to users (like Firebase config for web apps).