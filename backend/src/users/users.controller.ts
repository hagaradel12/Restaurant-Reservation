import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
// import { Roles, Role } from 'src/auth/decorators/role.decorator';
// import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { createDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, AuthorizationGuard)
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }
//user or admin can get by their username since it will actually be passed from the token (uses: profile)
  @Get(':username')
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, AuthorizationGuard)
  findOne(@Param('username') username: string): Promise<Users> {
    return this.usersService.findOneByUsername(username);
  }
//(create for admin and user)
  @Post()
//  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: createDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }
//change user data for admin or user
  @Patch(':username')
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, AuthorizationGuard)
  update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto): Promise<Users> {
    return this.usersService.update(username, updateUserDto);
  }

  //delete, for user it will choose username in token, for admin it will display input for admin to delete any user
  @Delete(':username')
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, AuthorizationGuard)
  remove(@Param('username') username: string): Promise<void> {
    return this.usersService.remove(username);
  }
  @Get(':email')
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, AuthorizationGuard)
  findOneEmail(@Param('email') email: string): Promise<Users> {
    return this.usersService.findOneByemail(email);
  }
}
