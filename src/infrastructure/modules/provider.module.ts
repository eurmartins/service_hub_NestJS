import { ProviderController } from './../controllers/provider.controller';
import { ProviderService } from './../../application/services/provider/provider.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from '../../domain/entities/provider.entity';
import { User } from '../../domain/entities/user.entity';
import { AppLoggerService } from '../../application/services/logger/logger.service';
import { ProviderRepositoryImpl } from '../repositories/provider.repository.impl';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';

import { PROVIDER_REPOSITORY } from '../../domain/repositories/provider.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Provider])],
  controllers: [ProviderController],
  providers: [
    AppLoggerService,
    ProviderService,
    {
      provide: PROVIDER_REPOSITORY,
      useClass: ProviderRepositoryImpl,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class ProviderModule {}
