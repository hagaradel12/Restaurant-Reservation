import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

//for login verification purpose only
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('register')
  async register(@Body() registerDto: RegisterDto){
    try{
      const result = await this.authService.register(registerDto);
      return{
        statusCode:HttpStatus.CREATED,
        message:'User registered successfully',
        data: result 
      };

    }catch(err){
      if(err.status==409){
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message:'User alerady registered'
          },
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred during registration',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
