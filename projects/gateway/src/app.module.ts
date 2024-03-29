import { join } from 'node:path'
import { ScheduleModule } from '@nestjs/schedule'
import { Module, RequestMethod } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { validatePath } from 'utils'

import type { MiddlewareConsumer, NestModule } from '@nestjs/common'

import { InfoMiddleware } from './middleware/info.middleware'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { ThrottlerExceptionFilter } from './filter/throttler-exception.filter'

@Module({
  imports: [
    // Internal Modules

    // External Modules
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({ ttl: 10, limit: 30 }),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.dev', '.env.staging', '.env.production', '.env'],
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_cfgSrv: ConfigService) => [
        {
          rootPath: join(__dirname, 'public'),
          serveRoot: validatePath(_cfgSrv.get('SERVER_BASE_PATH')),
        },
      ],
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: ThrottlerExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InfoMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
}
