import { Booking } from "src/booking/booking.schema";
import { DataAdapter } from "./data-adapter.interface";
import * as ExcelJS from 'exceljs';
import { format } from 'date-fns'; // Optional: Use date-fns for date formatting

export class MongoToExcelAdapter implements DataAdapter {
    convertToReport(data: Booking[]): any {
        if (!data || data.length === 0) {
            throw new Error('No bookings data available to generate report.');
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bookings sheet');

        worksheet.columns = [
            { header: 'Customer Name', key: 'username', width: 30 },
            { header: 'Number of people', key: 'noOfpeople', width: 30 },
            { header: 'Date', key: 'date', width: 30 },
            { header: 'Time', key: 'time', width: 30 },
        ];

        data.forEach((booking) => {
            // Format the date field if necessary
            const formattedDate = booking.date ? format(booking.date, 'yyyy-MM-dd') : 'N/A';
            
            worksheet.addRow({
                username: booking.username || 'N/A',
                noOfpeople: booking.no_of_people || 'N/A', // handle cases where no_of_people might be missing
                date: formattedDate,
                time: booking.time || 'N/A', // handle cases where time might be missing
            });
        });

        // Return the generated Excel as a buffer
        return workbook.xlsx.writeBuffer();
    }
}
