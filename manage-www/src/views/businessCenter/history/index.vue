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
        active: 'account',
        tags: [{
          label: '历史账变',
          value: 'account'
        }, {
          label: '历史订单',
          value: 'order'
        }, {
          label: '历史追号',
          value: 'append'
        }, {
          label: '历史第三方',
          value: 'agOrder'
        }, {
          label: '历史彩期',
          value: 'lottery'
        }]
      };
    }
  };
</script>