import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderDeletionFailedException extends HttpException {
  constructor(message: string = 'Order deletion failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
