import { responseParamsError } from '../response/validate-exception-factory'

/**
 * 检查参数中的 account、email和phone 是否至少有一个，如果没有，给客户端返回错误信息
 * @param info
 * @returns
 */
export function accountEmailPhoneAtLeastOne(info: Record<'account' | 'email' | 'phone' | string, any>) {
  if (info.account || info.email || info.phone)
    return

  responseParamsError([{
    property: 'account|email|phone',
    constraints: { 'account|email|phone': '账号、邮箱或手机号码至少需要填写一个' },
  }])
}
