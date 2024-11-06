import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'node:stream';
import { AppException } from 'src/interceptors/transform.interceptor';

export interface UploadImageResponse {
  asset_id: string;
}
export interface DownloadImageResponse {
  asset_id: string;
  public_id: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  url: string;
}

@Injectable()
export class ImagesService {
  async upload(file: Express.Multer.File): Promise<UploadImageResponse> {
    return new Promise((resolve, reject) => {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'youapp' },
        (error, result) => {
          if (error) {
            return reject(new AppException(error.message, error.http_code));
          }
          resolve({ asset_id: result?.asset_id });
        },
      );
      readableStream.pipe(uploadStream);
    });
  }

  async download(assetID: string): Promise<DownloadImageResponse> {
    try {
      const result = await cloudinary.api.resources_by_asset_ids(assetID, {
        max_results: 1,
      });
      const imageData = result.resources[0];
      return {
        asset_id: imageData.asset_id,
        public_id: imageData.public_id,
        format: imageData.format,
        bytes: imageData.bytes,
        width: imageData.width,
        height: imageData.height,
        url: imageData.url,
      };
    } catch (error) {
      const formatedError = error as {
        error: { message: string; http_code: number };
      };
      throw new AppException(
        formatedError.error.message,
        formatedError.error.http_code,
      );
    }
  }
}
