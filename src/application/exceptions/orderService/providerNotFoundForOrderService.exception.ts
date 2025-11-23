import { HttpException, HttpStatus } from '@nestjs/common';

export class ProviderNotFoundForOrderServiceException extends HttpException {
  constructor(
    message: string = 'Provider not found for order service operation',
  ) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
