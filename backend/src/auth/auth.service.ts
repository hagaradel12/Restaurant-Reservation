import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validate user login based on username and password
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;  // No need to use toObject() when using lean()
      return result;
    }
    return null;
  }

  // Generate JWT token with username and isAdmin
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByUsername(loginDto.username);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    const payload = { username: user.username, isAdmin: user.isAdmin };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(user:RegisterDto):Promise<string>{
    const existingUser = await this.usersService.findOneByemail(user.email);
    if(existingUser){
      throw new ConflictException('email already exists');
    }
    const hashedPassword =await bcrypt.hash(user.password,10);
    const newUser: RegisterDto ={...user,
    email: user.email,
    password:hashedPassword,
    username:user.username,
    name:user.name,
    phoneNo: user.phoneNo,
    isAdmin: user.isAdmin
  };
    await this.usersService.create(newUser);
    return 'registerd successfully';
}
}
