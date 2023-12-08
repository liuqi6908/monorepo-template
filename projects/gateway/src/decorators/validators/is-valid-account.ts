import { registerDecorator } from 'class-validator'
import { ACCOUNT_REQUIREMENTS_DESC, validateAccount } from 'zjf-utils'
import type { ValidationOptions } from 'class-validator'

export function isValidAccount(value: any) {
  return !validateAccount(value)
}

export function IsValidAccount(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isValidAccount',
      target: object.constructor,
      propertyName,
      options: {
        message: `账号不符合要求，${ACCOUNT_REQUIREMENTS_DESC}`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isValidAccount(value)
        },
      },
    })
  }
}
