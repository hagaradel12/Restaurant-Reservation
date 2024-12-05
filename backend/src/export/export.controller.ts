import { Controller, Get, Res } from '@nestjs/common';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {

    constructor(private exportService :ExportService){}

    @Get('export')
    async expoetBookings(@Res() res):Promise<any>{
        const excelBuffer = await this.exportService.exportBookingsToExcel();
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=bookings-report.xlsx',
          });
        res.send(excelBuffer);  
    }
}
