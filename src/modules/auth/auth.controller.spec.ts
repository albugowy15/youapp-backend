import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn().mockResolvedValue({ token: 'mockToken' }),
      register: jest.fn().mockResolvedValue({ message: 'User registered' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService login method', async () => {
    const loginDto = { identifier: 'testuser', password: 'password' };
    const result = await controller.login(loginDto);
    expect(authService.login).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual({ token: 'mockToken' });
  });

  it('should call AuthService register method', async () => {
    const registerDto = {
      username: 'testuser',
      password: 'password',
      email: 'test@example.com',
    };
    const result = await controller.register(registerDto);
    expect(authService.register).toHaveBeenCalledWith(registerDto);
    expect(result).toEqual({ message: 'User registered' });
  });
});
