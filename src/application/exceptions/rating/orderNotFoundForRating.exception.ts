import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderNotFoundForRatingException extends HttpException {
  constructor(message: string = 'Order not found for rating') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
