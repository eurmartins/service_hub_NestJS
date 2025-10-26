import { Module, Global } from '@nestjs/common';
import { AppLoggerService } from '../../../application/services/logger/logger.service';

@Global()
@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
