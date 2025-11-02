import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from 'src/domain/entities/orderService.entity';
import { Provider } from 'src/domain/entities/provider.entity';
import { Order } from 'src/domain/entities/order.entity';
import { OrderServiceService } from 'src/application/services/orderService/orderService.service';
import { OrderServiceController } from '../controllers/orderService.controller';
import { AppLoggerService } from 'src/application/services/logger/logger.service';
import { ORDER_SERVICE_REPOSITORY } from 'src/domain/repositories/orderService.repository';
import { OrderServiceRepositoryImpl } from '../repositories/orderService.repository.impl';
import { PROVIDER_REPOSITORY } from 'src/domain/repositories/provider.repository';
import { ProviderRepositoryImpl } from '../repositories/provider.repository.impl';
import { ORDER_REPOSITORY } from 'src/domain/repositories/order.repository';
import { OrderRepositoryImpl } from '../repositories/order.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderService, Provider, Order]),
  ],
  providers: [
    AppLoggerService,
    OrderServiceService,
    {
      provide: ORDER_SERVICE_REPOSITORY,
      useClass: OrderServiceRepositoryImpl,
    },
    {
      provide: PROVIDER_REPOSITORY,
      useClass: ProviderRepositoryImpl,
    },
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepositoryImpl,
    },
  ],
  controllers: [OrderServiceController],
})
export class OrderServiceModule {}
