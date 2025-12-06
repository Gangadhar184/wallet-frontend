import api from './api';
import type { UserDto, UpdateUserRequest, UpdatePasswordRequest } from '../types';

export interface SearchUsersParams {
  filter?: string;
  page?: number;
  size?: number;
}

export const userService = {
  // Get current logged-in user details
  async getCurrentUser(): Promise<UserDto> {
    const response = await api.get<UserDto>('/users/me');
    return response.data;
  },

  // Search/filter users (bulk endpoint)
  async searchUsers(params: SearchUsersParams = {}): Promise<UserDto[]> {
    const response = await api.get<UserDto[]>('/users/bulk', {
      params: {
        filter: params.filter || '',
        page: params.page || 0,
        size: params.size || 10,
      },
    });
    return response.data;
  },

  // Get user by ID
  async getUserById(id: number): Promise<UserDto> {
    const response = await api.get<UserDto>(`/users/${id}`);
    return response.data;
  },

  // Get all users
  async getAllUsers(): Promise<UserDto[]> {
    const response = await api.get<UserDto[]>('/users');
    return response.data;
  },

  // Update current user's profile
  async updateCurrentUser(data: UpdateUserRequest): Promise<UserDto> {
    const response = await api.put<UserDto>('/users/me', data);
    return response.data;
  },

  // Update password
  async updatePassword(data: UpdatePasswordRequest): Promise<string> {
    const response = await api.put<string>('/users/me/password', data);
    return response.data;
  },
};

export default userService;

