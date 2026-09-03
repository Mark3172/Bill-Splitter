# 🧾 Bill Splitter

A React and React Native utility for splitting group bills, attaching payment QR codes, and sharing polished receipt summaries.

## Highlights

- Live equal-split calculations with multi-currency formatting
- Large per-person summary and receipt preview
- KPay, AYA Pay, WavePay, and bank transfer support
- Payment QR upload, preview, copy, and download
- Shareable PNG receipt cards and formatted text
- Auto-saved accounts, currency, QR codes, and recent history
- Interactive web simulator and copy-ready Expo source

## UI

The interface uses a dark fintech design inspired by production patterns found on Mobbin:

- [Revolut Split bill](https://mobbin.com/screens/3fc54275-80f7-41c1-83ee-2dbff8296221) — dark surfaces, amount hierarchy, and pill actions
- [Revolut Receive QR](https://mobbin.com/screens/3a001837-9f06-4875-8b0a-ecbffafd3f8e) — focused QR presentation
- [Wise Split bill](https://mobbin.com/screens/2e45a42f-2609-4eb0-adb0-43d9f78bc064) — clear split summary
- [Phantom Receive](https://mobbin.com/screens/2a707eff-e0a5-457b-b00c-58ec94bd96cc) — high-contrast QR card
- [Splitwise split options](https://mobbin.com/flows/c539ec1a-b25e-46d0-bfad-4fbb01d514c2) — equal-split clarity and navigation cues

The visual layer is separate from the calculation, persistence, and sharing logic.

## Run the Web App

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run lint      # TypeScript validation
npm run build     # Production build
npm run preview   # Preview the production build
```

## Run with React Native / Expo

The repository now includes a ready-to-run Expo project under `mobile/`.

```bash
cd mobile
npm install
npx expo start --tunnel
```

Scan the terminal QR code with the iOS Camera app or Expo Go on Android.

### Android over USB

```bash
cd mobile
adb reverse tcp:8081 tcp:8081
npx expo start --localhost
```

Press `a` in the Expo terminal to launch the connected device.

## Build an Android APK

The `mobile/eas.json` file already contains:

- `preview`: installable Android APK
- `production`: Google Play Android App Bundle (`.aab`)

Install EAS CLI and sign in:

```bash
npm install --global eas-cli
eas login
```

Create a downloadable APK:

```bash
cd mobile
npm run build:apk
```

Create a Google Play bundle:

```bash
cd mobile
npm run build:android
```

## Persistence

- Web simulator: `localStorage`
- React Native app: `@react-native-async-storage/async-storage`
- History keeps the five most recent successful calculations

## Project Structure

```text
├── index.html
├── package.json
├── mobile/
│   ├── App.js
│   ├── app.json
│   ├── eas.json
│   ├── index.js
│   └── package.json
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── BottomNavBar.tsx
│   │   ├── CodeViewer.tsx
│   │   ├── HistoryTab.tsx
│   │   ├── MobileSimulator.tsx
│   │   ├── MobileTestGuide.tsx
│   │   ├── PaymentTab.tsx
│   │   ├── ReceiptModal.tsx
│   │   ├── SideDrawer.tsx
│   │   └── SplitTab.tsx
│   ├── utils/
│   │   └── receiptGenerator.ts
│   ├── expoCode.ts
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
└── vite.config.ts
```
