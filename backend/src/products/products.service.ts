/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Products } from './entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
  ) {}

  //get all products
 async findAll():Promise<Products[]>{
    let products = await this.productModel.find();
    return products;
}

//create
    async createProduct(createProductDto: CreateProductDto): Promise<Products> {
        const newProduct = new this.productModel(createProductDto);
        return newProduct.save();
      }
            //delete
      async deleteProduct(productCode: number): Promise<Products> {
        const deletedProduct = await this.productModel.findByIdAndDelete(productCode).exec();
        if (!deletedProduct) {
          throw new NotFoundException(Product with code ${productCode} not found);
        }
        return deletedProduct;
      }

      //update
    
      async update(productCode: number, updateProductDto: UpdateProductDto): Promise<Products> {
        const updatedProduct = await this.productModel
          .findByIdAndUpdate(productCode, updateProductDto, { new: true })
          .exec();
        if (!updatedProduct) {
          throw new NotFoundException(Product with code ${productCode} not found);
        }
        return updatedProduct;
      }
}



