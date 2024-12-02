import { Type } from 'class-transformer';
import { IsString, IsArray, IsMongoId, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

class ProductDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;  // Product ID in MongoDB format (ObjectId)

  @IsNumber()
  @Min(1)
  quantity: number;  // Quantity of the product, must be 1 or more
}

export class CreateCartDto {
  @IsString()
  @IsNotEmpty()
  username: string;  // Username for the cart (must be a valid string)

  @IsArray()
  @IsNotEmpty()
  @Type(() => ProductDto)  // Use @Type to ensure correct type conversion
  products: ProductDto[];  // Array of products in the cart
}
