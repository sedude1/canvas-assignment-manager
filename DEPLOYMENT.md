# Deploying Canvas Assignment Manager to Vercel

## 📋 Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Git installed on your computer

## 🚀 Step-by-Step Deployment

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it something like `canvas-assignment-manager`
3. Make it public (required for free Vercel deployment)
4. Don't initialize with README (we already have files)

### Step 2: Push Your Code to GitHub
Open terminal/command prompt in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Canvas Assignment Manager"

# Add your GitHub repository as origin (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/canvas-assignment-manager.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project
5. Click "Deploy"

### Step 4: Configure Environment (if needed)
- No environment variables needed for basic deployment
- The app will automatically work with Vercel's serverless functions

## 🎯 What Happens During Deployment

### Automatic Configuration
- **Frontend**: Vite builds your React app for production
- **API**: The `/api/canvas.js` file becomes a serverless function
- **CORS**: Automatically handled by Vercel
- **Environment Detection**: App detects production vs development

### File Structure for Vercel
```
canvas-assignment-app/
├── api/
│   └── canvas.js          # Serverless function for Canvas API proxy
├── src/                   # React app source code
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## 📱 After Deployment

### Your Live App
- You'll get a URL like: `https://canvas-assignment-manager-abc123.vercel.app`
- This URL works on any device with internet
- Perfect for mobile access

### Features That Work
- ✅ Canvas API integration (via serverless proxy)
- ✅ Smart assignment filtering
- ✅ Mobile-responsive design
- ✅ Local storage persistence
- ✅ Real-time assignment fetching

## 🔧 Troubleshooting

### Common Issues
1. **Build Errors**: Check that all dependencies are in package.json
2. **API Errors**: Verify the `/api/canvas.js` file is in the correct location
3. **CORS Issues**: Should be resolved automatically with serverless function

### Vercel Logs
- Check deployment logs in Vercel dashboard
- Function logs available for debugging API issues

## 🎉 Success!
Once deployed, you can:
- Access your app from any device
- Share the URL with others
- Use it on your phone like a native app
- Bookmark it to your home screen

## 📱 Mobile App Experience
To make it feel like a native app on your phone:
1. Open the Vercel URL in your phone's browser
2. Add to home screen (iOS: Share → Add to Home Screen, Android: Menu → Add to Home Screen)
3. The app will open full-screen like a native app

Your Canvas Assignment Manager is now live and accessible from anywhere! 🚀
