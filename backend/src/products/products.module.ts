import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './products.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Products.name, schema: ProductsSchema }])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // Export if other modules need it
})
export class ProductsModule {}
