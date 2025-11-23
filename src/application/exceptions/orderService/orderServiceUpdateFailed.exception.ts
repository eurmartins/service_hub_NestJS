import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderServiceUpdateFailedException extends HttpException {
  constructor(message: string = 'OrderService update failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
