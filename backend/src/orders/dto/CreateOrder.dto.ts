import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class CreateOrderDto {
    readonly orderNo: string;  //need to be uatomatically generated
    readonly username: string; //be taken from token
    readonly status: string ="pending";
    readonly Addres?: string;
    readonly Products?: mongoose.Schema.Types.ObjectId[];
  }