import { Controller, Post, Body, Param, Put, Delete, Get, UseGuards, Query, Req, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { UpdateOrderDto } from './dto/updateOrderDto';
import { Roles, Role } from 'src/auth/decorators/role.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { CartService } from 'src/cart/cart.service';
import { ordersDocument } from './orders.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private cartService: CartService) {}

  // Create a new order
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    // Fetch cart items if not passed in the request body
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      try {
        const cart = await this.cartService.getCart(createOrderDto.username);
        if (!cart || !cart.products || cart.products.length === 0) {
          throw new Error('No items in cart to create the order.');
        }
        createOrderDto.items = cart.products; // Assume cart has an 'items' array
      } catch (error) {
        throw new Error('Error fetching cart items: ' + error.message);
      }
    }

    return await this.ordersService.create(createOrderDto);
  }

  // Get user orders (current and past)
  // @UseGuards(AuthGuard, AuthorizationGuard)
  // @Roles(Role.Admin, Role.Customer) // Accessible by both admin and customer
  // // Client: View current order
  // @Get('current/:username')
  // async findCurrentOrder(@Param('username') username: string): Promise<ordersDocument | null> {
  //   try {
  //     const currentOrder = await this.ordersService.findCurrentOrder(username);
  //     if (!currentOrder) {
  //       throw new NotFoundException('No current order found for this user.');
  //     }
  //     return currentOrder;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch current order: ${error.message}`);
  //   }
  // }

  // // Client: View past orders
  // @UseGuards(AuthGuard, AuthorizationGuard)
  // @Roles(Role.Admin, Role.Customer) 
  // @Get('past/:username')
  // async findPastOrders(@Param('username') username: string): Promise<ordersDocument[]> {
  //   try {
  //     const pastOrders = await this.ordersService.findPastOrders(username);
  //     return pastOrders;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch past orders: ${error.message}`);
  //   }
  // }
  @Get(':username')
  async getAllOrdersForClient(@Param('username') username: string): Promise<ordersDocument[]> {
    try {
      return await this.ordersService.findAllOrders(username);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get a single order by order number or username
  @Roles(Role.Admin) // Restrict access to Admins
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Get('search')
  async getOrderByOrderNoOrUsername(
    @Query('orderNo') orderNo?: string,
    @Query('username') username?: string,
  ) {
    try {
      const order = await this.ordersService.getOrderByOrderNoOrUsername(orderNo, username);
      return order;
    } catch (error) {
      throw new Error(`Failed to fetch the order: ${error.message}`);
    }
  }

  // Admin: Get all orders
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Get('admin/all')
  async getAllOrders() {
    return await this.ordersService.getAllOrders();
  }

  // Admin: Update order status
  @Put('admin/status/:orderNo')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  async adminUpdateOrderStatus(
    @Param('orderNo') orderNo: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      return await this.ordersService.adminUpdateOrderStatus(orderNo, updateOrderDto.status);
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  // Admin: Delete order by order number
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Delete('admin/:orderNo')
  async adminDeleteOrder(@Param('orderNo') orderNo: string) {
    try {
      return await this.ordersService.adminDeleteOrder(orderNo);
    } catch (error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    }
  }
}
