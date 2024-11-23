import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
  ) {}

  // Fetch all users
  async getAllUsers(): Promise<Users[]> {
    return this.userModel.find().exec();
  }

  // Fetch a user by ID
  async getUserById(id: string): Promise<Users> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Create a new user
  async createUser(userData: Partial<Users>): Promise<Users> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  // Update a user by ID
  async updateUser(id: string, updateData: Partial<Users>): Promise<Users> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Delete a user by ID
  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
