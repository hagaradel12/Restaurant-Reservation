
import { IsEnum } from 'class-validator';
import { Products } from 'src/products/products.schema';

export class CreateOrderDto {
  products: Products[];
  Address: string;
  @IsEnum(['pending', 'shipped', 'delivered', 'canceled'])
  status: string;
  username: string;
}
