import { IsEnum, IsString, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(['pending', 'shipped', 'delivered', 'canceled'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  Address?: string;
}
