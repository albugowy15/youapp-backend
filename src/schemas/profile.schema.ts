import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

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
  weight_kg: number;

  @Prop([String])
  interests: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;
}

export type ProfileDocument = HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);
