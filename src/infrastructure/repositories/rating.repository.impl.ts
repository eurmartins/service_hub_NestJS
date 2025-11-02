import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../../domain/entities/rating.entity';
import { RatingRepository } from '../../domain/repositories/rating.repository';

@Injectable()
export class RatingRepositoryImpl implements RatingRepository {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async save(rating: Rating): Promise<Rating> {
    return this.ratingRepository.save(rating);
  }

  async findById(id: string): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: { id },
      relations: ['order', 'client', 'provider'],
    });
  }

  async findByOrderId(orderId: string): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: { orderId },
      relations: ['order', 'client', 'provider'],
    });
  }

  async findByClientId(clientId: string): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { clientId },
      relations: ['order', 'client', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProviderId(providerId: string): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { providerId },
      relations: ['order', 'client', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByScore(score: number): Promise<Rating[]> {
    return this.ratingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.order', 'order')
      .leftJoinAndSelect('rating.client', 'client')
      .leftJoinAndSelect('rating.provider', 'provider')
      .where('rating._score = :score', { score })
      .orderBy('rating.createdAt', 'DESC')
      .getMany();
  }

  async update(id: string, rating: Partial<Rating>): Promise<Rating> {
    await this.ratingRepository.update(id, rating);
    const updatedRating = await this.findById(id);
    if (!updatedRating) {
      throw new Error(`Rating with ID ${id} not found after update`);
    }
    return updatedRating;
  }

  async delete(id: string): Promise<void> {
    await this.ratingRepository.delete(id);
  }

  async findAll(): Promise<Rating[]> {
    return this.ratingRepository.find({
      relations: ['order', 'client', 'provider'],
      order: { createdAt: 'DESC' },
    });
  }
}
