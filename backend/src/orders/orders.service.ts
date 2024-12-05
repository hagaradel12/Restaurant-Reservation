import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Orders, ordersDocument } from './orders.schema';
import { UpdateOrderDto } from './dto/updateOrderDto';
import { CreateOrderDto } from './dto/createOrderDto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Model<ordersDocument>,
  ) {}

  // Create a new order
  async create(createOrderDto: CreateOrderDto): Promise<ordersDocument> {
    const newOrder = new this.orderModel(createOrderDto);
    return await newOrder.save();
  }

  // Delete an order by orderNo if within 5 minutes of creation
  
  async delete(orderNo: string): Promise<ordersDocument> {
    const order = await this.orderModel.findOne({ orderNo }).exec();
    if (!order) {
      throw new Error('Order not found');
    }

    const isOlderThan5Min = new Date().getTime() - order.createdAt.getTime() > 5 * 60 * 1000;
    if (isOlderThan5Min) {
      throw new Error('Order can only be deleted within 5 minutes of creation');
    }

    return await this.orderModel.findByIdAndDelete(order._id);
  }

  // Update an order if within 5 minutes of creation
  async update(orderNo: string, updateOrderDto: UpdateOrderDto): Promise<ordersDocument> {
    const order = await this.orderModel.findOne({ orderNo }).exec();
    if (!order) {
      throw new Error('Order not found');
    }

    const isOlderThan5Min = new Date().getTime() - order.createdAt.getTime() > 5 * 60 * 1000;
    if (isOlderThan5Min) {
      throw new Error('Order can only be updated within 5 minutes of creation');
    }

    return await this.orderModel.findByIdAndUpdate(order._id, updateOrderDto, { new: true });
  }

  // Get all orders of a user
  async getUserOrders(username: string): Promise<ordersDocument[]> {
    return await this.orderModel
      .find({ username })
      .populate('username')  // Populates the username (user details)
      .exec();
  }

  // Get order by order number
  async getOrderByOrderNo(orderNo: string): Promise<ordersDocument> {
    return await this.orderModel
      .findOne({ orderNo })
      .populate('username')  // Populates the username (user details)
      .exec();
  }

  // Admin: Get all orders
  async getAllOrders(): Promise<ordersDocument[]> {
    return await this.orderModel.find().populate('username').exec();
  }

  // Admin: Update order status
  async adminUpdateOrderStatus(orderNo: string, status: string): Promise<ordersDocument> {
    const validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    return await this.orderModel.findOneAndUpdate(
      { orderNo },
      { status },
      { new: true },
    );
  }

  // Admin: Delete order by order number
  async adminDeleteOrder(orderNo: string): Promise<ordersDocument> {
    return await this.orderModel.findOneAndDelete({ orderNo }).exec();
  }
}
