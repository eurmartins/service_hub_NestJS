import { HttpException, HttpStatus } from '@nestjs/common';

export class ClientNotAuthorizedToRateException extends HttpException {
  constructor(
    message: string = 'Only the client who made the order can rate it',
  ) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
