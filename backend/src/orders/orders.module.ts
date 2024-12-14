import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from './orders.schema';
import { Products, ProductsSchema } from 'src/products/products.schema';
import { Users, UsersSchema } from 'src/users/users.schema';
import { Cart, CartSchema } from 'src/cart/cart.schema';
import { CartService } from 'src/cart/cart.service';  // Import CartService

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrdersSchema },
      { name: Users.name, schema: UsersSchema },
      { name: Products.name, schema: ProductsSchema },
      { name: Cart.name, schema: CartSchema },  // Import Cart schema
    ]),
  ],
  providers: [OrdersService, CartService],  // Add CartService to providers
  controllers: [OrdersController],
})
export class OrdersModule {}
