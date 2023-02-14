<template>
  <div class="component-column-btn">
    <div
      class="refresh-botton"
      @click="$parent.getList()"
    >
      <svg-icon
        icon-class="refresh"
        class-name="refresh-btn"
      />
    </div>
    <div
      v-click-down="handleClose"
      class="search-select"
    >
      <div @click="show = !show">
        <svg-icon
          icon-class="grid"
          class-name="refresh-btn"
        />
        <i class="el-icon-caret-bottom" />
      </div>
      <transition name="el-zoom-in-top">
        <ul
          v-show="show"
          class="user-sub"
          :style="{height: height}"
        >
          <el-scrollbar>
            <template v-for="(column, columnIndex) in columns">
              <li
                v-if="column.type === undefined"
                :key="columnIndex"
                :class="{active: column.visible}"
                @click="column.visible = !column.visible"
              >
                <i class="el-icon-check check-icon" />{{ column.label }}
              <!-- 有跳动闪现的问题 -->
              <!-- <el-checkbox v-model="column.visible">
                {{ column.label }}
              </el-checkbox> -->
              </li>
            </template>
          </el-scrollbar>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
    name: 'ColumnBtn',
    props: {
      columns: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data () {
        return {
            show: false
        };
    },
    computed: {
        columnsValue: {
            get () {
                return this.columns;
            },
            set (val) {
                this.$emit('update:columns', val);
            }
        },
        height: function() {
          return this.columnsValue.length > 8 ? '300px' : 'auto';
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
.component-column-btn {
  width: auto;
  @include flex-base(left);
  .refresh-botton {
    width: 36px;
    height:36px;
    line-height: 40px;
    text-align: center;
    background-color: #f4f4f4;
    color: #444;
    border: 1px solid #ddd;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: $primary;
      color: #fff;
      border: 1px solid $primary;
    }
  }
  .search-select {
    position: relative;
    background-color: #f4f4f4;
    color: #444;
    border: 1px solid #ddd;
    border-left: none;
    height:36px;
    line-height: 40px;
    text-align: center;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    padding-right: 4px;
    cursor: pointer;
    &:hover {
      background-color: $primary;
      color: #fff;
      border-color: $primary;
    }
    i {
      position: relative;
      top: -2px;
    }
    .user-sub {
        position: absolute;
        z-index: 2000;
        top: 38px;
        right: 0;
        width: auto;
        min-width: 160px;
        padding: 6px 0;
        color: #525266;
        background: #fff;
        font-size: 14px;
        border: 1px solid #ddd;
        text-align: left;
        li {
            line-height: 36px;
            padding: 0 18px;
            &.active {
              .check-icon {
                border: 1px solid $primary;
                color: #fff;
                background-color: $primary;
              }
            }
            .check-icon {
                border: 1px solid #ccc;
                background-color: #eee;
                margin-right: 8px;
                color: #eee;
                top: 0;
            }
        }
    }
  }
  .refresh-btn {
    font-size: 22px;
    margin-left: 4px;
  }
}
</style>
