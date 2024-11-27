import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Products } from './products.schema';
import mongoose from 'mongoose';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Products.name) private productModel: mongoose.Model<Products>
    ) {}

    // Get all products
    async findAll(): Promise<Products[]> {
        let products = await this.productModel.find();
        return products;
    }

    // Create a new product
    async createProduct(createProductDto: CreateProductDto): Promise<Products> {
        const newProduct = new this.productModel(createProductDto);
        return newProduct.save();
    }

    // Delete a product
    async deleteProduct(productCode: number): Promise<Products> {
        const deletedProduct = await this.productModel.findByIdAndDelete(productCode).exec();
        if (!deletedProduct) {
            throw new NotFoundException("Product with code ${productCode} not found");
        }
        return deletedProduct;
    }

    // Update a product
    async update(productCode: number, updateProductDto: UpdateProductDto): Promise<Products> {
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(productCode, updateProductDto, { new: true })
            .exec();
        if (!updatedProduct) {
            throw new NotFoundException("Product with code ${productCode} not found");
        }
        return updatedProduct;
    }
}
