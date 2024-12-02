import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import { Orders } from './orders.schema';
import mongoose from 'mongoose'
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { UpdateOrderStatusDto } from './dto/UpdateOrderStatus.dto';
@Injectable()
export class OrdersService {
constructor(
    @InjectModel(Orders.name)private orderModel: mongoose.Model<Orders>
){}

 // Create a new order
 //public
 async createOrder(createOrderDto: CreateOrderDto): Promise<Orders> {
    const newOrder = new this.orderModel(createOrderDto);
    return newOrder.save();
  }

// Delete a order by orderNo
//Customer
async deleteOrder(orderNo: number): Promise<Orders> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(orderNo).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order code with number ${orderNo} not found`);
    }
    return deletedOrder;
  }

  // Update an existing order by orderNo
  //Admin
  async update(orderNo: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Orders> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(orderNo, updateOrderStatusDto, { new: true }).exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with orderNo${orderNo} not found`);
    }
    return updatedOrder;
  }

  //find an order by order no 
  //Admin
  async findByNumber(orderNo: number): Promise<Orders> {
    const order= await this.orderModel.findOne({ orderNo }).exec();
    if (!order) {
      throw new NotFoundException("Order with number ${orderNo} not found");
    }
    return order; 
}
  //customer get all his orders
  async findAll(): Promise<Orders[]> {
    return this.orderModel.find();
  }

}
