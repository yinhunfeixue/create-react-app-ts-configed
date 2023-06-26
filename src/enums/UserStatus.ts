/**
 * UserStatus
 */
enum UserStatus {
    DISABLED = 0,
    ENABLED = 1,
}

namespace UserStatus {
    export const ALL = [UserStatus.ENABLED, UserStatus.DISABLED]
    export function toString(value: UserStatus) {
        switch (value) {
            case UserStatus.DISABLED:
                return '禁用'
            case UserStatus.ENABLED:
                return '启用'
            default:
                return ''
        }
    }
}
export default UserStatus
