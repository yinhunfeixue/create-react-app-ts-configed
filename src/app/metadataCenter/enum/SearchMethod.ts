/**
 * SearchMethod
 */
enum SearchMethod {
    /**
     * 精确搜索
     */
    EXACT = '1',

    /**
     * 模糊搜索
     */
    FUZZY = '2',
}

namespace SearchMethod {
    export const ALL: SearchMethod[] = [SearchMethod.FUZZY, SearchMethod.EXACT]
    export function toString(value: SearchMethod) {
        switch (value) {
            case SearchMethod.EXACT:
                return '精确搜索'
            case SearchMethod.FUZZY:
                return '模糊搜索'
            default:
                return '-'
        }
    }
}
export default SearchMethod
