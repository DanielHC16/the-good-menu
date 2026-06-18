import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity'; // <-- Import it

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // <-- Add this array
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
