import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderAlreadyRatedException extends HttpException {
  constructor(message: string = 'This order has already been rated') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
