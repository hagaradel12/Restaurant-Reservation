import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Users {
  @Prop({required:true, unique:true})
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isAdmin: boolean;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phoneNo: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);