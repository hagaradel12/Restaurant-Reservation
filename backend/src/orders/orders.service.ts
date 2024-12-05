import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import { Orders } from './orders.schema';
import mongoose, { Model } from 'mongoose'
import { UpdateOrderStatusDto } from './dto/UpdateOrderStatus.dto';
import { Products } from 'src/products/products.schema';
import { CreateOrderDto } from './dto/CreateOrder.dto';
@Injectable()
export class OrdersService {
constructor(
    @InjectModel(Orders.name)private orderModel: mongoose.Model<Orders>
){}
//customer hagar
async create(orderData: CreateOrderDto): Promise<Orders> {
    // Create a new instance of the Order model with the provided order data
    const newOrder = new this.orderModel(orderData);

    // Save the new order to the database and return the created order
    return await newOrder.save();
  }
//Admin
async delete(OrderNo: number): Promise<Orders | null> {
    return await this.orderModel.findOneAndDelete({ OrderNo });
}

 //find an order by order no  //Admin
 async findByNumber(OrderNo: number): Promise<Orders> {
    const order= await this.orderModel.findOne({ OrderNo }).exec();
    if (!order) {
      throw new NotFoundException("Order with number ${OrderNo} not found");
    }
    return order; 
}
//Admin
async findAll():Promise<Orders[]>{
    return this.orderModel.find();
}
//Admin
async updateOrderStatus(updateOrderStatus: UpdateOrderStatusDto): Promise<Orders | null> {
    const { orderNo, status } = updateOrderStatus;
    const updatedOrder = await this.orderModel.findOneAndUpdate(
        { orderNo }, // Find the order by OrderNo
        { status }, // Update the status
        { new: true } // Return the updated document
    );

    if (!updatedOrder) {
        throw new NotFoundException(`Order with OrderNo ${orderNo} not found`);
    }

    return updatedOrder;
}

//customer should be able to update his order details within 5 min after clicking at to cart
async updateOrderDetails(username: string, OrderNo: number, updateDetails: any): Promise<Orders> {
    // Find the order by OrderNo and username
    const order = await this.orderModel.findOne({ OrderNo, username });

    if (!order) {
        throw new NotFoundException(`Order with OrderNo ${OrderNo} not found for this username`);
    }

    // Check if the order is within 5 minutes of being created
    const timeDifference = new Date().getTime() - new Date(order.createdAt).getTime();
    const fiveMinutesInMillis = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (timeDifference > fiveMinutesInMillis) {
        throw new Error("You can only update your order within 5 minutes of placing it.");
    }

    // Update order details
    order.orderDetails = updateDetails;
    order.updatedAt = new Date();
    
    await order.save();
    return order;
} 
//customer should be able to view all his past orders
async getCustomerOrders(username: string): Promise<Orders[]> {
    const orders = await this.orderModel.find({ username });

    if (!orders || orders.length === 0) {
      throw new NotFoundException(`No orders found for customer with username ${username}`);
    }

    return orders;
  }
}
