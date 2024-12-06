import { IsNotEmpty, IsString, IsArray, IsNumber, Min } from 'class-validator';  // You may want to add validation decorators
import { Types } from 'mongoose';  // Import mongoose Types to use ObjectId

export class CreateOrderDto {
  orderNo: number = Math.floor(Math.random() * 1000000);  // Generates a random number between 0 and 999999
  
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  status: string = "pending";  // Default to "pending"

  @IsString()
  @IsNotEmpty()
  address: string;

  // Items should match the schema structure (Array of objects with productId and quantity)
  @IsArray()
  @IsNotEmpty()
  items: { productId: Types.ObjectId; quantity: number }[];

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
