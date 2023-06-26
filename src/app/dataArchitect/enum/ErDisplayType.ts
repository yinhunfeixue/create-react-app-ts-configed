/**
 * ErDisplayType
 */
enum ErDisplayType {
    ALL_TABLE,
    MAIN_ENTITY,
}

namespace ErDisplayType {
    export const ALL: ErDisplayType[] = [ErDisplayType.ALL_TABLE, ErDisplayType.MAIN_ENTITY]
    export function toString(value: ErDisplayType) {
        const dic: { [key in ErDisplayType]: string } = {
            [ErDisplayType.ALL_TABLE]: '全部表',
            [ErDisplayType.MAIN_ENTITY]: '主实体',
        }
        return dic[value]
    }
}

export default ErDisplayType
