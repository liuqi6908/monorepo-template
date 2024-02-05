import { Module, forwardRef } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Desktop } from 'src/entities/desktop'
import { DesktopQueue } from 'src/entities/desktop-queue'
import { DesktopQueueHistory } from 'src/entities/desktop-queue-history'

import { NotifyModule } from '../notify/notify.module'
import { ExportModule } from '../export/export.module'
import { FileModule } from '../file/file.module'
import { DesktopService } from './desktop.service'
import { ZstackService } from './zstack/zstack.service'
import { HyperVService } from './hyper-v/hyper-v.service'
import { DesktopController } from './desktop.controller'
import { DesktopRequestService } from './desktop-request/desktop-request.service'
import { DesktopRequestController } from './desktop-request/desktop-request.controller'
import { DesktopVmController } from './desktop-control/desktop-vm/desktop-vm.controller'
import { DesktopHostController } from './desktop-control/desktop-host/desktop-host.controller'
import { DesktopQueueHistoryService } from './desktop-queue-history/desktop-queue-history.service'

@Module({
  imports: [
    forwardRef(() => ExportModule),
    forwardRef(() => NotifyModule),
    HttpModule,
    FileModule,
    TypeOrmModule.forFeature([
      Desktop,
      DesktopQueue,
      DesktopQueueHistory,
    ]),
  ],
  controllers: [
    DesktopController,
    DesktopRequestController,
    DesktopHostController,
    DesktopVmController,
  ],
  providers: [DesktopService, DesktopRequestService, DesktopQueueHistoryService, ZstackService, HyperVService],
  exports: [DesktopService, DesktopRequestService, DesktopQueueHistoryService],
})
export class DesktopModule {}
