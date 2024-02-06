import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { VerificationHistory } from 'src/entities/verification'
import { UserModule } from '../user/user.module'
import { DataModule } from '../data/data.module'
import { NotifyModule } from '../notify/notify.module'
import { VerificationService } from './verification.service'
import { VerificationController } from './verification.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationHistory]),
    forwardRef(() => DataModule),
    forwardRef(() => UserModule),
    forwardRef(() => NotifyModule),
  ],
  providers: [VerificationService],
  exports: [VerificationService],
  controllers: [VerificationController],
})
export class VerificationModule {}
