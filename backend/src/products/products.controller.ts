// products.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
  } from '@nestjs/common';
  import { ProductsService } from './products.service';
  import { Products } from './products.schema';
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    // Get all products
    @Get()
    async getAllProducts(): Promise<Products[]> {
      return this.productsService.getAllProducts();
    }
  
    // Get a product by ID
    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<Products> {
      return this.productsService.getProductById(id);
    }
  
    // Create a new product
    @Post()
    async createProduct(@Body() productData: Partial<Products>): Promise<Products> {
      return this.productsService.createProduct(productData);
    }
  
    // Update a product by ID
    @Put(':id')
    async updateProduct(
      @Param('id') id: string,
      @Body() updateData: Partial<Products>,
    ): Promise<Products> {
      return this.productsService.updateProduct(id, updateData);
    }
  
    // Delete a product by ID
    @Delete(':id')
    async deleteProduct(@Param('id') id: string): Promise<void> {
      return this.productsService.deleteProduct(id);
    }
  }
  