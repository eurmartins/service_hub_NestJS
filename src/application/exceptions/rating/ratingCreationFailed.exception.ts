import { HttpException, HttpStatus } from '@nestjs/common';

export class RatingCreationFailedException extends HttpException {
  constructor(message: string = 'Rating creation failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
