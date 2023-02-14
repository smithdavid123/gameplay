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
      active: 'config',
      tags: [{
          label: '彩票配置',
          value: 'config'
        },{
          label: '彩票赔率',
          value: 'bet'
        },{
          label: '单挑模式配置',
          value: 'onevs'
        },{
          label: '热门彩种',
          value: 'hot'
        },{
          label: '彩种导航',
          value: 'navigation'
        },{
          label: '自营彩期管理',
          value: 'self'
        },{
          label: '平台彩期查询',
          value: 'plat'
        }],
    };
  }
};
</script>