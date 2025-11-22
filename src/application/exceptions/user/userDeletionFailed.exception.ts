import { HttpException, HttpStatus } from '@nestjs/common';

export class UserDeletionFailedException extends HttpException {
  constructor(message: string = 'Failed to delete user') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
