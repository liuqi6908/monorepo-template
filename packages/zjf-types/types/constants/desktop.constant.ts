/** ---------------------- 云桌面申请 ---------------------- */
/** 云桌面申请时长配置 */
export const DESKTOP_REQUEST_DURATION_OPTION = [
  {
    label: '6个月',
    value: 180,
  },
  {
    label: '12个月',
    value: 365,
  },
  {
    label: '长期',
    value: 50 * 365,
  },
]
/** 云桌面申请上传文件大小限制 */
export const DESKTOP_REQUEST_UPLOAD_DFT_SIZE_LIMIT = 1024 * 1024 * 5
/** 云桌面申请上传文件数量限制 */
export const DESKTOP_REQUEST_UPLOAD_DFT_AMOUNT_LIMIT = 5
/** 云桌面申请上传文件可接受文件后缀列表 */
export const DESKTOP_REQUEST_UPLOAD_DFT_ACCEPT_LIMIT = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg']
/** 云桌面申请上传文件提示信息 */
export const DESKTOP_REQUEST_UPLOAD_HINT = '请上传 PDF、WORD、PNG、JPG 格式文件，每个不超过 5 MB'

/** ---------------------- 云桌面 ---------------------- */
/** 云桌面资源最大数量 */
export const DESKTOP_MAX_COUNT = 50

/** ---------------------- 云桌面文件传输 ---------------------- */
/** 云桌面FTP文件传输配额 */
export const DESKTOP_FTP_QUOTA = 1024 * 1024 * 1024 * 10
