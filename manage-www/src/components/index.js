import Vue from 'vue';

// 自动加载 global 目录下的 .js 结尾的文件
const componentsContext = require.context('./Global', true, /index.js$/);
componentsContext.keys().forEach(key => {
    const componentConfig = componentsContext(key);
    const component = componentConfig.default || componentConfig;
    Vue.component(component.name, component);
});
