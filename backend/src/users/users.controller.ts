import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto, UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admin can view all users
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }
//user or admin can get by their username since it will actually be passed from the token (uses: profile)
  @Get(':username')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('username') username: string): Promise<Users> {
    return this.usersService.findOneByUsername(username);
  }
//(create for admin and user)
  @Post()
//  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: any): Promise<Users> {
    return this.usersService.create(createUserDto);
  }
//change user data for admin or user
  @Patch(':username')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto): Promise<Users> {
    return this.usersService.update(username, updateUserDto);
  }

  //delete, for user it will choose username in token, for admin it will display input for admin to delete any user
  @Delete(':username')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('username') username: string): Promise<void> {
    return this.usersService.remove(username);
  }
  @Get(':email')
  @UseGuards(JwtAuthGuard)
  findOneEmail(@Param('email') email: string): Promise<Users> {
    return this.usersService.findOneByemail(email);
  }
}
