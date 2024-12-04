import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema ({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Orders {
  @Prop({ required: true })
  orderNo: number;

  // Defining an array of ObjectIds that reference the 'Products' collection
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }] })
  products: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, enum: ['pending', 'shipped', 'delivered', 'canceled'] })
  status: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: Date.now }) // Automatically set the createdAt field to the current time
  createdAt: Date;
}

export type OrdersDocument = HydratedDocument<Orders>;

export const OrdersSchema = SchemaFactory.createForClass(Orders);
