import { HttpException, HttpStatus } from '@nestjs/common';

export class ProviderDeletionFailedException extends HttpException {
  constructor(message: string = 'Provider deletion failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
