import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../domain/entities/user.entity';
import { Client } from 'src/domain/entities/client.entity';
import { Provider } from 'src/domain/entities/provider.entity';
import { OrderService } from 'src/domain/entities/orderService.entity';
import { Order } from 'src/domain/entities/order.entity';
import { Rating } from 'src/domain/entities/rating.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get('URL_DB'),
        entities: [User, Client, Provider, OrderService, Order, Rating],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
