import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart, CartDocument } from './cart.schema';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Get the user's cart
  @Get('/:username')
  async getCart(@Param('username') username: string): Promise<CartDocument> {
    return this.cartService.getCart(username);
  }

  // Get product details in the user's cart
  @Get('/:username/product/:productId')
  async getProductInCart(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ): Promise<{ product: any; quantity: number }> {
    return this.cartService.getProductInCart(username, productId);
  }

  // Get all carts (admin)
  @Get()
  async getAllCarts(): Promise<Cart[]> {
    return this.cartService.getAllCarts();
  }

  // Add a product to the user's cart
  @Post('/:username/product')
  async addProductToCart(
    @Param('username') username: string,
    @Body() body: { productId: string; quantity: number },
  ): Promise<Cart> {
    const { productId, quantity } = body;
    return this.cartService.addeProductInCart(username, productId, quantity);
  }

  // Update the quantity of a product in the user's cart
  @Patch('/:username/product/:productId')
  async updateProductQuantity(
    @Param('username') username: string,
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ): Promise<Cart> {
    const { quantity } = body;
    return this.cartService.updateProductQuantity(username, productId, quantity);
  }

  // Increment product quantity
  @Patch('/:username/product/:productId/increment')
  async incrementProductQuantity(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ): Promise<Cart> {
    return this.cartService.incrementProductQuantity(username, productId);
  }

  // Decrement product quantity
  @Patch('/:username/product/:productId/decrement')
  async decrementProductQuantity(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ): Promise<Cart> {
    return this.cartService.decrementProductQuantity(username, productId);
  }

  // Clear the user's cart
  @Delete('/:username')
  async clearCart(@Param('username') username: string): Promise<void> {
    return this.cartService.clearCart(username);
  }

  // Clear another user's cart (admin)
  @Delete('/admin/:username')
  async clearOtherCart(@Param('username') username: string): Promise<void> {
    return this.cartService.clearOtherCart(username);
  }

  // Delete a product from the user's cart
  @Delete('/:username/product/:productId')
  async deleteProductFromCart(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ): Promise<Cart> {
    return this.cartService.deleteProductFromCart(username, productId);
  }
}
