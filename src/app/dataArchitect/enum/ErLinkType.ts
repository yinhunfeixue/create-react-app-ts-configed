/**
 * ErLinkType
 */
enum ErLinkType {
    ONE_N = 1,
    N_ONE = 2,
    ONE_ONE = 4,
}

namespace ErLinkType {
    export function toString(value: ErLinkType) {
        const dic: { [key in ErLinkType]: string } = {
            [ErLinkType.ONE_N]: '1:N',
            [ErLinkType.N_ONE]: 'N:1',
            [ErLinkType.ONE_ONE]: '1:1',
        }

        return dic[value]
    }
}
export default ErLinkType
