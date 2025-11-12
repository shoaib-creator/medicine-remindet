# Firebase Setup Guide

This application uses Firebase for both Authentication and Firestore Database. Follow these steps to set up Firebase for your app.

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

### 4. Enable Firestore Database

1. In the Firebase Console, navigate to "Firestore Database" from the left sidebar
2. Click "Create database"
3. **Start in production mode** (we'll set up security rules next)
4. Choose a location for your database (select closest to your users)
5. Click "Enable"

### 5. Set Up Firestore Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with the following secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click "Publish" to save the rules

### 6. Configure the App

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

### 7. Get Your Configuration Values

You can find these values in the Firebase Console:
- Go to Project Settings (gear icon)
- Scroll down to "Your apps" section
- Click on your web app
- Copy the configuration values

### 8. Run the App

After configuring Firebase, restart your development server:

```bash
npm start
```

## Database Structure

The app uses the following Firestore structure:

```
users/
  {userId}/
    patientMedicines/
      {medicineId}/
        - name
        - dosage
        - frequency
        - currentStock
        - minStock
        - barcode
        - createdAt
        - updatedAt
    
    clinicMedicines/
      {medicineId}/
        - name
        - description
        - stock
        - price
        - barcode
        - createdAt
        - updatedAt
    
    clinicInfo/
      data/
        - name
        - address
        - phone
        - latitude
        - longitude
        - updatedAt
```

## Features Enabled

### Authentication
- User registration with email/password
- Secure login
- Session persistence
- Logout functionality

### Firestore Database
- Real-time data synchronization
- Cloud storage for all medicine data
- Automatic data backup
- Access from multiple devices
- User-specific data isolation

## Security Notes

- ✅ **Security rules are set up** - Users can only access their own data
- ✅ **Data is encrypted** - Firebase handles encryption in transit and at rest
- ✅ **Authentication required** - All database operations require login
- Never commit your actual Firebase configuration to a public repository
- Use environment variables for production deployments
- Enable Firebase App Check for additional security

## Firestore Features

### Real-time Sync
Your medicine data automatically syncs across all devices where you're logged in.

### Offline Support
Firestore caches data locally, so the app works offline. Changes sync when you're back online.

### Scalability
Firestore scales automatically as your data grows.

## Troubleshooting

### "Firebase not initialized" Error
- Make sure you've replaced all placeholder values in `firebase.js`
- Verify that your Firebase project is active in the Console

### Authentication Errors
- Check that Email/Password authentication is enabled in Firebase Console
- Verify your API key and auth domain are correct
- Check the browser console for detailed error messages

### Firestore Permission Errors
- Verify security rules are published
- Make sure you're logged in
- Check that the user ID in the path matches your auth user ID

### Network Errors
- Ensure you have an active internet connection
- Check if Firebase services are operational at [Firebase Status](https://status.firebase.google.com/)

### Data Not Showing Up
- Check Firestore console to verify data is being written
- Verify security rules allow access
- Check browser console for errors
- Make sure you're logged in with the correct account

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)

## Support

If you encounter issues:
1. Check the Firebase Console for error logs
2. Review the Firestore security rules
3. Check the browser console for detailed errors
4. Review the Firebase documentation
5. Open an issue on the GitHub repository
