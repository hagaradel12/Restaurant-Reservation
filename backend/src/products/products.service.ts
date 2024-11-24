import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { Products } from './products.schema';
import { InjectModel} from '@nestjs/mongoose';
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
}
