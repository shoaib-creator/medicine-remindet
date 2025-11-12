# Firebase Setup Guide

This application uses Firebase Authentication for user management. Follow these steps to set up Firebase for your app.

## Prerequisites
- A Google account
- Node.js and npm installed

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project
4. Enable Google Analytics (optional)

### 2. Register Your App

1. In the Firebase Console, click on "Web" (</>) icon to add a web app
2. Register your app with a nickname (e.g., "Medicine Reminder App")
3. Firebase will provide you with a configuration object

### 3. Enable Authentication

1. In the Firebase Console, navigate to "Authentication" from the left sidebar
2. Click on "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Save the changes

### 4. Configure the App

1. Open the file `src/config/firebase.js` in your project
2. Replace the placeholder values with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // Replace with your API Key
  authDomain: "YOUR_AUTH_DOMAIN",       // Replace with your Auth Domain
  projectId: "YOUR_PROJECT_ID",         // Replace with your Project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your Storage Bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your Messaging Sender ID
  appId: "YOUR_APP_ID"                  // Replace with your App ID
};
```

### 5. Get Your Configuration Values

You can find these values in the Firebase Console:
- Go to Project Settings (gear icon)
- Scroll down to "Your apps" section
- Click on your web app
- Copy the configuration values

### 6. Run the App

After configuring Firebase, restart your development server:

```bash
npm start
```

## Security Notes

- Never commit your actual Firebase configuration to a public repository
- Use environment variables for production deployments
- Enable Firebase App Check for additional security
- Set up Firebase Security Rules to protect your data

## Troubleshooting

### "Firebase not initialized" Error
- Make sure you've replaced all placeholder values in `firebase.js`
- Verify that your Firebase project is active in the Console

### Authentication Errors
- Check that Email/Password authentication is enabled in Firebase Console
- Verify your API key and auth domain are correct
- Check the browser console for detailed error messages

### Network Errors
- Ensure you have an active internet connection
- Check if Firebase services are operational at [Firebase Status](https://status.firebase.google.com/)

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [React Native Firebase](https://rnfirebase.io/)

## Support

If you encounter issues:
1. Check the Firebase Console for error logs
2. Review the Firebase documentation
3. Open an issue on the GitHub repository
