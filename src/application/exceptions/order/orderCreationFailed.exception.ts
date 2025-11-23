import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderCreationFailedException extends HttpException {
  constructor(message: string = 'Order creation failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
