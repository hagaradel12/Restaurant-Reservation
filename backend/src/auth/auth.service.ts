import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

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
}
