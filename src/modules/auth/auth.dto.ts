import { z } from 'zod';

export const loginSchema = z
  .object({
    identifier: z.string(),
    password: z.string(),
  })
  .required();
export type LoginDto = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(6).max(20),
    password: z.string().min(6).max(32),
  })
  .required();

export type RegisterDto = z.infer<typeof registerSchema>;

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
}

export interface RequestWithUserDto {
  user: AuthenticatedUser;
}
