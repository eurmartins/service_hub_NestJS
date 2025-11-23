import { HttpException, HttpStatus } from '@nestjs/common';

export class ProviderIdMismatchException extends HttpException {
  constructor(
    message: string = 'Provider ID does not match the order provider',
  ) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
