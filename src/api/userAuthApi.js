/*
 * @Author: your name
 * @Date: 2020-09-21 20:00:18
 * @LastEditTime: 2020-11-12 09:14:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dmp_frontend_ztzq_dev\src\api\userAuthApi.js
 */
import PermissionManage from '@/utils/PermissionManage'
import CONSTANTS from 'app_constants'
import Cache from 'app_utils/cache'
import sendPost, { httpObj } from './base'
import { requestUserPermissionList } from './systemApi'

const serverList = CONSTANTS['SERVER_LIST']
const connectWho = 'dmpTestServer'
const apiList = CONSTANTS['API_LIST']['common']
// 列 栏目
// export async function getManageColumns(params = {}) {
//     const data = await sendPost('/dmp/manage/columns', 'post', params, serverList[connectWho])
//     if (data == undefined) {
//         return false
//     }
//     return data.data
// }

export async function initUserInfo() {
    const userRes = await requestCurrentUserInfo()
    if (userRes.code === 200) {
        const { data } = userRes
        Cache.set('login', 'true')
        Cache.set('userinfo', data || {})
        Cache.set('globalSearchCondition', {
            keyword: '',
            area: [],
        })
        // 获取权限列表
        const permissionRes = await requestUserPermissionList(data.id)
        if (permissionRes.code === 200) {
            const { funcAuths, systemAuths } = permissionRes.data
            PermissionManage.funcAuths = funcAuths
            PermissionManage.systemAuths = systemAuths
            Cache.set('menuData', funcAuths)
            return Promise.resolve(data)
        } else {
            return Promise.reject(permissionRes.msg)
        }
    } else {
        return Promise.reject(userRes.msg)
    }
}
export async function getManageColumns(params = {}) {
    const data = await sendPost('/quantchiAPI/api/menu/columns', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

// 登录
export async function login(params = {}) {
    const data = await sendPost('/quantchiAPI/api/umg/user/login', 'post', params, serverList[connectWho], true)
    if (data == undefined) {
        return false
    }
    return data.data
}
// 退出
export async function logout(params = {}) {
    const data = await sendPost('/quantchiAPI/api/umg/user/logout', 'get', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}
// // 退出（原来的）
// export function logout(params = {}) {
//     return sendPost('/logout/', 'get', params,serverList[connectWho])
// }

// 请求下拉框数据
// 参数 ：namespace：
// standard  指标升级为标准时用到
export async function getSelectOption(params = {}) {
    const data = await httpObj.httpGet(`${apiList['selectOption']}${params.namespace}`)
    if (data == undefined) {
        return false
    }
    return data.data
}

// 修改密码
export async function usersPass(params = {}) {
    const data = await sendPost('/quantchiAPI/api/umg/user/changePassword', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function loadPageCasLogin(params = {}) {
    const data = await httpObj.httpGet(CONSTANTS['API_LIST']['login']['loadPageCasLogin'], params)
    if (data == undefined) {
        return false
    }
    return data.data
}

export async function requestCurrentUserInfo() {
    const res = await httpObj.httpGet(`/quantchiAPI/api/umg/user/currentUser`)
    if (res == undefined) {
        return false
    }
    return res.data
}
