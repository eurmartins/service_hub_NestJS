import { Injectable, Inject } from '@nestjs/common';
import { Client } from '../../../domain/entities/client.entity';
import { CreateClientDto } from '../../dtos/client/create-client.dto';
import { UpdateClientDto } from '../../dtos/client/update-client.dto';
import { ReadClientDto } from '../../dtos/client/read-client.dto';
import { AppLoggerService } from '../logger/logger.service';
import type { ClientRepository } from '../../../domain/repositories/client.repository';
import { CLIENT_REPOSITORY } from '../../../domain/repositories/client.repository';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository';

@Injectable()
export class ClientService {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(ClientService.name);
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      this.logger.info(`Creating client with ID: ${createClientDto.id}`);

      const user = await this.userRepository.findById(createClientDto.id);
      if (!user) {
        throw new Error(`User with ID ${createClientDto.id} not found`);
      }

      const client = new Client();
      client.id = createClientDto.id;
      client.user = user;
      client.name = createClientDto.name;

      const savedClient = await this.clientRepository.save(client);

      this.logger.info(`Client created with ID: ${savedClient.id}`);

      return savedClient;
    } catch (error) {
      this.logger.error(`Error creating client with ID: ${createClientDto.id}`);
      throw error;
    }
  }

  async findAll(): Promise<ReadClientDto[]> {
    try {
      this.logger.info('Fetching all clients');

      const clients = await this.clientRepository.findAll();

      this.logger.info(`Found ${clients.length} clients`);

      return clients.map((client) => ({
        id: client.id,
        user: {
          id: client.user.id,
          email: client.user.email.toString(),
          ativo: client.user.ativo,
        },
        name: client.name,
      }));
    } catch (error) {
      this.logger.error(`Error fetching all clients. Error details: ${error}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<ReadClientDto | null> {
    try {
      this.logger.info(`Fetching client with ID: ${id}`);

      const client = await this.clientRepository.findById(id);

      if (client) {
        this.logger.info(`Client found: ${client.name}`);
        return {
          id: client.id,
          user: {
            id: client.user.id,
            email: client.user.email.toString(),
            ativo: client.user.ativo,
          },
          name: client.name,
        };
      } else {
        this.logger.error(`Client with ID ${id} not found`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error fetching client with ID ${id}. Error: ${error}`);
      throw error;
    }
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<Client | null> {
    try {
      this.logger.info(`Updating client with ID: ${id}`);

      const client = await this.clientRepository.findById(id);

      if (!client) return null;

      const updatedData: Partial<Client> = {};

      if (updateClientDto.name) {
        updatedData.name = updateClientDto.name;
      }

      const updatedClient = await this.clientRepository.update(id, updatedData);

      this.logger.info(`Client updated: ${updatedClient.name}`);

      return updatedClient;
    } catch (error) {
      this.logger.error(`Error updating client with ID ${id}. Error: ${error}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting client with ID: ${id}`);

      await this.clientRepository.delete(id);

      this.logger.info(`Client deleted`);
    } catch (error) {
      this.logger.error(`Error deleting client with ID ${id}. Error: ${error}`);
      throw error;
    }
  }
}
