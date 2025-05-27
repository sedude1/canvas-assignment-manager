import { create } from 'zustand';
import { AssignmentWithSelection, CanvasApiConfig } from '../types/canvas';

interface AssignmentStore {
  // API Configuration
  apiConfig: CanvasApiConfig | null;
  setApiConfig: (config: CanvasApiConfig) => void;
  
  // Assignments
  assignments: AssignmentWithSelection[];
  setAssignments: (assignments: AssignmentWithSelection[]) => void;
  
  // Selection state
  toggleAssignmentSelection: (assignmentId: number) => void;
  selectAllAssignments: () => void;
  deselectAllAssignments: () => void;
  getSelectedAssignments: () => AssignmentWithSelection[];
  
  // Visibility controls
  toggleAssignmentVisibility: (assignmentId: number) => void;
  showHiddenAssignments: boolean;
  setShowHiddenAssignments: (show: boolean) => void;
  getVisibleAssignments: () => AssignmentWithSelection[];
  getHiddenAssignments: () => AssignmentWithSelection[];
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
  
  // Clear all data
  clearData: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  // Initial state
  apiConfig: null,
  assignments: [],
  isLoading: false,
  error: null,
  showHiddenAssignments: false,
  
  // API Configuration
  setApiConfig: (config: CanvasApiConfig) => {
    set({ apiConfig: config });
    // Save to localStorage manually
    localStorage.setItem('canvas-api-config', JSON.stringify(config));
  },
  
  // Assignments
  setAssignments: (assignments: AssignmentWithSelection[]) => {
    set({ assignments });
    // Save to localStorage manually
    localStorage.setItem('canvas-assignments', JSON.stringify(assignments));
  },
  
  // Selection management
  toggleAssignmentSelection: (assignmentId: number) => {
    const { assignments } = get();
    const updatedAssignments = assignments.map(assignment =>
      assignment.id === assignmentId
        ? { ...assignment, isSelected: !assignment.isSelected }
        : assignment
    );
    set({ assignments: updatedAssignments });
    localStorage.setItem('canvas-assignments', JSON.stringify(updatedAssignments));
  },
  
  selectAllAssignments: () => {
    const { assignments, showHiddenAssignments } = get();
    const updatedAssignments = assignments.map(assignment => ({
      ...assignment,
      isSelected: showHiddenAssignments || !assignment.isHidden ? true : assignment.isSelected
    }));
    set({ assignments: updatedAssignments });
    localStorage.setItem('canvas-assignments', JSON.stringify(updatedAssignments));
  },
  
  deselectAllAssignments: () => {
    const { assignments } = get();
    const updatedAssignments = assignments.map(assignment => ({
      ...assignment,
      isSelected: false
    }));
    set({ assignments: updatedAssignments });
    localStorage.setItem('canvas-assignments', JSON.stringify(updatedAssignments));
  },
  
  getSelectedAssignments: () => {
    const { assignments } = get();
    return assignments.filter(assignment => assignment.isSelected);
  },
  
  // Visibility controls
  toggleAssignmentVisibility: (assignmentId: number) => {
    const { assignments } = get();
    const updatedAssignments = assignments.map(assignment =>
      assignment.id === assignmentId
        ? { ...assignment, isHidden: !assignment.isHidden }
        : assignment
    );
    set({ assignments: updatedAssignments });
    localStorage.setItem('canvas-assignments', JSON.stringify(updatedAssignments));
  },
  
  setShowHiddenAssignments: (show: boolean) => {
    set({ showHiddenAssignments: show });
    localStorage.setItem('canvas-show-hidden', JSON.stringify(show));
  },
  
  getVisibleAssignments: () => {
    const { assignments, showHiddenAssignments } = get();
    return showHiddenAssignments 
      ? assignments 
      : assignments.filter(assignment => !assignment.isHidden);
  },
  
  getHiddenAssignments: () => {
    const { assignments } = get();
    return assignments.filter(assignment => assignment.isHidden);
  },
  
  // Loading states
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  
  // Error handling
  setError: (error: string | null) => set({ error }),
  
  // Clear all data
  clearData: () => {
    set({
      apiConfig: null,
      assignments: [],
      isLoading: false,
      error: null,
      showHiddenAssignments: false
    });
    localStorage.removeItem('canvas-api-config');
    localStorage.removeItem('canvas-assignments');
    localStorage.removeItem('canvas-show-hidden');
  }
}));

// Initialize store from localStorage
const initializeStore = () => {
  try {
    const savedConfig = localStorage.getItem('canvas-api-config');
    const savedAssignments = localStorage.getItem('canvas-assignments');
    const savedShowHidden = localStorage.getItem('canvas-show-hidden');
    
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      useAssignmentStore.getState().setApiConfig(config);
    }
    
    if (savedAssignments) {
      const assignments = JSON.parse(savedAssignments);
      useAssignmentStore.setState({ assignments });
    }
    
    if (savedShowHidden) {
      const showHidden = JSON.parse(savedShowHidden);
      useAssignmentStore.setState({ showHiddenAssignments: showHidden });
    }
  } catch (error) {
    console.warn('Failed to load saved data:', error);
  }
};

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeStore();
}
