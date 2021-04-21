import { notification } from 'antd';
import axios from 'axios';

/**
 * 网络代理的配置类
 */
class ProxySetting {
  static init() {
    axios.defaults.baseURL = './';
    axios.defaults.withCredentials = true;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.interceptors.response.use(
      ProxySetting.successHandler,
      ProxySetting.errorHandler
    );
    axios.interceptors.request.use((config) => {
      // 如需添加全局请求头，在这里配置
      // const token = '1111'
      // if (token) {
      //   config.headers.token = token;
      // }
      return config;
    });
  }

  /**
   * 请求响应拦截器。
   * 通常，需要对一些消息做全局的错误处理，在此处进行。
   * 处理完成后，如果不希望
   */
  static successHandler(response) {
    //当出错时，执行全局响应处理，并不再向后执行
    const { code, message } = response.data;
    if (code !== 200) {
      notification.error({
        description: message,
      });
      return Promise.reject();
    }
    return response;
  }

  /**
   * 全局错误拦截器
   * @param {*} error
   */
  static errorHandler(error) {
    const { message, response } = error;
    const { status } = response;
    switch (status) {
      case 401:
        break;
      default:
        notification.error({
          description: message || `未知错误:${status}`,
        });
        break;
    }
    return Promise.reject();
  }
}

export default ProxySetting;
