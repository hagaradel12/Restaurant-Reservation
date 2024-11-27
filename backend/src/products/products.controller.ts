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

}