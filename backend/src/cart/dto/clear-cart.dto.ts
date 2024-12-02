import { IsString, IsNotEmpty } from 'class-validator';

export class ClearCartDto {
  @IsString()
  @IsNotEmpty()
  username: string;  // Username to clear the cart for
}
