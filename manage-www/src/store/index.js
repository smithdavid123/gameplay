import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';

if (!window.Vuex) Vue.use(Vuex);

const modulesFiles = require.context('./modules', false, /\.js$/);

const modules = modulesFiles.keys().reduce((resultModules, modulePath) => {
    // './base.js' => 'base'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const moduleValue = modulesFiles(modulePath);
    resultModules[moduleName] = moduleValue.default;
    return resultModules;
}, {});

const store = new Vuex.Store({
    modules,
    getters
});

export default store;