import { Provider } from '../entities/provider.entity';

export const PROVIDER_REPOSITORY = Symbol('ProviderRepository');

export interface ProviderRepository {
  save(provider: Provider): Promise<Provider>;
  findById(id: string): Promise<Provider | null>;
  findByProfDescription(prof_description: string): Promise<Provider | null>;
  update(id: string, provider: Partial<Provider>): Promise<Provider>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Provider[]>;
}
