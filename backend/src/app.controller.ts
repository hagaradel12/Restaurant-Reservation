import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database.service';

@Controller()
export class AppController {
  private readonly databaseService: DatabaseService;

  constructor(private readonly appService: AppService) {
    // Retrieve the singleton instance of DatabaseService
    this.databaseService = DatabaseService.getInstance();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello(); // Use AppService to return a greeting
  }

  @Get('test-db')
  async testDatabase(): Promise<string> {
    try {
      const dbClient = this.databaseService.getClient();
      const result = await dbClient.query('SELECT NOW()');
      return `Database connection is successful. Current time: ${result.rows[0].now}`;
    } catch (error) {
      console.error('Error testing the database:', error);
      return 'Error connecting to the database';
    }
  }
}
