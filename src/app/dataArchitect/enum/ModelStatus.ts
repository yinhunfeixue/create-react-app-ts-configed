/**
 * ModelStatus
 */
enum ModelStatus {
    DRAFT = 0,
    PUBLISHED = 1,
}

namespace ModelStatus {
    export const ALL: ModelStatus[] = [ModelStatus.DRAFT, ModelStatus.PUBLISHED]
    export function toString(value: ModelStatus) {
        const dic: { [key in ModelStatus]: string } = {
            [ModelStatus.DRAFT]: '草稿',
            [ModelStatus.PUBLISHED]: '已发布',
        }
        return dic[value] || '-'
    }

    export function toColor(value: ModelStatus) {
        const dic: { [key in ModelStatus]: string } = {
            [ModelStatus.DRAFT]: '#FF9900',
            [ModelStatus.PUBLISHED]: 'rgba(66, 208, 213, 1)',
        }
        return dic[value] || dic[ModelStatus.DRAFT]
    }
}
export default ModelStatus
