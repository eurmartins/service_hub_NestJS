import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceNotActiveException extends HttpException {
  constructor(message: string = 'Service must be ACTIVE to be contracted') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
