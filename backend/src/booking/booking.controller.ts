import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException  } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './booking.schema';
import { UpdateBookingDto } from './dto/UpdateBooking.dto';
import { CreateBookingDto } from './dto/CreateBooking.dto';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}
    //Get all bookings                                                               //ADMIN
    @Get()
    async findAll(): Promise<Booking[]> {
      return this.bookingService.findAll();
    }

    // GET /booking/:username: Retrieve bookinga of specifc user                          //ADMIN
  @Get(':username')
  async findByUsername(@Param('username') username: string): Promise<Booking[]> {
    return this.bookingService.findByUsername(username);
  }

  // GET /booking/:username: Retrieve booking of specifc date                          //ADMIN
  @Get(':date')
  async findByDate(@Param('Date')date:Date): Promise<Booking[]> {
    return this.bookingService.findByDate(date);
  }

// POST /booking: Create a new booking
@Post()
async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
  return this.bookingService.create(createBookingDto);
}

 // PUT /booking/:username:Date Update an existing booking by its username &date           //ADMIN
 @Put(':username:Date')
 async update(@Param('username')username: string,  @Param('Date')date:Date, @Body() updateBookingDto: UpdateBookingDto): Promise<Booking> {
   return this.bookingService.update(username,date, updateBookingDto);
 }

// DELETE /booking/:username:Date Delete an existing booking by its username &date          //ADMIN
@Delete(':username:Date')
async delete(@Param('username')username: string,  @Param('Date')date:Date): Promise<Booking> {
  return this.bookingService.delete(username,date);
}

}
