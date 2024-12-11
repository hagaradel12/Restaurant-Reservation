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
  
  //GET: admin find username's booking
  async findByUsername(username: string): Promise<Booking[]> {
    // Use a case-insensitive regular expression for partial matches
    const booking = await this.bookingModel.find({ username: { $regex: username, $options: 'i' },}).exec();
  
    if (!booking || booking.length === 0) {
      throw new NotFoundException(`No bookings found for username matching '${username}'`);
    }
  
    return booking;
  }
  //GET: booking by id                                            //ADMIN
  async findById(bookingId:number): Promise<Booking> {
    const booking = await this.bookingModel.findOne({bookingId}).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }
    return booking;
  }

  // GET ALL BOOKING FOR CLIENT GET username from token
async findClient(username: string): Promise<Booking[]> {
  return this.bookingModel.find({username});
}

//Method to randmoly generate id     //example of imperative programming as we focused on th how and how
private generatedIds: Set<number> = new Set();
private async randomizedId(): Promise<number> {
    if (this.generatedIds.size >= 100) {
        throw new Error("All possible IDs have been generated.");
    }
    let id: number;

    do {
        id = Math.floor(Math.random() * 100) + 1; 
    } while (this.generatedIds.has(id)); // Ensure it's unique

    this.generatedIds.add(id);
    return id;
}
   // Create a new booking
   async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const newBooking = new this.bookingModel(createBookingDto);
  // Generate a random bookingId
  newBooking.bookingId = await this.randomizedId();

  return newBooking.save();
  }

// PUT:Update an existing booking by time & date                                //ADMIN
async update(bookingId: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
  const updatedBooking = await this.bookingModel.findOneAndUpdate({ bookingId }, updateBookingDto, { new: true } ).exec();

  console.log("Updated Booking:", updatedBooking);

  if (!updatedBooking) {
    throw new NotFoundException(`Booking with id ${bookingId} not found`);
  }

  return updatedBooking;
}

//DELETE: Delete a booking by title & date                                          //ADMIN
  async delete(bookingId:number): Promise<Booking> {
    const deletedBooking = await this.bookingModel.findOneAndDelete({bookingId}).exec();
    if (!deletedBooking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
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
