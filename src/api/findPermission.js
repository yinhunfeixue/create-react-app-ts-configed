import Cache from 'app_utils/cache'

export function findPermission (id) {
    let ifHave = true
    if (id && id !== 0) {
        let permissions = Cache.get('userData').permissions
        ifHave = false
        permissions.map((value, index) => {
            if (value.permission === id) {
                ifHave = true
            }
        })

    }
    return ifHave
}