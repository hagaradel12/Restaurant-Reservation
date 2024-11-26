// products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Products, ProductsDocument } from './products.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name) private readonly productModel: Model<ProductsDocument>,
  ) {}

  // Get all products
  async getAllProducts(): Promise<Products[]> {
    return this.productModel.find().exec();
  }

  // Get a product by ID
  async getProductById(id: string): Promise<Products> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // Create a new product
  async createProduct(productData: Partial<Products>): Promise<Products> {
    const newProduct = new this.productModel(productData);
    return newProduct.save();
  }

  // Update a product by ID
  async updateProduct(id: string, updateData: Partial<Products>): Promise<Products> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  // Delete a product by ID
  async deleteProduct(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
