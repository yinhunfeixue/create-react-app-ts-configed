/**
 * 这里是打开各种页面的方法，方法定义了参数
 */
class PageUtil {

    public static addTab: (pageKey: string, params?: any, newWindow?: boolean) => void
    /**
     * 打开权限首页
     * @param params 参数
     * type--目标类型：角色、用户、部门
     * id——目标id
     * name--目标名称，当type=user时，需要传此参数，用于搜索用户
     */
    static openPermissionIndex(params: { type: 'role' | 'user' | 'department'; id: string; name?: string }) {
        PageUtil.addTab('PermissionIndex', params)
    }


}
export default PageUtil
