import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class CreateBookingDto {
    readonly no_of_people:number; 
    readonly Date:Date; 
    readonly Time:string;
    readonly username:string;

  }