import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking, BookingSchema } from './booking.schema';
import { ExportService } from 'src/export/export.service';
import { ExportController } from 'src/export/export.controller';
import { AdapterModule } from 'src/adapter/adapter.module'; // Import AdapterModule here

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    AdapterModule,  // Import AdapterModule to use MongoToExcelAdapter
  ],
  controllers: [BookingController, ExportController],
  providers: [BookingService, ExportService],
})
export class BookingModule {}
