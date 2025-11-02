import { IsUUID, IsInt, Min, Max, IsString, IsOptional } from 'class-validator';

export class CreateRatingDto {
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
  comment?: string;
}
