/**
 * 发送手机验证码的目的
 */
export enum PhoneCodeAction {
  /** 登录 */
  LOGIN = 'login',
  /** 修改密码 */
  CHANGE_PASSWORD = 'change-password',
  /** 绑定手机 */
  BIND_PHONE = 'bind-phone',
  /** 解绑手机 */
  UNBIND_PHONE = 'unbind-phone',
}

/**
 * 发送手机验证码目的的描述
 */
export const phoneCodeActionDescriptions: Record<PhoneCodeAction, string> = {
  [PhoneCodeAction.LOGIN]: '登录',
  [PhoneCodeAction.CHANGE_PASSWORD]: '修改密码',
  [PhoneCodeAction.BIND_PHONE]: '绑定手机',
  [PhoneCodeAction.UNBIND_PHONE]: '解绑手机',
}
