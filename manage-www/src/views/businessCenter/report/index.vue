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
        active: 'accountChange',
        tags: [{
          label: '账变记录',
          value: 'accountChange'
        }, {
          label: '团队报表',
          value: 'teamreport'
        }, {
          label: '第三方报表',
          value: 'thirdPartyStatistics'
        }, {
          label: '总报表',
          value: 'totalreport'
        }, {
          label: '游戏输赢报表',
          value: 'agProfitLossReport'
        }, {
          label: '用户输赢报表',
          value: 'userreport'
        }, {
          label: '整点统计报表',
          value: 'wholepointreport'
        }]
      };
    }
  };
</script>