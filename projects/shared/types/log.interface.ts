/**
 * 日志数据行为及操作对象
 */
export interface LogItem<K, V = string> {
  key: K
  value: V
}
