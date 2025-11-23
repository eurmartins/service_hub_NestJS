import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderNotCompletedException extends HttpException {
  constructor(
    message: string = 'Rating can only be created for COMPLETED orders',
  ) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
