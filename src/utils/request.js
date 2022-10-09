import axios from 'axios';
// import { Message } from 'element-ui';
import { decrypt } from './secret';
import { store } from './store';

// 创建axios实例
const service = axios.create({
    baseURL: 'https://i.xuewuzhibu.cn/api/v1',
    timeout: 5000,
    headers: {
        Accept: 'application/json',
    },
});
// 请求拦截
service.interceptors.request.use(
    config => {
        const token = decrypt(store.get('config', false).token);
        token && (config.headers.Authorization = token);
        console.log(config);
        return config;
    },
    error => Promise.reject(error)
);

// 响应拦截
service.interceptors.response.use(
    response => {
        return response;
    },
    error => Promise.reject(error)
);

export default service;
