import { ErrorCode } from 'zjf-types'
import { Reflector } from '@nestjs/core'
import { Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { ICodeVerifyDto, IPhoneDto, PhoneCodeAction } from 'zjf-types'

import { ApiErrorResponse } from 'src/utils/response'
import { CodeService } from 'src/modules/code/code.service'
import { getReflectorValue } from 'src/utils/reflector-value'

interface BasicBody extends ICodeVerifyDto, IPhoneDto {}

@Injectable()
export class PhoneCodeVerifyGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly codeSrv: CodeService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()
    const action = getReflectorValue<PhoneCodeAction>(this.reflector, context, 'action', null)

    const body = req.body as any as BasicBody

    if (!action)
      throw new Error('action is required')

    await this.codeSrv.verifyWithError(body.bizId, [body.phone, action, body.code])

    return true
  }
}

/**
 * 校验验证码是否正确
 * @param action
 * @returns
 */
export function PhoneCodeVerify(action: PhoneCodeAction) {
  return applyDecorators(
    UseGuards(PhoneCodeVerifyGuard),
    SetMetadata('action', action),
    ApiErrorResponse(ErrorCode.AUTH_CODE_NOT_MATCHED),
  )
}
