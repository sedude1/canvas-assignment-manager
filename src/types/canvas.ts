export interface CanvasAssignment {
  id: number;
  name: string;
  description: string;
  due_at: string | null;
  points_possible: number | null;
  course_id: number;
  html_url: string;
  submission_types: string[];
  has_submitted_submissions: boolean;
  workflow_state: 'published' | 'unpublished';
}

export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  workflow_state: string;
}

export interface CanvasApiConfig {
  baseUrl: string;
  apiKey: string;
}

export interface AssignmentWithSelection extends CanvasAssignment {
  isSelected: boolean;
  courseName?: string;
  isDueInClass: boolean;
  isHidden: boolean;
}
