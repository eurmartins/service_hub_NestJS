import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '../../domain/entities/rating.entity';
import { Client } from '../../domain/entities/client.entity';
import { Provider } from '../../domain/entities/provider.entity';
import { Order } from '../../domain/entities/order.entity';
import { AppLoggerService } from '../../application/services/logger/logger.service';
import { RatingService } from '../../application/services/rating/rating.service';
import { RatingController } from '../controllers/rating.controller';
import { RatingRepositoryImpl } from '../repositories/rating.repository.impl';
import { RATING_REPOSITORY } from '../../domain/repositories/rating.repository';
import { OrderRepositoryImpl } from '../repositories/order.repository.impl';
import { ORDER_REPOSITORY } from '../../domain/repositories/order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Client, Provider, Order])],
  providers: [
    AppLoggerService,
    RatingService,
    {
      provide: RATING_REPOSITORY,
      useClass: RatingRepositoryImpl,
    },
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepositoryImpl,
    },
  ],
  controllers: [RatingController],
})
export class RatingModule {}
