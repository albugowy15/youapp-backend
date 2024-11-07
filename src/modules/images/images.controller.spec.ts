/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

describe('ImagesController', () => {
  let controller: ImagesController;
  let service: ImagesService;

  const mockImagesService = {
    upload: jest.fn(),
    download: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [{ provide: ImagesService, useValue: mockImagesService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .overrideInterceptor(FileInterceptor)
      .useValue({
        intercept: jest.fn().mockImplementation((ctx, next) => next.handle()),
      })
      .compile();

    controller = module.get<ImagesController>(ImagesController);
    service = module.get<ImagesService>(ImagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upload', () => {
    it('should upload an image', async () => {
      const file: Express.Multer.File = {
        buffer: Buffer.from('sample'),
        originalname: 'sample.png',
        mimetype: 'image/png',
        fieldname: 'file',
        encoding: '7bit',
        size: 1000,
        // @ts-ignore
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };
      const uploadResponse = { url: 'http://example.com/sample.png' };
      mockImagesService.upload.mockResolvedValue(uploadResponse);

      const result = await controller.upload(file);

      expect(result).toEqual(uploadResponse);
      expect(service.upload).toHaveBeenCalledWith(file);
    });
  });

  describe('download', () => {
    it('should download an image by ID', async () => {
      const id = 'sample-id';
      const downloadResponse = { id, data: Buffer.from('sample-data') };
      mockImagesService.download.mockResolvedValue(downloadResponse);

      const result = await controller.download(id);

      expect(result).toEqual(downloadResponse);
      expect(service.download).toHaveBeenCalledWith(id);
    });
  });
});
