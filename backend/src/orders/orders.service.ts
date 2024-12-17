import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Orders, ordersDocument } from './orders.schema';
import { UpdateOrderDto } from './dto/updateOrderDto';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Model<ordersDocument>,
    private cartService: CartService
  ) {}

  // Create a new order
  //call clear cart
  async create(createOrderDto: CreateOrderDto): Promise<ordersDocument> {
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
  
    const newOrder = new this.orderModel(createOrderDto);
  
    // Generating a random order number
    newOrder.orderNo = Math.floor(Math.random() * 1000); // Generates a random number between 0 and 999
  
    // Save the order
    const savedOrder = await newOrder.save();
  
    // Clear the user's cart after order creation
    try {
      await this.cartService.clearCart(createOrderDto.username);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Order placed, but failed to clear cart.');
    }
  
    console.log(savedOrder); // Log the saved order to verify the 'items' field
    return savedOrder;
  }
  

  // Client: Find current order
  // async findCurrentOrder(username: string): Promise<ordersDocument | null> {
  //   try {
  //     const currentOrder = await this.orderModel
  //       .findOne({ username, status: { $in: ['pending', 'shipped'] } })
  //       .exec();

  //     if (!currentOrder) {
  //       throw new Error('No current order found for this user.');
  //     }

  //     return currentOrder;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch current order: ${error.message}`);
  //   }
  // }

  // // Client: View past orders
  // async findPastOrders(username: string): Promise<ordersDocument[]> {
  //   const pastOrders = await this.orderModel
  //     .find({ username, status: 'delivered' })
  //     .sort({ createdAt: -1 });

  //   return pastOrders;
  // }
  async findAllOrders(username: string): Promise<ordersDocument[]> {
    try {
      // Fetch all orders for the user
      return await this.orderModel
        .find({ username })
        .sort({ createdAt: -1 }) // Sort by most recent
        .exec();
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }
  // Admin: Get order by order number or username
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

    const updatedOrder = await this.orderModel.findOneAndUpdate(
      { orderNo },
      { status },
      { new: true },
    );

    if (!updatedOrder) {
      throw new Error(`Order with orderNo ${orderNo} not found`);
    }

    return updatedOrder;
  }

  // Admin: Delete order by order number
  async adminDeleteOrder(orderNo: string): Promise<ordersDocument> {
    return await this.orderModel.findOneAndDelete({ orderNo }).exec();
  }
}
