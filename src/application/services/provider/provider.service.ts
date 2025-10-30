import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../../../domain/entities/provider.entity';
import { User } from '../../../domain/entities/user.entity';
import { CreateProviderDto } from '../../dtos/provider/create-provider.dto';
import { UpdateProviderDto } from '../../dtos/provider/update-provider.dto';
import { ReadProviderDto } from '../../dtos/provider/read-provider.dto';
import { AppLoggerService } from '../logger/logger.service';
import { ProfDescription } from '../../../domain/values-objects/provider.values-objects/profdescription.values-objects';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(ProviderService.name);
  }

  async create(createProviderDto: CreateProviderDto): Promise<Provider> {
    try {
      this.logger.info(`Creating provider with name: ${createProviderDto.id}`);

      const user = await this.userRepository.findOneBy({
        id: createProviderDto.id,
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const provider = new Provider();
      provider.id = createProviderDto.id;
      provider.user = user;
      provider.name = createProviderDto.name;
      provider.prof_description = new ProfDescription(
        createProviderDto.prof_description,
      );

      const savedProvider = await this.providerRepository.save(provider);

      this.logger.info(`Provider created with ID: ${savedProvider.id}`);

      return savedProvider;
    } catch (error) {
      this.logger.error(
        `Error creating provider with name: ${createProviderDto.name}`,
      );
      throw error;
    }
  }

  async findAll(): Promise<ReadProviderDto[]> {
    try {
      this.logger.info('Fetching all providers');

      const providers = await this.providerRepository.find({
        relations: ['user'],
      });

      this.logger.info(`Found ${providers.length} providers`);

      return providers.map((provider) => ({
        id: provider.id,
        user: {
          id: provider.user.id,
          email: provider.user.email.toString(),
          ativo: provider.user.ativo,
        },
        name: provider.name,
        prof_description: provider.prof_description.value,
      }));
    } catch (error) {
      this.logger.error(`Error fetching all providers. 
        Error details: ${error}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<ReadProviderDto | null> {
    try {
      this.logger.info(`Fetching provider with ID: ${id}`);

      const provider = await this.providerRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (provider) {
        this.logger.info(`Provider found: ${provider.name}`);
        return {
          id: provider.id,
          user: {
            id: provider.user.id,
            email: provider.user.email.toString(),
            ativo: provider.user.ativo,
          },
          name: provider.name,
          prof_description: provider.prof_description.value,
        };
      } else {
        this.logger.error(`Provider with ID ${id} not found`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error fetching provider with ID ${id}. 
        Error: ${error}`);
      throw error;
    }
  }

  async update(
    id: string,
    updateProviderDto: UpdateProviderDto,
  ): Promise<Provider | null> {
    try {
      this.logger.info(`Updating provider with ID: ${id}`);

      const provider = await this.providerRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!provider) return null;

      if (updateProviderDto.name) {
        provider.name = updateProviderDto.name;
      }

      if (updateProviderDto.prof_description) {
        provider.prof_description = new ProfDescription(
          updateProviderDto.prof_description,
        );
      }

      const updatedProvider = await this.providerRepository.save(provider);

      this.logger.info(`Provider updated: ${updatedProvider.name}`);

      return updatedProvider;
    } catch (error) {
      this.logger.error(`Error updating provider with ID ${id}. 
        Error: ${error}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting provider with ID: ${id}`);

      await this.providerRepository.delete(id);

      this.logger.info(`Provider deleted`);
    } catch (error) {
      this.logger.error(`Error deleting provider with ID ${id}. 
        Error: ${error}`);
      throw error;
    }
  }
}
