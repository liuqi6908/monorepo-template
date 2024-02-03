import { Reflector } from '@nestjs/core'
import { Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { ErrorCode, PhoneCodeAction, phoneCodeActionDescriptions } from 'zjf-types'
import type { CanActivate, ExecutionContext } from '@nestjs/common'

import { UserService } from 'src/modules/user/user.service'
import { getReflectorValue } from 'src/utils/reflector-value'
import { ApiErrorResponse, responseError } from 'src/utils/response'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'

@Injectable()
export class PhoneCodeSendableGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly userSrv: UserService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()

    const registerRequiredActions = [
      PhoneCodeAction.LOGIN,
      PhoneCodeAction.CHANGE_PASSWORD,
      PhoneCodeAction.UNBIND_PHONE,
    ]

    const notRegisterRequiredActions = [
      PhoneCodeAction.BIND_PHONE,
    ]

    const phoneExistsRequiredActions = [
      PhoneCodeAction.UNBIND_PHONE,
    ]
    const phoneNotExistsRequiredActions = [
      // 目前，允许用户在存在手机号的情况下，绑定新手机，但是不允许用户在不存在手机号的情况下，解绑手机
    ]

    const actionIn = getReflectorValue(this.reflector, context, 'actionIn', 'body')
    const actionKey = getReflectorValue(this.reflector, context, 'actionKey', 'action')
    const phoneIn = getReflectorValue(this.reflector, context, 'phoneIn', 'body')
    const phoneKey = getReflectorValue(this.reflector, context, 'phoneKey', 'phone')

    const phone = req?.[phoneIn]?.[phoneKey]
    const action = req?.[actionIn]?.[actionKey]

    if (!action) {
      responseParamsError([{
        property: actionKey,
        constraints: { [actionKey]: 'action is required' },
      }])
    }

    if (!phone) {
      responseParamsError([{
        property: phoneKey,
        constraints: { [phoneKey]: 'phone is required' },
      }])
    }

    if (!phoneCodeActionDescriptions[action]) {
      responseParamsError([{
        property: actionKey,
        constraints: { [actionKey]: 'action is invalid' },
      }])
    }

    const user = await this.userSrv.repo().findOne({ where: { phone } })

    if (registerRequiredActions.includes(action) && !user)
      responseError(ErrorCode.USER_PHONE_NUMBER_NOT_REGISTERED)

    if (registerRequiredActions.includes(action) && user && user.isDeleted)
      responseError(ErrorCode.AUTH_ACCOUNT_IS_DELETED)

    if (notRegisterRequiredActions.includes(action) && user)
      responseError(ErrorCode.USER_PHONE_NUMBER_REGISTERED)

    if (user && phoneExistsRequiredActions.includes(action) && !user.phone)
      responseError(ErrorCode.USER_PHONE_NUMBER_NOT_EXISTS)

    if (user && phoneNotExistsRequiredActions.includes(action) && user.phone)
      responseError(ErrorCode.USER_PHONE_NUMBER_EXISTS)

    if (action === PhoneCodeAction.UNBIND_PHONE && user?.phone !== phone)
      responseError(ErrorCode.USER_PHONE_NUMBER_NOT_MATCHED)

    return true
  }
}

/**
 * 确保 phone + action 组合有效
 * @param action
 * @param phone
 * @returns
 */
export function PhoneCodeSendable(
  action?: { in?: 'body' | 'query'; key?: string },
  phone?: { in?: 'body' | 'query'; key?: string },
) {
  return applyDecorators(
    UseGuards(PhoneCodeSendableGuard),
    SetMetadata('actionIn', action?.in),
    SetMetadata('actionKey', action?.key),
    SetMetadata('phoneIn', phone?.in),
    SetMetadata('phoneKey', phone?.key),
    ApiErrorResponse(
      ErrorCode.USER_PHONE_NUMBER_NOT_REGISTERED,
      ErrorCode.AUTH_ACCOUNT_IS_DELETED,
      ErrorCode.USER_PHONE_NUMBER_REGISTERED,
      ErrorCode.USER_PHONE_NUMBER_NOT_EXISTS,
      ErrorCode.USER_PHONE_NUMBER_EXISTS,
      ErrorCode.USER_PHONE_NUMBER_NOT_MATCHED,
    ),
  )
}
