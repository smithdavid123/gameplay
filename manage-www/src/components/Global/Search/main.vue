<template>
  <div :style="{display: 'inline-block', width: `${width}px`}">
    <el-input
      v-model="inputValue"
      placeholder="搜索"
      clearable
      @clear="handleSearch"
      @focus="searchBtnColor= '#1D7BDE'"
      @blur="searchBtnColor= '#C0C4CC'"
      @keyup.enter.native="handleSearch"
    >
      <svg-icon
        slot="suffix"
        icon-class="search"
        :style="{ color: searchBtnColor, cursor: 'pointer' }"
        @click="handleSearch"
      />
    </el-input>
  </div>
</template>

<script>
export default {
    name: 'Search',
    props: {
        keywords: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 220
        }
    },
    data () {
        return {
            searchBtnColor: '#C0C4CC'
        };
    },
    computed: {
        inputValue: {
            get () {
                return this.keywords;
            },
            set (val) {
                this.$emit('update:keywords', val);
            }
        }
    },
    methods: {
        handleSearch () {
            this.$emit('Search', { keywords: this.inputValue });
        }
    }
};
</script>
