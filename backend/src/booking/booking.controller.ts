import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException,UseGuards   } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './booking.schema';
import { UpdateBookingDto } from './dto/UpdateBooking.dto';
import { CreateBookingDto } from './dto/CreateBooking.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles, Role } from 'src/auth/decorators/role.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';



@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}                                                         

   //Get all bookings as admin but not booking that have passed                     //ADMIN   
                
    @Get()
     @UseGuards(AuthGuard, AuthorizationGuard)
     @Roles(Role.Admin)  
    async findAllAdmin(): Promise<Booking[]> {
      return this.bookingService.findAllAdmin();
    }

    // GET /booking/:username: Retrieve bookinga of specifc user                          //ADMIN
  @Get('admin/:username')
   @Roles(Role.Admin)
   @UseGuards(AuthGuard, AuthorizationGuard)
  async findByUsername(@Param('username') username: string): Promise<Booking[]> {
    return this.bookingService.findByUsername(username);
  }

  // GET /booking/:username: Retrieve booking of specifc date                          //ADMIN
  @Get('/:bookingId')
   @Roles(Role.Admin)
   @UseGuards(AuthGuard, AuthorizationGuard)
  async findById(@Param('bookingId')bookingId:number): Promise<Booking[]> {
    return this.bookingService.findById(bookingId);
  }

// GET ALL BOOKING FOR CLIENT GET username from token
@Get('client/:username')
 @Roles(Role.Customer)
 @UseGuards(AuthGuard, AuthorizationGuard)
async findClient(@Param('username') username: string): Promise<Booking[]> {
  return this.bookingService.findClient(username);
}


// POST /booking: Create a new booking
@Post()
 @Roles(Role.Customer)
   @UseGuards(AuthGuard, AuthorizationGuard)
async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
  return this.bookingService.create(createBookingDto);
}

 // PUT /booking/:username:Date Update an existing booking by its username & date 
 //booking id is unique but prevent user from having multiple bookings with same data and time
           //ADMIN
 @Put('/:bookingId')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
 async update(@Param('bookingId') bookingId: number, @Body() updateBookingDto: UpdateBookingDto): Promise<Booking> {
   return this.bookingService.update(bookingId, updateBookingDto);
 }

// DELETE /booking/:username:Date Delete an existing booking by its username & date          //ADMIN
 
@Delete('/:bookingId')
 @Roles(Role.Admin)
   @UseGuards(AuthGuard, AuthorizationGuard)
async delete(@Param('bookingId')bookingId:number): Promise<Booking> {
  return this.bookingService.delete(bookingId);
}
}