import { HttpException, HttpStatus } from '@nestjs/common';

export class ProviderCreationFailedException extends HttpException {
  constructor(message: string = 'Provider creation failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
