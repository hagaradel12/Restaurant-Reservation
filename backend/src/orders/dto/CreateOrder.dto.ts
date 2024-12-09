import { IsNotEmpty, IsString, IsArray, IsNumber, Min, IsEnum } from 'class-validator';  // You may want to add validation decorators
import { Types } from 'mongoose';  // Import mongoose Types to use ObjectId

export class CreateOrderDto {
  
  
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEnum(['pending', 'shipped', 'delivered', 'canceled'])
  status: string; // Default to "pending"

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
