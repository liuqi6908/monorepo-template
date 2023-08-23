import { Config } from 'src/entities/config'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysConfigService } from './config.service'
import { ConfigController } from './config.controller'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Config])],
  controllers: [ConfigController],
  providers: [SysConfigService],
  exports: [SysConfigService],
})
export class ConfigModule {}
