import { HttpException, HttpStatus } from '@nestjs/common';

export class ClientDeletionFailedException extends HttpException {
  constructor(message: string = 'Failed to delete client') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
