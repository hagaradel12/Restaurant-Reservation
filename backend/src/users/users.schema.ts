import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ required: true })
  Name: string;

  @Prop({ required: true })
  isAdmin: boolean;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  PhoneNo: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);