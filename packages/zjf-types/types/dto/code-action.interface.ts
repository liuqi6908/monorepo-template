import { CodeAction } from '../code-action.enum';

export interface ICodeActionDto {
  /** 请求验证码用于 */
  action: CodeAction
}