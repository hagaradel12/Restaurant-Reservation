import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class Booking {
  @Prop({ required: true })
  no_of_people: number;

  @Prop({ required: true })
  Date: Date;

  @Prop({ required: true })
  Time: string;

  @Prop({ required: true })
  username: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);