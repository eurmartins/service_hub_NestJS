import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './infrastructure/modules/client.module';
import { UserModule } from './infrastructure/modules/user.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { LoggerModule } from './infrastructure/modules/global/logger.module';
import { ProviderModule } from './infrastructure/modules/provider.module';
import { OrderServiceModule } from './infrastructure/modules/orderService.module';
import { OrderModule } from './infrastructure/modules/order.module';
import { RatingModule } from './infrastructure/modules/rating.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UserModule,
    LoggerModule,
    ClientModule,
    ProviderModule,
    OrderServiceModule,
    OrderModule,
    RatingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
