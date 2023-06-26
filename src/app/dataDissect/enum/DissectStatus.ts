import { LegacyButtonType } from 'antd/lib/button/button'

/**
 * 剖析状态
 */
enum DissectStatus {
    DOING = 1,
    SUCCESS = 2,
    INVALID = 3,
    EXPIRE = 4,
    ERROR = 5,
}

namespace DissectStatus {
    export function toString(value?: DissectStatus) {
        const dic: { [key in DissectStatus]: string } = {
            [DissectStatus.SUCCESS]: '剖析完成',
            [DissectStatus.DOING]: '剖析中...',
            [DissectStatus.INVALID]: '剖析失效',
            [DissectStatus.EXPIRE]: '剖析过期',
            [DissectStatus.ERROR]: '剖析失败',
        }
        return dic[value as DissectStatus] || ''
    }

    export function toColor(value?: DissectStatus) {
        const dic: { [key in DissectStatus]: string } = {
            [DissectStatus.SUCCESS]: 'rgba(51, 153, 51, 1)',
            [DissectStatus.DOING]: 'rgba(58, 157, 255, 1)',
            [DissectStatus.INVALID]: 'rgba(245, 75, 69, 1)',
            [DissectStatus.EXPIRE]: 'rgba(245, 75, 69, 1)',
            [DissectStatus.ERROR]: 'rgba(245, 75, 69, 1)',
        }
        return dic[value as DissectStatus] || dic[DissectStatus.DOING]
    }

    export function toBorderColor(value?: DissectStatus) {
        const dic: { [key in DissectStatus]: string } = {
            [DissectStatus.SUCCESS]: 'rgba(51, 153, 51, 0.2)',
            [DissectStatus.DOING]: 'rgba(58, 157, 255, 0.2)',
            [DissectStatus.INVALID]: 'rgba(245, 75, 69, 0.2)',
            [DissectStatus.EXPIRE]: 'rgba(245, 75, 69, 0.2)',
            [DissectStatus.ERROR]: 'rgba(245, 75, 69, 0.2)',
        }
        return dic[value as DissectStatus] || dic[DissectStatus.DOING]
    }

    export function toBtnLabel(value?: DissectStatus) {
        const dic: { [key in DissectStatus]: string } = {
            [DissectStatus.SUCCESS]: '知道了',
            [DissectStatus.DOING]: '知道了',
            [DissectStatus.INVALID]: '修改设置',
            [DissectStatus.EXPIRE]: '更新结果',
            [DissectStatus.ERROR]: '知道了',
        }
        return dic[value as DissectStatus] || ''
    }

    export function toBtnType(value?: DissectStatus) {
        const dic: { [key in DissectStatus]: LegacyButtonType } = {
            [DissectStatus.SUCCESS]: 'default',
            [DissectStatus.DOING]: 'default',
            [DissectStatus.INVALID]: 'primary',
            [DissectStatus.EXPIRE]: 'primary',
            [DissectStatus.ERROR]: 'default',
        }
        return dic[value as DissectStatus] || ''
    }
}
export default DissectStatus
