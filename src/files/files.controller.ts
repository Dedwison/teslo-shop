import { Response } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './helpers';
import { CloudinaryService } from './../cloudinary/cloudinary.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @Get('product/:imageName')
  findProdictImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    console.log(imageName);
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: { fieldSize: 10485760 }, // 10MB
    }),
  )
  async uploadImageToCloudinary(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const response = await this.cloudinary.uploadImage(file);
    return { secure_url: response.secure_url, public_id: response.public_id };
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: { fieldSize: 10485760 }, // 10MB
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    // console.log(file);

    // const secureUrl = `${file.filename}`;
    const secureUrl = `${this.configService.get(
      'HOST_API',
    )}/api/files/product/${file.filename}`;

    return { secureUrl };
  }
}
