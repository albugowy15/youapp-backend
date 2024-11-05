export class UpdateDto {
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
