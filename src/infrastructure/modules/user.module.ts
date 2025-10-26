import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserService } from '../../application/services/user/user.service';
import { HashService } from '../../application/services/user/hash.service';
import { UserController } from '../controllers/user.controller';
import { AppLoggerService } from '../../application/services/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, HashService, AppLoggerService],
  controllers: [UserController],
})
export class UserModule {}
