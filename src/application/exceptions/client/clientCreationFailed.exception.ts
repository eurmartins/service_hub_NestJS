import { HttpException, HttpStatus } from '@nestjs/common';

export class ClientCreationFailedException extends HttpException {
  constructor(message: string = 'Failed to create client') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
