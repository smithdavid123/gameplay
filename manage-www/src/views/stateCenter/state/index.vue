<template>
  <div>
    <moduleTags
      :tags="tags"
      :active.sync="active"
    />
    <component :is="active" />
  </div>
</template>

<script>
import moduleTags from '@/layout/modules/tags';
import modules from './modules';
export default {
  components: {
    moduleTags,
    ...modules
  },
  data() {
    return {
      active: 'userstat',
      tags: [{
          label: '用户统计',
          value: 'userstat'
        },{
          label: '首页',
          value: 'home'
        }],
    };
  }
};
</script>