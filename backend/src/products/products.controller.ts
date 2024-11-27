/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
// eslint-disable-next-line prettier/prettier
import { ProductsService } from './products.service';
import { Products } from './products.schema';


@Controller('products')
export class ProductsController {
constructor(private productsService: ProductsService){}

@Get('/getAll')
async getAllProducts():Promise<Products[]>{
    return await this.productsService.findAll();
}
    @Post()
    async createProduct(@Body() productData: Products){
        return await this.productsService.create(productData);
    }

     // Create a new product
  async createProduct(createProductDto: CreateProductDto): Promise<Products> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

// DELETE: Delete a product by its productCode
@Delete(':productCode')
async deleteProduct(
  @Param('productCode') productCode: number,
): Promise<Products> {
  return await this.productsService.deleteProduct(productCode);
}

// PUT: Update an existing product by its productCode
@Put(':productCode')
async updateProduct(
  @Param('productCode') productCode: number,
  @Body() updateProductDto: UpdateProductDto,
): Promise<Products> {
  return await this.productsService.update(productCode, updateProductDto);
}

}


















}