import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Products, ProductsDocument } from './products.schema';
import mongoose from 'mongoose';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';

@Injectable()
export class ProductsService {  
    constructor(                                   
        @InjectModel(Products.name) private productModel: mongoose.Model<ProductsDocument>
    ) {} // DIP - Dependency Injection (injecting the model for products)

    // Get all products
    async findAll(): Promise<Products[]> {
        let products = await this.productModel.find();
        return products; // SRP - Single Responsibility (delegating logic to the model)
    }

    // Create a new product
    async createProduct(createProductDto: CreateProductDto): Promise<Products> {
        const newProduct = new this.productModel(createProductDto);
        return newProduct.save(); // SRP - Single Responsibility (delegating logic to the model)
    }

    // Delete a product
    async deleteProduct(name: string): Promise<Products> {
        const deletedProduct = await this.productModel.findOneAndDelete({ name }).exec();
        if (!deletedProduct) {
            throw new NotFoundException(`Product with name "${name}" not found`);
        }
        return deletedProduct;
    }

// Update a product
async update(updateProductDto: UpdateProductDto): Promise<Products> {
    const { name, ...updateFields } = updateProductDto;

    // Ensure 'name' is provided to locate the product
    if (!name) {
        throw new NotFoundException('Product name is required for update');
    }

    // Find and update the product
    const updatedProduct = await this.productModel
        .findOneAndUpdate({ name }, updateFields, { new: true })
        .exec();

    // Throw an exception if the product was not found
    if (!updatedProduct) {
        throw new NotFoundException(`Product with name "${name}" not found`);
    }

    return updatedProduct;
}


    // Get a product by name
    async findByName(name: string): Promise<Products> {
        const product = await this.productModel.findOne({ name }).exec();
        if (!product) {
            throw new NotFoundException("product with the name ${name} not found"); // SRP - Single Responsibility (handling exceptions)
        }
        return product; // SRP - Single Responsibility (delegating logic to the model)
    }

   // Get a product by ID 
    async findById(id: mongoose.Types.ObjectId): Promise<Products> {
        const product = await this.productModel.findOne({ _id:id }).exec();
        if (!product) {
            throw new NotFoundException("product with the id ${id} not found"); // SRP - Single Responsibility (handling exceptions)
        }
        return product; // SRP - Single Responsibility (delegating logic to the model)
    }
}