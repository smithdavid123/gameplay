import {GameList} from '@/assets/js/game/game';
import {MethodList} from '@/assets/js/game/method_config';

export let account_data;
export let config_data;
export let lotterys;
export let methods;
export let lottery_methods = {};

function  init () {
  let store = JSON.parse(localStorage.getItem('initdata'))
  account_data = {
    lotteryCode: store?store.gameLotteryAccount.code:0,
    lotteryPoint:store?store.gameLotteryAccount.point:0
  }
  config_data = {
    lotteryCode: store?store.gameLotteryConfig.sysCode:0,
    lotteryPoint: store?store.gameLotteryConfig.sysPoint:0,
    unitMoney: store?store.gameLotteryConfig.sysUnitMoney:0,
  };
  
  // 从服务器过来的差异化数据
  store ? store.gameLotteryMethodList.map(function (a) {
    if (!(a.lottery in lottery_methods)) lottery_methods[a.lottery] = {};
    lottery_methods[a.lottery][a.methodName] = a;
  }) : {};

  // 采种处理
  let obj = GameList.cache;
  store ? store.gameConfig.forEach(d => {
    obj[d.lottery].floatBonus = d.floatBonus;
    obj[d.lottery].stopDelay = d.stopDelay;
  }) : {};
  
  // 加载本地彩种配置
  
  // store?store.gameLotteryInfoList.map(function (a) {
  //   obj[a.shortName] = a;
  // }):{};

  lotterys = obj;

  // let _methods = [{},{},{},{},{},{}];
  // 加载本地玩法配置
  let _methods = MethodList;
  // store?store.gameLotteryMethodList.map(function (a) {
  //   _methods[a.type-1][a.methodName] = a;
  // }):{};

  methods = _methods;
  
  // console.log(JSON.stringify(lotterys));
  // console.log(JSON.stringify(methods));

}
 init()
export  function  updateCache () {
   init()
}
