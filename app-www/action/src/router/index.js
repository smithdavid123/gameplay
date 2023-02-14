import Vue from 'vue'
import Router from 'vue-router'
const Layout = r => require.ensure([], () => r(require('@/views/layout')), 'Layout')
const HelloWorld = r => require.ensure([], () => r(require('@/views/HelloWorld')), 'HelloWorld')
const Login = r => require.ensure([], () => r(require('@/views/Login')), 'Login')
const play = r => require.ensure([], () => r(require('@/views/play')), 'play')
const playItem = r => require.ensure([], () => r(require('@/views/playItem')), 'playItem')
const game = r => require.ensure([], () => r(require('@/views/game')), 'game')
const person = r => require.ensure([], () => r(require('@/views/person')), 'person')
const personSearch = r => require.ensure([], () => r(require('@/views/personSearch')), 'personSearch')
const systemNotice = r => require.ensure([], () => r(require('@/views/systemNotice')), 'systemNotice')
const message = r => require.ensure([], () => r(require('@/views/message')), 'message')
const setting = r => require.ensure([], () => r(require('@/views/setting')), 'setting')
const oppenGame = r => require.ensure([], () => r(require('@/views/oppenGame')), 'oppenGame')
const setModel = r => require.ensure([], () => r(require('@/views/setModel')), 'setModel')
const setModelCard = r => require.ensure([], () => r(require('@/views/setModelCard')), 'setModelCard')
const personPayment = r => require.ensure([], () => r(require('@/views/personPayment')), 'personPayment')
const pay = r => require.ensure([], () => r(require('@/views/pay')), 'pay')
const service = r => require.ensure([], () => r(require('@/views/service')), 'service')
const addNumber = r => require.ensure([], () => r(require('@/views/addNumber')), 'addNumber')
const signedContract = r => require.ensure([], () => r(require('@/views/signedContract')), 'signedContract')

Vue.use(Router)

export default new Router({
    routes: [

        {
            path: '/',
            redirect: '/helloWorld',
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/helloWorld',
            component: Layout,
            name: 'helloWorld',
            redirect: 'helloWorld',
            meta: { title: '舆情数据', isFlag: false, role: '' },
            children: [{
                path: '',
                component: HelloWorld,
                meta: { title: '舆情数据' },
            }]

        },
        {
            path: '/play',
            component: Layout,
            name: 'play',
            redirect: 'play',
            meta: { title: '舆情数据', isFlag: false, role: '' },
            children: [{
                path: '',
                component: play,
                meta: { title: '舆情数据' },
            }]

        },
        {
            path: '/playItem',
            component: playItem,
            name: 'playItem',


        },
        {
            path: '/game',
            component: Layout,
            name: 'game',
            redirect: 'game',
            meta: { title: '舆情数据', isFlag: false, role: '' },
            children: [{
                path: '',
                component: game,
                meta: { title: '舆情数据' },
            }]

        },
        {
            path: '/person',
            component: Layout,
            name: 'person',
            redirect: 'person',
            meta: { title: '舆情数据', isFlag: false, role: '', keepAlive: true },
            children: [{
                path: '',
                component: person,
                meta: { title: '舆情数据' },
            }]

        }, {
            path: '/personSearch',
            component: personSearch,
            name: 'personSearch',


        },
        {
            path: '/systemNotice',
            component: systemNotice,
            name: 'systemNotice',


        },
        {
            path: '/message',
            component: message,
            name: 'message',


        }, {
            path: '/setting',
            component: setting,
            name: 'setting',


        }, {
            path: '/setModel',
            component: setModel,
            name: 'setModel',


        }, {
            path: '/setModelCard',
            component: setModelCard,
            name: 'setModelCard',


        }, {
            path: '/oppenGame',
            component: oppenGame,
            name: 'oppenGame',


        },
        {
            path: '/personPayment',
            component: personPayment,
            name: 'personPayment',


        },
        {
            path: '/pay',
            component: pay,
            name: 'pay',


        }, {
            path: '/service',
            component: service,
            name: 'service',


        }, {
            path: '/addNumber',
            component: addNumber,
            name: 'addNumber',


        }, {
            path: '/signedContract',
            component: signedContract,
            name: 'signedContract',


        }

    ],
    //页面跳转显示在顶部
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }

})