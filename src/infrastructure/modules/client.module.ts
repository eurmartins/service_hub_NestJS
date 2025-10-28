import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../domain/entities/client.entity';
import { User } from '../../domain/entities/user.entity';
import { AppLoggerService } from '../../application/services/logger/logger.service';
import { ClientService } from '../../application/services/client/client.service';
import { ClientController } from '../controllers/client.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Client])],
  providers: [AppLoggerService, ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
