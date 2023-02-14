<template>
  <header>
    <div class="header-left">
      <router-link
        tag="span"
        to="/dashboard"
      >
        后台管理系统
      </router-link>
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        background-color="#393d49"
        text-color="#9d9d9d"
        active-text-color="#fff"
        router
      >
        <el-submenu
          v-for="(item, i) in menus"
          :key="i"
          :index="`${i}`"
        >
          <template slot="title">
            <svg-icon
              :icon-class="item.meta.icon"
              class-name="menu-icon"
            />{{ item.meta.title }}
          </template>
          <el-menu-item
            v-for="(child, j) in item.children"
            :key="j"
            :index="`${item.path}/${child.path}`"
          >
            <svg-icon
              :icon-class="child.meta.icon"
              class-name="menu-icon"
              style="top: 0;"
            />{{ child.meta.title }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div
      class="header-right"
      @mouseenter="show = true"
      @mouseleave="show = false"
    >
      <img
        src="../../assets/image/avatar.jpg"
        alt="个人头像"
      >
      <span class="name">{{ username }}</span>
      <i class="el-icon-caret-bottom caret-icon" />
      <transition name="el-zoom-in-top">
        <ul
          v-show="show"
          class="user-sub"
        >
          <li
            v-for="item in toggleList"
            :key="item.value"
          >
            <a
              href="javascript:void(0);"
              @click="logOut"
            >{{ item.label }}</a>
          </li>
        </ul>
      </transition>
    </div>
  </header>
</template>
<script>
  export default {
    name: 'Header',
    data() {
      return {
        show: false,
        toggleList: [{
          label: '修改密码',
          value: 'password'
        },{
          label: '二次验证',
          value: 'verification'
        },{
          label: '平台公告',
          value: 'notice'
        },{
          label: '安全退出',
          value: 'layout'
        }]
      };
    },
    computed: {
      username: function() {
        return this.$store.getters.username;
      },
      menus: function() {
        return this.$store.getters.routes;
      },
      activeIndex: function() {
        return this.$route.path;
      }
    },
    methods: {
      // 退出
      async logOut() {
        try {
          await this.$api.logout();
          await this.$store.dispatch('user/Logout');
          this.$router.push({
            path: '/'
          });
        } catch (error) {
          // do nothing.
        }
      }
    }
  };
</script>