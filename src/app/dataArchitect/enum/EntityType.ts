/**
 * EntityType
 */
enum EntityType {
    BUSINESS_OBJECT = 1,
    BUSINESS_ACTION = 2,
}

namespace EntityType {
    export const ALL = [EntityType.BUSINESS_ACTION, EntityType.BUSINESS_OBJECT]
    export function toString(value: EntityType) {
        const dic: { [key in EntityType]: string } = {
            [EntityType.BUSINESS_OBJECT]: '业务对象',
            [EntityType.BUSINESS_ACTION]: '业务活动',
        }
        return dic[value] || ''
    }

    export function toColor(value: EntityType) {
        const dic: { [key in EntityType]: string } = {
            [EntityType.BUSINESS_OBJECT]: 'rgba(74, 144, 226, 1)',
            [EntityType.BUSINESS_ACTION]: 'rgba(255, 153, 0, 1)',
        }
        return dic[value] || '#666'
    }
}
export default EntityType
