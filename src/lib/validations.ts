import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be at most 50 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(3, 'First name must be at least 3 characters').max(50, 'First name must be at most 50 characters'),
  lastName: z.string().min(3, 'Last name must be at least 3 characters').max(50, 'Last name must be at most 50 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be exactly 10 digits'),
});

export const transferSchema = z.object({
  toUsername: z.string().min(3, 'Username must be at least 3 characters'),
  amount: z.number().positive('Amount must be positive').min(1, 'Minimum transfer amount is ₹1'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;

