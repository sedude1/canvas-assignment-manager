# Canvas Assignment Manager

A mobile-friendly React application that connects to your Canvas LMS to fetch and manage assignments with AI-powered solving capabilities.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- A Canvas LMS account with API access

### Installation & Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open the application**:
   - Navigate to: `http://localhost:3000`
   - Or copy and paste this URL into your browser: **http://localhost:3000**

## 🔧 Canvas API Configuration

When you first open the app, you'll need to configure your Canvas connection:

### Getting Your Canvas URL
Your Canvas URL is typically in this format:
- `https://[your-school].instructure.com`
- Examples:
  - `https://canvas.university.edu`
  - `https://myschool.instructure.com`
  - `https://learn.college.edu`

### Getting Your Canvas API Key

1. **Log into Canvas** in your web browser
2. **Go to Account Settings**:
   - Click your profile picture (top right)
   - Select "Account" or "Settings"
3. **Find API Access**:
   - Scroll down to "Approved Integrations" section
   - Click "+ New Access Token"
4. **Generate Token**:
   - Enter a purpose: "Assignment Manager App"
   - Click "Generate Token"
   - **Copy the token immediately** (you won't see it again!)
5. **Paste into the app**:
   - Return to the Canvas Assignment Manager
   - Paste your Canvas URL and API key
   - Click "Connect to Canvas"

## 📱 Features

### ✅ Current Features
- **Canvas API Integration**: Securely connect using your API key
- **Assignment Fetching**: Automatically retrieves current assignments from all courses
- **Mobile-Friendly Interface**: Responsive design optimized for mobile devices
- **Assignment Selection**: Check/uncheck assignments you want to process
- **Due Date Tracking**: Color-coded due dates (overdue, due soon, etc.)
- **Course Organization**: Assignments grouped by course
- **Local Storage**: Your API configuration and selections are saved locally

### 🔮 Planned Features
- **AI-Powered Solving**: Send selected assignments to AI for help
- **Assignment Details**: View full assignment descriptions and requirements
- **Submission Tracking**: Track which assignments have been submitted
- **Notifications**: Reminders for upcoming due dates

## 🎯 How to Use

1. **Initial Setup**:
   - Enter your Canvas URL and API key
   - Click "Connect to Canvas"

2. **View Assignments**:
   - Browse your current assignments from all courses
   - See due dates, point values, and course names

3. **Select Assignments**:
   - Check the boxes next to assignments you want help with
   - Use "Select All" / "Deselect All" for bulk actions

4. **Process Selected** (Coming Soon):
   - Click "Process Selected" to send to AI solver
   - Get help with assignment solutions

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + ShadCN UI components
- **Icons**: Lucide React
- **State Management**: Zustand with persistence
- **Build Tool**: Vite
- **API**: Canvas LMS REST API

## 🔒 Privacy & Security

- **Local Storage**: Your API key is stored locally in your browser only
- **No Server**: This app runs entirely in your browser
- **Secure Connections**: All API calls use HTTPS
- **No Data Collection**: We don't collect or store your personal data

## 🐛 Troubleshooting

### Common Issues

**"Failed to connect to Canvas API"**
- Verify your Canvas URL is correct and includes `https://`
- Check that your API key is valid and hasn't expired
- Ensure your Canvas account has API access enabled

**"No assignments found"**
- Check that you're enrolled in courses with active assignments
- Verify assignments aren't past the one-week cutoff for overdue items

**App won't load**
- Make sure the development server is running (`npm run dev`)
- Try refreshing the page
- Check the browser console for errors

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Canvas credentials are correct
3. Try refreshing the page or restarting the dev server

## 📄 License

This project is for educational purposes. Please ensure compliance with your institution's Canvas API usage policies.
