import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger('AppLogger');

  info(message: string) {
    this.logger.log(`[INFO] ${message}`);
  }

  error(message: string, trace?: string) {
    this.logger.error(`[ERROR] ${message}`, trace);
  }

  debug(message: string) {
    this.logger.debug(`[DEBUG] ${message}`);
  }
}
