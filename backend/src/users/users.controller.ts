import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Get all users
  @Get()
  async getAllUsers(): Promise<Users[]> {
    return this.userService.getAllUsers();
  }

  // Get a user by ID
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Users> {
    return this.userService.getUserById(id);
  }

  // Create a new user
  @Post()
  async createUser(@Body() userData: Partial<Users>): Promise<Users> {
    return this.userService.createUser(userData);
  }

  // Update a user by ID
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: Partial<Users>,
  ): Promise<Users> {
    return this.userService.updateUser(id, updateData);
  }

  // Delete a user by ID
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
