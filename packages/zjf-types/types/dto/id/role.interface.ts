export interface IRoleIdDto {
  /** 角色权限的唯一标识 */
  roleId: string
}

export interface IRoleIdOptionalDto extends Partial<IRoleIdDto> {}
