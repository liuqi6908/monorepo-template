/**
 * 将文件读取为可预览的 URL
 * @param file 要读取的文件
 * @returns 可预览的 URL
 */
export function readFileAsDataURL(file: File) {
  return window.URL.createObjectURL(file)
}
