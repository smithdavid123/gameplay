<template>
  <div class="main-bg ccc" >

  <!--  <img src="../assets/images/login_bg.jpg" style="width: 100%"/>-->
    <div class="login-form mu-demo-form">
      <p class="tc logoimg" >


      </p>
      <mu-form ref="form" :model="validateForm" class=" ">

        <mu-form-item  prop="username" :rules="usernameRules">
          <mu-text-field v-model="validateForm.username"  icon=":iconfont icon-yonghutouxiang"  placeholder="账号登录"  prop="username"></mu-text-field>
        </mu-form-item>
        <mu-form-item  prop="password" :rules="passwordRules">
          <mu-text-field type="password" v-model="validateForm.password"  icon=":iconfont icon-mima" placeholder="密码" prop="password"></mu-text-field>
        </mu-form-item>
        <mu-form-item style="margin: 0">
          <div class="clearfix" style="width: 100%">
            <div class="fl">
              <mu-checkbox v-model="isChecked" label="记住密码" ></mu-checkbox>

            </div>

            <div class="fr" style="right: 0">
              <mu-button flat  to="/service" small style="margin: 0">
                联系客服
              </mu-button>
            </div>

          </div>


        </mu-form-item>
        <mu-form-item>

          <div style="width: 100%">
            <mu-button color="#03A9F4" @click="submit" style="width: 95%;color: #fff;">{{textLogin}}</mu-button>

          </div>

        </mu-form-item>

      </mu-form>
    </div>



  </div>
</template>
<script>
  import Cookies from 'js-cookie'
  import { isLogin ,initData, getAppVersion } from '@/api/login';
  import Version from  '@/utils/version';
  //#952b39   #5b1314
  export default {
    data () {
      return {

        loading: false,
        usernameRules: [
          { validate: (val) => !!val, message: '必须填写账号'},
        ],
        passwordRules: [
          { validate: (val) => !!val, message: '必须填写密码'},
        ],
        argeeRules: [{ validate: (val) => !!val, message: '必须同意用户协议'}],
        isChecked:true,
        validateForm: {
          username: '',
          password: '',
          mcode:3//2pingguo 3 anzuo

        },
        textLogin:'登录',
        disabledBtn:true
      }
    },

    created () {
    /*  isLogin().then();*/
      var lett=this;
      document.onkeydown=function(e){
        var key=window.event.keyCode;
        if(key==13){
          lett.submit();
        }
      };
     this.getCookie();
    },
    mounted () {
      getAppVersion().then((rst)=>{
        let res = rst.data;
        let vs = res.version.toString().split("");
        let lastVersion = parseInt(res.version);
        let force = parseInt(res.force);

        if (lastVersion > Version) {
          alert("温馨提示：请更新至最新版本：V" + vs.join(".") + "! " + res.desp);
          if (force) {
            this.textLogin = "请更新";
            this.disabledBtn = false;
          }
        }
      });

    },
    methods: {

      submit () {

        if(!this.disabledBtn){

          return
        }else{
          // 判断复选框是否被勾选; 勾选则调用配置Cookie方法
          if (this.isChecked) { // 记住密码

            this.setCookie(this.validateForm.username, this.validateForm.password, 30); // 保存期限为30天
          } else {
            this.clearCookie(); // 清空 Cookie
          }
          this.$refs.form.validate().then((result) => {
            if(result){
              this.loading = true;
              this.textLogin = '登录中..';
              this.disabledBtn =  false;



              this.$store.dispatch('Login',this.validateForm).then(() => {
                localStorage.setItem("currentUser", this.validateForm.username);
                this.$router.push({ path: '/helloWorld' });
                this.loading = false;

                setTimeout(() => {

                  this.textLogin = '登录';
                  this.disabledBtn =  true;
                }, 500)



              }).catch(() => {
                this.textLogin = '登录';
                this.disabledBtn =  true;
                this.loading = false
              })
            }
          });
        }

      },
      // 设置Cookie
      setCookie(username, password, exdays) { // 用户名, 密码, 保存天数
        let exdate = new Date(); // 获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
        // 字符串拼接cookie
        window.document.cookie = 'userName=' + username + ';path=/;expires=' + exdate.toGMTString();
        window.document.cookie = 'userPwd=' + password + ';path=/;expires=' + exdate.toGMTString();
      },
      // 读取Cookie
      getCookie() {
        if (document.cookie.length > 0) {
          this.isChecked = true
          let arr = document.cookie.split('; '); // 这里显示的格式需要切割一下自己可输出看下
          for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split('='); // 再次切割
            // 判断查找相对应的值
            if (arr2[0] == 'userName') {
              this.validateForm.username = arr2[1]; // 保存到保存数据的地方
            } else if (arr2[0] == 'userPwd') {
              this.validateForm.password = arr2[1];
            }
          }
        }else{
          this.isChecked = false
        }
      },
      // 清除Cookie
      clearCookie() {
        this.setCookie('', '', -1); // 修改2值都为空，天数为负1天就好了
      }

    }
  };
</script>
<style scoped>
  .main-bg{
    width: 100%;
    height: 100%;

  }
.mu-demo-form{
  position: absolute;
  z-index: 1000;
  top: 0%;
  width: 85%;
  height: 65%;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-radius: 5px;
}
  .login-form /deep/ .mu-text-field-input{
    text-indent: 40px;
    height: 39px;
    background-color: #fff;
    color: #424242;

  }.login-form /deep/ .mu-input-icon{
             color: #424242;
       z-index: 99;
             font-size: 25px!important;
             left: 9px;
             top: 0;
  }


  /*.login-form /deep/ .mu-checkbox-label{*/
  /*  color: #fff;*/
  /*}*/
  .login-form  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #606266;
    font-size: 14px;
  }

  .login-form ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #606266;
    font-size: 14px;
  }

  .login-form :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #606266;
    font-size: 14px;
  }
  .ccc{
background-image: url('../assets/images/login_bg.jpg');
    background-size: cover;
    background-position: center center;
  }
  .mTitle_main{
    background-image:-webkit-linear-gradient(right,#ffbc00,#f1eb2d,#ffbc00);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    font-size: 36px;

  }
  .login-form .logoimg{
    width: 11rem;
    height: 11rem;
  }

</style>
