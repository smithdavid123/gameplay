<template>
  <div class="component-search-btn">
    <div
      class="search-botton"
      @click="$parent.handleSearch()"
    >
      <svg-icon
        icon-class="search"
      />搜索
    </div>
    <div
      v-click-down="handleClose"
      class="search-select"
      @click="show = !show"
    >
      <i class="el-icon-caret-bottom" />
      <transition name="el-zoom-in-top">
        <ul
          v-show="show"
          class="user-sub"
        >
          <li>
            <a
              href="javascript:void(0);"
              @click="queryValue = {...source}"
            >重置</a>
          </li>
          <li>
            <a
              href="javascript:void(0);"
              @click="queryValue = {...source}"
            >清空</a>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
    name: 'SearchBtn',
    props: {
      query: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data () {
        return {
            show: false,
            source: {...this.query}
        };
    },
    computed: {
        queryValue: {
            get () {
                return this.query;
            },
            set (val) {
                this.$emit('update:query', val);
            }
        }
    },
    methods: {
        handleClose() {
          this.show = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.component-search-btn {
  width: auto;
  height:36px;
  line-height: 36px;
  @include flex-base(left);
  .search-botton {
    width: 68px;
    padding: 0 10px;
    background-color: $primary;
    color: #fff;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    cursor: pointer;
  }
  .search-select {
    position: relative;
    width: 25px;
    color: #fff;
    background: $primary;
    text-align: center;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    cursor: pointer;
    .user-sub {
        position: absolute;
        z-index: 2000;
        top: 44px;
        right: 0;
        width: 100px;
        padding: 6px 0;
        color: #525266;
        background: #fff;
        font-size: 14px;
        border: 1px solid #ddd;
        text-align: center;
        li {
            line-height: 30px;
            a {
                display: block;
                &:hover {
                    color: $primary;
                    background: #e5f2fc;
                }
            }
        }
    }
  }
}
</style>
