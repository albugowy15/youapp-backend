import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { ProfilesRepository } from './profiles.repository';
import { UpdateProfileDto } from './profiles.dto';
import { getHoroscopeSign, getZodiacSign } from '../../lib/zodiac';
import { Profile } from 'src/common/schemas/profile.schema';

jest.mock('../../lib/zodiac', () => ({
  getHoroscopeSign: jest.fn(),
  getZodiacSign: jest.fn(),
}));

describe('ProfilesService', () => {
  let service: ProfilesService;
  let profilesRepository: ProfilesRepository;

  const mockProfilesRepository = {
    findByUserID: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: ProfilesRepository, useValue: mockProfilesRepository },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    profilesRepository = module.get<ProfilesRepository>(ProfilesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should return profile data for a valid user ID', async () => {
      const userID = 'test-user-id';
      const profile = {
        user: userID,
        profile_picture: 'picture-url',
        display_name: 'John Doe',
        gender: 'male',
        birthday: '1990-01-01',
        horoscope: 'Capricorn',
        zodiac: 'Horse',
        height_cm: 180,
        weight_kg: 75,
        interests: ['coding', 'reading'],
      };
      const expectedResponse: {
        about: Omit<Profile, 'interests' | 'user'>;
        interests: Profile['interests'];
      } = {
        about: {
          profile_picture: 'picture-url',
          display_name: 'John Doe',
          gender: 'male',
          birthday: '1990-01-01',
          horoscope: 'Capricorn',
          zodiac: 'Horse',
          height_cm: 180,
          weight_kg: 75,
        },
        interests: ['coding', 'reading'],
      };

      mockProfilesRepository.findByUserID.mockResolvedValue(profile);

      const result = await service.find(userID);

      expect(result).toEqual(expectedResponse);
      expect(profilesRepository.findByUserID).toHaveBeenCalledWith(userID);
    });

    it('should return null if no profile is found', async () => {
      const userID = 'nonexistent-user-id';
      mockProfilesRepository.findByUserID.mockResolvedValue(null);

      const result = await service.find(userID);

      expect(result).toBeNull();
      expect(profilesRepository.findByUserID).toHaveBeenCalledWith(userID);
    });
  });

  describe('update', () => {
    it('should create a new profile if one does not exist', async () => {
      const userID = 'test-user-id';
      const updateDto: UpdateProfileDto = {
        about: {
          display_name: 'John Doe',
          profile_picture: 'new-picture-url',
          birthday: '1990-01-01',
          gender: 'male',
          height_cm: 180,
          weight_kg: 75,
        },
        interests: ['coding', 'gaming'],
      };

      mockProfilesRepository.findByUserID.mockResolvedValue(null);
      (getHoroscopeSign as jest.Mock).mockReturnValue('Capricorn');
      (getZodiacSign as jest.Mock).mockReturnValue('Horse');

      await service.update(userID, updateDto);

      expect(profilesRepository.findByUserID).toHaveBeenCalledWith(userID);
      expect(getHoroscopeSign).toHaveBeenCalledWith(1, 1); // January 1st
      expect(getZodiacSign).toHaveBeenCalledWith(1990);
      expect(profilesRepository.create).toHaveBeenCalledWith({
        user: userID,
        interests: ['coding', 'gaming'],
        display_name: 'John Doe',
        profile_picture: 'new-picture-url',
        birthday: '1990-01-01',
        gender: 'male',
        height_cm: 180,
        weight_kg: 75,
        horoscope: 'Capricorn',
        zodiac: 'Horse',
      });
    });

    it('should update an existing profile if one exists', async () => {
      const userID = 'test-user-id';
      const currentProfile = {
        user: userID,
        interests: ['coding'],
        display_name: 'John Doe',
        profile_picture: 'picture-url',
        birthday: '1990-01-01',
        gender: 'male',
        height_cm: 180,
        weight_kg: 75,
        horoscope: 'Capricorn',
        zodiac: 'Horse',
      };
      const updateDto: UpdateProfileDto = {
        about: {
          display_name: 'John Updated',
          profile_picture: 'updated-picture-url',
          birthday: '1990-01-01',
          gender: 'male',
          height_cm: 180,
          weight_kg: 75,
        },
        interests: ['coding', 'music'],
      };

      mockProfilesRepository.findByUserID.mockResolvedValue(currentProfile);
      (getHoroscopeSign as jest.Mock).mockReturnValue('Capricorn');
      (getZodiacSign as jest.Mock).mockReturnValue('Horse');

      await service.update(userID, updateDto);

      expect(profilesRepository.findByUserID).toHaveBeenCalledWith(userID);
      expect(getHoroscopeSign).toHaveBeenCalledWith(1, 1); // January 1st
      expect(getZodiacSign).toHaveBeenCalledWith(1990);
      expect(profilesRepository.update).toHaveBeenCalledWith(userID, {
        interests: ['coding', 'music'],
        display_name: 'John Updated',
        profile_picture: 'updated-picture-url',
        birthday: '1990-01-01',
        gender: 'male',
        height_cm: 180,
        weight_kg: 75,
        horoscope: 'Capricorn',
        zodiac: 'Horse',
      });
    });
  });
});
