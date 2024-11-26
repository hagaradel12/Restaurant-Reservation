import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import {BookingSchema} from './booking.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }])
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService]
})
export class BookingModule {}
