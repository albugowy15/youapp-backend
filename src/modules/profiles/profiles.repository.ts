import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { Profile, ProfileDocument } from '../../common/schemas/profile.schema';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async findByUserID(userID: string): Promise<ProfileDocument | null> {
    return await this.profileModel.findOne({
      user: userID,
    });
  }

  async create(data: Profile): Promise<ProfileDocument> {
    const createdProfile = await this.profileModel.create(data);
    return await createdProfile.save();
  }

  async update(
    userID: string,
    data: UpdateQuery<Profile>,
  ): Promise<ProfileDocument | null> {
    return await this.profileModel.findOneAndUpdate({ user: userID }, data);
  }
}
