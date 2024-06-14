import PageUtil from '@/utils/PageUtil';
import ProjectUtil from '@/utils/ProjectUtil';

/**
 * LoginApi
 */
class LoginApi {
  static logout() {
    localStorage.removeItem('token');
    ProjectUtil.setModelData({ token: undefined });
    PageUtil.openLoginPage();
  }
}
export default LoginApi;
