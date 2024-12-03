import { ForbiddenException, Injectable,NotFoundException } from '@nestjs/common';
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
  const newOrder = new this.orderModel({
    ...createOrderDto,
    createdAt: new Date(),
    status: 'Pending', // Default status
  });
  return newOrder.save();
}

// Delete a order by orderNo
//Customer
async deleteOrder(orderNo: number): Promise<Orders> {
  const order = await this.orderModel.findOne({ orderNo }).exec();
  if (!order) {
    throw new NotFoundException(`Order with number ${orderNo} not found`);
  }

  const timeDifference = (Date.now() - new Date(order.createdAt).getTime()) / 1000; // Time in seconds
  if (timeDifference > 300) {
    throw new ForbiddenException('Order can only be deleted within 5 minutes');
  }

  const deletedOrder = await this.orderModel.findByIdAndDelete(order._id).exec();
  return deletedOrder;
}

// Client can only update within 5 minutes
async updateStatus(orderNo: number, updateOrderStatusDto: UpdateOrderStatusDto, username: string): Promise<Orders> {
  // Find the order by its order number
  const order = await this.orderModel.findOne({ orderNo }).exec();

  if (!order) {
    throw new NotFoundException(`Order with number ${orderNo} not found`);
  }

  // Check if the order was created within the last 5 minutes
  const timeDifference = new Date().getTime() - new Date(order.createdAt).getTime();
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (timeDifference > fiveMinutes) {
    throw new ForbiddenException('You can no longer update this order. Please contact the admin.');
  }

  // Update the order if within the time limit and if the username matches
  if (order.username !== username) {
    throw new ForbiddenException('You cannot update an order that does not belong to you.');
  }

  // Proceed with updating the order status
  const updatedOrder = await this.orderModel.findOneAndUpdate(
    { orderNo },
    { $set: updateOrderStatusDto },
    { new: true }
  ).exec();

  return updatedOrder;
}

// Admin can update any order at any time
async update(orderNo: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Orders> {
  const updatedOrder = await this.orderModel.findOneAndUpdate(
    { orderNo },
    updateOrderStatusDto,
    { new: true }
  ).exec();

  if (!updatedOrder) {
    throw new NotFoundException(`Order with orderNo ${orderNo} not found`);
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
