import { Injectable } from '@nestjs/common';
import { ProfilesRepository } from './profiles.repository';
import { ProfileResponseDto, UpdateProfileDto } from './profiles.dto';

@Injectable()
export class ProfilesService {
  constructor(private profilesRepository: ProfilesRepository) {}

  async find(userID: string): ProfileResponseDto {
    const profile = await this.profilesRepository.findByUserID(userID);
    if (!profile) return null;
    return {
      about: {
        profile_picture: profile.profile_picture,
        display_name: profile.display_name,
        gender: profile.gender,
        birthday: profile.birthday,
        horoscope: profile.horoscope,
        zodiac: profile.zodiac,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
      },
      interests: profile.interests,
    };
  }

  async update(userID: string, updateDto: UpdateProfileDto): Promise<void> {
    const currentProfile = await this.profilesRepository.findByUserID(userID);
    if (!currentProfile) {
      await this.profilesRepository.create({
        user: userID,
        interests: updateDto.interests,
        display_name: updateDto.about.display_name,
        profile_picture: updateDto.about.profile_picture,
        birthday: updateDto.about.birthday,
        zodiac: updateDto.about.zodiac,
        horoscope: updateDto.about.horoscope,
        gender: updateDto.about.gender,
        height_cm: updateDto.about.height_cm,
        weight_kg: updateDto.about.weight_kg,
      });
      return;
    }

    await this.profilesRepository.update(userID, {
      interests: updateDto.interests,
      display_name: updateDto.about.display_name,
      profile_picture: updateDto.about.profile_picture,
      birthday: updateDto.about.birthday,
      zodiac: updateDto.about.zodiac,
      horoscope: updateDto.about.horoscope,
      gender: updateDto.about.gender,
      height_cm: updateDto.about.height_cm,
      weight_kg: updateDto.about.weight_kg,
    });
  }
}
