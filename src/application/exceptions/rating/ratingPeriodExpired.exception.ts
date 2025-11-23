import { HttpException, HttpStatus } from '@nestjs/common';

export class RatingPeriodExpiredException extends HttpException {
  constructor(
    message: string = 'Rating period expired. Orders can only be rated within 30 days of completion',
  ) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
