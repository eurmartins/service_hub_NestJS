import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '../../dtos/user/create-user.dto';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    const user = new User();
    Object.assign(user, createUserDto);
    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created with ID: ${savedUser.id}`);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    const users = await this.userRepository.find();
    this.logger.log(`Found ${users.length} users`);
    return users;
  }

  async findOne(id: string): Promise<User | null> {
    this.logger.log(`Fetching user with ID: ${id}`);
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      this.logger.log(`User found: ${user.email}`);
    } else {
      this.logger.warn(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    this.logger.log(`Updating user with ID: ${id}`);
    const existing = await this.findOne(id);
    if (!existing) return null;
    Object.assign(existing, updateUserDto);
    const updatedUser = await this.userRepository.save(existing);
    this.logger.log(`User updated: ${updatedUser.email}`);
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting user with ID: ${id}`);
    await this.userRepository.delete(id);
    this.logger.log(`User deleted`);
  }
}
