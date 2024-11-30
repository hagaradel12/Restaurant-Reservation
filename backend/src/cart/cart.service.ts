import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart } from './cart.schema';
import { Products} from 'src/products/products.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
  ) {}

  // Get the user's cart from username extracted from token, called when user clicks on go to cart
  async getCart(username: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  //this is to retrive the product if it exists in the cart to display it to the user
  async getProductInCart(username: string, productId: string): Promise<{ product: any; quantity: number }> {
    const objectId = new mongoose.Types.ObjectId(productId);
  
    // Find user's cart
    const cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    // Check if product exists in the cart
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
  async getAllCarts(): Promise<Cart[]> {
    return this.cartModel.find().exec();
  }

  // Add a product in the user's cart, whether cart exists or not
  //this is called if user clicks on product not in cart or cart doesnt exist
  async addeProductInCart(username: string, productId: string, quantity: number): Promise<Cart> {
    const objectId = new mongoose.Types.ObjectId(productId); //productId fetched and sent from front end

    // Check if the product exists
    const product = await this.productModel.findById(objectId).exec();
    if (!product) { 
      throw new NotFoundException('Product not found');
    }


    //find user's cart from extracted username
    let cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new this.cartModel({
        username,
        products: [{ productId: objectId, quantity }], //create a cart with username and single product with quantity input from front end
        //drop down with quantities up to a reasonable no*
      });
    } else {  //cart exists so add this produt assuming it doesn't exist since this method will only be called for this case
      // if (existingProduct) {
      //   // Update the quantity (increase/decrease)
      //   existingProduct.quantity= quantity;
      //   //there is also +/- buttons to +/- quantity with checks to ensure quantity>0, these will be called
      //   //if user in front end click on those buttons so it will be separate 
      //   if (existingProduct.quantity <= 0) {
      //     // Remove the product if quantity is 0 or less
      //     cart.products = cart.products.filter(
      //       (item) => item.productId.toString() !== productId,
      //     );
      //   }
      // } else {
        // Add the new product to the cart
        cart.products.push({ productId: objectId, quantity });
      }
  return cart.save();
  }

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

  // Increment product quantity
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
async decrementProductQuantity(
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

  // Decrement product quantity
  const existingProduct = cart.products.find(
    (item) => item.productId.toString() === productId,
  );

  if (!existingProduct) {
    throw new NotFoundException('Product not found in cart');
  }

  if (existingProduct.quantity > 1) {
    existingProduct.quantity -= 1;
  } else {
    throw new BadRequestException('Quantity cannot be less than 1');
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

  // Clear another user's cart (Admin only)
  async clearOtherCart(username: string): Promise<void> {
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
    cart.products.splice(productIndex, 1);

    return cart.save();
  }
}
