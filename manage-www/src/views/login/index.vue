<template>
  <div class="module-login">
    <vue-particle-line />
    <div class="form-wrap cc">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
      >
        <div class="form-header">
          <p class="logo-text">
            管理系统
          </p>
          <p class="logo-des">
            Management System
          </p>
        </div>
        <el-form-item prop="username">
          <el-input
            v-model.trim="form.username"
            placeholder="请输入您的用户名"
            class="text-input"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model.trim="form.password"
            type="password"
            placeholder="请输入您的密码"
          />
        </el-form-item>
        <el-form-item prop="securityCode">
          <div class="form-code">
            <el-input
              v-model.trim="form.securityCode"
              placeholder="请输入验证码"
              class="form-code-input"
            />
            <div
              v-show="show"
              class="form-code-img"
              @click="getCode"
            >
              <img
                :src="`/api/utils/login-security-code?${form.tms}`"
                alt="验证码"
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="form-submit"
            @click="submitForm('form')"
          >
            {{ loginText }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            logging: false,
            show: true,
            form: {
                username: '',
                password: '',
                securityCode: '',
                tms: new Date().getTime()
            },
            rules: {
                username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                securityCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            }
        };
    },
    computed: {
      loginText: function() {
        return this.logging ? '登录中...' : '立即登录';
      }
    },
    created() {
      Object.assign(this.$root.$children[0].$data, this.$root.$children[0].$options.data());
    },
    methods: {
      // 提交
        submitForm (formName) {
          if (!this.logging) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    this.logging = true;
                    try {
                        const { lv } = await this.$store.dispatch('user/Login', this.form);
                        if (lv < 2) {
                          this.$message.error('用户无权限!');
                          this.getCode();
                          this.logging = false;
                        } else {
                          this.$router.push({
                              path: '/dashboard'
                          });
                        }
                    } catch (error) {
                        this.getCode();
                        this.logging = false;
                    }
                } else {
                    this.getCode();
                    return false;
                }
            });
          }
        },
        // 重置验证码
        getCode() {
          this.show = false;
          this.form.tms = new Date().getTime();
          this.$nextTick(() => {
            this.show = true;
          });
        }
    }
};
</script>
