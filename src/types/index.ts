// User types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
}

// Account types
export interface BalanceResponse {
  balance: number;
}

export interface TransferRequest {
  toUsername: string;
  amount: number;
  requestId: string;
}

export interface Transaction {
  id: number;
  fromUser: string;
  toUser: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  type: string;
  date: string;
}

export interface TransactionDto {
  fromUser: string;
  toUser: string;
  amount: number;
  type: string;
  status: string;
  date: string;
}

// API Error type
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}

// Auth context types
export interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

