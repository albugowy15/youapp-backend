import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findOne(identifier: string): Promise<UserDocument | null> {
    return await this.usersRepository.findOneByEmailOrUsername(
      identifier,
      identifier,
    );
  }
}
