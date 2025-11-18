import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    const created = await this.userRepository.save(user);
    return created;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user._email = :email', { email })
      .getOne();
  }

  async update(user: User): Promise<User> {
    await this.userRepository.update(user.id, user);
    const updated = await this.findById(user.id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
