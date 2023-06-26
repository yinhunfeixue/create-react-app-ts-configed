/**
 * 内容格式
 */
enum ContentType {
  FORMT_LIMIT = 1,
  CONTENT_LIMIT = 2,
}

namespace ContentType {
  export const ALL = [ContentType.FORMT_LIMIT, ContentType.CONTENT_LIMIT]

  export function toString(value: ContentType) {
    switch (value) {
      case ContentType.FORMT_LIMIT:
        return '格式限制'
      case ContentType.CONTENT_LIMIT:
        return '内容限制'
      default:
        return ''
    }
  }
}
export default ContentType
