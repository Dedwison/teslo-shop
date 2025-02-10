import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product, ProductImage } from './entities';
import { PostgresHandlerExceptions } from 'src/common/exceptions/postgres-handlerExceptions';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PostgresHandlerExceptions],
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
