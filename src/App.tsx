import React, { useEffect, useState } from 'react';
import { ApiSetup } from './components/ApiSetup';
import { AssignmentList } from './components/AssignmentList';
import { Button } from './components/ui/button';
import { useAssignmentStore } from './store/useAssignmentStore';
import { CanvasApiService } from './services/canvasApi';
import { RefreshCw, Settings, AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  
  const { 
    apiConfig, 
    assignments, 
    isLoading, 
    error, 
    setAssignments, 
    setIsLoading, 
    setError, 
    clearData 
  } = useAssignmentStore();

  useEffect(() => {
    setIsConfigured(!!apiConfig);
    
    // Auto-fetch assignments if we have a config and no assignments
    if (apiConfig && assignments.length === 0) {
      fetchAssignments();
    }
  }, [apiConfig]);

  const fetchAssignments = async () => {
    if (!apiConfig) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const apiService = new CanvasApiService(apiConfig);
      const fetchedAssignments = await apiService.getAllAssignments();
      setAssignments(fetchedAssignments);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconfigure = () => {
    clearData();
    setIsConfigured(false);
  };

  if (!isConfigured) {
    return <ApiSetup onConfigured={() => setIsConfigured(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Canvas Assignments</h1>
              <p className="text-sm text-muted-foreground">
                {assignments.length} assignment{assignments.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAssignments}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReconfigure}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <h3 className="font-medium text-destructive">Error</h3>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAssignments}
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {isLoading && assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Loading assignments...</h3>
            <p className="text-muted-foreground text-center">
              Fetching your current assignments from Canvas
            </p>
          </div>
        ) : (
          <AssignmentList />
        )}
      </main>
    </div>
  );
}

export default App;
