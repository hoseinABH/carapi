import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { promisify } from 'util';
// Entities
import { User } from './user.entity';
// Services
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private UserService: UsersService,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  async signup(email: string, password: string) {
    const users = await this.UserService.find(email);
    if (users.length) {
      throw new BadRequestException(
        'This email address is already being used.',
      );
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.UserService.create(email, result);

    return user;
  }
}
