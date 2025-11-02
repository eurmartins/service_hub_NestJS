import { Rating } from '../entities/rating.entity';

export const RATING_REPOSITORY = Symbol('RatingRepository');

export interface RatingRepository {
  save(rating: Rating): Promise<Rating>;
  findById(id: string): Promise<Rating | null>;
  findByOrderId(orderId: string): Promise<Rating | null>;
  findByClientId(clientId: string): Promise<Rating[]>;
  findByProviderId(providerId: string): Promise<Rating[]>;
  findByScore(score: number): Promise<Rating[]>;
  update(id: string, rating: Partial<Rating>): Promise<Rating>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Rating[]>;
}
