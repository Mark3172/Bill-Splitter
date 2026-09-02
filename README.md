# 🧾 Bill Splitter — React Native & Web

A mobile bill splitting utility app crafted for instant group expense calculation, payment QR code attachment, and 1-tap sharing with live receipt formatting.

---

## ✨ Features

- **Dynamic Math & Split Engine**: Live calculation of per-person share with thousands comma formatting.
- **Premium Receipt Preview**: Live simulated receipt showing event name, total bill, individual share, and payment details.
- **Multi-Payment Provider Support**:
  - 🔵 **KPay** (KBZPay)
  - 🔴 **AYA Pay**
  - 🟡 **WavePay**
  - 🟢 **Bank Transfer** (CB Bank, KBZ, AYA Bank, etc.)
- **Payment QR Code Attachment**: Upload or take photos of payment QR codes directly on device with persistent storage.
- **Auto-Persistence**:
  - Mobile: `@react-native-async-storage/async-storage`
  - Web: `localStorage`
- **1-Tap Share & Clipboard**:
  - Native image + message sharing via `expo-sharing` / `Share.share` / `navigator.share`.
  - Formatted text copy with haptic feedback (`expo-haptics`).

---

## 📱 Getting Started with React Native / Expo

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- [Expo Go app](https://expo.dev/go) on your iOS or Android device

### 2. Create Expo Project & Install Dependencies

```bash
# Create project
npx create-expo-app BillSplitter --template blank
cd BillSplitter

# Install required native dependencies
npx expo install expo-clipboard expo-haptics @react-native-async-storage/async-storage expo-image-picker expo-sharing
```

### 3. Replace `App.js`
Replace the contents of `App.js` in your newly created project with the code from `src/expoCode.ts` (or the **App.js** tab in the web interface).

### 4. Run on Device

```bash
# Start the development server with tunnel mode
npx expo start --tunnel
```

- **iOS**: Open the Camera app on your iPhone and scan the QR code in the terminal.
- **Android**: Open the **Expo Go** app and scan the QR code in the terminal.

#### Testing Over USB:
```bash
# For Android over USB with ADB:
adb reverse tcp:8081 tcp:8081
npx expo start --localhost
# Press 'a' in the terminal to launch on connected device
```

---

## 📦 Building a Standalone Android APK (EAS Build)

To build a standalone `.apk` file without Android Studio:

1. **Install EAS CLI and log in**:
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

2. **Configure `eas.json` for APK builds**:
   ```json
   {
     "cli": {
       "version": ">= 12.0.0"
     },
     "build": {
       "preview": {
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```

3. **Trigger the Cloud Build**:
   ```bash
   eas build -p android --profile preview
   ```
   Once the build completes, download the APK link or scan the QR code in the terminal to install directly on your phone.

---

## 🌐 Running the Web Application

```bash
# Install packages
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

---

## 📂 Project Structure

```
├── README.md               # Documentation & setup guide
├── index.html              # Web entry point
├── package.json            # Project dependencies & scripts
├── src/
│   ├── App.tsx             # Web container & preview layout
│   ├── components/
│   │   ├── MobileSimulator.tsx  # Interactive mobile simulator
│   │   ├── CodeViewer.tsx       # Expo code viewer with copy
│   │   └── MobileTestGuide.tsx  # Mobile connection & QR dialog
│   ├── expoCode.ts         # Complete React Native App.js source
│   ├── types.ts            # TypeScript definitions
│   └── main.tsx            # React DOM mounting
```

---

## 📄 License
MIT License
