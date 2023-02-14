// permission.js
import Vue from 'vue'
import router from './router'
import store from './store'
import { getToken } from '@/utils/auth' // 验权
import  {openCode} from  '@/api/login'

const whiteList = ['/login','/service'] // 不重定向白名单

router.beforeEach((to, from, next) => {

  if (getToken()) { // 判断是否有token
  if(to.path === '/game'){
    openCode().then((res)=>{
      localStorage.setItem('listDataGame', JSON.stringify(res));

    });
  }
    if (to.path === '/login') {
       next({ path: '/' })
    } else {
        // -------------------------四个大菜单中前三个应该没有必要请求用户信息----------------------------
        let keys = new Set(['/helloWorld', '/play', '/game']);
        if (!keys.has(to.path)) {
          store.dispatch('GetInfo').then(res => { // 拉取用户信息
            next();
          }).catch(() => {
            store.dispatch('FedLogOut').then(() => {
              next({ path: '/login' });
            })
          })  
        } else {
          next();
        }
        // -----------------------------------------------------
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

