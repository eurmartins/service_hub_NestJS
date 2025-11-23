import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../domain/entities/order.entity';
import { Client } from '../../domain/entities/client.entity';
import { Provider } from '../../domain/entities/provider.entity';
import { OrderService } from '../../domain/entities/orderService.entity';
import { AppLoggerService } from '../../application/services/logger/logger.service';
import { OrderService as OrderApplicationService } from '../../application/services/order/order.service';
import { OrderController } from '../controllers/order.controller';
import { OrderRepositoryImpl } from '../repositories/order.repository.impl';
import { ORDER_REPOSITORY } from '../../domain/repositories/order.repository';
import { OrderServiceRepositoryImpl } from '../repositories/orderService.repository.impl';
import { ORDER_SERVICE_REPOSITORY } from '../../domain/repositories/orderService.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Client, Provider, OrderService])],
  providers: [
    AppLoggerService,
    OrderApplicationService,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepositoryImpl,
    },
    {
      provide: ORDER_SERVICE_REPOSITORY,
      useClass: OrderServiceRepositoryImpl,
    },
  ],
  controllers: [OrderController],
})
export class OrderModule {}
