import axios from 'axios';
import {
    Message
} from 'element-ui';
import store from '@/store';
import router from '@/router';

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials: true,
    timeout: 150000
});

service.interceptors.request.use(
    config => {
        config.cancelToken = new axios.CancelToken(cancel => store.dispatch('user/PushReq', { cancelToken: cancel }));
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    async response => {
        const { data } = response;
        if (data.error) {
            Message({
                message: data.message || '操作失败!',
                type: 'error',
                duration: 5 * 1000
            });
            if (+data.code === 110) {
                await store.dispatch('user/Logout');
                router.push({
                    path: '/login'
                });
            }
            return Promise.reject(data.msg || 'error');
        } else {
            return data;
        }
    },
    async error => {
        const { data } = error.response;
        Message({
            message: data.msg || '网络出现障碍，请刷新页面!',
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(data);
    }
);

export default service;