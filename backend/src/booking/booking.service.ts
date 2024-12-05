import { Injectable ,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, bookingDocument } from './booking.schema';
import { UpdateBookingDto } from './dto/UpdateBooking.dto';
import { CreateBookingDto } from './dto/CreateBooking.dto';
@Injectable()
export class BookingService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<bookingDocument> ) {}
  // Get: final all booking (ADMIN)
  // async findAllAdmin(): Promise<Booking[]> {
  //   // const today = new Date();
  //   // today.setHours(0, 0, 0, 0); // Set the time to the start of the day
  // //  return this.bookingModel.find({ Date: { $gte: today } }).exec();
  // }

  async findAllAdmin(): Promise<bookingDocument[]> {
    return this.bookingModel.find().exec();
  }
  
 //GET:booking by username                                                     //ADMIN &client by token?
   async findByUsername(username: string): Promise<Booking[]> {
    const booking = await this.bookingModel.find({ username }).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with username ${username} not found`);
    }
    return booking;
  }

  //GET: booking by date                                            //ADMIN
  async findByDate(date:string): Promise<Booking[]> {
    const booking = await this.bookingModel.find({date}).exec();
    if (!booking) {
      throw new NotFoundException(`Booking at ${date} not found`);
    }
    return booking;
  }

  // GET ALL BOOKING FOR CLIENT GET username from token
// @Roles(Role.Customer)
// @UseGuards(AuthGuard, AuthorizationGuard)
async findClient(username: string): Promise<Booking[]> {
  return this.bookingModel.find({username});
}

   // Create a new booking
   async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const newBooking = new this.bookingModel(createBookingDto);
    return newBooking.save();
  }

    // PUT:Update an existing booking by title & date                                //ADMIN
    async update(username: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
        const updatedBooking = await this.bookingModel.findOneAndUpdate({username, updateBookingDto}, { new: true }).exec();
        if (!updatedBooking) {
          throw new NotFoundException(`Booking with username ${username} not found`);
        }
        return updatedBooking;
      }

       //DELETE: Delete a booking by title & date                                          //ADMIN
  async delete(username: string,date:string): Promise<Booking> {
    const deletedBooking = await this.bookingModel.findOneAndDelete({username,date}).exec();
    if (!deletedBooking) {
      throw new NotFoundException(`Booking with username ${username} at ${date} not found`);
    }
    return deletedBooking;
  }

}

//SOLID principlas:
//Single Responsibility Principle :applied in every api as each api has only one responsibility
//Open-Closed Principle: can add new features/methods without changing in the existing ones can do fin by range date and it won't
//affect existing findByusername method and create &update DTO allow for update done easily without changing create and update logic
//Liskov Substitution Principle: subtypes compatible with base types example:use of BookingDocument which is subtype done 
//for type safety and compatibilty with mongoos model schema 

