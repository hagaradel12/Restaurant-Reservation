import { Booking } from "src/booking/booking.schema";
import { DataAdapter } from "./data-adapter.interface";
import * as ExcelJS from 'exceljs';
import { format } from 'date-fns'; // Optional: Use date-fns for date formatting

export class MongoToExcelAdapter implements DataAdapter { //implements data adapter interface
    //so it has to implement convertToReport method
    convertToReport(data: Booking[]): any { //takes booking array as parameter
        if (!data || data.length === 0) { //check if no bookings exist
            throw new Error('No bookings data available to generate report.');
        }//!data checks data is falsy mening array is (null, undefined, nan,..)
        //this is important to check first if !data is true to throw error so we dont access length on null values
        //if one or more bookings exist
        const workbook = new ExcelJS.Workbook(); //create an excel workbook
        const worksheet = workbook.addWorksheet('Bookings sheet');
        //add a booking worksheet to the workbook
        worksheet.columns = [
            { header: 'Customer Name', key: 'username', width: 30 },
            { header: 'Number of people', key: 'noOfpeople', width: 30 },
            { header: 'Date', key: 'date', width: 30 },
            { header: 'Time', key: 'time', width: 30 },
        ]; //define the field names with key and width which is in terms of no of character

        data.forEach((booking) => { //for each data in input which is a booking array, loop on each
            //booking instance 
            // Format the date field if necessary
            const formattedDate = booking.date ? format(booking.date, 'yyyy-MM-dd') : 'N/A';
            
            worksheet.addRow({ //insert row to worksheet then is inside the workbook
                username: booking.username || 'N/A',
                noOfpeople: booking.no_of_people || 'N/A', // handle cases where no_of_people might be missing
                date: formattedDate,
                time: booking.time || 'N/A', // handle cases where time might be missing
            });
        }); //the values in here on the left are the keys in column definition
        // and on the right it is based on schema props names

        //Return the generated Excel in buffer hich stores binary data and here it
        //is first converted to xlsx file
        //buffer can be used to be able to save it locally or send it as a response 
        //to another api that takes it as input
        return workbook.xlsx.writeBuffer();
        //xlsx is a compressed format for spreadsheets in microsoft excel
    }
}
