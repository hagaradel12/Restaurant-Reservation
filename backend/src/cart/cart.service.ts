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

  // Get the user's cart from username extracted from token, called when user clicks on cart in nav bar in 
  //home page
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

  //fetch a product from the user's cart using the username to find the cart
  //then it checks if the product passed as a parameter exists in the cart
  //if true, returns the product key-value array with product id and quantity to be
  //displayed in the frontend
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
  async getAllCarts(): Promise<CartDocument[]> {
    return this.cartModel.find().exec();
  }

  // Add a product in the user's cart, whether cart exists or not
  //this is called if user clicks on product not in cart or cart doesnt exist
  //if cart exist and product in cart, menu shows +/- buttons that call increment and decrement
  //imperative

  //front end renders menu and displays add to cart button if product not in cart or if cart doesnt exist
  //1st find product using product id
  //then get cart using username from token
  //if cart doesnt exist, create the cart and add the product fetched with quantity 1 along with the username
  //if cart exists, check if product in cart, if not, add to cart also does similar functionality
  //but instead of creating cart it adds the product with quantity 1 to existing cart
  //later on since these products are now in cart, they can be manipulated with +/- buttons
  //or drop down fro, inside cart page.tsx
async addeProductInCart(username: string, productId: string): Promise<CartDocument> {
    const objectId = new mongoose.Types.ObjectId(productId);
    const product = await this.productModel.findById(objectId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    let cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) { //no cart, so create it and add product
      cart = new this.cartModel({
        username,
        products: [{ productId: objectId, quantity: 1 }],
      });
    } else { //cart exist, no product in cart, add it to existing cart 
      const existingProduct = cart.products.find(
        (item) => item.productId.toString() === productId,
      );
      if (!existingProduct) {
        cart.products.push({ productId: objectId, quantity:1 });
      }
    }
    return cart.save();
  }
  
//Update the quantity of a product in the cart
//this is called if product exists in cart and user changes quantity from drop down, tested in frontend
//only available inside cart page
  async updateProductQuantity(
    username: string,
    productId: string,
    quantity: number,
  ): Promise<CartDocument> {
    const objectId = new mongoose.Types.ObjectId(productId); //conversion to object id for use in mongo
  
    //ensure product exists
    const product = await this.productModel.findById(objectId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    //find user's cart by their id to update it
    const cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    //update product quantity to chosen quantity from front end
    const existingProduct = cart.products.find(
      (item) => item.productId.toString() === productId,
    ); //callback function that takes the item and checks if its id is equal to product id passed from front end,
    //and if so, returns true, and for the first true instance which is only one in this case since id is unique
    //in returns the product and the quantity (products array of key-value pairs in cart)
  
    if (!existingProduct) {
      throw new NotFoundException('Product not found in cart');
    }
  
    existingProduct.quantity = quantity; //updates quantity
  
    return cart.save();
  }
  
//increment product by 1 assuming it is already in cart, as the button
//that calls this only shows for products that exist in the user's cart 
//single responsibility principle, only concerned about single unit quantity increment (one funcitonality) 
async incrementProductQuantity(
  username: string,
  productId: string,
): Promise<CartDocument> {
  const objectId = new mongoose.Types.ObjectId(productId);

//find product first by its id 
//to avoid error if product deleted suddenly
  const product = await this.productModel.findById(objectId).exec();
  if (!product) {
    throw new NotFoundException('Product not found');
  }

  //find the user's cart by their username 
  const cart = await this.cartModel.findOne({ username }).exec();
  if (!cart) {
    throw new NotFoundException('Cart not found');
  }

  //increment product quantity, delarative approach in array function
  //this is a reference to the original object
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
async decrementProductQuantity(username: string, productId: string): Promise<CartDocument> {
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





  //clear the user's cart by their username from token sent from front end
  async clearCart(username: string): Promise<void> {
    const cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    //clear all products from the cart
    cart.products = [];
    await cart.save();
  }



  //delete a product from the user's cart by product id and username sent from end when
  //user clicks on a delete button/remove icon
  async deleteProductFromCart(username: string, productId: string): Promise<CartDocument> {
    const objectId = new mongoose.Types.ObjectId(productId);

    const cart = await this.cartModel.findOne({ username }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === objectId.toString(),
    ); //item is whole item with product id and quntity
    //find index searches for the item with product id matching one sent
    //in params and then returns the position of that
    //element in the array, if no match, returns -1
    if (productIndex === -1) { //no match for product found in cart
      throw new NotFoundException('Product not found in cart');
    }

    // Remove the product from the cart starting position productIndex and deleting one element 
    //which is the product itself
    cart.products.splice(productIndex, 1);//imperative as
    //it uses explicit action, push it another example

    return cart.save();
  }
}
