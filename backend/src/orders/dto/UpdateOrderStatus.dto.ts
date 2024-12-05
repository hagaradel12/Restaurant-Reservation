import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class UpdateOrderStatusDto {
     orderNo?: Number;  
     username?: string; //be taken from token
     status: string;
     Address?: string;
     Products?: mongoose.Schema.Types.ObjectId[];
  }