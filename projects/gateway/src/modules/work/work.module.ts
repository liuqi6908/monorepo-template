import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Work } from 'src/entities/work'
import { FileModule } from '../file/file.module'
import { WorkService } from './work.service'
import { WorkController } from './work.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Work]),
    FileModule,
  ],
  providers: [WorkService],
  controllers: [WorkController],
  exports: [WorkService],
})
export class WorkModule {}
