# Build Android APK Guide

## Overview

Convert your React chatbot into an Android APK that connects to your laptop's LLM server over WiFi.

## Architecture

```
[Android Phone] ←→ WiFi ←→ [Your Laptop]
    (APK)                    (Backend Server + Ollama)
```

## Prerequisites

- Node.js installed
- Your laptop and phone on the same WiFi network
- Android phone with USB debugging enabled (optional)

## Method 1: Using Capacitor (Recommended)

Capacitor converts your web app into a native Android app.

### Step 1: Install Capacitor

```bash
# In your project root
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Initialize Capacitor
npx cap init
```

When prompted:
- App name: `ArthBot`
- App ID: `com.arthbot.app` (or your choice)
- Web directory: `dist`

### Step 2: Build Your Web App

```bash
# Build the production version
npm run build
```

This creates a `dist` folder with your optimized app.

### Step 3: Add Android Platform

```bash
# Add Android platform
npx cap add android
```

This creates an `android` folder with Android project files.

### Step 4: Configure Network Access

The app needs to connect to your laptop's IP address.

**Find your laptop's IP:**

Windows:
```bash
ipconfig
# Look for "IPv4 Address" under your WiFi adapter
# Example: 192.168.1.100
```

Mac/Linux:
```bash
ifconfig
# Look for "inet" under your WiFi interface
# Example: 192.168.1.100
```

### Step 5: Update API Base URL

Before building, update your `.env` file:

```env
VITE_API_BASE_URL=http://192.168.1.100:4000
```

Replace `192.168.1.100` with YOUR laptop's IP address.

Then rebuild:
```bash
npm run build
npx cap sync
```

### Step 6: Build APK

**Option A: Using Android Studio (Easier)**

```bash
# Open Android Studio
npx cap open android
```

In Android Studio:
1. Wait for Gradle sync to complete
2. Click `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. Wait for build to complete
4. Click "locate" to find the APK
5. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

**Option B: Using Command Line**

```bash
cd android
./gradlew assembleDebug
cd ..
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 7: Install APK on Phone

**Method 1: USB Cable**
```bash
# Enable USB debugging on phone
# Connect phone via USB
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Method 2: File Transfer**
1. Copy APK to phone via USB/Bluetooth/Email
2. Open APK file on phone
3. Allow "Install from unknown sources"
4. Install the app

### Step 8: Start Your Backend Server

On your laptop:
```bash
cd server
npm start
```

Keep this running while using the app!

### Step 9: Use the App

1. Ensure phone and laptop are on same WiFi
2. Open ArthBot app on phone
3. Login/Signup
4. Start chatting!

## Method 2: Using Cordova (Alternative)

### Step 1: Install Cordova

```bash
npm install -g cordova
```

### Step 2: Create Cordova Project

```bash
# Create new Cordova project
cordova create arthbot-mobile com.arthbot.app ArthBot

