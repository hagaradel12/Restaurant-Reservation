import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException,UseGuards   } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './booking.schema';
import { UpdateBookingDto } from './dto/UpdateBooking.dto';
import { CreateBookingDto } from './dto/CreateBooking.dto';
import { AuthGuard } from '@nestjs/passport';
// import { Roles, Role } from 'src/auth/decorators/role.decorator';
// import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';


@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}                                                         

   //Get all bookings as admin but not booking that have passed                     //ADMIN   
                
    @Get()
    // @Roles(Role.Admin)
    // @UseGuards(AuthGuard, AuthorizationGuard)
    async findAllAdmin(): Promise<Booking[]> {
      return this.bookingService.findAllAdmin();
    }

    // GET /booking/:username: Retrieve bookinga of specifc user                          //ADMIN
   
  @Get(':username')
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, AuthorizationGuard)
  async findByUsername(@Param('username') username: string): Promise<Booking[]> {
    return this.bookingService.findByUsername(username);
  }

  // GET /booking/:username: Retrieve booking of specifc date                          //ADMIN
  @Get(':date')
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, AuthorizationGuard)
  async findByDate(@Param('Date')date:Date): Promise<Booking[]> {
    return this.bookingService.findByDate(date);
  }
///////NEED TO DO GET ALL BOOKING FOR CLIENT GET username from token

// POST /booking: Create a new booking

@Post()
// @Roles(Role.Customer)
//   @UseGuards(AuthGuard, AuthorizationGuard)
async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
  return this.bookingService.create(createBookingDto);
}

 // PUT /booking/:username:Date Update an existing booking by its username & date           //ADMIN

 @Put(':username:Date')
//  @Roles(Role.Admin)
//   @UseGuards(AuthGuard, AuthorizationGuard)
 async update(@Param('username')username: string,  @Param('Date')date:Date, @Body() updateBookingDto: UpdateBookingDto): Promise<Booking> {
   return this.bookingService.update(username,date, updateBookingDto);
 }

// DELETE /booking/:username:Date Delete an existing booking by its username & date          //ADMIN
 
@Delete(':username:Date')
// @Roles(Role.Admin)
//   @UseGuards(AuthGuard, AuthorizationGuard)
async delete(@Param('username')username: string,  @Param('Date')date:Date): Promise<Booking> {
  return this.bookingService.delete(username,date);
}

}
