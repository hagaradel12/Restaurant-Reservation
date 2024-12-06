import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Booking {
  @Prop({ required: true })
  bookingId:number;
  
  @Prop({ required: true })
  no_of_people: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  username: string;
}
// The HydratedDocument type is now explicitly used here.
export type bookingDocument = HydratedDocument<Booking> ;

export const BookingSchema = SchemaFactory.createForClass(Booking);