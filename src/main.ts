import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Service Hub API')
    .setDescription(
      'Complete API for managing services, orders, ratings and users',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Token for authentication',
      },
      'Bearer',
    )
    .addTag('Health', 'API health check endpoints')
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Clients', 'Client management')
    .addTag('Providers', 'Provider management')
    .addTag('Orders', 'Order management')
    .addTag('Order Services', 'Service management')
    .addTag('Ratings', 'Rating management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT', '3000'), 10);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  Logger.log(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  Logger.log(
    `Swagger documentation available at: http://localhost:${port}/api/docs`,
    'Bootstrap',
  );
}
void bootstrap();
