import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from './orders.schema';
import { Products, ProductsSchema } from 'src/products/products.schema';
import { Users, UsersSchema } from 'src/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrdersSchema },
      { name: Users.name, schema: UsersSchema },
      { name: Products.name, schema: ProductsSchema },
    ]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
