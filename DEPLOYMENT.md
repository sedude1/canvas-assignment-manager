# Running Canvas Assignment Manager Locally

## 📋 Prerequisites
- Node.js installed on your computer
- Git installed on your computer

## 🚀 Local Development Setup

### Step 1: Install Dependencies
Open terminal/command prompt in your project folder and run:

```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

This will start the app at `http://localhost:3000/`

### Step 3: Access on Mobile Device (Same Network)
To access the app on your phone or other devices on the same WiFi network:

```bash
npm run dev -- --host
```

This will show you a network URL like `http://192.168.x.x:3000/` that you can access from any device on your network.

## 📱 Mobile Access

### On Your Phone
1. Make sure your phone is connected to the same WiFi network as your computer
2. Open Safari (iOS) or Chrome (Android)
3. Navigate to the network URL shown in your terminal (e.g., `http://192.168.x.x:3000/`)
4. The app is fully responsive and works great on mobile!

### Add to Home Screen
To make it feel like a native app:
1. Open the app in your phone's browser
2. **iOS**: Tap Share → Add to Home Screen
3. **Android**: Tap Menu → Add to Home Screen
4. The app will open full-screen like a native app

## 🎯 Features Available

### Demo Mode
- Click "🎮 Try Demo Mode" to test with sample data
- No Canvas credentials needed
- Perfect for testing the interface

### Canvas Integration
- Enter your Canvas URL and API key
- Real-time assignment fetching
- Smart filtering and organization

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Start with network access
npm run dev -- --host

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📁 Project Structure

```
canvas-assignment-app/
├── src/
│   ├── components/        # React components
│   ├── services/         # API services
│   ├── store/           # State management
│   ├── types/           # TypeScript types
│   └── lib/             # Utilities
├── public/              # Static assets
└── package.json         # Dependencies
```

## 🎉 Success!

Your Canvas Assignment Manager is now running locally and accessible from:
- **Computer**: `http://localhost:3000/`
- **Mobile**: `http://192.168.x.x:3000/` (network URL shown in terminal)

Perfect for development and personal use! 🚀
