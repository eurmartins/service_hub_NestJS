import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './infrastructure/decorators/public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Check API status',
    description: 'Returns a simple message to verify if the API is working',
  })
  @ApiResponse({
    status: 200,
    description: 'API is operational',
    schema: {
      example: 'Hello World!',
    },
  })
  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
