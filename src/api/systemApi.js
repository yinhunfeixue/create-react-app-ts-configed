import CONSTANTS from 'app_constants'
import {
    httpObj
} from './base'

const apiList = CONSTANTS['API_LIST']['systemSetting']

/************** 用户 *****************/
export async function requestUserList(params) {
    const data = await httpObj.httpPost(apiList['requestUserList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function listAuth(params) {
    const data = await httpObj.httpPost(apiList['listAuth'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}




export async function requestAddUser(data) {
    const res = await httpObj.httpPost(apiList['requestAddUser'], data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestEditUser(id, data) {
    const res = await httpObj.httpPost(`${apiList['requestEditUser']}/${id}`, data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestDeleteUser(ids) {
    const res = await httpObj.httpPost(apiList['requestDeleteUser'], {
        ids
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestImportUser(file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await httpObj.httpPost(apiList['requestImportUser'], formData)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function batchUpdateStaus(ids, status) {
    const res = await httpObj.httpPost(apiList['batchUpdateStaus'], {
        ids,
        status
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function downloadTemplate() {
    const res = await httpObj.httpGetDownload(apiList['downloadTemplate'])
    if (res == undefined) {
        return false
    }
    return res.data
}

/*************** 部门 ***************/

export async function requestDepartmentTree() {
    const res = await httpObj.httpGet(apiList['requestDepartmentTree'])
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestAddDepartment(data) {
    const res = await httpObj.httpPost(apiList['requestAddDepartment'], data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestEditDepartment(id, data) {
    const res = await httpObj.httpPost(`${apiList['requestEditDepartment']}/${id}`, data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestDepartmentDetail(id) {
    const res = await httpObj.httpGet(`${apiList['requestDepartmentDetail']}`, {
        id
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestImportDepartment(file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await httpObj.httpPost(apiList['requestImportDepartment'], formData)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestDeleteDepartment(ids) {
    const res = await httpObj.httpPost(apiList['requestDeleteDepartment'], {
        ids
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestRemoveDepartmentFromUsers(deptId, userIds) {
    const res = await httpObj.httpPost(apiList['requestRemoveDepartmentFromUsers'], {
        deptId,
        userIds
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestAddDepartmentToUser(deptId, userIds) {
    const res = await httpObj.httpPost(apiList['requestAddDepartmentToUser'], {
        deptId,
        userIds
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

/*************** 角色 ***************/
export async function requestRoleList() {
    const data = await httpObj.httpGet(apiList['requestRoleList'])
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function requestAddRole(data) {
    const res = await httpObj.httpPost(apiList['requestAddRole'], data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestEditRole(id, data) {
    const res = await httpObj.httpPost(`${apiList['requestEditRole']}/${id}`, data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestDeleteRole(ids) {
    const res = await httpObj.httpPost(apiList['requestDeleteRole'], {
        ids
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestRemoveRoleFromUsers(roleId, userIds) {
    const res = await httpObj.httpPost(apiList['requestRemoveRoleFromUsers'], {
        roleId,
        userIds
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestAddRoleToUser(roleId, userIds) {
    const res = await httpObj.httpPost(apiList['requestAddRoleToUser'], {
        roleId,
        userIds
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function listRoleAvailableUsers(params) {
    const res = await httpObj.httpPost(apiList['listRoleAvailableUsers'], params)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function listUsedRoles() {
    const res = await httpObj.httpGet(apiList['listUsedRoles'])
    if (res == undefined) {
        return false
    }
    return res.data
}

/*************** 权限 ***************/
export async function requestPermissionList(authType) {
    const res = await httpObj.httpPost(apiList['requestPermissionList'], {
        authType,
        needAll: true,
        page: 1,
        page_size: 1000
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestRolePermissionList(id) {
    const res = await httpObj.httpGet(apiList['requestRolePermissionList'], {
        id
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestUserPermissionList(id) {
    const res = await httpObj.httpGet(apiList['requestUserPermissionList'], {
        id
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestDepartmentPermissionList(id) {
    const res = await httpObj.httpGet(apiList['requestDepartmentPermissionList'], {
        id
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function saveUserPermissionList(data) {
    const res = await httpObj.httpPost(apiList['saveUserPermissionList'], data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function saveRolePermissionList(data) {
    const res = await httpObj.httpPost(apiList['saveRolePermissionList'], data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function saveDepartmentPermissionList(data) {
    const res = await httpObj.httpPost(apiList['saveDepartmentPermissionList'], data)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function resetUserPermission(userId, resetType) {
    const res = await httpObj.httpPost(apiList['resetUserPermission'], {
        userId,
        resetType
    })
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function listDepartmentAvailableUsers(params) {
    const res = await httpObj.httpPost(apiList['listDepartmentAvailableUsers'], params)
    if (res == undefined) {
        return false
    }
    return res.data
}

export async function requestMenuTree() {
    const res = await httpObj.httpGet(`/quantchiAPI/api/umg/auth/getMenuTree`);
    return res.data;
}

export async function saveMenuTree(data) {
    const res = await httpObj.httpPost(`/quantchiAPI/api/umg/auth/setMenuTree`, data)
    return res.data;
}


export async function getUserSystemAuth(params = {}) {
    const data = await httpObj.httpGet(apiList['getUserSystemAuth'] + "/" + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getUserTaskAuth(params = {}) {
    const data = await httpObj.httpGet(apiList['getUserTaskAuth'] + "/" + params.id)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getResource(params = {}) {
    const data = await httpObj.httpGet(apiList['getResource'])
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function setResourceAuth(params = {}) {
    const data = await httpObj.httpPost(apiList['setResourceAuth'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getSystemDs(params = {}) {
    const data = await httpObj.httpGet(apiList['getSystemDs'])
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getTaskDs(params = {}) {
    const data = await httpObj.httpGet(apiList['getTaskDs'])
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function getAllAuth(params = {}) {
    const data = await httpObj.httpPost(apiList['getAllAuth'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function resourceReset(params = {}) {
    const data = await httpObj.httpPost(apiList['resourceReset'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}