import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '../../dtos/user/create-user.dto';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';
import { ReadUserDto } from '../../dtos/user/read-user.dto';
import { HashService } from './hash.service';
import { AppLoggerService } from '../logger/logger.service';
import { Email } from '../../../domain/values-objects/user.values-objects/email.values-objects';
import { HashPassword } from '../../../domain/values-objects/user.values-objects/hashpassword.values-objects';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.info(`Creating user with email: ${createUserDto.email}`);

      const user = new User();
      user.email = new Email(createUserDto.email);
      const hashed = await this.hashService.hash(createUserDto.hashSenha);
      user.hashPassword = new HashPassword(hashed);

      const savedUser = await this.userRepository.create(user);

      this.logger.info(`User created with ID: ${savedUser.id}`);

      return savedUser;
    } catch (error) {
      this.logger.error(
        `Error creating user with email: ${createUserDto.email}`,
      );
      throw error;
    }
  }

  async findAll(): Promise<ReadUserDto[]> {
    try {
      this.logger.info('Fetching all users');

      const users = await this.userRepository.findAll();

      this.logger.info(`Found ${users.length} users`);

      return users.map((user) => ({
        id: user.id,
        email: user.email.toString(),
        ativo: user.ativo,
      }));
    } catch (error) {
      this.logger.error(`Error to fetch all users. Error details: ${error}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<ReadUserDto | null> {
    try {
      this.logger.info(`Fetching user with ID: ${id}`);

      const user = await this.userRepository.findById(id);

      if (user) {
        this.logger.info(`User found: ${user.email.toString()}`);
        return {
          id: user.id,
          email: user.email.toString(),
          ativo: user.ativo,
        };
      } else {
        this.logger.error(`User with ID ${id} not found`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${id}. Error: ${error}`);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      this.logger.info(`Updating user with ID: ${id}`);

      const user = await this.userRepository.findById(id);

      if (!user) return null;

      if (updateUserDto.email) {
        user.email = new Email(updateUserDto.email);
      }

      if (updateUserDto.hashSenha) {
        const hashed = await this.hashService.hash(updateUserDto.hashSenha);
        user.hashPassword = new HashPassword(hashed);
      }

      const updatedUser = await this.userRepository.update(user);

      this.logger.info(`User updated: ${updatedUser.email.toString()}`);

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
