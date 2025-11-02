import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Rating } from '../../../domain/entities/rating.entity';
import { CreateRatingDto } from '../../dtos/rating/create-rating.dto';
import { ReadRatingDto } from '../../dtos/rating/read-rating.dto';
import { UpdateRatingDto } from '../../dtos/rating/update-rating.dto';
import { AppLoggerService } from '../logger/logger.service';
import type { RatingRepository } from '../../../domain/repositories/rating.repository';
import { RATING_REPOSITORY } from '../../../domain/repositories/rating.repository';
import type { OrderRepository } from '../../../domain/repositories/order.repository';
import { ORDER_REPOSITORY } from '../../../domain/repositories/order.repository';
import { Score } from '../../../domain/values-objects/rating.values-objects/score';
import { Comment } from '../../../domain/values-objects/rating.values-objects/comment';
import { OrderStatusEnum } from '../../../domain/entities/enums/status.enum';

@Injectable()
export class RatingService {
  constructor(
    @Inject(RATING_REPOSITORY)
    private readonly ratingRepository: RatingRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(RatingService.name);
  }

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    try {
      this.logger.info('Creating rating');
      this.logger.debug(`Rating data: ${JSON.stringify(createRatingDto)}`);

      const order = await this.orderRepository.findById(
        createRatingDto.orderId,
      );

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      this.logger.debug(
        `Order found: ${JSON.stringify({
          id: order.id,
          status: order.status,
          clientId: order.clientId,
          providerId: order.providerId,
          completedAt: order.completedAt,
        })}`,
      );

      if (order.status !== OrderStatusEnum.COMPLETED) {
        throw new BadRequestException(
          'Rating can only be created for COMPLETED orders',
        );
      }

      if (order.clientId !== createRatingDto.clientId) {
        throw new BadRequestException(
          'Only the client who made the order can rate it',
        );
      }

      const existingRating = await this.ratingRepository.findByOrderId(
        createRatingDto.orderId,
      );

      if (existingRating) {
        throw new BadRequestException('This order has already been rated');
      }

      if (!order.completedAt) {
        throw new BadRequestException('Order completion date not found');
      }

      if (!Rating.canRateOrder(order.completedAt)) {
        throw new BadRequestException(
          'Rating period expired. Orders can only be rated within 30 days of completion',
        );
      }

      if (order.providerId !== createRatingDto.providerId) {
        throw new BadRequestException(
          'Provider ID does not match the order provider',
        );
      }

      const rating = new Rating();
      rating.orderId = createRatingDto.orderId;
      rating.clientId = createRatingDto.clientId;
      rating.providerId = createRatingDto.providerId;
      rating.score = Score.create(createRatingDto.score);

      if (createRatingDto.comment) {
        rating.comment = Comment.create(createRatingDto.comment);
      } else {
        rating.comment = null;
      }

      const savedRating = await this.ratingRepository.save(rating);

      this.logger.info(`Rating created with ID: ${savedRating.id}`);

      return savedRating;
    } catch (error) {
      this.logger.error(
        'Error creating rating',
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async findAll(): Promise<ReadRatingDto[]> {
    try {
      this.logger.info('Fetching all ratings');

      const ratings = await this.ratingRepository.findAll();

      this.logger.info(`Found ${ratings.length} ratings`);

      return ratings.map((rating) => this.mapToReadDto(rating));
    } catch (error) {
      this.logger.error(
        'Error fetching all ratings',
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<ReadRatingDto | null> {
    try {
      this.logger.info(`Fetching rating with ID: ${id}`);

      const rating = await this.ratingRepository.findById(id);

      if (rating) {
        this.logger.info(`Rating found: ${rating.id}`);
        return this.mapToReadDto(rating);
      } else {
        this.logger.error(`Rating with ID ${id} not found`);
        return null;
      }
    } catch (error) {
      this.logger.error(
        `Error fetching rating with ID ${id}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async findByOrderId(orderId: string): Promise<ReadRatingDto | null> {
    try {
      this.logger.info(`Fetching rating for order ID: ${orderId}`);

      const rating = await this.ratingRepository.findByOrderId(orderId);

      if (rating) {
        this.logger.info(`Rating found for order: ${orderId}`);
        return this.mapToReadDto(rating);
      } else {
        this.logger.info(`No rating found for order: ${orderId}`);
        return null;
      }
    } catch (error) {
      this.logger.error(
        `Error fetching rating for order ID ${orderId}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async findByClientId(clientId: string): Promise<ReadRatingDto[]> {
    try {
      this.logger.info(`Fetching ratings by client ID: ${clientId}`);

      const ratings = await this.ratingRepository.findByClientId(clientId);

      this.logger.info(
        `Found ${ratings.length} ratings for client ${clientId}`,
      );

      return ratings.map((rating) => this.mapToReadDto(rating));
    } catch (error) {
      this.logger.error(
        `Error fetching ratings for client ID ${clientId}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async findByProviderId(providerId: string): Promise<ReadRatingDto[]> {
    try {
      this.logger.info(`Fetching ratings by provider ID: ${providerId}`);

      const ratings = await this.ratingRepository.findByProviderId(providerId);

      this.logger.info(
        `Found ${ratings.length} ratings for provider ${providerId}`,
      );

      return ratings.map((rating) => this.mapToReadDto(rating));
    } catch (error) {
      this.logger.error(
        `Error fetching ratings for provider ID ${providerId}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async update(id: string, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    try {
      this.logger.info(`Updating rating with ID: ${id}`);

      const rating = await this.ratingRepository.findById(id);

      if (!rating) {
        throw new BadRequestException('Rating not found');
      }

      if (updateRatingDto.score !== undefined) {
        rating.score = Score.create(updateRatingDto.score);
      }

      if (updateRatingDto.comment !== undefined) {
        if (updateRatingDto.comment) {
          rating.comment = Comment.create(updateRatingDto.comment);
        } else {
          rating.comment = null;
        }
      }

      const updatedRating = await this.ratingRepository.save(rating);

      this.logger.info(`Rating updated: ${updatedRating.id}`);

      return updatedRating;
    } catch (error) {
      this.logger.error(
        `Error updating rating with ID ${id}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting rating with ID: ${id}`);

      const rating = await this.ratingRepository.findById(id);

      if (!rating) {
        throw new BadRequestException('Rating not found');
      }

      await this.ratingRepository.delete(id);

      this.logger.info('Rating deleted');
    } catch (error) {
      this.logger.error(
        `Error deleting rating with ID ${id}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async getProviderAverageRating(providerId: string): Promise<number> {
    try {
      this.logger.info(
        `Calculating average rating for provider ID: ${providerId}`,
      );

      const ratings = await this.ratingRepository.findByProviderId(providerId);

      if (ratings.length === 0) {
        return 0;
      }

      const sum = ratings.reduce(
        (acc, rating) => acc + rating.score.toNumber(),
        0,
      );
      const average = sum / ratings.length;

      this.logger.info(
        `Average rating for provider ${providerId}: ${average.toFixed(2)}`,
      );

      return Number(average.toFixed(2));
    } catch (error) {
      this.logger.error(
        `Error calculating average rating for provider ID ${providerId}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  private mapToReadDto(rating: Rating): ReadRatingDto {
    return {
      id: rating.id,
      orderId: rating.orderId,
      clientId: rating.clientId,
      providerId: rating.providerId,
      score: rating.score.toNumber(),
      comment: rating.comment ? rating.comment.toString() : null,
      createdAt: rating.createdAt,
      order:
        rating.order && rating.order.client && rating.order.client.user
          ? {
              id: rating.order.id,
              clientId: rating.order.clientId,
              serviceId: rating.order.serviceId,
              providerId: rating.order.providerId,
              chargedAmount: rating.order.chargedAmount.toNumber(),
              status: rating.order.status,
              createdAt: rating.order.createdAt,
              completedAt: rating.order.completedAt,
              client: {
                id: rating.order.client.id,
                name: rating.order.client.name,
                user: {
                  id: rating.order.client.user.id,
                  email: rating.order.client.user.email.toString(),
                  ativo: rating.order.client.user.ativo,
                },
              },
            }
          : undefined,
      client:
        rating.client && rating.client.user
          ? {
              id: rating.client.id,
              name: rating.client.name,
              user: {
                id: rating.client.user.id,
                email: rating.client.user.email.toString(),
                ativo: rating.client.user.ativo,
              },
            }
          : undefined,
      provider:
        rating.provider && rating.provider.user
          ? {
              id: rating.provider.id,
              name: rating.provider.name,
              prof_description: rating.provider.prof_description.value,
              user: {
                id: rating.provider.user.id,
                email: rating.provider.user.email.toString(),
                ativo: rating.provider.user.ativo,
              },
            }
          : undefined,
    };
  }
}
