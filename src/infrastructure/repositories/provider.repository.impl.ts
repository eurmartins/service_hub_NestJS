import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../../domain/entities/provider.entity';
import { ProviderRepository } from '../../domain/repositories/provider.repository';

@Injectable()
export class ProviderRepositoryImpl implements ProviderRepository {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async save(provider: Provider): Promise<Provider> {
    return this.providerRepository.save(provider);
  }

  async findById(id: string): Promise<Provider | null> {
    return this.providerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByProfDescription(
    prof_description: string,
  ): Promise<Provider | null> {
    return this.providerRepository
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.user', 'user')
      .where('provider._prof_description = :prof_description', {
        prof_description,
      })
      .getOne();
  }

  async update(id: string, provider: Partial<Provider>): Promise<Provider> {
    await this.providerRepository.update(id, provider);
    const updatedProvider = await this.findById(id);
    if (!updatedProvider) {
      throw new Error(`Provider with ID ${id} not found after update`);
    }
    return updatedProvider;
  }

  async delete(id: string): Promise<void> {
    await this.providerRepository.delete(id);
  }

  async findAll(): Promise<Provider[]> {
    return this.providerRepository.find({ relations: ['user'] });
  }
}
