import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../domain/entities/client.entity';
import { User } from '../../domain/entities/user.entity';
import { AppLoggerService } from '../../application/services/logger/logger.service';
import { ClientService } from '../../application/services/client/client.service';
import { ClientController } from '../controllers/client.controller';
import { ClientRepositoryImpl } from '../repositories/client.repository.impl';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';

import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Client])],
  providers: [
    AppLoggerService,
    ClientService,
    {
      provide: CLIENT_REPOSITORY,
      useClass: ClientRepositoryImpl,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  controllers: [ClientController],
})
export class ClientModule {}
