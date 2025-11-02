import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RatingService } from '../../application/services/rating/rating.service';
import { CreateRatingDto } from '../../application/dtos/rating/create-rating.dto';
import { ReadRatingDto } from '../../application/dtos/rating/read-rating.dto';
import { UpdateRatingDto } from '../../application/dtos/rating/update-rating.dto';
import { Rating } from '../../domain/entities/rating.entity';

@Controller('/api/v1/ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async create(@Body() createRatingDto: CreateRatingDto): Promise<Rating> {
    return this.ratingService.create(createRatingDto);
  }

  @Get()
  async findAll(): Promise<ReadRatingDto[]> {
    return this.ratingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadRatingDto | null> {
    return this.ratingService.findOne(id);
  }

  @Get('order/:orderId')
  async findByOrderId(
    @Param('orderId') orderId: string,
  ): Promise<ReadRatingDto | null> {
    return this.ratingService.findByOrderId(orderId);
  }

  @Get('client/:clientId')
  async findByClientId(
    @Param('clientId') clientId: string,
  ): Promise<ReadRatingDto[]> {
    return this.ratingService.findByClientId(clientId);
  }

  @Get('provider/:providerId')
  async findByProviderId(
    @Param('providerId') providerId: string,
  ): Promise<ReadRatingDto[]> {
    return this.ratingService.findByProviderId(providerId);
  }

  @Get('provider/:providerId/average')
  async getProviderAverageRating(
    @Param('providerId') providerId: string,
  ): Promise<{ average: number }> {
    const average =
      await this.ratingService.getProviderAverageRating(providerId);
    return { average };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    return this.ratingService.update(id, updateRatingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.ratingService.remove(id);
  }
}
