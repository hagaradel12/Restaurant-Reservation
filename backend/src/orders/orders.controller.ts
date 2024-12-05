import { Controller, Post, Body, Param, Put, Delete, Get, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createOrderDto';
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

  // Delete order by order number
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Delete(':orderNo')
  async delete(@Param('orderNo') orderNo: string) {
    return await this.ordersService.delete(orderNo);
  }

  // Update order by order number
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Put(':orderNo')
  async update(
    @Param('orderNo') orderNo: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(orderNo, updateOrderDto);
  }

  // Get all orders for a user

  @Get('user/:username')
  async getUserOrders(@Param('username') username: string) {
    return await this.ordersService.getUserOrders(username);
  }

  // Get a single order by order number
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Get(':orderNo')
  async getOrderByOrderNo(@Param('orderNo') orderNo: string) {
    return await this.ordersService.getOrderByOrderNo(orderNo);
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
  async adminUpdateOrderStatus(
    @Param('orderNo') orderNo: string,
    @Body() status: string,
  ) {
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
