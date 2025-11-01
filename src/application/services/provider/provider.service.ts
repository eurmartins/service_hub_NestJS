import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Provider } from '../../../domain/entities/provider.entity';
import { CreateProviderDto } from '../../dtos/provider/create-provider.dto';
import { UpdateProviderDto } from '../../dtos/provider/update-provider.dto';
import { ReadProviderDto } from '../../dtos/provider/read-provider.dto';
import { AppLoggerService } from '../logger/logger.service';
import { ProfDescription } from '../../../domain/values-objects/provider.values-objects/profdescription.values-objects';
import type { ProviderRepository } from '../../../domain/repositories/provider.repository';
import { PROVIDER_REPOSITORY } from '../../../domain/repositories/provider.repository';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository';

@Injectable()
export class ProviderService {
  constructor(
    @Inject(PROVIDER_REPOSITORY)
    private readonly providerRepository: ProviderRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(ProviderService.name);
  }

  async create(createProviderDto: CreateProviderDto): Promise<Provider> {
    try {
      this.logger.info(`Creating provider with name: ${createProviderDto.id}`);

      const user = await this.userRepository.findById(createProviderDto.id);
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

      const providers = await this.providerRepository.findAll();

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

      const provider = await this.providerRepository.findById(id);

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

      const provider = await this.providerRepository.findById(id);

      if (!provider) return null;

      if (updateProviderDto.name) {
        provider.name = updateProviderDto.name;
      }

      if (updateProviderDto.prof_description) {
        provider.prof_description = new ProfDescription(
          updateProviderDto.prof_description,
        );
      }

      const updatedProvider = await this.providerRepository.update(
        id,
        provider,
      );

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
