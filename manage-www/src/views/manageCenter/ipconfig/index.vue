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
      active: 'ipsvalidation',
      tags: [{
          label: '用户IP设置',
          value: 'ipsvalidation'
        },{
          label: '黑名单管理',
          value: 'blacks'
        }],
    };
  }
};
</script>