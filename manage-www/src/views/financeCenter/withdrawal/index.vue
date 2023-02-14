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
      active: 'aduitrisk',
      tags: [{
          label: '风控审核',
          value: 'aduitrisk'
        },{
          label: '出款审核',
          value: 'aduit'
        },{
          label: '提现接口统计',
          value: 'count'
        }],
    };
  }
};
</script>