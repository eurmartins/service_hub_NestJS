import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundProviderByIdException extends HttpException {
  constructor(message: string = 'Provider not found by ID') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
