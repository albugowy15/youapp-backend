import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Profile {
  @Prop({ required: true })
  profile_picture: string;

  @Prop({ required: true })
  display_name: string;

  @Prop()
  gender: 'male' | 'female';

  @Prop()
  birthday: string;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  height_cm: number;

  @Prop()
  weight_cm: number;

  @Prop([String])
  interests: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export type ProfileDocument = HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);
