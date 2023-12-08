import * as path from 'node:path'
import { validatePath } from '@catsjuice/utils'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import compression from '@fastify/compress'
import fmp from '@fastify/multipart'
import { parseBoolRaw } from 'zjf-utils'

import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import registerSwagger from './bootstrap/register-swagger'
import { AppModule } from './app.module'
import { getExceptionFactory } from './utils/response/validate-exception-factory'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const packageJson = await require(path.join(__dirname, '../package.json'))
  const cfgSrv = app.get(ConfigService)
  const globalPrefix = validatePath(cfgSrv.get('SERVER_BASE_PATH') || '/')
  await app.setGlobalPrefix(globalPrefix)

  // Register Swagger
  if (parseBoolRaw(cfgSrv.get('SWAGGER_ENABLED')))
    await registerSwagger(app, cfgSrv, globalPrefix, packageJson.version)

  /** 启用 压缩 */
  app.register(compression)
  /** 文件 */
  app.register(fmp, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 1024 * 1024 * 1024,
    },
  })

  /** 启用 validation */
  app.useGlobalPipes(
    new ValidationPipe({ exceptionFactory: getExceptionFactory() }),
  )

  // Global variables
  globalThis.prefix = globalPrefix
  globalThis.version = packageJson.version

  // enable cors
  app.enableCors({
    origin: ['https://r.qiyandata.com'],
    methods: 'POST',
  })

  // Start server
  await app.listen(Number.parseInt(cfgSrv.get('SERVER_PORT')) || 3000, '::')
  logger.log(`App is running on ${await app.getUrl()}`)
}
bootstrap()
