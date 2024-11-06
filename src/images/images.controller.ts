import {
  Controller,
  Post,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  DownloadImageResponse,
  ImagesService,
  UploadImageResponse,
} from './images.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadImageResponse> {
    return await this.imagesService.upload(file);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async download(@Param('id') id: string): Promise<DownloadImageResponse> {
    // do retrieve
    return await this.imagesService.download(id);
  }
}
