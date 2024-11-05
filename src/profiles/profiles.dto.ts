import { Profile } from 'src/schemas/profile.schema';

export class UpdateProfileDto {
  about: {
    profile_picture: string;
    display_name: string;
    gender: 'male' | 'female';
    birthday: string;
    horoscope: string;
    zodiac: string;
    height_cm: number;
    weight_kg: number;
  };
  interests: string[];
}

export type ProfileResponseDto = Promise<{
  about: Omit<Profile, 'interests' | 'user'>;
  interests: Profile['interests'];
} | null>;
