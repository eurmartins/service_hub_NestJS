import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundUserByIdException extends HttpException {
  constructor(message: string = 'User not found by ID') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
