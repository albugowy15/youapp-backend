import { User } from 'src/schemas/user.schema';

export class LoginDto {
  identifier: string;
  password: string;
}

export class RegisterDto extends User {}
