export enum UserRole {
  ADMIN = 'ADMIN',
  PI = 'PI',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  pi: User;
  tags: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  project: Project;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  createdBy: User;
}

export interface Document {
  id: string;
  project: Project;
  title: string;
  description: string;
  fileName: string;
  contentType: string;
  uploadedBy: User;
  uploadedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  summary: string;
  tags: string;
  startDate: string;
  endDate: string;
}

export interface UpdateProjectRequest {
  title?: string;
  summary?: string;
  tags?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateMilestoneRequest {
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateMilestoneRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
}

export interface CreateDocumentRequest {
  title: string;
  description: string;
  file: File;
}

// add to the existing file
export interface CreateUserRequest {
  username: string;
  fullName: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  fullName: string;
  username?: string;
  role: UserRole;
}