import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('invalid email'),
  password: z.string().min(6, 'Password should be at least 6 characters'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
