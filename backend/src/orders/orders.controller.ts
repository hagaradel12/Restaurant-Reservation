import { Controller, Post, Body, Param, Put, Delete, Get, UseGuards, Query, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { UpdateOrderDto } from './dto/updateOrderDto';
import { Roles, Role } from 'src/auth/decorators/role.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create a new order
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin, Role.Customer) // Accessible by both admin and customer
  @Get('user-orders')
  getUserOrders(@Query('username') username: string) {
    const current =this.ordersService.findCurrentOrder(username);
    const past = this.ordersService.findPastOrders(username);
      return{
        currentOrder : current,
        pastOrders:past
      };
  }



  // Get a single order by order number
  @Roles(Role.Admin) // Restrict access to Admins
  @UseGuards(AuthGuard, AuthorizationGuard) 
  @Get('search')
  async getOrderByOrderNoOrUsername(
    @Query('orderNo') orderNo?: string,  @Query('username') username?: string ) {
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
  @Roles(Role.Admin)
  @Put('admin/status/:orderNo')
  async adminUpdateOrderStatus(@Param('orderNo') orderNo: string,@Body() status: string,) {
    return await this.ordersService.adminUpdateOrderStatus(orderNo, status);
  }

  // Admin: Delete order by order number
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Delete('admin/:orderNo')
  async adminDeleteOrder(@Param('orderNo') orderNo: string) {
    return await this.ordersService.adminDeleteOrder(orderNo);
  }
}