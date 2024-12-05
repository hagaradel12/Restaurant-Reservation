import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Products } from 'src/products/products.schema';



@Schema()
export class Orders {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }] })
  products: Products[]; // List of products included in the order

  @Prop({ required: true })
  Address: string; // Shipping address for the order

  @Prop({
    required: true,
    default: 'pending',
    enum: ['pending', 'on its way', 'delivered', 'canceled'],
  })
  status: string; // Order status

  @Prop({ required: true })
  username: string; // Username of the customer who placed the order

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp of order creation

  @Prop({ default: Date.now })
  updatedAt: Date; // Timestamp of last order update

  @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }] })
  orderDetails: Products[]; // List of products in the order, referencing the Products collection
}

// Create the schema for the Orders class
export const OrdersSchema = SchemaFactory.createForClass(Orders);