# Copy your built files
npm run build
cp -r dist/* arthbot-mobile/www/

cd arthbot-mobile
```

### Step 3: Add Android Platform

```bash
cordova platform add android
```

### Step 4: Build APK

```bash
cordova build android
```

APK location: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

## Method 3: Using PWA (Progressive Web App)

Simplest method - no APK needed!

### Step 1: Add PWA Support

Your app already works as a web app. Just access it from phone browser.

### Step 2: Access from Phone

1. Start backend on laptop: `cd server && npm start`
2. Start frontend on laptop: `npm run dev`
3. Find laptop IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
4. On phone browser, go to: `http://192.168.1.100:5173`
5. Tap browser menu → "Add to Home Screen"
6. App icon appears on home screen!

### Advantages
- ✅ No build process
- ✅ Instant updates
- ✅ Works on any device
- ✅ No app store needed

### Disadvantages
- ❌ Requires browser
- ❌ Limited offline support
- ❌ No native features

## Network Configuration

### Making Your Laptop Accessible

#### Windows Firewall
```bash
# Allow Node.js through firewall
# Control Panel → Windows Defender Firewall → Allow an app
# Find Node.js and check both Private and Public
```

Or run as admin:
```bash
netsh advfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=4000
```

#### Mac Firewall
```bash
# System Preferences → Security & Privacy → Firewall
# Click "Firewall Options"
# Add Node.js to allowed apps
```

#### Linux Firewall (UFW)
```bash
sudo ufw allow 4000/tcp
sudo ufw allow 5173/tcp
```

### Test Connection

From your phone browser, visit:
```
http://YOUR_LAPTOP_IP:4000/auth/profile
```

You should see an error (expected - no token), but it means server is reachable!

## Production APK (Signed)

For Google Play Store or production use:

### Step 1: Generate Keystore

```bash
keytool -genkey -v -keystore arthbot-release.keystore -alias arthbot -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Configure Signing

Create `android/key.properties`:
```properties
storePassword=your-password
keyPassword=your-password
keyAlias=arthbot
storeFile=../arthbot-release.keystore
```

### Step 3: Build Release APK

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

### "Cannot connect to server"

**Check 1: Same WiFi**
- Phone and laptop must be on same WiFi network
- Not mobile data!

**Check 2: Firewall**
- Disable firewall temporarily to test
- If works, add firewall rule (see above)

**Check 3: IP Address**
- Verify laptop IP hasn't changed
- Rebuild app with new IP if needed

**Check 4: Server Running**
- Ensure `npm start` is running in server folder
- Check terminal for errors

### "App crashes on startup"

**Solution 1: Check Logs**
```bash
# Connect phone via USB
adb logcat | grep -i arthbot
```

**Solution 2: Rebuild**
```bash
npm run build
npx cap sync
npx cap open android
# Build again in Android Studio
```

### "Voice input not working"

**Cause**: Android permissions

**Solution**: Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

Then rebuild.

### "Ollama not responding"

**Check**: Ollama is running on laptop
```bash
ollama list
# Should show your models
```

**Fix**: Start Ollama
```bash
ollama serve
```

## Dynamic IP Solution

If your laptop IP changes frequently:

### Option 1: Static IP

Set static IP on your laptop:
- Windows: Network Settings → Change adapter options → Properties → IPv4
- Mac: System Preferences → Network → Advanced → TCP/IP
- Set to "Manual" and choose IP like `192.168.1.100`

### Option 2: Local Domain

Use `.local` domain (works on same network):

1. Find laptop hostname:
```bash
# Windows
hostname

# Mac/Linux
hostname
```

2. Use in app:
```env
VITE_API_BASE_URL=http://YOUR-LAPTOP-NAME.local:4000
```

3. Rebuild and sync

### Option 3: Dynamic DNS

Use a service like ngrok (requires internet):

```bash
# Install ngrok
# Run on laptop
ngrok http 4000

# Use the ngrok URL in your app
VITE_API_BASE_URL=https://abc123.ngrok.io
```

## Complete Build Script

Create `build-android.sh`:

```bash
#!/bin/bash

echo "Building Android APK..."

# Get laptop IP
IP=$(ipconfig | grep "IPv4" | head -1 | awk '{print $NF}')
echo "Using IP: $IP"

# Update .env
echo "VITE_API_BASE_URL=http://$IP:4000" > .env

# Build web app
echo "Building web app..."
npm run build

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync

# Build APK
echo "Building APK..."
cd android
./gradlew assembleDebug
cd ..

echo "✅ APK built successfully!"
echo "Location: android/app/build/outputs/apk/debug/app-debug.apk"
```

Run:
```bash
chmod +x build-android.sh
./build-android.sh
```

## Summary

**Easiest Method**: PWA (Add to Home Screen)
- No build needed
- Access via browser
- Instant updates

**Best Method**: Capacitor
- Native Android app
- Professional look
- App icon on home screen

**Requirements**:
1. Laptop and phone on same WiFi
2. Backend server running on laptop
3. Ollama running on laptop
4. Correct IP address in app

**Steps**:
1. Install Capacitor: `npm install @capacitor/core @capacitor/cli @capacitor/android`
2. Initialize: `npx cap init`
3. Build: `npm run build`
4. Add Android: `npx cap add android`
5. Update IP in `.env`
6. Sync: `npx cap sync`
7. Build APK: `npx cap open android` → Build → Build APK
8. Install on phone
9. Start server on laptop
10. Use app!

Your chatbot will now work as a native Android app while using your laptop's LLM! 🎉
