import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../domain/entities/client.entity';
import { ClientRepository } from '../../domain/repositories/client.repository';

@Injectable()
export class ClientRepositoryImpl implements ClientRepository {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async save(client: Client): Promise<Client> {
    return this.clientRepository.save(client);
  }

  async findById(id: string): Promise<Client | null> {
    return this.clientRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByName(name: string): Promise<Client | null> {
    return this.clientRepository.findOne({
      where: { name },
      relations: ['user'],
    });
  }

  async update(id: string, client: Partial<Client>): Promise<Client> {
    await this.clientRepository.update(id, client);
    const updatedClient = await this.findById(id);
    if (!updatedClient) {
      throw new Error(`Client with ID ${id} not found after update`);
    }
    return updatedClient;
  }

  async delete(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({ relations: ['user'] });
  }
}
