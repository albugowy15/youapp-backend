import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      email: email,
    });
  }

  async findOneByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      username: username,
    });
  }

  async create(data: User): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }
}
