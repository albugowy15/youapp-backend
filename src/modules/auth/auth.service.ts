import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser, LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    identifier: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.usersRepository.findOneByEmailOrUsername(
      identifier,
      identifier,
    );
    if (!user) {
      return null;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return null;
    }
    return {
      email: user.email,
      username: user.username,
      id: user._id.toString(),
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findOneByEmailOrUsername(
      loginDto.identifier,
      loginDto.identifier,
    );
    if (!user) {
      throw new BadRequestException('invalid username/email or password');
    }
    const match = await bcrypt.compare(loginDto.password, user.password);
    if (!match) {
      throw new BadRequestException('invalid username/email or password');
    }
    const payload = {
      username: user.username,
      email: user.email,
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<void> {
    const duplicateUserByEmail = await this.usersRepository.findOneByEmail(
      registerDto.email,
    );
    if (duplicateUserByEmail) {
      throw new BadRequestException(
        `${registerDto.email} already registerd. Please use another email`,
      );
    }
    const duplicateUserByUsername =
      await this.usersRepository.findOneByUsername(registerDto.username);
    if (duplicateUserByUsername) {
      throw new BadRequestException(
        `${registerDto.username} already registerd. Please use another username`,
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    await this.usersRepository.create({
      password: hashedPassword,
      email: registerDto.email,
      username: registerDto.username,
    });
  }
}
