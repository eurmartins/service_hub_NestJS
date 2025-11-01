import { Client } from '../entities/client.entity';

export const CLIENT_REPOSITORY = Symbol('ClientRepository');

export interface ClientRepository {
  save(client: Client): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findByName(name: string): Promise<Client | null>;
  update(id: string, client: Partial<Client>): Promise<Client>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Client[]>;
}
