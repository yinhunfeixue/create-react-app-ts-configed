/**
 * ModelType
 */
enum ModelType {
    ENTITY_MODEL = 1,
    DIM_MODEL = 2,
}

namespace ModelType {
    export const ALL = [ModelType.DIM_MODEL, ModelType.ENTITY_MODEL]
    export function toString(value: ModelType) {
        const dic: { [key in ModelType]: string } = {
            [ModelType.ENTITY_MODEL]: '实体模型',
            [ModelType.DIM_MODEL]: '维度模型',
        }
        return dic[value] || ''
    }
}
export default ModelType
