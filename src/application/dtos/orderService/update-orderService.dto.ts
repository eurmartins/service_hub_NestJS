import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderServiceDto } from './create-orderService.dto';

export class UpdateOrderServiceDto extends PartialType(CreateOrderServiceDto) {}
