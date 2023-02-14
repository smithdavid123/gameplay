import Vue from 'vue';
import store from '@/store';
let qs = require('qs');
import request from '@/utils/request';
import {
    filterNull,
    getNextDate
} from '@/utils';

const modulesFiles = require.context('./modules', false, /\.js$/);
export const apis = modulesFiles.keys().reduce((modules, modulePath) => {
    // './auth.js' => 'auth'
    const moduleValue = modulesFiles(modulePath).default;
    moduleValue.forEach(item => {
        const {
            name,
            ...formData
        } = item;
        const {
            method
        } = formData;
        modules[name] = (obj, auth = { tk: store.getters.token, lc: store.getters.licence }) => {
            let newObj = {...obj };
            try {
                newObj.eDate && (newObj.eDate = `${getNextDate(newObj.eDate, 1)} 00:00:00`);
                newObj.eTime && (newObj.eTime = `${getNextDate(newObj.eTime, 1)} 00:00:00`);
                newObj.endTime && (newObj.endTime = `${getNextDate(newObj.endTime, 1)} 00:00:00`);
                newObj.endSubmitTime && (newObj.endSubmitTime = `${getNextDate(newObj.endSubmitTime, 1)} 00:00:00`);
                newObj.endFinishTime && (newObj.endFinishTime = `${getNextDate(newObj.endFinishTime, 1)} 00:00:00`);
            } catch (error) {

            }
            const assignObj = Object.assign({}, newObj, auth);
            formData.data = method === 'post' ? qs.stringify(filterNull(assignObj)) : null;
            formData.params = method === 'get' ? filterNull(obj) : null;
            return request(formData);
        };
    });
    return modules;
}, {});

Object.defineProperty(Vue.prototype, '$api', {
    value: apis
});