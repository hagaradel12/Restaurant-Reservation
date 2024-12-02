import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class UpdateOrderStatusDto {
    readonly orderNo?: Number;  //need to be uatomatically generated
    readonly username?: string; //be taken from token
    readonly status: string;
    readonly Address?: string;
    readonly Products?: mongoose.Schema.Types.ObjectId[];
  }