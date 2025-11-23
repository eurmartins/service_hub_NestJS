import { HttpException, HttpStatus } from '@nestjs/common';

export class ProviderUpdateFailedException extends HttpException {
  constructor(message: string = 'Provider update failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
