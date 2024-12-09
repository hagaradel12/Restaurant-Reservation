import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BookingModule } from './booking/booking.module';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { AdapterModule } from './adapter/adapter.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://lojineamer:0000@cluster0.ras61.mongodb.net/test'),
     UsersModule,
    BookingModule,
    ProductsModule,
    OrdersModule,
   CartModule,
    AuthModule,
    AdapterModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}