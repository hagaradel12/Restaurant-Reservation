import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(['pending', 'shipped', 'delivered', 'canceled'], { message: 'Invalid status' })
  @IsNotEmpty({ message: 'Status is required' })
  status: string;
}
