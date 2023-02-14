import Vue from 'vue';

const modulesFiles = require.context('./modules', false, /\.js$/);
modulesFiles.keys().forEach(modulePath => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const moduleValue = modulesFiles(modulePath).default;
    Vue.directive(moduleName, moduleValue);
});