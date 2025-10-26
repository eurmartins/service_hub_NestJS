import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('AppLogger');
  }

  setContext(context: string) {
    this.logger = new Logger(context);
  }

  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  info(message: string) {
    this.logger.log(this.format('INFO', message));
  }

  error(message: string, trace?: string) {
    this.logger.error(this.format('ERROR', message), trace);
  }

  warn(message: string) {
    this.logger.warn(this.format('WARN', message));
  }

  debug(message: string) {
    this.logger.debug(this.format('DEBUG', message));
  }
}
