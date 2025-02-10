import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { Readable } from 'stream';
@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'drsahfjvo',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        },
        (error, result) => {
          if (error) {
            console.log('Error en Cloudinary:', error);
            return reject(error);
          }
          if (result) {
            let { secure_url, public_id } = result;
            public_id = public_id.replace('drsahfjvo/', '');
            resolve({ secure_url, public_id } as UploadApiResponse);
          }
          reject(new Error('Upload result is undefined'));
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }
}
