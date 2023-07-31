/**
 * 解析未知错误，看是否是 SQL 错误
 * @param error
 * @returns
 */
export function parseSqlError(error: any) {
  if (error.name === 'QueryFailedError') {
    if (error.message.match(/^Duplicate entry/))
      return SqlError.DUPLICATE_ENTRY

    if (error.message.match(/foreign key constraint fails/))
      return SqlError.FOREIGN_KEY_CONSTRAINT_FAILS
  }

  return SqlError.UNEXPECTED
}
