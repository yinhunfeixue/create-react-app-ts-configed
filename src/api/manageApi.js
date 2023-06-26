import { httpObj, sendPost } from './base'
import CONSTANTS from 'app_constants'

const serverList = CONSTANTS['API_LIST']['manage']

// 用户相关---------------------------start-------------------------------------
/**
 * 查询用户列表左侧树
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getUserTree(params = {}) {
    const data = await httpObj.httpGet(serverList['getUserTree'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

// /**
//  * 查询用户列表
//  * @param  {Object} [params={}] [description]
//  * @return {[type]}             [description]
//  */
// export async function getUserList(params = {}) {
//     const data = await httpObj.httpPost(serverList['getUserByUserName'], params);
//     if (data == undefined) {
//         return false;
//     }
//     return data.data;
// };

/**
 * 查询用户列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getUserList(params = {}) {
    const data = await httpObj.httpGet(serverList['getUserList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 查询单个角色
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function singleRole(id) {
    const data = await httpObj.httpGet(serverList['getUserList'] + '/' + id)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 删除用户列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function delUserList(params = []) {
    const data = await httpObj.httpPost(serverList['deleteUsers'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
// 用户相关------------------------------end----------------------------------

// 角色相关------------------------------start-----------------------------------------
/**
 * 查询所有角色
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function authorityRole(params = {}) {
    const data = await httpObj.httpGet(serverList['authorityRole'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 新增角色
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addRole(params = {}) {
    const data = await httpObj.httpPost(serverList['addRole'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 修改角色
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function modifyRole(params = {}) {
    const data = await httpObj.httpPost(serverList['modifyRole'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 根据角色ID 查询角色明细
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function listRoleByRoleid(params = {}) {
    const data = await httpObj.httpPost(serverList['listRoleByRoleid'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 删除角色列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function delRoleList(params = []) {
    const data = await httpObj.httpPost(serverList['deleteRolesApi'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 新增修改角色
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function saveRole(params = {}) {
    const data = await httpObj.httpPost(serverList['saveRolesApi'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
// 角色相关------------------------------end-----------------------------------------

// 权限相关------------------------------start-----------------------------------------
/**
 * 添加新的数据权限
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addDataAuth(params = {}) {
    const data = await httpObj.httpPost(serverList['addDataAuth'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 查询权限的明细
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getDataAuthDetail(params = {}) {
    const data = await httpObj.httpPost(serverList['getDataAuthDetail'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 查询所有权限
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function selectAllAuth(params = {}) {
    const data = await httpObj.httpPost(serverList['selectAllAuth'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 修改权限
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getTableColumn(params = {}) {
    const data = await httpObj.httpPost(serverList['getTableColumn'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 删除权限
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleAuth(params = {}) {
    const data = await httpObj.httpPost(serverList['deleAuth'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 用户列表接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function usersList(params = {}) {
    const data = await httpObj.httpGet(serverList['usersList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 用户组列表接口
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function userGroupsList(params = {}) {
    const data = await httpObj.httpGet(serverList['userGroupsList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 新增用户组列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addGroupsList(params = {}) {
    const data = await httpObj.httpPost(serverList['userGroupsList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 删除用户组列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function delGroupsList(params = {}) {
    const data = await httpObj.httpPost(serverList['delGroupsList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 分配用户组列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addGroupsUser(id, params) {
    let str = '?users=' + params.users
    const data = await httpObj.httpPost(serverList['userGroupsList'] + '/' + id + '/' + 'members' + str)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 分配用户组列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function delGroupsUser(id, params) {
    let str = '?users=' + params.users
    const data = await httpObj.httpDel(serverList['userGroupsList'] + '/' + id + '/' + 'members' + str)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 添加用户到角色
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addRoles(params = {}) {
    const data = await httpObj.httpPost(serverList['addRoles'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 添加符合条件的所有用户到角色
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addAllToRoles(params = {}) {
    const data = await httpObj.httpPost(serverList['addAllToRoles'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 删除用户从角色
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteRoles(params = {}) {
    const data = await httpObj.httpPost(serverList['deleteRoles'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 删除符合条件的所有用户从角色
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteAllFromRoles(params = {}) {
    const data = await httpObj.httpPost(serverList['deleteAllFromRoles'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 添加角色到权限的映射
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function opRoleAuthRelation(params = {}) {
    const data = await httpObj.httpPost(serverList['opRoleAuthRelation'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 获取权限列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function authorities(params = {}) {
    const data = await httpObj.httpGet(serverList['authorities'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 添加用户到用户组
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addGroups(params = {}) {
    const data = await httpObj.httpPost(serverList['addGroups'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 添加符合条件的所有用户到用户组
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function addAllToGroups(params = {}) {
    const data = await httpObj.httpPost(serverList['addAllToGroups'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};
/**
 * 删除用户从用户组
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteGroups(params = {}) {
    const data = await httpObj.httpPost(serverList['deleteGroups'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

/**
 * 删除符合条件的所有用户从用户组
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function deleteAllFromGroups(params = {}) {
    const data = await httpObj.httpPost(serverList['deleteAllFromGroups'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

export async function departments(params = {}) {
    const data = await httpObj.httpGet(serverList['departments'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

export async function getRolesList(params = {}) {
    const data = await httpObj.httpGet(serverList['rolesList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

export async function addUser(params = {}) {
    const data = await httpObj.httpPost(serverList['usersList'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

export async function resetPassword(params = {}) {
    const data = await httpObj.httpPost(serverList['resetPassword'], params)
    if (data == undefined) {
        return false
    }
    return data.data
};

// 权限相关------------------------------end-----------------------------------------

/**
 * 角色配置：根据角色获取权限数据
 */
export async function getRoleMenu(params = {}) {
    const data = await httpObj.httpGet(serverList['roleMenu'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 保存角色权限数据
 */
export async function saveRoleMenu(params = {}) {
    const data = await httpObj.httpPost(serverList['roleMenu'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
