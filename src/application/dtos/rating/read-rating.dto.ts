import {
  IsUUID,
  IsInt,
  Min,
  Max,
  IsString,
  IsOptional,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReadClientDto } from '../client/read-client.dto';
import { ReadProviderDto } from '../provider/read-provider.dto';
import { ReadOrderDto } from '../order/read-order.dto';

export class ReadRatingDto {
  @IsUUID()
  id: string;

  @IsUUID()
  orderId: string;

  @IsUUID()
  clientId: string;

  @IsUUID()
  providerId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @IsOptional()
  @IsString()
  comment?: string | null;

  @IsDateString()
  createdAt: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadOrderDto)
  order?: ReadOrderDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadClientDto)
  client?: ReadClientDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReadProviderDto)
  provider?: ReadProviderDto;
}
