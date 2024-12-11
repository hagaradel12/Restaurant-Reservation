import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './products.schema';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';
import mongoose from 'mongoose';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role, Roles } from 'src/auth/decorators/role.decorator';

@Controller('products')  
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {} // DIP - Dependency Injection

  // GET /products/getAll: Retrieve all products                                 //ADMIN
  @Get('/getAll') //for unauthenticated users
  // OCP - Open for extension (adding new guards without modifying logic)
  async getAllProducts(): Promise<Products[]> {
    return await this.productsService.findAll(); // SRP - Single Responsibility (delegating logic to service)
  }

  // POST /products: Create a new product ->                                        //ADMIN
  @Post()
  @UseGuards(AuthGuard, AuthorizationGuard) // OCP - Open for extension (adding new guards without modifying logic)
  @Roles(Role.Admin)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Products> {
    return await this.productsService.createProduct(createProductDto); // SRP - Single Responsibility (delegating logic to service)
  }

  // DELETE /products/:productCode: Delete a product by its productCode           //ADMIN
  @Delete(':name')
  @UseGuards(AuthGuard, AuthorizationGuard) // OCP - Open for extension (adding new guards without modifying logic)
  @Roles(Role.Admin)  async deleteProduct(@Param('name') name: string): Promise<Products> {
    return await this.productsService.deleteProduct(name); // SRP - Single Responsibility (delegating logic to service)
  }

  // PUT /products/:productCode: Update an existing product by its name     //ADMIN
  @Put(':name')
  @UseGuards(AuthGuard, AuthorizationGuard) // OCP - Open for extension (adding new guards without modifying logic)
  @Roles(Role.Admin)
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    return await this.productsService.update(updateProductDto); // SRP - Single Responsibility (delegating logic to service)
  }

  // GET /products/:name: Retrieve a product by its name                           //ANY USER
  @Get(':name')
  async getProductByName(@Param('name') name: string): Promise<Products> {
    const product = await this.productsService.findByName(name); // SRP - Single Responsibility (delegating logic to service)
    if (!product) {
      throw new NotFoundException(`Product with name "${name}" not found`); // SRP - Single Responsibility (handling HTTP exception)
    }
    return product;
  }

  // GET /products/productId/:id: Retrieve a product by its ID                     //ANY USER
  @Get('productId/:id') //called in methods with guards so no need to apply guard twice as
  //it causes error in fetching products
  //@UseGuards(AuthGuard) // OCP - Open for extension (adding new guards without modifying logic)
  //@Roles(Role.Admin, Role.Customer)
  async findById(@Param('id') id: string): Promise<Products> {
    try {
      const product = await this.productsService.findById(new mongoose.Types.ObjectId(id)); // SRP - Single Responsibility (delegating logic to service)
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;  // Propagate the error if it's already a NotFoundException
      } else {
        throw new NotFoundException(`Product with ID ${id} not found`); // SRP - Single Responsibility (handling HTTP exception)
      }
    }
  }
}