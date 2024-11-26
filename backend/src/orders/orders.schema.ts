import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Products } from 'src/products/products.schema';

export type OrdersDocument = Orders & Document;

@Schema()
export class Orders {
  // Array of product IDs and quantities
  @Prop([
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ])
  products: { productId: mongoose.Types.ObjectId; quantity: number }[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, enum: ['pending', 'shipped', 'delivered', 'canceled'] })
  status: string;

  @Prop({ required: true })
  username: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
