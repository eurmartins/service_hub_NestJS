import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderServiceDeletionFailedException extends HttpException {
  constructor(message: string = 'OrderService deletion failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
