import { loginByUsername, logout, getUserInfo ,initData} from '@/api/login'
import { getToken, setToken, removeToken,removeCookie ,setCookie} from '@/utils/auth'
import {GameList} from '@/assets/js/game/game';

const user = {
  state: {
    token: getToken(),

    person:'',

    isAdmin:'',
    initData:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },

    SET_PERSON: (state, person) => {
      state.person = person
    },

    SET_ISADMIN: (state, isAdmin) => {
      state.isAdmin = isAdmin
    },
    SET_INITDATA: (state, initData) => {
      state.initData = initData
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
/*      const userName = userInfo.userName.trim()*/
      return new Promise((resolve, reject) => {
        debugger
        loginByUsername(userInfo).then(response => {
          removeToken()

          const data = response.data
          setToken(data.tk)
          setCookie(data.lc)
          commit('SET_TOKEN', data)
          InitAllData(data);
          resolve();
          
        }).catch(error => {

          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data;
          commit('SET_PERSON', data);
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {

          commit('SET_TOKEN', '');
          commit('SET_PERSON', '')
          commit('SET_ISADMIN', '')
          commit('SET_INITDATA','')

          removeToken()
          removeCookie()
          resolve()

        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')

        removeToken()
        removeCookie()
        resolve()
      })
    }
  }
}

function InitAllData (res) {
  let data = res.initData;
  // 使用本地信息
  data['gameLotteryInfoList'] = GameList.list;
  data['gameLotteryMethodList'] = [];
  data['gameConfig'] = [];
  res.methods.forEach(d => {
    data['gameLotteryMethodList'].push({'lottery': d[0], 'methodName': d[1], 'bonus': d[2]});
  });
  
  if (res.games) res.games.forEach(d => {
    data['gameConfig'].push({'lottery': d[0], 'floatBonus': parseFloat(d[1]), 'stopDelay': parseInt(d[2])});
  })
  localStorage.setItem('initdata', JSON.stringify(data));
}

export default user
