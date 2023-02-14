<template>
  <div
    id="tags-view-container"
    class="tags-view-container"
  >
    <span
      v-for="tag in tags"
      :key="tag.value"
      class="tags-view-item"
      :class="{active: currentTag === tag.value}"
      @click="currentTag = tag.value"
    >
      {{ tag.label }}
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      tags: {
        type: Array,
        default: _ => {
          return [];
        }
      },
      active: {
        type: String,
        default: ''
      }
    },
    computed: {
      currentTag: {
        get() {
          return this.active;
        },
        set(val) {
          this.$emit('update:active', val);
        }
      }
    },
  };
</script>

<style lang="scss" scoped>
  .tags-view-container {
    position: fixed;
    left: 0;
    top: 64px;
    z-index: 1996;
    height: 40px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 28px;
      line-height: 28px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 3px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 20px;
      }

      &:last-of-type {
        margin-right: 20px;
      }

      &.active {
        background-color: $primary;
        color: #fff;
        border-color: $primary;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
</style>