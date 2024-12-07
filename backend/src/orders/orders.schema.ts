import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Products } from 'src/products/products.schema';
import { Users } from 'src/users/users.schema';

@Schema({ timestamps: true })
export class Orders {

  @Prop({required: true, unique: true})
  orderNo:number

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }] })
  products: Products[];

  @Prop({ required: true })
  Address: string;

  @Prop({
    required: true,
    default: 'pending',
    enum: ['pending', 'shipped', 'delivered', 'canceled'],
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  username: Users;

  @Prop({ required: true})
  paymentMethod: string;

 
  @Prop([
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ])
   items: { productId: mongoose.Types.ObjectId; quantity: number }[];
}


export type ordersDocument = HydratedDocument<Orders> & { createdAt: Date; updatedAt: Date }; // Add createdAt and updatedAt explicitly
export const OrdersSchema = SchemaFactory.createForClass(Orders);

 
