import { HttpException, HttpStatus } from '@nestjs/common';

export class UserUpdateFailedException extends HttpException {
  constructor(message: string = 'Failed to update user') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
