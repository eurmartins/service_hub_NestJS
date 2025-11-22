import { HttpException, HttpStatus } from '@nestjs/common';

export class UserCreationFailedException extends HttpException {
  constructor(message: string = 'Failed to create user') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
