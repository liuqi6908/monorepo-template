/**
 * 枚举值转Markdown文本
 * @param obj 需要转换的对象
 * @returns 转换后的字符串
 */
export function enumMarkdown(obj: Record<string, string>) {
  return Object.entries(obj).map(([key, value]) => {
    return `- \`${key}\`: ${value}`
  }).join('\n')
}