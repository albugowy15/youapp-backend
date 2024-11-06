import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    ImagesService,
    {
      inject: [ConfigService],
      provide: 'Images',
      useFactory: async (configService: ConfigService) => {
        return cloudinary.config({
          cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
        });
      },
    },
  ],
  controllers: [ImagesController],
})
export class ImagesModule {}
