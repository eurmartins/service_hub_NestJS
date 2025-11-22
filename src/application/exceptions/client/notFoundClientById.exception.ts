import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundClientByIdException extends HttpException {
  constructor(message: string = 'Client not found by ID') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
