import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { CanvasApiService } from '../services/canvasApi';
import { Settings, Eye, EyeOff } from 'lucide-react';

interface ApiSetupProps {
  onConfigured: () => void;
}

export const ApiSetup: React.FC<ApiSetupProps> = ({ onConfigured }) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  const { setApiConfig, setError, error, setAssignments } = useAssignmentStore();

  // Demo data for testing
  const createDemoData = () => {
    const demoAssignments = [
      {
        id: 1,
        name: "Math Homework - Chapter 5",
        description: "Complete exercises 1-20 from Chapter 5",
        due_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Due in 2 days
        points_possible: 100,
        course_id: 101,
        html_url: "https://example.com/assignment1",
        submission_types: ["online_text_entry"],
        has_submitted_submissions: false,
        workflow_state: "published" as const,
        isSelected: false,
        courseName: "Advanced Mathematics",
        isDueInClass: false,
        isHidden: false
      },
      {
        id: 2,
        name: "History Essay - World War II",
        description: "Write a 5-page essay on the causes of World War II",
        due_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Due in 5 days
        points_possible: 150,
        course_id: 102,
        html_url: "https://example.com/assignment2",
        submission_types: ["online_upload"],
        has_submitted_submissions: false,
        workflow_state: "published" as const,
        isSelected: false,
        courseName: "World History",
        isDueInClass: false,
        isHidden: false
      },
      {
        id: 3,
        name: "Science Lab Report",
        description: "Submit lab report for chemistry experiment",
        due_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Overdue by 1 day
        points_possible: 75,
        course_id: 103,
        html_url: "https://example.com/assignment3",
        submission_types: ["online_upload"],
        has_submitted_submissions: false,
        workflow_state: "published" as const,
        isSelected: false,
        courseName: "Chemistry 101",
        isDueInClass: false,
        isHidden: false
      },
      {
        id: 4,
        name: "Programming Project - Calculator App",
        description: "Build a calculator app using React",
        due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 1 week
        points_possible: 200,
        course_id: 104,
        html_url: "https://example.com/assignment4",
        submission_types: ["online_url"],
        has_submitted_submissions: false,
        workflow_state: "published" as const,
        isSelected: false,
        courseName: "Computer Science",
        isDueInClass: false,
        isHidden: false
      }
    ];
    
    return demoAssignments;
  };

  const handleDemoMode = () => {
    console.log('Demo mode activated!');
    const demoConfig = { 
      baseUrl: 'https://demo.instructure.com', 
      apiKey: 'demo-key-12345' 
    };
    
    setApiConfig(demoConfig);
    setAssignments(createDemoData());
    onConfigured();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submitted!', { baseUrl, apiKey: apiKey ? 'PROVIDED' : 'EMPTY' });
    e.preventDefault();
    setIsValidating(true);
    setError(null);

    try {
      console.log('Starting validation...');
      
      // Validate inputs
      if (!baseUrl.trim()) {
        throw new Error('Please enter your Canvas URL');
      }
      
      if (!baseUrl.startsWith('https://')) {
        throw new Error('Canvas URL must start with https:// (e.g., https://yourschool.instructure.com)');
      }
      
      if (!CanvasApiService.validateBaseUrl(baseUrl)) {
        throw new Error('Please enter a valid Canvas URL (e.g., https://yourschool.instructure.com)');
      }

      if (!apiKey.trim()) {
        throw new Error('Please enter your Canvas API key');
      }
      
      if (!CanvasApiService.validateApiKey(apiKey)) {
        throw new Error('Please enter a valid Canvas API key (should be a long string of letters and numbers)');
      }

      console.log('Validation passed, testing API connection...');

      // Test the API connection
      const config = { baseUrl: baseUrl.trim(), apiKey: apiKey.trim() };
      const apiService = new CanvasApiService(config);
      
      // Try to fetch courses to validate the API key
      console.log('Fetching courses...');
      await apiService.getCourses();
      
      console.log('API connection successful!');
      
      // If successful, save the config
      setApiConfig(config);
      onConfigured();
    } catch (error) {
      console.error('Error during submission:', error);
      if (error instanceof Error && (
        error.message.includes('CORS') || 
        error.message.includes('fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch') ||
        error.name === 'TypeError'
      )) {
        setError('CORS Error: Canvas API calls are blocked by browser security. This is normal for web apps. Use Demo Mode to test the interface, or deploy this app to a server with proper CORS handling.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to connect to Canvas API');
      }
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Settings className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Canvas Assignment Manager</h1>
          <p className="text-muted-foreground">
            Connect to your Canvas account to get started
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Demo Mode Button */}
        <div className="text-center">
          <Button 
            onClick={handleDemoMode}
            variant="outline"
            className="w-full mb-4"
          >
            🎮 Try Demo Mode (Sample Data)
          </Button>
          <p className="text-xs text-muted-foreground mb-4">
            Test the app with sample assignments without needing Canvas credentials
          </p>
          <div className="text-xs text-muted-foreground">
            — OR —
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="baseUrl" className="text-sm font-medium">
              Canvas URL
            </label>
            <Input
              id="baseUrl"
              type="url"
              placeholder="https://yourschool.instructure.com"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Your school's Canvas URL
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              API Key
            </label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="Enter your Canvas API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Generate this in Canvas: Account → Settings → New Access Token
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isValidating}
          >
            {isValidating ? 'Connecting...' : 'Connect to Canvas'}
          </Button>
        </form>

        <div className="text-xs text-muted-foreground space-y-2">
          <p>
            <strong>Note:</strong> Direct Canvas API calls from browsers are often blocked by CORS policy. 
            For production use, this app should be deployed to a server with proper CORS handling.
          </p>
          <p>
            <strong>How to get your API key:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Log into Canvas</li>
            <li>Go to Account → Settings</li>
            <li>Scroll to "Approved Integrations"</li>
            <li>Click "+ New Access Token"</li>
            <li>Enter a purpose and click "Generate Token"</li>
            <li>Copy the token and paste it above</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
