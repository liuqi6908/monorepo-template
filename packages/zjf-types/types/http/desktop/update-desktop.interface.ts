import type { ICreateDesktopBodyDto } from './create-desktop.interface'

/**
 * 更新云桌面
 * 请求参数
 */
export interface IUpdateDesktopBodyDto extends
  Partial<Omit<ICreateDesktopBodyDto, 'id'>> {}
