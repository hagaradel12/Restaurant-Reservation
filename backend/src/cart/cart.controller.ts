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
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role, Roles } from 'src/auth/decorators/role.decorator';

@Controller('cart')

@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}


  // Get the user's cart, both roles
  @Get('/:username')
  async getCart(@Param('username') username: string): Promise<CartDocument> {
    return this.cartService.getCart(username);
  }


  // Get product details in the user's cart, both roles
  @Get('/:username/product/:productId')
  async getProductInCart(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ): Promise<{ product: any; quantity: number }> {
    return this.cartService.getProductInCart(username, productId);
  }

  @UseGuards(AuthorizationGuard)
@Roles(Role.Admin)
  // Get all carts (admin)
  @Get()
  async getAllCarts(): Promise<Cart[]> {
    return this.cartService.getAllCarts();
  }

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Customer)
  // Add a product to the user's cart, only the user
  @Post('/:username/product')
  async addProductToCart(
    @Param('username') username: string,
    @Body() body: { productId: string; quantity: number },
  ): Promise<Cart> {
    const { productId, quantity } = body;
    return this.cartService.addeProductInCart(username, productId);
  }

  @UseGuards(AuthorizationGuard)
@Roles(Role.Customer)
  // Update the quantity of a product in the user's cart, only user
  @Patch('/:username/product/:productId')
  async updateProductQuantity(
    @Param('username') username: string,
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ): Promise<Cart> {
    const { quantity } = body;
    return this.cartService.updateProductQuantity(username, productId, quantity);
  }

  @UseGuards(AuthorizationGuard)
@Roles(Role.Customer)
  // Increment product quantity (user)
  @Patch('/:username/product/:productId/increment')
  async incrementProductQuantity(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ): Promise<Cart> {
    return this.cartService.incrementProductQuantity(username, productId);
  }

  @UseGuards(AuthorizationGuard)
@Roles(Role.Admin, Role.Customer)
  // Decrement product quantity (user)
  @Patch('/:username/product/:productId/decrement')
  async decrementProductQuantity(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ): Promise<Cart> {
    return this.cartService.decrementProductQuantity(username, productId);
  }

  @UseGuards(AuthorizationGuard)
@Roles(Role.Admin, Role.Customer)
  // Clear the user's cart, user and admin
  //used if user is inactive for too long, or
  //user deletes their account
  @Delete('/:username')
  async clearCart(@Param('username') username: string): Promise<void> {
    return this.cartService.clearCart(username);
    }

    @UseGuards(AuthorizationGuard)
@Roles(Role.Admin, Role.Customer)
  // Delete a product from the user's cart, admin and user
//user by choice, and admin if product is out of stock for example
//although technically in large scale projects, if a product is out
//of stock, it should be called whenever users get their cart
//then it would automatically delete
  @Delete('/:username/product/:productId')
  async deleteProductFromCart(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ): Promise<Cart> {
    return this.cartService.deleteProductFromCart(username, productId);
  }
}
