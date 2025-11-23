import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProviderService } from '../../application/services/provider/provider.service';
import { CreateProviderDto } from '../../application/dtos/provider/create-provider.dto';
import { UpdateProviderDto } from '../../application/dtos/provider/update-provider.dto';
import { ReadProviderDto } from '../../application/dtos/provider/read-provider.dto';

@ApiTags('Providers')
@ApiBearerAuth('Bearer')
@Controller('/api/v1/providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @ApiOperation({
    summary: 'Create new provider',
    description: 'Creates a new provider in the system associated with a user',
  })
  @ApiBody({ type: CreateProviderDto })
  @ApiResponse({
    status: 201,
    description: 'Provider created successfully',
    type: ReadProviderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
  })
  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providerService.create(createProviderDto);
  }

  @ApiOperation({
    summary: 'List all providers',
    description: 'Returns a list of all registered providers',
  })
  @ApiResponse({
    status: 200,
    description: 'Provider list returned successfully',
    type: [ReadProviderDto],
  })
  @Get()
  findAll(): Promise<ReadProviderDto[]> {
    return this.providerService.findAll();
  }

  @ApiOperation({
    summary: 'Get provider by ID',
    description: 'Returns the data of a specific provider',
  })
  @ApiParam({
    name: 'id',
    description: 'Provider unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Provider found',
    type: ReadProviderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReadProviderDto | null> {
    return this.providerService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update provider',
    description: 'Updates partial data of a provider',
  })
  @ApiParam({
    name: 'id',
    description: 'Provider unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateProviderDto })
  @ApiResponse({
    status: 200,
    description: 'Provider updated successfully',
    type: ReadProviderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
  })
  @Patch(':id')
  update(
    @Param('id')
    id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providerService.update(id, updateProviderDto);
  }

  @ApiOperation({
    summary: 'Delete provider',
    description: 'Removes a provider from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Provider unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Provider deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.providerService.remove(id);
  }
}
