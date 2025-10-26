import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '../../dtos/user/create-user.dto';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';
import { HashService } from './hash.service';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly loggerService: AppLoggerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.loggerService.info(`Creating user with email: ${createUserDto.email}`);
    const user = new User();
    Object.assign(user, createUserDto);
    user.hashSenha = await this.hashService.hash(createUserDto.hashSenha);
    const savedUser = await this.userRepository.save(user);
    this.loggerService.info(`User created with ID: ${savedUser.id}`);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    this.loggerService.info('Fetching all users');
    const users = await this.userRepository.find();
    this.loggerService.info(`Found ${users.length} users`);
    return users;
  }

  async findOne(id: string): Promise<User | null> {
    this.loggerService.info(`Fetching user with ID: ${id}`);
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      this.loggerService.info(`User found: ${user.email}`);
    } else {
      this.loggerService.error(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    this.loggerService.info(`Updating user with ID: ${id}`);
    const existing = await this.findOne(id);
    if (!existing) return null;
    Object.assign(existing, updateUserDto);
    const updatedUser = await this.userRepository.save(existing);
    this.loggerService.info(`User updated: ${updatedUser.email}`);
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    this.loggerService.info(`Deleting user with ID: ${id}`);
    await this.userRepository.delete(id);
    this.loggerService.info(`User deleted`);
  }
}
