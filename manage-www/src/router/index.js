import Vue from 'vue';
import VueRouter from 'vue-router';
if (!window.VueRouter) Vue.use(VueRouter);

const modulesFiles = require.context('./modules', true, /\.js$/);

const routes = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleValue = modulesFiles(modulePath);
    return [...modules, ...moduleValue.default];
}, []);

const router = new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes
});

export default router;