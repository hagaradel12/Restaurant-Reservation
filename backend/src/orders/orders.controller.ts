import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Orders } from './orders.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() orderData: Orders) {
    return await this.ordersService.create(orderData);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return await this.ordersService.delete(id);
  }
}
