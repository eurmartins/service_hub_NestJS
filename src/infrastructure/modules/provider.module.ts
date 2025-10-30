import { ProviderController } from './../controllers/provider.controller';
import { ProviderService } from './../../application/services/provider/provider.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from '../../domain/entities/provider.entity';
import { User } from '../../domain/entities/user.entity';
import { AppLoggerService } from '../../application/services/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Provider])],
  controllers: [ProviderController],
  providers: [AppLoggerService, ProviderService],
})
export class ProviderModule {}
