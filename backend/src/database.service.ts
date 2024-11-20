import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
//singleton database connection
@Injectable()
export class DatabaseService {
  private static instance: DatabaseService;
  private client: Client;

  private constructor() {
    this.client = new Client({
      connectionString: 'postgres://postgres.kjusqqxaozzkhfxyqmiu:TestingProject%2312345@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
    });

    this.connectToDatabase();
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async connectToDatabase() {
    try {
      await this.client.connect();
      console.log('Connected to the PostgreSQL database');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }

  getClient(): Client {
    return this.client;
  }

  async closeConnection() {
    try {
      await this.client.end();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing the connection:', error);
    }
  }
}
