import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class CreateOrderDto {
    readonly orderNo: number = Math.floor(Math.random() * 1000000);  // Generates a random number between 0 and 999999
    readonly username: string; // Taken from token
    readonly status: string = "pending"; // Default to "pending"
    readonly address: string;
    readonly products?: mongoose.Schema.Types.ObjectId[];
}
