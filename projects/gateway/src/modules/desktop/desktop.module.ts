import { Module } from '@nestjs/common'
import { Desktop } from 'src/entities/desktop'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DesktopQueue } from 'src/entities/desktop-queue'
import { DesktopQueueHistory } from 'src/entities/desktop-queue-history'

import { DesktopService } from './desktop.service'
import { DesktopController } from './desktop.controller'
import { DesktopRequestService } from './desktop-request/desktop-request.service'
import { DesktopRequestController } from './desktop-request/desktop-request.controller'
import { DesktopQueueHistoryService } from './desktop-queue-history/desktop-queue-history.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Desktop,
      DesktopQueue,
      DesktopQueueHistory,
    ]),
  ],
  controllers: [DesktopController, DesktopRequestController],
  providers: [DesktopService, DesktopRequestService, DesktopQueueHistoryService],
  exports: [DesktopService, DesktopRequestService, DesktopQueueHistoryService],
})
export class DesktopModule {}