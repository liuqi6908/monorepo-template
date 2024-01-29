import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, forwardRef } from '@nestjs/common'
import { UserDeleted } from 'src/entities/user-deleted'
import { User } from 'src/entities/user'

import { CodeModule } from '../code/code.module'
import { AuthModule } from '../auth/auth.module'
import { VerificationModule } from '../verification/verification.module'
import { DesktopModule } from '../desktop/desktop.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDeleted]),
    CodeModule,
    forwardRef(() => DesktopModule),
    forwardRef(() => AuthModule),
    forwardRef(() => VerificationModule),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
