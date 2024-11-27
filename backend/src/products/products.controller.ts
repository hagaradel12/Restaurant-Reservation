
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './products.schema';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';


@Controller('products')
export class ProductsController {
constructor(private productsService: ProductsService){}

@Get('/getAll')
async getAllProducts():Promise<Products[]>{
    return await this.productsService.findAll();
}
// POST: Create a new product
@Post()
async createProduct(@Body() createProductDto: CreateProductDto): Promise<Products> {
  return await this.productsService.createProduct(createProductDto);
}

// DELETE: Delete a product by its productCode
@Delete(':productCode')
async deleteProduct(@Param('productCode') productCode: number): Promise<Products> {
  return this.productsService.deleteProduct(productCode);
}

// PUT: Update an existing product by its productCode
@Put(':productCode')
async updateProduct(
  @Param('productCode') productCode: number,
  @Body() updateProductDto: UpdateProductDto,
): Promise<Products> {
  return this.productsService.update(productCode, updateProductDto);
}

}