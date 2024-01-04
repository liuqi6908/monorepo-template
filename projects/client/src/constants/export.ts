export type FileType = 'small' | 'big'

interface MenuItem {
  label: string
  value: FileType
}

/**
 * 菜单
 */
export const EXPORT_MENU: MenuItem[] = [
  { label: '小文件外发', value: 'small' },
  { label: '大文件外发', value: 'big' },
]
