import { apis } from '@/apis';
import {
    getCookie,
    setCookie,
    removeCookie
} from '@/utils/auth';

const state = {
    token: getCookie('_lotteryTK'),
    licence: getCookie('_lotteryLC'),
    username: getCookie('username'),
    level: getCookie('level'),
    reqList: [] // 取消请求的url数组
};

const mutations = {
    SET_TOKEN: (state, value) => {
        state.token = value;
    },
    SET_LICENCE: (state, value) => {
        state.licence = value;
    },
    SET_USERNAME: (state, value) => {
        state.username = value;
    },
    SET_LEVEL: (state, value) => {
        state.level = value;
    },
    PUSH_REQ(state, payload) {
        state.reqList.push(payload.cancelToken);
    },
    CLEAR_REQ(state) {
        state.reqList.forEach(item => {
            item('路由跳转取消请求');
        });
        state.reqList = [];
    }
};

const actions = {
    // 登录
    Login({
        commit
    }, value) {
        return new Promise(async(resolve, reject) => {
            try {
                const { data } = await apis.login(value);
                commit('SET_TOKEN', data.tk);
                commit('SET_LICENCE', data.lc);
                commit('SET_USERNAME', value.username);
                commit('SET_LEVEL', data.lv);
                setCookie('_lotteryTK', data.tk, 3 / 24);
                setCookie('_lotteryLC', data.lc, 3 / 24);
                setCookie('username', value.username, 3 / 24);
                setCookie('level', data.lv, 3 / 24);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    },
    // 退出
    Logout({
        commit
    }) {
        return new Promise((resolve, reject) => {
            commit('SET_TOKEN', '');
            commit('SET_LICENCE', '');
            commit('SET_USERNAME', '');
            commit('SET_LEVEL', 0);
            removeCookie('_lotteryTK');
            removeCookie('_lotteryLC');
            removeCookie('username');
            removeCookie('level');
            resolve();
        });
    },
    // 追加当前路由的请求
    PushReq({
        commit
    }, value) {
        commit('PUSH_REQ', value);
    },
    // 清除当前页面所有请求
    ClearReq({
        commit
    }) {
        commit('CLEAR_REQ');
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};