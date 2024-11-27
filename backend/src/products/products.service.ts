import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Products } from './products.schema';
import mongoose from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Products.name)private productModel: mongoose.Model<Products>
    ){}
 //get all products
 async findAll():Promise<Products[]>{
    let products = await this.productModel.find();
    return products;
}
async create(productData:Products):Promise<Products>{
    const newProduct = new this.productModel(productData);
    return await newProduct.save();
}

}
