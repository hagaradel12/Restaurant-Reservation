import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from './users.schema';
import * as bcrypt from 'bcrypt';
import { createDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async findAll(): Promise<Users[]> {
    return this.userModel.find().exec();
  }

  async findOneByUsername(username: string): Promise<Users | null> {
    return this.userModel.findOne({ username: new RegExp(`^${username}$`, 'i') }).lean().exec(); // Using lean to return a plain object
  }

  async create(createUserDto: createDto): Promise<Users> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      ...createUserDto,
      passwordHashed: hashedPassword,  // Ensure correct field is set
    });
    return user.save();
  }

  async update(username: string, updateUserDto: Partial<Users>): Promise<Users> {
    return this.userModel.findOneAndUpdate({ username }, updateUserDto, { new: true }).exec();
  }

  async remove(username: string): Promise<void> {
    await this.userModel.deleteOne({ username }).exec();
  }
   //for regiseration check
   async findOneByemail(email: string): Promise<Users | null> {
    return this.userModel.findOne({ email }).lean().exec(); 
  }
}
