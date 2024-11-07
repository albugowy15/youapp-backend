import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Profile {
  @Prop({ required: false })
  profile_picture?: string;

  @Prop({ required: false })
  display_name?: string;

  @Prop({ required: false })
  gender?: 'male' | 'female';

  @Prop({ required: false })
  birthday?: string;

  @Prop({ required: false })
  horoscope?: string;

  @Prop({ required: false })
  zodiac?: string;

  @Prop({ required: false })
  height_cm?: number;

  @Prop({ required: false })
  weight_kg?: number;

  @Prop([String])
  interests?: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user!: string;
}

export type ProfileDocument = HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);
