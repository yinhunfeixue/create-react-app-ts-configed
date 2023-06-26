import { message, Modal } from 'antd'
import Cache from 'app_utils/cache'
import axios from 'axios'

require('es6-promise').polyfill()
const BaseName = process.env.BASE_URL || ''
const CancelToken = axios.CancelToken
const source = CancelToken.source()
let cancel

const sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            // 返回 ‘ok’
            resolve('ok')
        }, time)
    })
}

axios.interceptors.response.use(
    (response) => {
        console.log('response interceptor1 onResolved()', response.data.code)
        return response
    },
    (error) => {
        console.log('response interceptor1 onRejected()')
        return Promise.reject(error)
    }
)

// 入湖及防止浏览器请求缓存特殊处理
const isInLakeDeal = (url, params) => {
    let resUrl = url
    let resParams = params
    let isInLake = Cache.get('isInLake') || false
    let viewName = Cache.get('viewName')
    // url 上有参数的情况
    if (/\?/.test(resUrl)) {
        resUrl = resUrl + '&isInLake=' + isInLake + '&viewName=' + viewName + '&_t_=' + new Date().getTime() + '&_rd_=' + Math.floor(Math.random() * 10000000)
    } else {
        resUrl = resUrl + '?isInLake=' + isInLake + '&viewName=' + viewName + '&_t_=' + new Date().getTime() + '&_rd_=' + Math.floor(Math.random() * 10000000)
    }

    if (params instanceof FormData) {
        return {
            resUrl,
            resParams,
        }
    }

    if (Array.isArray(params)) {
        // url 上有参数的情况
        // if (/\?/.test(resUrl)) {
        //     resUrl = resUrl + '&isInLake=' + isInLake + '&_t_=' + new Date().getTime()
        // } else {
        //     resUrl = resUrl + '?isInLake=' + isInLake + '&_t_=' + new Date().getTime()
        // }
    } else {
        if (/\?/.test(resUrl)) {
            resParams = {
                ...params,
            }
        } else {
            resParams = {
                ...params,
                isInLake,
                viewName,
            }
        }
    }

    // console.log(resUrl, resParams, '-------isInLakeDeal--------isInLakeDeal---------')
    return {
        resUrl,
        resParams,
    }
}

// 请求reponse数据处理
const responseinterceptors = (response) => {
    // console.log(response, '----------response.headers-------------')
    if (response.headers && response.headers['jwt-quantchi']) {
        Cache.set('jwtQuantchi', response.headers['jwt-quantchi'])
    }
    const { code, msg } = response.data
    if (code && code !== 200) {
        if (code === 3001) {
            Modal.warning({
                title: '暂无权限操作',
                content: msg || '~',
            })
        } else {
            message.error(msg)
        }
    }
}

const reponseLogin = (res) => {
    if (res.data.code == '1001') {
        message.warning(res.data.msg ? res.data.msg : '您的登陆信息已过期,请重新登录')
        Cache.clear()
        if (res.data && res.data.casUrl) {
            window.location.href = res.data.casUrl
        } else {
            window.location.href = `${BaseName}/login`
        }

        return false
    } else {
        return res
    }
}

// 请求头设置
const axiosConfig = (disabledJwt = false) => {
    axios.defaults.withCredentials = false
    axios.defaults.timeout = 0
    // axios.defaults.headers['Cache-Control'] = 'no-cache'
    axios.defaults.headers['Pragma'] = 'no-cache'
    axios.defaults.headers['Cache-Control'] = 'no-cache'

    if (!disabledJwt && Cache.get('jwtQuantchi')) {
        axios.defaults.headers['jwt-quantchi'] = Cache.get('jwtQuantchi')
    } else {
        axios.defaults.headers['jwt-quantchi'] = ''
    }
}

/**
 * 附件文件名提取
 * @param {*} disposition
 */
