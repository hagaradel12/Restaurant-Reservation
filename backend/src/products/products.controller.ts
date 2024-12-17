import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './products.schema';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';
import mongoose from 'mongoose';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('products')  
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {} // DIP - Dependency Injection

  // GET /products/getAll: Retrieve all products     
  @UseGuards(AuthGuard, AuthorizationGuard)                              //ADMIN
  @Public()
  @Get('/getAll')
  // OCP - Open for extension (adding new guards without modifying logic)
  async getAllProducts(): Promise<Products[]> {
    return await this.productsService.findAll(); // SRP - Single Responsibility (delegating logic to service)
  }

  // POST /products: Create a new product                                          //ADMIN
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard) // OCP - Open for extension (adding new guards without modifying logic)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Products> {
    return await this.productsService.createProduct(createProductDto); // SRP - Single Responsibility (delegating logic to service)
  }

  // DELETE /products/:productCode: Delete a product by its productCode           //ADMIN
  @Delete(':name')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard) 
  async deleteProduct(@Param('name') name: string): Promise<Products> {
    return await this.productsService.deleteProduct(name); // SRP - Single Responsibility (delegating logic to service)
  }

  // PUT /products/:productCode: Update an existing product      //ADMIN
  @Patch(':name')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  async updateProduct(
    @Param('name') name: string, // Extract the product name from the route parameter
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    // Ensure the name from the route is included in the DTO
    return await this.productsService.update({ ...updateProductDto, name });
  }
  

  // GET /products/:name: Retrieve a product by its name                           //ANY USER
  @Get(':name')
  @UseGuards(AuthGuard, AuthorizationGuard) 
  async getProductByName(@Param('name') name: string): Promise<Products> {
    const product = await this.productsService.findByName(name); // SRP - Single Responsibility (delegating logic to service)
    if (!product) {
      throw new NotFoundException(`Product with name "${name}" not found`); // SRP - Single Responsibility (handling HTTP exception)
    }
    return product;
  }

   //GET /products/productId/:id: Retrieve a product by its ID                     //ANY USER
   @Get('productId/:id')
    @UseGuards(AuthGuard) 
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
