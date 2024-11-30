import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Products } from 'src/products/products.schema';



@Schema()

export class Orders {

  @Prop({ required: true })
  orderNo: Number;

 @Prop({ type: [{ type:mongoose.Schema.Types.ObjectId, ref: 'products' }] })
  products: Products[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, enum: ['pending', 'shipped', 'delivered', 'canceled'] })
  status: string;

  @Prop({ required: true })
  username: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
