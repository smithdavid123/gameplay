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
        active: 'order',
        tags: [{
          label: '订单查询',
          value: 'order'
        }, {
          label: '追号查询',
          value: 'append'
        }, {
          label: '第三方记录',
          value: 'record'
        }]
      };
    }
  };
</script>