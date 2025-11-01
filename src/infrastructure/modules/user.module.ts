import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserService } from '../../application/services/user/user.service';
import { HashService } from '../../application/services/user/hash.service';
import { UserController } from '../controllers/user.controller';
import { AppLoggerService } from '../../application/services/logger/logger.service';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    HashService,
    AppLoggerService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
