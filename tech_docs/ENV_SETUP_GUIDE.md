# Environment Variables Setup Guide

## Overview
This project now uses environment variables to store sensitive configuration and API keys instead of hardcoding them. This is a security best practice.

## Files Created/Modified

### 1. `.env` (Created)
- Contains your actual environment variables with real values
- **IMPORTANT:** This file is gitignored (`.env*` in `.gitignore`) and will NOT be committed to version control
- Should only exist on your local machine and deployment environments

### 2. `.env.example` (Created)
- Template file showing what environment variables are needed
- Should be committed to version control so other developers know what to set up
- Copy this file and rename to `.env`, then fill in your actual values

### 3. `src/firebase/config.ts` (Refactored)
- Changed from hardcoded Firebase credentials to environment variables
- Now reads from: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.

## Environment Variables

### Firebase Configuration
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Your Firebase app ID
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (optional)

### API Keys
- `GEMINI_API_KEY` - Google Generative AI API key for Gemini

## Important Notes

### NEXT_PUBLIC_ Prefix
Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and frontend code. Use this prefix for:
- Firebase configuration (needed for client-side initialization)
- Public API keys that must be available in the browser

**DO NOT** use `NEXT_PUBLIC_` for:
- API keys that should remain server-side only
- Secrets and passwords

## How to Get Started

1. **For Local Development:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and fill in your actual values
   ```

2. **For Deployment:**
   - Set environment variables in your deployment platform's environment variable settings
   - Popular platforms: Vercel, Firebase Hosting, App Engine, Docker, etc.

3. **For CI/CD:**
   - Configure secure environment variables in your CI/CD pipeline
   - Never commit `.env` files to version control

## Verification

After setting up `.env`, verify your configuration:

```bash
# The app will automatically load .env during development
npm run dev
```

If you see warnings about missing environment variables, check that:
1. `.env` file exists in the project root
2. All required variables are set
3. The file is readable

## Security Best Practices

✅ DO:
- Create `.env` locally and in deployment environments
- Use `.env.example` for documentation
- Rotate API keys regularly
- Use different API keys for different environments (dev, staging, production)

❌ DON'T:
- Commit `.env` to version control
- Share `.env` files via email or messaging
- Use the same API keys across multiple projects
- Log or expose API keys in error messages

