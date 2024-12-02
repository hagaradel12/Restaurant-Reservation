import { IsString, IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteProductFromCartDto {
  @IsString()
  @IsNotEmpty()
  username: string;  // Username to identify the cart

  @IsMongoId()
  @IsNotEmpty()
  productId: string;  // Product ID to delete from the cart
}
