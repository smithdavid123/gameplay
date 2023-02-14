// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import FastClick from 'fastclick'
FastClick.prototype.focus = function(targetElement) {
  var length;
  if (!deviceIsIOS) return;
 // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
  if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
   length = targetElement.value.length;
   targetElement.focus();
   targetElement.setSelectionRange(length, length);
  } else {
   targetElement.focus();
 }
 };
 FastClick.attach(document.body);

import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import { $ } from 'jquery'
import router from './router'
// import MuseUI from 'muse-ui';
import MuseUI from 'muse-ui/es5/index.js';
import 'muse-ui/dist/muse-ui.css';
import './assets/iconfont/iconfont.css';
import './assets/mestyle.css';
import './assets/style.css'
import './permission'
import store from './store'
import md5 from 'js-md5';
import Toast from 'muse-ui-toast';
import  { LoadingPlugin } from 'vux'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
Vue.use(LoadingPlugin)

import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
import Loading from 'muse-ui-loading';
Vue.use(Loading);

Vue.config.productionTip = false
Vue.use(MuseUI);
Vue.use(Toast);

Vue.prototype.$md5 = md5;
Vue.prototype.$ = $;
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',


})
