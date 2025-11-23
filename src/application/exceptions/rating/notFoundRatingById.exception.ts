import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundRatingByIdException extends HttpException {
  constructor(message: string = 'Rating not found by ID') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
