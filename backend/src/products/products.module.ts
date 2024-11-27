// products.module.ts
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsSchema } from './products.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Products', schema: ProductsSchema }])
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
