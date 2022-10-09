import axios from 'axios';
import { Message } from 'element-ui';
import { decrypt } from './secret';
import { store } from './store';

// 提示函数
const tip = (msg, type) => {
    Message({
        message: msg,
        type: type || 'error',
        duration: 5000,
        center: true,
    });
};

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */

const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        // 401: 未登录或授权失败，没有填写token或token无效
        case 401:
            tip('未填写token或token无效');
            break;
        // 403 管理员关闭了接口功能或没有该接口权限
        case 403:
            tip('管理员关闭了该接口或没有权限权限');
            break;
        // 429 超出请求配额，请求受限
        case 429:
            tip('请求过于频繁，请稍后再试');
            break;
        // 500: 服务器出现异常
        case 500:
            tip('服务器出现异常');
            break;
        // 404请求不存在
        case 404:
            tip('请求的资源不存在');
            break;
        default:
            console.log(other);
    }
};

// 创建axios实例
const service = axios.create({
    baseURL: 'https://i.xuewuzhibu.cn/api/v1',
    timeout: 10000 * 12,
    headers: {
        Accept: 'application/json',
    },
});
// 请求拦截
service.interceptors.request.use(
    config => {
        const token = decrypt(store.get('config', false).token);
        token && (config.headers.Authorization = token);
        return config;
    },
    error => Promise.reject(error)
);

// 响应拦截
service.interceptors.response.use(
    response =>
        response.status === 200
            ? Promise.resolve(response.data)
            : Promise.reject(response),
    error => {
        if (error.response) {
            errorHandle(error.response.status, error.response.data);
            return Promise.reject(error.response);
        } else {
            console.log(error);
        }
    }
);

export default service;
