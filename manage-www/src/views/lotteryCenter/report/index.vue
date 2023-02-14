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
      active: 'lottery',
      tags: [{
          label: '彩种日分析报表',
          value: 'lottery'
        },{
          label: '玩法日分析报表',
          value: 'betCode'
        },{
          label: '个人彩种分析',
          value: 'member'
        },{
          label: '个人游戏分析',
          value: 'memberAg'
        }],
    };
  }
};
</script>