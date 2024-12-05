import { IsString } from 'class-validator';

export class OrderByIdDto {
  @IsString()
  orderNo: string;
}
