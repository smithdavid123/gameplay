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
        active: 'memberGroup',
        tags: [{
          label: '契约分红用户组',
          value: 'memberGroup'
        }, {
          label: '契约配置',
          value: 'dividendConfig'
        }, {
          label: '契约分红列表',
          value: 'dividendMember'
        }, {
          label: '契约分红记录',
          value: 'dividendLog'
        }]
      };
    }
  };
</script>