const getAttachmentFileName = (disposition) => {
    // var disposition = xhr.getResponseHeader('Content-Disposition');
    let filename = ''
    if (disposition && disposition.indexOf('attachment') !== -1) {
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        let matches = filenameRegex.exec(disposition)
        if (matches != null && matches[1]) {
            filename = decodeURIComponent(matches[1].replace(/['"]/g, ''))
        }
    }
    return filename
}

const sendPost = (url, method = 'get', params, connect, disabledJwt = false) => {
    const { resUrl, resParams } = isInLakeDeal(url, params)
    url = resUrl
    params = resParams
    const sendParams =
        method == 'get'
            ? {
                  params,
              }
            : params

    axiosConfig(disabledJwt)

    return axios[method.toLowerCase()](connect + url, sendParams)
        .then(function (response) {
            responseinterceptors(response)
            return reponseLogin(response)
        })
        .catch((err) => {
            console.log(err)
        })
}

class httpClass {
    httpPost(url, params) {
        let sendParams = params

        axiosConfig()
        const { resUrl, resParams } = isInLakeDeal(url, params)
        url = resUrl
        params = resParams

        return axios['post'](url, params)
            .then(function (response) {
                responseinterceptors(response)
                return reponseLogin(response)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    httpGet(url, params) {
        const { resUrl, resParams } = isInLakeDeal(url, params)
        url = resUrl
        const sendParams = {
            params: resParams,
        }

        axiosConfig()
        return axios['get'](url, sendParams)
            .then(function (response) {
                responseinterceptors(response)
                return reponseLogin(response)
            })
            .catch((error) => {
                // console.log(error.response, '---------------------error.response')
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log('error.request', error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message)
                }
            })
    }

    httpPUT(url, params) {
        // let isInLake = Cache.get('isInLake') || false
        const { resUrl, resParams } = isInLakeDeal(url, params)
        url = resUrl
        const sendParams = resParams

        axiosConfig()
        return axios['put'](url, sendParams)
            .then(function (response) {
                responseinterceptors(response)
                return reponseLogin(response)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    httpDel(url, params) {
        axiosConfig()
        const { resUrl, resParams } = isInLakeDeal(url, params)
        url = resUrl
        const sendParams = resParams

        return axios['delete'](url, sendParams)
            .then(function (response) {
                responseinterceptors(response)
                return reponseLogin(response)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    httpGetDownload(url, params) {
        const { resUrl, resParams } = isInLakeDeal(url, params)
        url = resUrl
        // params = resParams
        const sendParams = {
            params: resParams,
        }

        axiosConfig()
        axios
            .get(url, {
                ...sendParams,
                responseType: 'blob',
            })
            .then((res) => {
                console.log(res.headers)
                responseinterceptors(res)
                let filename = getAttachmentFileName(res.headers['content-disposition'])
                console.log(`'${filename}'`)
                // let blob = res.data
                let blob = new Blob([res.data], {
                    type: res.headers['content-type'] || 'application/octet-stream',
                })
                let reader = new FileReader()
                reader.readAsDataURL(blob)
                reader.onload = (e) => {
                    let a = document.createElement('a')
                    a.download = filename.trim()
                    a.href = e.target.result
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                }
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    httpPostDownload(url, params) {
        const { resUrl, resParams } = isInLakeDeal(url, params)
        url = resUrl
        params = resParams

        axiosConfig()
        axios
            .post(url, params, {
                responseType: 'blob',
            })
            .then((res) => {
                console.log(res.headers)
                responseinterceptors(res)
                // let filename = decodeURIComponent(res.headers['content-disposition'].split('=')[1])
                let filename = getAttachmentFileName(res.headers['content-disposition'])
                // console.log(`'${filename}'`)
                let blob = res.data
                let reader = new FileReader()
                reader.readAsDataURL(blob)
                reader.onload = (e) => {
                    let a = document.createElement('a')
                    a.download = filename.trim()
                    a.href = e.target.result
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                }
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    httpPatch(url, params) {
        const sendParams = params
        axios.defaults.withCredentials = true
        axios.defaults.timeout = 0
        return axios['patch'](url, sendParams)
            .then(function (response) {
                // if (response.data.code == '1001') {
                //     Cache.clear()
                //     window.location.href = '#/login'
                //     return false
                // } else {
                //     return response
                // }
                responseinterceptors(response)
                return reponseLogin(response)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    httpCancelPost(url, params) {
        const sendParams = {
            ...params,
        }
        axios.defaults.withCredentials = true
        axios.defaults.timeout = 0
        return axios['post'](url, sendParams, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c
            }),
        })
            .then(function (response) {
                // if (response.data.code == '1001') {
                //     Cache.clear()
                //     window.location.href = '#/login'
                //     return false
                // } else {
                //     return response
                // }
                responseinterceptors(response)
                return reponseLogin(response)
            })
            .catch(function (thrown) {
                if (axios.isCancel(thrown)) {
                    console.log('Request canceled', thrown.message)
                } else {
                    console.log(thrown.message)
                }
            })
    }
    httpCancelGet(url, params) {
        const sendParams = {
            params,
        }
        axios.defaults.withCredentials = true
        axios.defaults.timeout = 0
        return axios['get'](url, sendParams, {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c
            }),
        })
            .then(function (response) {
                // if (response.data.code == '1001') {
                //     Cache.clear()
                //     window.location.href = '#/login'
                //     return false
                // } else {
                //     return response
                // }

                responseinterceptors(response)
                return reponseLogin(response)
            })
            .catch(function (thrown) {
                if (axios.isCancel(thrown)) {
                    console.log('Request canceled', thrown.message)
                } else {
                    console.log(thrown.message)
                }
            })
    }
    cancelRequest = () => {
        // 第一次执行时还未发送请求，会报错，添加如下判断
        if (typeof cancel === 'function') {
            // 取消请求
            cancel()
        }
    }
}

// 上传文件转成FormData格式
export const formData = function (params) {
    let formData = new FormData()
    if (params.uploadfile != undefined) {
        _.map(params.uploadfile, (item, key) => {
            formData.append('file', item)
        })
        delete params.uploadfile
    }

    _.map(params, (v, k) => {
        formData.append(k, v)
    })
    return formData
}

export const httpObj = new httpClass()

export default sendPost
