export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  profile: {
    firstName: string;
    lastName: string;
  };
  lastLoginAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}