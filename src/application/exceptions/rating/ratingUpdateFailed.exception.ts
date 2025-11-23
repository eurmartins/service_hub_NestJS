import { HttpException, HttpStatus } from '@nestjs/common';

export class RatingUpdateFailedException extends HttpException {
  constructor(message: string = 'Rating update failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
