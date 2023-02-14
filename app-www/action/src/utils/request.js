import axios from 'axios'
import store from '../store'
import Qs from 'qs'
import Toast from 'muse-ui-toast';
import { getToken  ,getCookie} from '@/utils/auth' // 验权
import baseURL from '@/utils/conf';


// 创建
const service = axios.create({
  //baseURL: 'http://47.90.120.37:8007', // api的base_url
  //baseURL: 'http://47.90.120.37:8005/api', // api的base_url
  //baseURL: 'http://d.jinhua101.com', // api的base_url
  //baseURL: 'http://d.ldegj101.com', // api的base_url
  // baseURL: 'http://127.0.0.1:8007', // api的base_url
  baseURL: baseURL, // api的base_url
  //baseURL: 'http://10.101.1.177:8007', // api的base_url
  withCredentials:true,//默认跨域记住session
  transformRequest: [function (data) {
    if (!data) data = {};
    data.tk = getToken()
    data.lc = getCookie()
    data = Qs.stringify(data);
    return data;
  }],

})


// 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.error !=0) {

      if(res.error){
        if(res.code == '001'){

          Toast.message({
            message: res.message,
            position: 'center',

          });

        }
        if(res.error == '1'){

          Toast.message({
            message: res.message,
            position: 'center',

          });

        }

      }else{
        return response.data;
      }

      return Promise.reject('error');
    } else {

      return response.data;

    }
    return  response.data
  },
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */


  error => {
    /*    Message({
          message: error.message,
          type: 'error',
          duration: 1000
        })*/
    return Promise.reject(error)
  })

export default service
