import { HttpException, HttpStatus } from '@nestjs/common';

export class ClientUpdateFailedException extends HttpException {
  constructor(message: string = 'Failed to update client') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
