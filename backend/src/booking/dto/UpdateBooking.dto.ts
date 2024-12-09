import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId

export class UpdateBookingDto {
    readonly no_of_people?: number;
    readonly date?: Date;
    readonly time?: string;
  }