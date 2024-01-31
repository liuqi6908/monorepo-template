/** 身份验证审核驳回原因的最大长度 */
export const VERIFICATION_REJECT_REASON_MAX = 100
/** 身份验证审核驳回原因的最小长度 */
export const VERIFICATION_REJECT_REASON_MIN = 3

/** 学校的最大长度 */
export const VERIFICATION_SCHOOL_MAX = 60
/** 学院的最大长度 */
export const VERIFICATION_COLLEGE_MAX = 60
/** 学号的最大长度 */
export const VERIFICATION_NUMBER_MAX = 20
/** 身份证号的最大长度 */
export const VERIFICATION_ID_CARD_MAX = 18
/** 身份证号的最小长度 */
export const VERIFICATION_ID_CARD_MIN = 18
/** 真实姓名的最小长度 */
export const VERIFICATION_NAME_MIN = 2
/** 真实姓名的最大长度 */
export const VERIFICATION_NAME_MAX = 20

/** 身份认证上传文件大小限制 */
export const VERIFICATION_UPLOAD_DFT_SIZE_LIMIT = 1024 * 1024 * 2
/** 身份认证上传文件数量限制 */
export const VERIFICATION_UPLOAD_DFT_AMOUNT_LIMIT = 8
/** 身份认证上传文件可接受文件后缀列表 */
export const VERIFICATION_UPLOAD_DFT_ACCEPT_LIMIT = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico']
/** 身份认证上传文件提示信息 */
export const VERIFICATION_UPLOAD_HINT = '请上传身份证、学生证或教师证、校园卡等凭证，仅限图片格式文件，单个图片不超过 2 MB'
