import { HttpException, HttpStatus } from '@nestjs/common';

export class RatingDeletionFailedException extends HttpException {
  constructor(message: string = 'Rating deletion failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
