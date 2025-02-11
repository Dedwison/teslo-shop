import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Product, ProductImage } from './entities';
import { PostgresHandlerExceptions } from 'src/common/exceptions/postgres-handlerExceptions';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PostgresHandlerExceptions],
  imports: [AuthModule, TypeOrmModule.forFeature([Product, ProductImage])],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
