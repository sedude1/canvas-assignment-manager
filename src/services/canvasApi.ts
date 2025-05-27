import { CanvasAssignment, CanvasCourse, CanvasApiConfig, AssignmentWithSelection } from '../types/canvas';

export class CanvasApiService {
  private config: CanvasApiConfig;
  private useProxy: boolean;

  constructor(config: CanvasApiConfig, useProxy: boolean = true) {
    this.config = config;
    this.useProxy = useProxy;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    let url: string;
    let headers: HeadersInit;

    if (this.useProxy) {
      // Detect environment and use appropriate proxy URL
      const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
      const baseUrl = isProduction 
        ? window.location.origin  // Use current domain in production
        : 'http://localhost:3003'; // Use local proxy in development
      
      url = `${baseUrl}/api/canvas${endpoint}`;
      headers = {
        'Content-Type': 'application/json',
        'X-Canvas-Url': this.config.baseUrl,
        'X-Api-Key': this.config.apiKey,
      };
    } else {
      // Direct API call (will likely fail due to CORS)
      url = `${this.config.baseUrl}/api/v1${endpoint}`;
      headers = {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      };
    }
    
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Canvas API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  // Smart detection for "due in class" assignments
  private isDueInClass(assignment: CanvasAssignment): boolean {
    const name = assignment.name.toLowerCase();
    const description = assignment.description?.toLowerCase() || '';
    
    // Keywords that indicate "due in class"
    const inClassKeywords = [
      'due in class',
      'in-class',
      'in class',
      'class discussion',
      'class participation',
      'attendance',
      'present in class',
      'class presentation',
      'oral presentation',
      'class activity',
      'class work',
      'classwork',
      'participation',
      'discussion post',
      'forum',
      'peer review',
      'group work',
      'lab work',
      'workshop'
    ];

    return inClassKeywords.some(keyword => 
      name.includes(keyword) || description.includes(keyword)
    );
  }

  // Smart detection for what constitutes a real assignment
  private isRealAssignment(assignment: CanvasAssignment): boolean {
    const name = assignment.name.toLowerCase();
    const description = assignment.description?.toLowerCase() || '';
    
    // Filter out non-assignments
    const nonAssignmentKeywords = [
      'syllabus',
      'course info',
      'course information',
      'welcome',
      'introduction',
      'getting started',
      'orientation',
      'announcement',
      'calendar',
      'schedule',
      'resources',
      'links',
      'extra credit',
      'bonus',
      'optional',
      'practice',
      'sample',
      'example',
      'template',
      'rubric'
    ];

    // If it contains non-assignment keywords, it's probably not a real assignment
    if (nonAssignmentKeywords.some(keyword => 
      name.includes(keyword) || description.includes(keyword)
    )) {
      return false;
    }

    // Must have a due date or points to be considered a real assignment
    if (!assignment.due_at && !assignment.points_possible) {
      return false;
    }

    // Must have submission types (not just "none" or empty)
    if (!assignment.submission_types || 
        assignment.submission_types.length === 0 || 
        (assignment.submission_types.length === 1 && assignment.submission_types[0] === 'none')) {
      return false;
    }

    return true;
  }

  async getCourses(): Promise<CanvasCourse[]> {
    return this.makeRequest<CanvasCourse[]>('/courses?enrollment_state=active&per_page=100');
  }

  async getAssignmentsForCourse(courseId: number): Promise<CanvasAssignment[]> {
    return this.makeRequest<CanvasAssignment[]>(
      `/courses/${courseId}/assignments?per_page=100&order_by=due_at`
    );
  }

  async getAllAssignments(): Promise<AssignmentWithSelection[]> {
    try {
      // Get all active courses
      const courses = await this.getCourses();
      
      // Get assignments for each course
      const assignmentPromises = courses.map(async (course) => {
        try {
          const assignments = await this.getAssignmentsForCourse(course.id);
          return assignments
            .filter(assignment => this.isRealAssignment(assignment)) // Filter out non-assignments
            .map(assignment => {
              const isDueInClass = this.isDueInClass(assignment);
              return {
                ...assignment,
                isSelected: false,
                courseName: course.name,
                isDueInClass,
                isHidden: isDueInClass // Auto-hide "due in class" assignments
              };
            });
        } catch (error) {
          console.warn(`Failed to fetch assignments for course ${course.name}:`, error);
          return [];
        }
      });

      const assignmentArrays = await Promise.all(assignmentPromises);
      const allAssignments = assignmentArrays.flat();

      // Filter for current assignments (not past due by more than a week)
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const filteredAssignments = allAssignments.filter(assignment => {
        if (!assignment.due_at) return true; // Include assignments with no due date
        const dueDate = new Date(assignment.due_at);
        return dueDate >= oneWeekAgo; // Include assignments due within the last week or in the future
      });

      console.log(`Processed ${allAssignments.length} assignments:`);
      console.log(`- ${filteredAssignments.filter(a => a.isDueInClass).length} detected as "due in class"`);
      console.log(`- ${filteredAssignments.filter(a => !a.isHidden).length} visible assignments`);
      console.log(`- ${filteredAssignments.filter(a => a.isHidden).length} hidden assignments`);

      return filteredAssignments;
    } catch (error) {
      throw new Error(`Failed to fetch assignments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static validateApiKey(apiKey: string): boolean {
    // Basic validation - Canvas API keys are typically long alphanumeric strings
    return apiKey.length > 20 && /^[a-zA-Z0-9~]+$/.test(apiKey);
  }

  static validateBaseUrl(baseUrl: string): boolean {
    try {
      const url = new URL(baseUrl);
      return url.protocol === 'https:' && url.hostname.length > 0;
    } catch {
      return false;
    }
  }

  // Test proxy server connection
  static async testProxyConnection(): Promise<boolean> {
    try {
      const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
      const baseUrl = isProduction 
        ? window.location.origin 
        : 'http://localhost:3003';
      
      const response = await fetch(`${baseUrl}/api/canvas/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
