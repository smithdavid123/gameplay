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
      active: 'memberlog',
      tags: [{
          label: '前台日志',
          value: 'memberlog'
        },{
          label: '后台日志',
          value: 'systemlog'
        },{
          label: '登录日志',
          value: 'loginrecord'
        }],
    };
  }
};
</script>