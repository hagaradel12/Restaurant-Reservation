import { Type } from 'class-transformer';
import { IsString, IsArray, IsMongoId, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

// Define a Product DTO to validate each product item in the cart
class ProductDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;  // Product ID to update

  @IsNumber()
  @Min(1)
  quantity: number;  // Updated quantity of the product
}

export class UpdateCartDto {
  @IsString()
  @IsOptional()
  username?: string;  // Optional field for updating the username

  @IsArray()
  @IsOptional()
  @Type(() => ProductDto)  // Ensure that each product in the array is validated as a ProductDto
  products?: ProductDto[];  // Optional array of products to be updated
}
