export class UpdateDto {
  about: {
    profile_picture: string;
    display_name: string;
    gender: string;
    birthday: string;
    horoscope: string;
    zodiac: string;
    height_cm: number;
    weight_kg: number;
  };
  interests: string[];
}
