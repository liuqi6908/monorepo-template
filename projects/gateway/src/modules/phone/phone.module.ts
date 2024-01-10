import { Module, forwardRef } from '@nestjs/common'

import { UserModule } from '../user/user.module'
import { CodeModule } from '../code/code.module'
import { PhoneService } from './phone.service'
import { PhoneController } from './phone.controller'

@Module({
  imports: [
    forwardRef(() => UserModule),
    CodeModule,
  ],
  providers: [PhoneService],
  controllers: [PhoneController],
  exports: [PhoneService],
})
export class PhoneModule {}
