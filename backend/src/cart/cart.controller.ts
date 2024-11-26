import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Get the user's cart
  @Get(':username')
  async getCart(@Param('username') username: string) {
    return this.cartService.getCart(username);
  }

  // Get a specific product in the user's cart
  @Get(':username/product/:productId')
  async getProductInCart(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.getProductInCart(username, productId);
  }

  // Get all carts (for admin purposes)
  @Get()
  async getAllCarts() {
    return this.cartService.getAllCarts();
  }

  // Add a product to the cart
  @Post(':username/add-product')
  async addProductToCart(
    @Param('username') username: string,
    @Body() body: { productId: string; quantity: number },
  ) {
    const { productId, quantity } = body;
    return this.cartService.addeProductInCart(username, productId, quantity);
  }

  // Update a product's quantity in the cart
  @Patch(':username/update-product')
  async updateProductQuantity(
    @Param('username') username: string,
    @Body() body: { productId: string; quantity: number },
  ) {
    const { productId, quantity } = body;
    return this.cartService.updateProductQuantity(username, productId, quantity);
  }

  // Increment a product's quantity in the cart
  @Patch(':username/increment-product/:productId')
  async incrementProductQuantity(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.incrementProductQuantity(username, productId);
  }

  // Decrement a product's quantity in the cart
  @Patch(':username/decrement-product/:productId')
  async decrementProductQuantity(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.decrementProductQuantity(username, productId);
  }

  // Clear the user's cart
  @Delete(':username/clear')
  async clearCart(@Param('username') username: string) {
    return this.cartService.clearCart(username);
  }

  // Clear another user's cart
  @Delete(':username/clear-other')
  async clearOtherCart(@Param('username') username: string) {
    return this.cartService.clearOtherCart(username);
  }

  // Delete a product from the cart
  @Delete(':username/delete-product/:productId')
  async deleteProductFromCart(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.deleteProductFromCart(username, productId);
  }
}
