import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderServiceCreationFailedException extends HttpException {
  constructor(message: string = 'OrderService creation failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
