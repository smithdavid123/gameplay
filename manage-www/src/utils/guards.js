import router from '@/router';
import store from '@/store';
import {
    getCookie
} from '@/utils/auth';

const whiteList = ['/login', '/'];

router.beforeEach(async(to, from, next) => {
    store.dispatch('user/ClearReq');
    const hasToken = getCookie('_lotteryTK');
    const hasLicence = getCookie('_lotteryLC');
    // has token && licence
    if (hasToken && hasLicence) {
        next();
    } else {
        // no token && licence
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next('/login');
        }
    }
});