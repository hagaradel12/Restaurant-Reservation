import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongoToExcelAdapter } from 'src/adapter/mongo-to-excel.adapter'; // Import the adapter
import { Booking } from 'src/booking/booking.schema';

@Injectable()
export class ExportService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: mongoose.Model<Booking>,
    private mongoToExcelAdapter: MongoToExcelAdapter,  // Inject MongoToExcelAdapter here
  ) {}

  async exportBookingsToExcel(): Promise<Buffer> {
    const bookings = await this.bookingModel.find().exec();
    const excelBuffer = await this.mongoToExcelAdapter.convertToReport(bookings);
    return excelBuffer;
  }
}
