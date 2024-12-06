import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { Products, ProductsDocument } from 'src/products/products.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(Products.name) private readonly productModel: Model<ProductsDocument>,
  ) {}

  // Get the user's cart from username extracted from token, called when user clicks on go to cart
  //imperative as it matually retrieves cart from carts
  //database then checks if it exist,
  //error handling and if conditions are imperative
  async getCart(username: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  //Retrieve a product from the user's cart
  async getProductInCart(username: string, productId: string): Promise<{ product: any; quantity: number }> {
    const objectId = new mongoose.Types.ObjectId(productId);
  
    // Find user's cart
    const cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    //Find a product in the cart by productId
    //This applies single responsibility principle as it is a helper
    //function dedicated for a single purpose
    //Retieve full populated products from cart, after retrieving cart
    const productInCart = cart.products.find(
      (item) => item.productId.toString() === productId,
    );
  
    if (!productInCart) {
      throw new NotFoundException('Product not found in cart');
    }
  
    // Retrieve product details
    const product = await this.productModel.findById(objectId).exec();
    if (!product) {
      throw new NotFoundException('Product details not found');
    }
  
    return { product, quantity: productInCart.quantity };
  }
  
  // Get all carts (for admin)
  //Open-Closed PRINCIPLE: open for extension
  //but closed for modification
  //This means client cannot directly modify the function
  //but extend it by applying conditions like filtering according
  //to certain attribute, or sorting according to total price for all products in 
  //the cart, for example to notify promising orders of bundles, or to decide
  //on discounts and offers

  //declarativ, no conditions/loops/or defined logic
  //find is build in and does the fetching internally
  async getAllCarts(): Promise<Cart[]> {
    return this.cartModel.find().exec();
  }

  // Add a product in the user's cart, whether cart exists or not
  //this is called if user clicks on product not in cart or cart doesnt exist
  //if cart exist and product in cart, menu shows +/- buttons that call increment
  //and decrement
  //imperative
  async addeProductInCart(username: string, productId: string, quantity: number): Promise<Cart> {
    const objectId = new mongoose.Types.ObjectId(productId);
    const product = await this.productModel.findById(objectId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    let cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      cart = new this.cartModel({
        username,
        products: [{ productId: objectId, quantity }],
      });
    } else {
      const existingProduct = cart.products.find(
        (item) => item.productId.toString() === productId,
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;  // Increment quantity
      } else {
        cart.products.push({ productId: objectId, quantity });
      }
    }
    return cart.save();
  }
  
//Update th equantity of a product in the cart
//this is called if product exists in cart and user changes quantity from drop down
  async updateProductQuantity(
    username: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const objectId = new mongoose.Types.ObjectId(productId);
  
    // Validate product existence
    const product = await this.productModel.findById(objectId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    // Find user's cart
    const cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    // Update product quantity
    const existingProduct = cart.products.find(
      (item) => item.productId.toString() === productId,
    );
  
    if (!existingProduct) {
      throw new NotFoundException('Product not found in cart');
    }
  
    existingProduct.quantity = quantity;
  
    return cart.save();
  }
  
//increment product by 1 assuming it is already in cart 
//single responsibility principle, only concerned about single unit quantity increment
async incrementProductQuantity(
  username: string,
  productId: string,
): Promise<Cart> {
  const objectId = new mongoose.Types.ObjectId(productId);

  // Validate product existence
  const product = await this.productModel.findById(objectId).exec();
  if (!product) {
    throw new NotFoundException('Product not found');
  }

  // Find user's cart
  const cart = await this.cartModel.findOne({ username }).exec();
  if (!cart) {
    throw new NotFoundException('Cart not found');
  }

  // Increment product quantity, delarative approach in array function
  const existingProduct = cart.products.find(
    (item) => item.productId.toString() === productId,
  );

  if (!existingProduct) {
    throw new NotFoundException('Product not found in cart');
  }

  existingProduct.quantity += 1;

  return cart.save();
}

//same for decrement by 1
async decrementProductQuantity(username: string, productId: string): Promise<Cart> {
  const objectId = new mongoose.Types.ObjectId(productId);
  const product = await this.productModel.findById(objectId).exec();
  if (!product) {
    throw new NotFoundException('Product not found');
  }

  const cart = await this.cartModel.findOne({ username }).exec();
  if (!cart) {
    throw new NotFoundException('Cart not found');
  }

  const existingProduct = cart.products.find(
    (item) => item.productId.toString() === productId,
  );

  if (!existingProduct) {
    throw new NotFoundException('Product not found in cart');
  }
//declerative approach
  if (existingProduct.quantity === 1) {
    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId,
    );
  } else {
    existingProduct.quantity -= 1;
  }

  return cart.save();
}





  // Clear the user's cart
  async clearCart(username: string): Promise<void> {
    const cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Clear all products from the cart
    cart.products = [];
    await cart.save();
  }



  // Delete a product from the user's cart
  async deleteProductFromCart(username: string, productId: string): Promise<Cart> {
    const objectId = new mongoose.Types.ObjectId(productId);

    const cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === objectId.toString(),
    );
    if (productIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);//imperative as
    //it uses explicit action, push it another example

    return cart.save();
  }
}
