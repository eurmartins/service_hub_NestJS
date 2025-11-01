import {
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { StatusEnum } from 'src/domain/entities/enums/status.enum';

export class CreateServiceProvisionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsUUID()
  providerId: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}
