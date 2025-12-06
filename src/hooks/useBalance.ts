import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import accountService from '../services/accountService';
import type { TransferRequest } from '../types';
import type { AxiosError } from 'axios';

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => accountService.getBalance(),
    staleTime: 30000, // 30 seconds
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferRequest) => accountService.transfer(data),
    onSuccess: () => {
      // Invalidate balance and transactions queries
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transfer successful!');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Transfer failed');
    },
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => accountService.getTransactions(),
    staleTime: 30000,
  });
}

