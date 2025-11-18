import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserService } from '../../application/services/user/user.service';
import { HashService } from '../../application/services/user/hash.service';
import { UserController } from '../controllers/user.controller';
import { AppLoggerService } from '../../application/services/logger/logger.service';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
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
  exports: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    HashService,
  ],
})
export class UserModule {}
