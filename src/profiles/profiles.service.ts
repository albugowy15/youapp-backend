import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from 'src/schemas/profile.schema';
import { UpdateDto } from './dto/updateDto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async find(id: string, userID: string): Promise<Profile> {
    try {
      return this.profileModel.findOne({
        _id: id,
        user: userID,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async update(
    id: string,
    userID: string,
    updateDto: UpdateDto,
  ): Promise<void> {
    try {
      await this.profileModel.findOneAndUpdate(
        { _id: id, user: userID },
        {
          profile_picture: updateDto.about.profile_picture,
          display_name: updateDto.about.display_name,
          gender: updateDto.about.gender,
          birthday: updateDto.about.birthday,
          horoscope: updateDto.about.horoscope,
          zodiac: updateDto.about.zodiac,
          height_cm: updateDto.about.height_cm,
          weight_kg: updateDto.about.weight_kg,
          interests: updateDto.interests,
        },
      );
    } catch (error) {
      console.error(error);
    }
  }
}
