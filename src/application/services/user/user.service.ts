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
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.info(`Creating user with email: ${createUserDto.email}`);

      const user = new User();
      Object.assign(user, createUserDto);
      user.hashSenha = await this.hashService.hash(createUserDto.hashSenha);
      const savedUser = await this.userRepository.save(user);

      this.logger.info(`User created with ID: ${savedUser.id}`);

      return savedUser;
    } catch (error) {
      this.logger.error(
        `Error creating user with email: ${createUserDto.email}`,
      );
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      this.logger.info('Fetching all users');

      const users = await this.userRepository.find();

      this.logger.info(`Found ${users.length} users`);

      return users;
    } catch (error) {
      this.logger.error(`Error to fetch all users. Error details: ${error}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      this.logger.info(`Fetching user with ID: ${id}`);

      const user = await this.userRepository.findOneBy({ id });

      if (user) {
        this.logger.info(`User found: ${user.email}`);
      } else {
        this.logger.error(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${id}. Error: ${error}`);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      this.logger.info(`Updating user with ID: ${id}`);

      const user_existing = await this.findOne(id);

      if (!user_existing) return null;

      Object.assign(user_existing, updateUserDto);
      const updatedUser = await this.userRepository.save(user_existing);

      this.logger.info(`User updated: ${updatedUser.email}`);

      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id}. Error: ${error}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting user with ID: ${id}`);

      await this.userRepository.delete(id);

      this.logger.info(`User deleted`);
    } catch (error) {
      this.logger.error(`Error deleting user with ID ${id}. Error: ${error}`);
      throw error;
    }
  }
}
