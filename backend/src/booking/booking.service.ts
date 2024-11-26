import { Injectable ,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './booking.schema';
import { UpdateBookingDto } from './dto/UpdateBooking.dto';

@Injectable()
export class BookingService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<Booking> ) {}
 //Get: final all booking                                                      //ADMIN
        async findAll(): Promise<Booking[]> {
            return this.bookingModel.find().exec();
          }
 //GET:booking by username                                                     //ADMIN
   async findByUsername(username: string): Promise<Booking[]> {
    const booking = await this.bookingModel.find({ username }).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with username ${username} not found`);
    }
    return booking;
  }

  //GET: one booking by username and date                                            //ADMIN
  async findByUsernameAndDate(username: string,date:Date): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ username,date }).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with username ${username} at ${date} not found`);
    }
    return booking;
  }

    // PUT:Update an existing booking by title & date                                //ADMIN
    async update(username: string,date:Date, updateBookingDto: UpdateBookingDto): Promise<Booking> {
        const updatedBooking = await this.bookingModel.findOneAndUpdate({username,date, updateBookingDto}, { new: true }).exec();
        if (!updatedBooking) {
          throw new NotFoundException(`Booking with username ${username} at ${date} not found`);
        }
        return updatedBooking;
      }

       //DELETE: Delete a booking by title & date                                          //ADMIN
  async delete(username: string,date:Date): Promise<Booking> {
    const deletedBooking = await this.bookingModel.findOneAndDelete({username,date}).exec();
    if (!deletedBooking) {
      throw new NotFoundException(`Booking with username ${username} at ${date} not found`);
    }
    return deletedBooking;
  }

}
