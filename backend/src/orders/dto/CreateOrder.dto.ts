import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class CreateOrderDto {
     orderNo: number = Math.floor(Math.random() * 1000000);  // Generates a random number between 0 and 999999
     username: string; 
     status: string = "pending"; // Default to "pending"
     address: string;
     products?: mongoose.Schema.Types.ObjectId[];
}