import { Injectable } from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import { Orders } from './orders.schema';
import mongoose from 'mongoose'
@Injectable()
export class OrdersService {
constructor(
    @InjectModel(Orders.name)private orderModel: mongoose.Model<Orders>
){}

async create(orderData:Orders):Promise<Orders>{
    const newOrder = new this.orderModel(orderData);
    return await newOrder.save();
}

async delete(id:string):Promise<Orders>{
    return await this.orderModel.findByIdAndDelete(id);
}
}
