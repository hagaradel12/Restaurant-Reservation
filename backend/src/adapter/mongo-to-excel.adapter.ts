import { Booking } from "src/booking/booking.schema";
import { DataAdapter } from "./data-adapter.interface";
import * as ExcelJS from 'exceljs';

export class MongoToExcelAdapter implements DataAdapter{
    convertToReport(data: Booking[]):any {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bookings sheet');

        worksheet.columns =[
            {header:'Customer Name', key:'username',width:30},
            {header:'Number of people', key:'noOfpeople',width:30},
            {header:'Date', key:'date', width:30},
            {header:'Time', key:'time', width:30},

        ];
        data.forEach((booking)=>{
            worksheet.addRow({
                username:booking.username,
                noOfpeople: booking.no_of_people,
                date: booking.date,
                time:booking.time,
            });
        });
        return workbook.xlsx.writeBuffer();
    }
}