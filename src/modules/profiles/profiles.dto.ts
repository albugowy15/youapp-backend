import { Profile } from '../../common/schemas/profile.schema';
import { z } from 'zod';

export const updateProfileSchema = z.object({
  about: z
    .object({
      profile_picture: z.string(),
      display_name: z.string().max(200),
      gender: z.enum(['male', 'female']),
      birthday: z.string().date(),
      height_cm: z.number().int().positive(),
      weight_kg: z.number().int().positive(),
    })
    .optional(),
  interests: z.array(z.string()).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

export type ProfileResponseDto = Promise<{
  about: Omit<Profile, 'interests' | 'user'>;
  interests: Profile['interests'];
} | null>;
