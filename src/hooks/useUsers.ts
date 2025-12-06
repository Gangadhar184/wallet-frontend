import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import userService from '@/services/userService';
import type { UpdateUserRequest, UpdatePasswordRequest } from '@/types';
import type { AxiosError } from 'axios';

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 60000, // 1 minute
  });
}

// Search users with debounced input
export function useSearchUsers(searchTerm: string, enabled: boolean = true) {
  const debouncedSearch = useDebounce(searchTerm, 300);

  return useQuery({
    queryKey: ['searchUsers', debouncedSearch],
    queryFn: () => userService.searchUsers({ filter: debouncedSearch, size: 10 }),
    enabled: enabled && debouncedSearch.length > 0,
    staleTime: 30000, // 30 seconds
  });
}

// Update current user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => userService.updateCurrentUser(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
      toast.success('Profile updated successfully!');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
}

// Update password
export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: UpdatePasswordRequest) => userService.updatePassword(data),
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to update password');
    },
  });
}

// Hook that combines search term state with debounced query
export function useUserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const query = useQuery({
    queryKey: ['searchUsers', debouncedSearch],
    queryFn: () => userService.searchUsers({ filter: debouncedSearch, size: 10 }),
    enabled: debouncedSearch.length >= 1,
    staleTime: 30000,
  });

  const filteredUsers = useMemo(() => {
    return query.data || [];
  }, [query.data]);

  return {
    searchTerm,
    setSearchTerm,
    users: filteredUsers,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

