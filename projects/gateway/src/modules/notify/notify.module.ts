import { Module, forwardRef } from '@nestjs/common'

import { UserModule } from '../user/user.module'
import { EmailModule } from '../email/email.module'
import { PermissionModule } from '../permission/permission.module'
import { NotifyService } from './notify.service'

@Module({
  imports: [
    PermissionModule,
    EmailModule,
    forwardRef(() => UserModule),
  ],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
