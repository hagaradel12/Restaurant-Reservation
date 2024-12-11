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
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role, Roles } from 'src/auth/decorators/role.decorator';

@Controller('cart')

@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}


  // Get the user's cart, both roles ->tested
  
  @Get('/:username') 
  async getCart(@Param('username') username: string): Promise<CartDocument> {
    return this.cartService.getCart(username);
  }


  // Get product details in the user's cart, both roles ->tested
  @Get('/:username/product/:productId') 
  @Roles(Role.Admin, Role.Customer)
  async getProductInCart(@Param('username') username: string, @Param('productId') productId: string):
   Promise<{ product: any; quantity: number }> {
    return this.cartService.getProductInCart(username, productId);
  }


  // Get all carts (admin) ->tested
  @Get()
  @UseGuards(AuthorizationGuard)
@Roles(Role.Admin)
  async getAllCarts(): Promise<CartDocument[]> {
    return this.cartService.getAllCarts();
  }

 
  // Add a product to the user's cart, only the user when cart doesnt exist or product doesnt exist in cart ->user, tested
  @Post('/:username/product') 
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Customer)
  async addProductToCart(@Param('username') username: string, @Body() body: { productId: string; quantity: number }
): Promise<CartDocument> {
    const { productId, quantity} = body;
    return this.cartService.addeProductInCart(username, productId);
  }

  @Get('/:username/:productId/exists')
    async ifExists(username: string, prodId: string): Promise<boolean> {
      //find the cart if username has a cart
      const ifExists = await this.cartService.ifExists(username, prodId);
      return ifExists;
    }
  
  

  // Update the quantity of a product in the user's cart, only user ->tested
  @Patch('/:username/product/:productId')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Customer)
  async updateProductQuantity(@Param('username') username: string,@Param('productId') productId: string,
  @Body() body: { quantity: number }): Promise<CartDocument> {
    const { quantity } = body;
    return this.cartService.updateProductQuantity(username, productId, quantity);
  }


  // Increment product quantity (user) ->tested
  @Patch('/:username/product/:productId/increment')
  @UseGuards(AuthorizationGuard)
@Roles(Role.Admin, Role.Customer)
  async incrementProductQuantity(@Param('username') username: string, @Param('productId') productId: string): Promise<CartDocument> {
    return this.cartService.incrementProductQuantity(username, productId);
  }


  // Decrement product quantity (user) ->tested
  @Patch('/:username/product/:productId/decrement')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Admin, Role.Customer)
  async decrementProductQuantity(@Param('username') username: string,@Param('productId') productId: string): Promise<CartDocument> {
    return this.cartService.decrementProductQuantity(username, productId);
  }


  // Clear the user's cart, user and admin
  //used if user is inactive for too long, or
  //user deletes their account
  @Delete('/:username')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Admin, Role.Customer)
  async clearCart(@Param('username') username: string): Promise<void> {
    return this.cartService.clearCart(username);
    }

 
  // Delete a product from the user's cart, admin and user
//user by choice, and admin if product is out of stock for example
//although technically in large scale projects, if a product is out
//of stock, it should be called whenever users get their cart
//then it would automatically delete
  @Delete('/:username/product/:productId')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Admin, Role.Customer)
  async deleteProductFromCart(@Param('username') username: string,@Param('productId') productId: string): Promise<CartDocument> {
    return this.cartService.deleteProductFromCart(username, productId);
  }
}