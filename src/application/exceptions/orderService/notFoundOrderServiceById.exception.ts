import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundOrderServiceByIdException extends HttpException {
  constructor(message: string = 'OrderService not found by ID') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
