import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RatingService } from '../../application/services/rating/rating.service';
import { CreateRatingDto } from '../../application/dtos/rating/create-rating.dto';
import { ReadRatingDto } from '../../application/dtos/rating/read-rating.dto';
import { UpdateRatingDto } from '../../application/dtos/rating/update-rating.dto';
import { Rating } from '../../domain/entities/rating.entity';

@ApiTags('Ratings')
@ApiBearerAuth('Bearer')
@Controller('/api/v1/ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({
    summary: 'Create new rating',
    description:
      'Creates a new rating for a service with a score of 1 to 5 and optional comment',
  })
  @ApiBody({ type: CreateRatingDto })
  @ApiResponse({
    status: 201,
    description: 'Rating created successfully',
    type: ReadRatingDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or IDs not found',
  })
  @Post()
  async create(@Body() createRatingDto: CreateRatingDto): Promise<Rating> {
    return this.ratingService.create(createRatingDto);
  }

  @ApiOperation({
    summary: 'List all ratings',
    description: 'Returns a list of all registered ratings',
  })
  @ApiResponse({
    status: 200,
    description: 'Rating list returned successfully',
    type: [ReadRatingDto],
  })
  @Get()
  async findAll(): Promise<ReadRatingDto[]> {
    return this.ratingService.findAll();
  }

  @ApiOperation({
    summary: 'Get rating by ID',
    description: 'Returns the detailed data of a specific rating',
  })
  @ApiParam({
    name: 'id',
    description: 'Rating unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Rating found',
    type: ReadRatingDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Rating not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadRatingDto | null> {
    return this.ratingService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get rating by order ID',
    description: 'Returns the rating associated with a specific order',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Rating found',
    type: ReadRatingDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Rating not found',
  })
  @Get('order/:orderId')
  async findByOrderId(
    @Param('orderId') orderId: string,
  ): Promise<ReadRatingDto | null> {
    return this.ratingService.findByOrderId(orderId);
  }

  @ApiOperation({
    summary: 'Get client ratings',
    description: 'Returns all ratings created by a specific client',
  })
  @ApiParam({
    name: 'clientId',
    description: 'Client unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Client rating list',
    type: [ReadRatingDto],
  })
  @Get('client/:clientId')
  async findByClientId(
    @Param('clientId') clientId: string,
  ): Promise<ReadRatingDto[]> {
    return this.ratingService.findByClientId(clientId);
  }

  @ApiOperation({
    summary: 'Get provider ratings',
    description: 'Returns all ratings received by a provider',
  })
  @ApiParam({
    name: 'providerId',
    description: 'Provider unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Provider rating list',
    type: [ReadRatingDto],
  })
  @Get('provider/:providerId')
  async findByProviderId(
    @Param('providerId') providerId: string,
  ): Promise<ReadRatingDto[]> {
    return this.ratingService.findByProviderId(providerId);
  }

  @ApiOperation({
    summary: 'Get provider average rating',
    description:
      'Calculates and returns the average rating of all ratings for a provider',
  })
  @ApiParam({
    name: 'providerId',
    description: 'Provider unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Average rating calculated successfully',
    schema: {
      example: { average: 4.5 },
    },
  })
  @Get('provider/:providerId/average')
  async getProviderAverageRating(
    @Param('providerId') providerId: string,
  ): Promise<{ average: number }> {
    const average =
      await this.ratingService.getProviderAverageRating(providerId);
    return { average };
  }

  @ApiOperation({
    summary: 'Update rating',
    description: 'Updates partial data of an existing rating',
  })
  @ApiParam({
    name: 'id',
    description: 'Rating unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateRatingDto })
  @ApiResponse({
    status: 200,
    description: 'Rating updated successfully',
    type: ReadRatingDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Rating not found',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    return this.ratingService.update(id, updateRatingDto);
  }

  @ApiOperation({
    summary: 'Delete rating',
    description: 'Removes a rating from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Rating unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Rating deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Rating not found',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.ratingService.remove(id);
  }
}
