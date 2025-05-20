import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { GlobalExceptionFilter } from './common/filters/all-exception.filter'
import { useContainer } from 'class-validator'
import { CustomConfigService } from './global/config/config.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ApiPaginatedRes, ApiRes } from './common/dtos/res/api-response.dto'
import { BaseParamsReqDto } from './common/dtos/req/base-params.dto'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const configService = app.get(CustomConfigService)
  const port = configService.env.PORT

  app.enableCors('*')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.useGlobalInterceptors(app.get(ResponseInterceptor))
  app.useGlobalFilters(new GlobalExceptionFilter())
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('EcuaTickets API')
    .setDescription(
      'Complete API documentation for EcuaTickets. This API is designed to provide a seamless experience for developers and users alike. It includes endpoints for authentication, user management and more.',
    )
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`, 'Local server')
    // .addServer('https://api.produccion.com', 'Production server')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter your JWT token',
      in: 'header',
    })
    .build()

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ApiRes, ApiPaginatedRes, BaseParamsReqDto],
  })

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none', // 'list', 'full', 'none'
      operationsSorter: 'method', // 'alpha', 'method'
      tagsSorter: 'alpha',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      filter: true,
      syntaxHighlight: {
        activate: true,
        theme: 'agate',
      },
    },
    customSiteTitle: 'EcuaTickets API Documentation',
    // customfavIcon: 'https://nestjs.com/favicon.ico',
    customCss: `
      .swagger-ui .information-container { padding: 20px 0 }
      .swagger-ui .scheme-container { padding: 15px 0 }
    `,
  })

  await app.listen(port)
  Logger.log(`Server running on port ${port}`, 'Bootstrap')
  Logger.log(
    `Swagger docs available at: http://localhost:${port}/api/docs`,
    'Bootstrap',
  )
  Logger.log(
    'API versioning enabled. Use /api/v1/ to access the API.',
    'Bootstrap',
  )
}

void bootstrap()
