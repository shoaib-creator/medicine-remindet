# Medicine Reminder App

A comprehensive React Native Expo application for managing medicine reminders with features for both patients and clinics. Now with Firebase Authentication for secure user management!

## Features

### Authentication
- **User Registration**: Sign up with email and password
- **User Login**: Secure login system with Firebase Authentication
- **Splash Screen**: Beautiful animated splash screen on app launch
- **User Session**: Persistent login sessions across app restarts

### Patient Features
- **Medicine Management**: Add, view, and manage personal medicines
- **Stock Tracking**: Keep track of medicine quantities with low stock alerts
- **Barcode Scanning**: Scan medicine barcodes to quickly add medicines
- **Nearby Clinic Finder**: When medicine stock is low, find nearby clinics that have the medicine in stock
- **Medicine Details**: Track dosage, frequency, and minimum stock levels
- **Visual Alerts**: Clear indicators for low stock medicines
- **User Profile**: View logged-in user information and logout functionality

### Clinic Features
- **Medicine Inventory**: Manage clinic medicine stock and inventory
- **Stock Management**: Update stock quantities with quick add/remove buttons
- **Barcode Scanning**: Scan medicine barcodes for inventory management
- **Location Tracking**: Set clinic location for patient discovery
- **Clinic Information**: Store clinic name, address, phone, and location
- **Price Management**: Track medicine prices

## Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **Firebase**: Authentication and user management
- **React Navigation**: Navigation between screens
- **AsyncStorage**: Local data persistence
- **expo-barcode-scanner**: Barcode scanning functionality
- **expo-location**: Location services for finding nearby clinics
- **expo-splash-screen**: Professional splash screen
- **@expo/vector-icons**: Icon library

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, for easier development)
- Expo Go app on your mobile device (for testing)
- Firebase account (for authentication)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/shoaib-creator/medicine-remindet.git
cd medicine-remindet
```

2. Install dependencies:
```bash
npm install
```

3. **Configure Firebase** (IMPORTANT):
   - Follow the detailed guide in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - Update `src/config/firebase.js` with your Firebase credentials
   - Enable Email/Password authentication in Firebase Console

4. Start the development server:
```bash
npm start
```

5. Run the app:
   - **iOS**: Scan the QR code with the Camera app or run `npm run ios` (requires macOS)
   - **Android**: Scan the QR code with the Expo Go app or run `npm run android`
   - **Web**: Press 'w' in the terminal or run `npm run web`

## Usage

### Getting Started

1. **First Launch**:
   - The app will show a splash screen with the Medicine Reminder logo
   - After 2-3 seconds, you'll be directed to the login screen

2. **Sign Up**:
   - Tap "Sign Up" on the authentication screen
   - Enter your email and password (minimum 6 characters)
   - Confirm your password
   - Tap "Sign Up" to create your account

3. **Login**:
   - Enter your registered email and password
   - Tap "Login" to access the app
   - Your session will be saved for future use

### For Patients

1. **Adding Medicine**:
   - Tap the blue '+' button at the bottom right
   - Fill in medicine details (name, dosage, frequency, stock)
   - Optionally scan the barcode for easy identification
   - Set minimum stock level for alerts

2. **Managing Stock**:
   - Use '+' and '-' buttons to update medicine quantities
   - Low stock medicines will be highlighted with a red border

3. **Finding Nearby Clinics**:
   - When a medicine is low on stock, tap "Find Nearby Clinics"
   - Grant location permission when prompted
   - View clinics with the medicine in stock, sorted by distance

4. **Logout**:
   - View your logged-in email at the top of the Patient screen
   - Tap the logout icon (top right) to sign out
   - Confirm logout when prompted

### For Clinics

1. **Setting Up Clinic Information**:
   - Tap "Setup Clinic Information" on first launch
   - Enter clinic name, address, and phone number
   - Use "Get Current Location" to automatically capture GPS coordinates
   - Save the information

2. **Adding Medicine to Inventory**:
   - Tap the blue '+' button at the bottom right
   - Enter medicine name, description, stock quantity, and price
   - Optionally scan the barcode
   - Save the medicine

3. **Managing Inventory**:
   - Use '+', '-', and '+10' buttons to update stock quantities
   - View stock status (Out of Stock, Low Stock warnings)
   - Delete medicines using the trash icon

## Permissions Required

- **Camera**: For barcode scanning functionality
- **Location**: For finding nearby clinics with medicine stock
- **Internet**: For Firebase Authentication

## Data Storage

**Authentication**: User accounts and sessions are managed by Firebase Authentication.

**Local Storage**: All medicine and clinic data is stored locally on the device using AsyncStorage:
- Patient medicines
- Clinic medicines
- Clinic information

No medicine data is sent to external servers, ensuring privacy and offline functionality after authentication.

## Project Structure

```
medicine-remindet/
├── src/
│   ├── components/
│   │   └── BarcodeScanner.js    # Reusable barcode scanner component
│   ├── config/
│   │   └── firebase.js          # Firebase configuration
│   ├── context/
│   │   └── AuthContext.js       # Authentication state management
│   ├── navigation/
│   │   └── AppNavigator.js      # Navigation setup with auth flow
│   ├── screens/
│   │   ├── SplashScreen.js      # App splash screen
│   │   ├── AuthScreen.js        # Login/Signup screen
│   │   ├── PatientScreen.js     # Patient medicine management screen
│   │   └── ClinicScreen.js      # Clinic inventory management screen
│   └── utils/
│       └── storage.js           # AsyncStorage utilities for data persistence
├── assets/                       # App assets (icons, images)
├── App.js                        # Main app entry point
├── app.json                      # Expo configuration
├── package.json                  # Dependencies and scripts
├── FIREBASE_SETUP.md            # Firebase configuration guide
└── README.md                     # This file
```

## Future Enhancements

- Push notifications for medicine reminders
- Social login (Google, Apple)
- Profile management and customization
- Multi-clinic support for broader clinic search
- Medicine interaction warnings
- Prescription management
- Cloud synchronization for medicine data
- Medicine usage history and analytics
- Export/import medicine data
- Refill reminders with automatic clinic notifications
- Dark mode support
- Multi-language support

## Security

- Firebase Authentication provides secure user management
- Passwords are never stored locally
- All authentication tokens are encrypted
- Local medicine data is stored securely on device
- Follow the [FIREBASE_SETUP.md](FIREBASE_SETUP.md) guide for secure configuration

## Troubleshooting

### Authentication Issues
- Make sure Firebase is properly configured (see FIREBASE_SETUP.md)
- Check that Email/Password authentication is enabled in Firebase Console
- Verify internet connection for authentication

### App Crashes
- Clear app cache and restart
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Expo Go app is up to date

### Location/Camera Permissions
- Grant necessary permissions when prompted
- Check device settings if permissions were previously denied

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Author

Created by [shoaib-creator](https://github.com/shoaib-creator)
