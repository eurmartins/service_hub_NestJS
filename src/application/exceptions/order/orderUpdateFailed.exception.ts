import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderUpdateFailedException extends HttpException {
  constructor(message: string = 'Order update failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
