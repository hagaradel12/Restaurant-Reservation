import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Orders } from './orders.schema';
import { UpdateOrderStatusDto } from './dto/UpdateOrderStatus.dto';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Orders> {
    return this.ordersService.create(createOrderDto);
  }
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Delete(':orderNo')
    async deleteOrder(@Param('orderNo') orderNo: number): Promise<Orders> {
        return this.ordersService.delete(orderNo);
    }
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Get(':orderNo')
  async getOrder(@Param('orderNo')orderNo: number){
    const order =await this.ordersService.findByNumber(orderNo);
    return order;
  }
  @Get('/')
  async findAll(){
    return this.ordersService.findAll();
  }
  @Patch('update-details/:orderNo')
  async updateOrderDetails(
    @Param('orderNo') orderNo: number,
    @Body() updateDetails: UpdateOrderStatusDto,
    @Req() req, 
  ): Promise<Orders> {
    const username = req.user.username; // assuming username is available in req.user (from JWT or session)

    return this.ordersService.updateOrderDetails(username, orderNo, updateDetails);
  }

  @Get('history')
  async getCustomerOrders(@Req() req): Promise<Orders[]> {
    const username = req.user.username; // assuming username is available in req.user (from JWT or session)

    return this.ordersService.getCustomerOrders(username);
  }

}