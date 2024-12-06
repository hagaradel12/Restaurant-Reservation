import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './products.schema';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';
import mongoose from 'mongoose';
import { AuthGuard } from 'src/auth/guards/authentication.guard'; 

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/getAll')
  async getAllProducts(): Promise<Products[]> {
    return await this.productsService.findAll();
  }

  // POST: Create a new product
  @Post()
  @UseGuards(AuthGuard)  // Applying the auth guard to protect this route
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Products> {
    return await this.productsService.createProduct(createProductDto);
  }

  // DELETE: Delete a product by its productCode
  @Delete(':productCode')
  @UseGuards(AuthGuard)  // Guard applied to restrict access
  async deleteProduct(@Param('productCode') productCode: number): Promise<Products> {
    return await this.productsService.deleteProduct(productCode);
  }

  // PUT: Update an existing product by its productCode
  @Put(':productCode')
  @UseGuards(AuthGuard)  // Guard applied to restrict access
  async updateProduct(
    @Param('productCode') productCode: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    return await this.productsService.update(productCode, updateProductDto);
  }

  // GET: get a product by its name
  @Get(':name')
  async getProductByName(@Param('name') name: string): Promise<Products> {
    const product = await this.productsService.findByName(name);
    if (!product) {
      throw new NotFoundException(`Product with name "${name}" not found`);
    }
    return product;
  }

  // GET: get a product by its ID
  @Get('productId/:id')
  async findById(@Param('id') id: string): Promise<Products> {
    try {
      const product = await this.productsService.findById(new mongoose.Types.ObjectId(id));
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;  // Propagate the error if it's already a NotFoundException
      } else {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
    }
  }
}
