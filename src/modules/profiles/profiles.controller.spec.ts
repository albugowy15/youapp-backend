/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUserDto } from '../auth/auth.dto';
import { UpdateProfileDto } from './profiles.dto';
import { BadRequestException } from '@nestjs/common';
import { Profile } from 'src/common/schemas/profile.schema';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;

  beforeEach(async () => {
    const mockProfilesService = {
      find: jest.fn(),
      update: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [{ provide: ProfilesService, useValue: mockProfilesService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return profile data for the authenticated user', async () => {
      const mockUser = { id: 'user123', username: 'testuser' };
      const req: RequestWithUserDto = { user: mockUser } as any;
      const expectedProfile: {
        about: Omit<Profile, 'interests' | 'user'>;
        interests: Profile['interests'];
      } = {
        about: {
          profile_picture: 'profpic',
          display_name: 'test user',
          gender: 'male',
          birthday: '2001-10-15',
          horoscope: 'Libra',
          zodiac: 'Snake',
          height_cm: 174,
          weight_kg: 57,
        },
        interests: ['football'],
      };

      jest.spyOn(service, 'find').mockResolvedValue(expectedProfile);

      const result = await controller.find(req);
      expect(result).toEqual(expectedProfile);
      expect(service.find).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('update', () => {
    it('should update profile data for the authenticated user', async () => {
      const mockUser = { id: 'user123', username: 'testuser' };
      const req: RequestWithUserDto = { user: mockUser } as any;
      const updateDto: UpdateProfileDto = {
        about: {
          profile_picture: 'profpic',
          display_name: 'test user',
          gender: 'male',
          birthday: '2001-10-15',
          height_cm: 174,
          weight_kg: 57,
        },
        interests: ['football'],
      };

      jest.spyOn(service, 'update').mockResolvedValue();

      await controller.update(updateDto, req);
      expect(service.update).toHaveBeenCalledWith(mockUser.id, updateDto);
    });

    it('should throw a BadRequestException if the update data is invalid', async () => {
      const mockUser = { id: 'user123', username: 'testuser' };
      const req: RequestWithUserDto = { user: mockUser } as any;
      const updateDto: UpdateProfileDto = {
        about: {
          profile_picture: 'profpic',
          display_name: 'test user',
          gender: 'male',
          birthday: '2001-10-15',
          height_cm: 174,
          weight_kg: 57,
        },
        interests: ['football'],
      };

      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new BadRequestException('Invalid data');
      });

      await expect(controller.update(updateDto, req)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.update).toHaveBeenCalledWith(mockUser.id, updateDto);
    });
  });
});
