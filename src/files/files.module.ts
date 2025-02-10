import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryModule } from './../cloudinary/cloudinary.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule, CloudinaryModule],
})
export class FilesModule {}
