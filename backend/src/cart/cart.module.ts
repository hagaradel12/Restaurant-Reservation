import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from './cart.schema';
import { Products, ProductsSchema } from 'src/products/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema }, // Register Cart schema
      { name: Products.name, schema: ProductsSchema }, // Register Products schema
    ]),
    JwtModule.register({ secret: 'your-secret-key', signOptions: { expiresIn: '60m' } }), // Register JwtModule
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
