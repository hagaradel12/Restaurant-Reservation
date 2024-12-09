import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Products } from 'src/products/products.schema';
import { Users } from 'src/users/users.schema';

@Schema({ timestamps: true })
export class Orders {

  @Prop({required: false, unique: true})
  orderNo:number


  @Prop({ required: true })
  address: string;

  @Prop({
    required: true,
    default: 'pending',
    enum: ['pending', 'shipped', 'delivered', 'canceled'],
  })
  status: string;

  @Prop({ required: true})
  username: string;

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

 
