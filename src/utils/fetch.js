// axios请求模块
import axios from 'axios'
import React from 'react'

let fetcher = axios.create({
    method:'post',
    baseURL: 'http://192.168.2.56',
    withCredentials: true,
    timeout: 60000,
    // headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Content-Type': 'application/json',
    // }    
})
// 路由拦截器、在这里做一些登录失效处理和错误码的统一处理
fetcher.interceptors.request.use(function (config) {
  return config
}, function (error) {
    return Promise.reject(error);
})
// reponse 这时候可以对code码进行统一的处理
fetcher.interceptors.response.use(function (reponse) {
 return reponse
}, function (error) {
    return Promise.reject(error);
})
export const post = fetcher.post
export const put = fetcher.put
export const get = (url,params) => {
  params = params || {}
  return fetcher.get(url, params)
}
export const del = (url, params) => {
    return fetcher.delete(url,params)
}