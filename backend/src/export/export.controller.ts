import { Controller, Get, Res } from '@nestjs/common';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {

    constructor(private exportService :ExportService){}

    @Get('export') //get http method decorator
    async exportBookings(@Res() res):Promise<any>{ //Res decorator is
        //used to inject the response from the server to client so it
        //can be sent as a downloadable attachment in the front end so client
        //can download or open
        const excelBuffer = await this.exportService.exportBookingsToExcel();
        res.set({ //set http response header to tell browser format of 
            //content or data being returned from server
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=bookings-report.xlsx',
          });//this specifies how content should be displayed or handled by client
          //attachment means it is to be downloaded and the downloaded fle will be called
          //bookings-report.xlxs
        res.send(excelBuffer);  
    }
}
