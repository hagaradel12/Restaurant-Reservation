import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongoToExcelAdapter } from 'src/adapter/mongo-to-excel.adapter'; // Import the adapter
import { Booking } from 'src/booking/booking.schema';

@Injectable()
export class ExportService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: mongoose.Model<Booking>, //inject booking model
    private mongoToExcelAdapter: MongoToExcelAdapter,  // Inject MongoToExcelAdapter here
  ) {} 

  //this promises to return buffer which is the type returned by the mongo to excel adapter
  async exportBookingsToExcel(): Promise<Buffer> {
    const bookings = await this.bookingModel.find().exec(); //gets all bookings -> Booking[]
    const excelBuffer = await this.mongoToExcelAdapter.convertToReport(bookings); //call the method
    return excelBuffer;
  }
}
