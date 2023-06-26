import { httpObj } from './base.js';
import { message } from 'antd';

type requestFunc = <O extends Record<string, any>, T = any>(url: string, params: O) => Promise<API.Response<T>>;

interface TRequest {
  get: requestFunc,
  post: requestFunc,
  put: requestFunc,
  del: requestFunc,
  httpGetDownload: requestFunc,
  httpPostDownload: requestFunc,
}

const Request: TRequest = {
  get: async (url, params) => {
    const response = await httpObj.httpGet(url, params) || {};
    /* if((response.data || {}).code !== 200) {
      (response.data || {}).msg &&  message.error((response.data || {}).msg)
    } */
    return Promise.resolve(response.data)
  },
  post: async (url, params) => {
    const response = await httpObj.httpPost(url, params) || {};
    /* if((response.data || {}).code !== 200) {
      (response.data || {}).msg &&  message.error((response.data || {}).msg)
    } */
    return Promise.resolve(response.data)
  },
  put: async (url, params) => {
    const response = await httpObj.httpGet(url, params) || {};
    /* if((response.data || {}).code !== 200) {
      (response.data || {}).msg &&  message.error((response.data || {}).msg)
    } */
    return Promise.resolve(response.data)
  },
  del: async (url, params) => {
    const response = await httpObj.httpDel(url, params) || {};
    /* if((response.data || {}).code !== 200) {
      (response.data || {}).msg &&  message.error((response.data || {}).msg)
    } */
    return Promise.resolve(response.data)
  },
  httpGetDownload: async (url, params) => {
    const response = await httpObj.httpGetDownload(url, params) || {};
    /* if((response.data || {}).code !== 200) {
      (response.data || {}).msg &&  message.error((response.data || {}).msg)
    } */
    return Promise.resolve(response.data)
  },
  httpPostDownload: async (url, params) => {
    const response = await httpObj.httpPostDownload(url, params) || {};
    /* if((response.data || {}).code !== 200) {
      (response.data || {}).msg &&  message.error((response.data || {}).msg)
    } */
    return Promise.resolve(response.data)
  },
}

export default Request;