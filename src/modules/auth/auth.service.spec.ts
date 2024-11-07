/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './auth.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: UsersRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUsersRepository = {
      findOneByEmailOrUsername: jest.fn(),
      findOneByEmail: jest.fn(),
      findOneByUsername: jest.fn(),
      create: jest.fn(),
    };
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mockAccessToken'),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token if credentials are valid', async () => {
      const user = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const loginDto: LoginDto = {
        identifier: 'testuser',
        password: 'password',
      };
      jest
        .spyOn(usersRepository, 'findOneByEmailOrUsername')
        // @ts-ignore
        .mockResolvedValue(user);
      // @ts-ignore
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.login(loginDto);
      expect(result).toEqual({ access_token: 'mockAccessToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        sub: '123',
      });
    });

    it('should throw BadRequestException if user is not found', async () => {
      const loginDto: LoginDto = {
        identifier: 'nonexistent',
        password: 'password',
      };
      jest
        .spyOn(usersRepository, 'findOneByEmailOrUsername')
        // @ts-ignore
        .mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if password does not match', async () => {
      const user = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const loginDto: LoginDto = {
        identifier: 'testuser',
        password: 'wrongpassword',
      };
      jest
        .spyOn(usersRepository, 'findOneByEmailOrUsername')
        // @ts-ignore
        .mockResolvedValue(user);
      // @ts-ignore
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('register', () => {
    it('should create a new user if email and username are unique', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      };
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'findOneByUsername').mockResolvedValue(null);
      // @ts-ignore
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      await service.register(registerDto);

      expect(usersRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
      });
    });

    it('should throw BadRequestException if email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        username: 'testuser',
        password: 'password',
      };
      // @ts-ignore
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue({});

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if username already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'existinguser',
        password: 'password',
      };
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(null);
      // @ts-ignore
      jest.spyOn(usersRepository, 'findOneByUsername').mockResolvedValue({});

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
