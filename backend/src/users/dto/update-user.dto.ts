import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean({ message: 'isAdmin must be a boolean value (true or false).' })
  @IsNotEmpty()
  isAdmin: boolean;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber(null)
  phoneNo: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
