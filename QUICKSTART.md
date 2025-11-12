# Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the App
```bash
npm start
```

### Step 3: Open on Your Device
- **Scan the QR code** with:
  - iOS: Camera app
  - Android: Expo Go app (download from Play Store)
- **Or press**:
  - `a` for Android emulator
  - `i` for iOS simulator (macOS only)
  - `w` for web browser

## First-Time Setup

### For Patients (Normal People)
1. Open the app and stay on the **Patient** tab
2. Tap the blue **+** button to add your first medicine
3. Enter:
   - Medicine name (e.g., "Aspirin")
   - Dosage (e.g., "500mg")
   - Frequency (e.g., "2x daily")
   - Current stock (e.g., "30")
4. Optionally scan the barcode
5. Tap **Save**

### For Clinics
1. Switch to the **Clinic** tab
2. Tap **Setup Clinic Information**
3. Enter clinic details:
   - Clinic name
   - Address
   - Phone number
4. Tap **Get Current Location** to auto-fill coordinates
5. Tap **Save**
6. Add medicines to inventory using the **+** button

## Key Features to Try

### 1. Add a Medicine (Patient Side)
- Tap + button → Fill form → Save
- Watch it appear in your list

### 2. Scan a Barcode
- Tap + button → Tap "Scan Barcode"
- Point camera at any barcode
- See the barcode number auto-fill

### 3. Track Medicine Stock
- Use - button to mark medicine as taken
- Watch stock decrease
- See low stock alert when it gets low

### 4. Find Nearby Clinics
- Let stock go below minimum (e.g., 5)
- Tap "Find Nearby Clinics" button
- Grant location permission
- See nearby clinics with that medicine

### 5. Manage Clinic Inventory
- Switch to Clinic tab
- Add medicines with stock and price
- Use +/- buttons to adjust stock
- Use +10 for bulk additions

## Tips for Best Experience

1. **Grant Permissions**: Allow camera and location for full functionality
2. **Set Realistic Minimums**: Set min stock to when you'd normally refill
3. **Use Barcodes**: Makes medicines easier to identify and manage
4. **Update Stock Daily**: Keep accurate counts for better reminders
5. **Add Clinic Location**: Ensures accurate distance calculations

## Troubleshooting

### App Won't Start
```bash
# Clear cache and restart
npm start -- --clear
```

### Camera Not Working
- Check device permissions in Settings
- Allow camera access for Expo Go

### Location Not Working
- Enable location services on device
- Grant location permission when prompted

### Data Not Saving
- Check storage permissions
- Try closing and reopening the app

## Testing the Complete Flow

1. **Add a medicine as Patient** with stock = 5, min = 5
2. **Switch to Clinic tab**
3. **Setup clinic info** with your current location
4. **Add the same medicine** to clinic inventory
5. **Switch back to Patient tab**
6. **Tap "Find Nearby Clinics"** on the low-stock medicine
7. **See your clinic appear** in the search results!

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Read [FEATURES.md](FEATURES.md) for complete feature list
- Customize the app for your specific needs
- Share with friends or healthcare providers

## Need Help?

- Check the [README](README.md) for more details
- Open an issue on GitHub
- Review the code in `src/` directory

---

**Enjoy managing your medicines! 💊**
