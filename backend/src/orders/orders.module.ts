import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {MongooseModule} from '@nestjs/mongoose';
import { Orders, OrdersSchema } from './orders.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Orders', schema: OrdersSchema }])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
