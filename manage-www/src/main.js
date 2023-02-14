import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/icons'; // icon
import '@/components'; // 全局组件
import '@/filters'; // 全局过滤器
import '@/directive'; // 全局指令
import '@/apis'; // 全局api
import '@/components/Library'; // 第三方插件
import '@/utils/date-fns'; // 时间转化
import '@/utils/guards'; // 路由守卫
import '@/style/index.scss'; // 全局样式

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');