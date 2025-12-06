import api from './api';
import type { BalanceResponse, TransferRequest, TransactionDto } from '../types';

export const accountService = {
  async getBalance(): Promise<BalanceResponse> {
    const response = await api.get<BalanceResponse>('/account/balance');
    return response.data;
  },

  async transfer(data: TransferRequest): Promise<string> {
    const response = await api.post<string>('/account/transfer', data);
    return response.data;
  },

  async getTransactions(): Promise<TransactionDto[]> {
    const response = await api.get<TransactionDto[]>('/account/transactions');
    return response.data;
  },
};

export default accountService;

