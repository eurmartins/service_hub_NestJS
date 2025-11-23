import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderCompletionDateNotFoundException extends HttpException {
  constructor(message: string = 'Order completion date not found') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
