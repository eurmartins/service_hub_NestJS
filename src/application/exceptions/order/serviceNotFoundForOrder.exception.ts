import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceNotFoundForOrderException extends HttpException {
  constructor(message: string = 'Service not found for order creation') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
