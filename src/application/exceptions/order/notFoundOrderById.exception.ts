import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundOrderByIdException extends HttpException {
  constructor(message: string = 'Order not found by ID') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
