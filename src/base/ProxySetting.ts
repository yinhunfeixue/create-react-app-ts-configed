import Model from '@/model/Model';
import PageUtil from '@/utils/PageUtil';
import { notification } from 'antd';
import axios, { AxiosResponse } from 'axios';

const duration = 3;
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
      const token = Model.token;
      if (token) {
        config.headers = {
          ...config.headers,
          token,
        };
      }
      return config;
    });
  }

  /**
   * 请求响应拦截器。
   * 通常，需要对一些消息做全局的错误处理，在此处进行。
   * 处理完成后，如果不希望
   */
  static successHandler(response: AxiosResponse) {
    //当出错时，执行全局响应处理，并不再向后执行
    const { code, msg } = response.data;
    if (code !== 200) {
      ProxySetting.showErrorMessage(msg);
      return Promise.reject();
    }

    return response;
  }

  /**
   * 全局错误拦截器
   * @param {*} error
   */
  static errorHandler(error: any) {
    const { message, response } = error;
    if (response) {
      const { status } = response;
      switch (status) {
        case 401:
          PageUtil.openLoginPage(window.location.href);
          break;
        default:
          ProxySetting.showErrorMessage(message, status);
          break;
      }
    } else {
      ProxySetting.showErrorMessage(message);
    }
    return Promise.reject();
  }

  static showErrorMessage(resMessage?: string, status?: string) {
    const message = resMessage || `未知错误： ${status || ''}`;
    notification.error({
      message,
      duration,
    });
  }
}

export default ProxySetting;
