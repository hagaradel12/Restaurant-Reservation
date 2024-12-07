import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './cart.schema';
import { Products, ProductsSchema } from 'src/products/products.schema';
import { CartController } from './cart.controller'; // Import the controller
import { JwtModule } from '@nestjs/jwt'; // Import the JWT module
import { AuthModule } from 'src/auth/auth.module'; // Import AuthModule if needed

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Products.name, schema: ProductsSchema },
    ]),
    JwtModule.register({
      secret: 'your_jwt_secret', // Make sure to store this in environment variables
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule, // Import the AuthModule if you have JWT authentication logic there
  ],
  providers: [CartService],
 controllers: [CartController], // Add the controller to the module
  exports: [CartService],
})
export class CartModule {}
