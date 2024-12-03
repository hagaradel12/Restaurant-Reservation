import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Products } from 'src/products/products.schema';

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Orders {
  @Prop({ required: true })
  orderNo: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }] })
  products: Products[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, enum: ['pending', 'shipped', 'delivered', 'canceled'] })
  status: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: Date.now }) // Automatically set the createdAt field to the current time
  createdAt: Date;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
