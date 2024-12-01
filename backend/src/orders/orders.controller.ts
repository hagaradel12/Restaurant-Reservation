import { Body, Controller, Delete, Param, Post ,Put,Get, UseGuards, Req} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Orders } from './orders.schema';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { UpdateOrderStatusDto } from './dto/UpdateOrderStatus.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles, Role } from 'src/auth/decorators/role.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';

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
  @Put('update/:orderNo')
  async updateStatus(
    @Param('orderNo') orderNo: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req: any // assuming the user’s token is in the request
  ) {
    const username = req.user.username; // You need to extract username from the JWT
    return this.ordersService.updateStatus(orderNo, updateOrderStatusDto, username);
  }

  @Put('admin/update/:orderNo')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  async updateByAdmin(
    @Param('orderNo') orderNo: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ) {
    return this.ordersService.update(orderNo, updateOrderStatusDto);
  }
  //get an order by its number 
  @Get(':orderNo')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  async getOrder(@Param('orderNo')orderNo: number){
    const order =await this.ordersService.findByNumber(orderNo);
    return order;
  }
  //get all orders of the customer
  @Get()
  async getAll(){
    return this.ordersService.findAll();
  }

}
