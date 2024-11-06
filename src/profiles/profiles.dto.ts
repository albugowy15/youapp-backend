import { Profile } from 'src/schemas/profile.schema';
import { z } from 'zod';

export const updateProfileSchema = z.object({
  about: z
    .object({
      profile_picture: z.string(),
      display_name: z.string(),
      gender: z.enum(['male', 'female']),
      birthday: z.string().date(),
      horoscope: z.string(),
      zodiac: z.string(),
      height_cm: z.number().positive().int(),
      weight_kg: z.number().int().positive(),
    })
    .optional(),
  interests: z.array(z.string()).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
// export class UpdateProfileDto {
//   about: {
//     profile_picture: string;
//     display_name: string;
//     gender: 'male' | 'female';
//     birthday: string;
//     horoscope: string;
//     zodiac: string;
//     height_cm: number;
//     weight_kg: number;
//   };
//   interests: string[];
// }

export type ProfileResponseDto = Promise<{
  about: Omit<Profile, 'interests' | 'user'>;
  interests: Profile['interests'];
} | null>;
