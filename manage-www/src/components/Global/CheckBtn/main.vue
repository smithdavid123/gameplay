<template>
  <div
    class="query-item clearfix"
    :class="{checked}"
    @click="checkValue = checkValue ? 0 : 1"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
    <div class="check-label fl">
      {{ name }}
    </div>
    <div class="check-value fl">
      <svg-icon
        v-if="checked || show"
        icon-class="check"
        class-name="check-icon"
      />
    </div>
  </div>
</template>

<script>
export default {
    name: 'CheckBtn',
    props: {
        value: {
            type: Number,
            default: 1
        },
        name: {
            type: String,
            default: '包含下级'
        },
        flag: {
          type: Boolean,
          default: false
        }
    },
    data() {
      return {
        show: false
      };
    },
    computed: {
        checked: function() {
          return this.flag ? !!this.checkValue : !this.checkValue;
        },
        checkValue: {
            get () {
                return this.value;
            },
            set (val) {
                this.$emit('update:value', val);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.query-item {
  margin-left: 16px;
  display: inline-block;
  .check-label {
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    background: #c2c2c2;
    color: #fff;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    cursor: pointer;
  }
  .check-value {
    width: 36px;
    height: 36px;
    line-height: 36px;
    padding: 0 6px 0 8px;
    background: #fff;
    color: #c2c2c2;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    cursor: pointer;
    border: 1px solid #c2c2c2;
    border-left: none;
    cursor: pointer;
  }
  &.checked {
    .check-label {
      background: $primary;
    }
    .check-value {
      border-color: $primary;
      color: $primary;
    }
  }
}
  
</style>
