import { Body, Controller, Delete, Param, Post ,Put} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Orders } from './orders.schema';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { UpdateOrderStatusDto } from './dto/UpdateOrderStatus.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //POST:Create order 
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Orders> {
    return await this.ordersService.createOrder(createOrderDto);
  }
 // DELETE /courses/:course_code: Delete a order by its number
 @Delete(':orderNo')
 async deleteOrder(@Param('orderNo') orderNo: number): Promise<Orders> {
   return this.ordersService.deleteOrder(orderNo);
 }

 // PUT /order/:orderNo: Update an existing order by its orderNo
 @Put(':orderNo')
 async update(@Param('orderNo') orderNo: number, @Body() updateOrderStatusDto: UpdateOrderStatusDto): Promise<Orders> {
   return this.ordersService.update(orderNo, updateOrderStatusDto);
 }
}
