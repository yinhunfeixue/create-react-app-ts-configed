/**
 * LogType
 */
enum LogType {
    NORMAL = 1,
    WARN = 2,
    ERROR = 3,
}

namespace LogType {
    export function toString(value: LogType) {
        const dic: { [key in LogType]: string } = {
            [LogType.NORMAL]: 'INFO',
            [LogType.WARN]: 'WARN',
            [LogType.ERROR]: 'ERROR',
        }
        return dic[value] || 'INFO'
    }

    export function toColor(value: LogType) {
        const dic: { [key in LogType]: string } = {
            [LogType.NORMAL]: 'rgba(45, 48, 51, 1)',
            [LogType.WARN]: 'rgba(250, 173, 20, 1)',
            [LogType.ERROR]: 'rgba(245, 75, 69, 1)',
        }
        return dic[value] || ''
    }

    export function toIconColor(value: LogType) {
        const dic: { [key in LogType]: string } = {
            [LogType.NORMAL]: '#4d73ff',
            [LogType.WARN]: 'rgba(250, 173, 20, 1)',
            [LogType.ERROR]: 'rgba(245, 75, 69, 1)',
        }
        return dic[value] || ''
    }
}
export default LogType
