import { ReadUserDto } from '../user/read-user.dto';

export class ReadClientDto {
  id: string;
  user: ReadUserDto;
  name: string;
}
