# Medicine Reminder App

A comprehensive React Native Expo application for managing medicine reminders with features for both patients and clinics.

## Features

### Patient Features
- **Medicine Management**: Add, view, and manage personal medicines
- **Stock Tracking**: Keep track of medicine quantities with low stock alerts
- **Barcode Scanning**: Scan medicine barcodes to quickly add medicines
- **Nearby Clinic Finder**: When medicine stock is low, find nearby clinics that have the medicine in stock
- **Medicine Details**: Track dosage, frequency, and minimum stock levels
- **Visual Alerts**: Clear indicators for low stock medicines

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
- **React Navigation**: Navigation between screens
- **AsyncStorage**: Local data persistence
- **expo-barcode-scanner**: Barcode scanning functionality
- **expo-location**: Location services for finding nearby clinics
- **@expo/vector-icons**: Icon library

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, for easier development)
- Expo Go app on your mobile device (for testing)

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

3. Start the development server:
```bash
npm start
```

4. Run the app:
   - **iOS**: Scan the QR code with the Camera app or run `npm run ios` (requires macOS)
   - **Android**: Scan the QR code with the Expo Go app or run `npm run android`
   - **Web**: Press 'w' in the terminal or run `npm run web`

## Usage

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

## Data Storage

All data is stored locally on the device using AsyncStorage:
- Patient medicines
- Clinic medicines
- Clinic information

No data is sent to external servers, ensuring privacy and offline functionality.

## Project Structure

```
medicine-remindet/
├── src/
│   ├── components/
│   │   └── BarcodeScanner.js    # Reusable barcode scanner component
│   ├── navigation/
│   │   └── AppNavigator.js      # Navigation setup with bottom tabs
│   ├── screens/
│   │   ├── PatientScreen.js     # Patient medicine management screen
│   │   └── ClinicScreen.js      # Clinic inventory management screen
│   └── utils/
│       └── storage.js           # AsyncStorage utilities for data persistence
├── assets/                       # App assets (icons, images)
├── App.js                        # Main app entry point
├── app.json                      # Expo configuration
└── package.json                  # Dependencies and scripts
```

## Future Enhancements

- Medicine reminder notifications
- Multi-clinic support for broader clinic search
- Medicine interaction warnings
- Prescription management
- Cloud synchronization
- Medicine usage history and analytics
- Export/import medicine data
- Refill reminders with automatic clinic notifications

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Author

Created by [shoaib-creator](https://github.com/shoaib-creator)
