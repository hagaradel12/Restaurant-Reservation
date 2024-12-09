import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException,UseGuards,Req   } from '@nestjs/common';
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
   @UseGuards(AuthGuard, AuthorizationGuard)
   @Roles(Role.Admin)
   @Get('admin/username/:username')
  async findByUsername(@Param('username') username: string): Promise<Booking[]> {
    return this.bookingService.findByUsername(username);
  }

  // GET /booking/:username: Retrieve booking of specifc date                          //ADMIN
  @UseGuards(AuthGuard, AuthorizationGuard)
   @Roles(Role.Admin)
   @Get('admin/id/:bookingId')
  async findById(@Param('bookingId')bookingId:number): Promise<Booking> {
    return this.bookingService.findById(bookingId);
  }

// GET ALL BOOKING FOR CLIENT GET username from token
@UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.Customer)
 @Get('client/:username')
async findClient(@Param('username') username: string): Promise<Booking[]> {
  return this.bookingService.findClient(username);
}


// POST /booking: Create a new booking
@UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.Customer)
 @Post('createBooking')
async create(@Req() {user},@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
  return this.bookingService.create(createBookingDto,user);
}

 // PUT /booking/:username:Date Update an existing booking by its username & date 
 //booking id is unique but prevent user from having multiple bookings with same data and time
           //ADMIN
 @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin)
  @Put('update/:bookingId')
 async update(@Param('bookingId') bookingId: number, @Body() updateBookingDto: UpdateBookingDto): Promise<Booking> {
   return this.bookingService.update(bookingId, updateBookingDto);
 }

// DELETE /booking/:username:Date Delete an existing booking by its username & date          //ADMIN
@UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.Admin)
@Delete('delete/:bookingId')
async delete(@Param('bookingId')bookingId:number): Promise<Booking> {
  console.log("in the Controller");
  return this.bookingService.delete(bookingId);
}
}