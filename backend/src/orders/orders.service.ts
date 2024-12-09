import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Orders, ordersDocument } from './orders.schema';
import { UpdateOrderDto } from './dto/updateOrderDto';
import { CreateOrderDto } from './dto/CreateOrder.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Model<ordersDocument>,
  ) {}
//CLIENT
  //create order for client DONE
  //view current order DONE
  //view past orders DONE
  //no update no delete 
  
//ADMIN
  //view all orders DONE
  //find an order by user name or orderNo DONE
  //update order status DONE
  //delete order  DONE

// Create a new order
  async create(createOrderDto: CreateOrderDto): Promise<ordersDocument> {
    const newOrder = new this.orderModel(createOrderDto);
    newOrder.orderNo = Math.floor(Math.random() * 1000);  // Generates a random number between 0 and 999
    return await newOrder.save();
  }

 //client should be able to view current order
 //username will be extarcted from the token
 async findCurrentOrder(username: string): Promise<ordersDocument | null> {
  try {
    const currentOrder = await this.orderModel
      .findOne({ username, status: { $in: ['pending', 'shipped'] }}).exec();

    if (!currentOrder) {
      throw new Error('No current order found for this user.');
    }

    return currentOrder;
  } catch (error) {
    throw new Error(`Failed to fetch current order: ${error.message}`);
  }
}


   //view past orders
   async findPastOrders(username: string): Promise<ordersDocument[]> {
      const pastOrders = await this.orderModel.find({ username, status: 'delivered' }).sort({ createdAt: -1 }); 
      return pastOrders;
   }

  // Delete an order by orderNo if within 5 minutes of creation
  // async delete(orderNo: string): Promise<ordersDocument> {
  //   const order = await this.orderModel.findOne({ orderNo }).exec();
  //   if (!order) {
  //     throw new Error('Order not found');
  //   }

  //   const isOlderThan5Min = new Date().getTime() - order.createdAt.getTime() > 5 * 60 * 1000;
  //   if (isOlderThan5Min) {
  //     throw new Error('Order can only be deleted within 5 minutes of creation');
  //   }

  //   return await this.orderModel.findByIdAndDelete(order._id);
  // }

  // Update an order if within 5 minutes of creation
  // async update(orderNo: string, updateOrderDto: UpdateOrderDto): Promise<ordersDocument> {
  //   const order = await this.orderModel.findOne({ orderNo }).exec();
  //   if (!order) {
  //     throw new Error('Order not found');
  //   }

  //   const isOlderThan5Min = new Date().getTime() - order.createdAt.getTime() > 5 * 60 * 1000;
  //   if (isOlderThan5Min) {
  //     throw new Error('Order can only be updated within 5 minutes of creation');
  //   }

  //   return await this.orderModel.findByIdAndUpdate(order._id, updateOrderDto, { new: true });
  // }



  // Get order by order number or username
  async getOrderByOrderNoOrUsername(orderNo?: string, username?: string): Promise<ordersDocument | null> {
    try {
      if (!orderNo && !username) {
        throw new Error('Either orderNo or username must be provided.');
      }
      const query: any = {};
      if (orderNo) query.orderNo = orderNo;
      if (username) query.username = username;
      const order = await this.orderModel.findOne(query).exec();
      if (!order) {
        throw new Error('No order found with the provided criteria.');
      }
      return order;
    } catch (error) {
      throw new Error(`Failed to fetch the order: ${error.message}`);
    }
  }
  

  // Admin: Get all orders
  async getAllOrders(): Promise<ordersDocument[]> {
    return await this.orderModel.find().exec();
  }

  // Admin: Update order status
  async adminUpdateOrderStatus(orderNo: string, status: string): Promise<ordersDocument> {
    const validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    return await this.orderModel.findOneAndUpdate({ orderNo },{ status },{ new: true });
  }

  // Admin: Delete order by order number
  async adminDeleteOrder(orderNo: string): Promise<ordersDocument> {
    return await this.orderModel.findOneAndDelete({ orderNo }).exec();
  }
}