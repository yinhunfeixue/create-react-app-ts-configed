import { getUserList, getUserTree, getRoleMenu, saveRoleMenu } from 'app_api/manageApi'

class UserService {
    /**
     * 只获取某些条件下的用户 ID 和 NAME
     * @param {*} params 
     */
    static async getUserIdNameList(params = {}) {
        let res = {}
        let param = {
            page: 1,
            page_size: 99999,
            brief: true,
            ...params,
        }
        res = await getUserList(param)
        if (res.code == 200) {
            return res.data
        } else {
            return []
        }
        // return res
    }

    /**
     * 只获取某些条件下的用户所有详细信息
     * @param {*} params 
     */
    static async getUserInfoList(params = {}) {
        let res = {}
        let param = {
            ...params,
            brief: false,
        }
        res = await getUserList(param)
        if (res.code == 200) {
            return res.data
        } else {
            return []
        }
    }


    /**
     * 获取部门信息
     * @param {*} params 
     */
    static async getUserDepartmentsList(params = {}) {
        let res = {}
        let param = {
            ...params,
            // brief: false,
            recursive: true
        }
        res = await getUserTree(param)
        // if (res.code == 200) {
        return res
        // } else {
        //     return []
        // }
    }

    /**
     * 根据角色 ID 获取角色用户信息
     * @param {*} params 
     */
    static async getRoleMenuByRoleId(params = {}) {
        let res = {}
        let param = {
            ...params,
            // brief: false,
        }
        res = await getRoleMenu(param)
        // if (res.code == 200) {
        return res
        // } else {
        //     return []
        // }
    }

    /**
     * 保存角色权限配置信息
     * @param {*} params 
     */
    static async saveRoleMenuData(params = {}) {
        let res = {}
        let param = {
            ...params,
            // brief: false,
        }
        res = await saveRoleMenu(param)
        // if (res.code == 200) {
        return res
        // } else {
        //     return {}
        // }
    }
}

export default UserService