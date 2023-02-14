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
        active: 'list',
        tags: [{
          label: '用户列表',
          value: 'list'
        }, {
          label: '套利查询',
          value: 'repeat'
        }, {
          label: '当日会员概要',
          value: 'resume'
        }, {
          label: '流水限制',
          value: 'drawing'
        }, {
          label: '推广链接',
          value: 'spread'
        }, {
          label: '投注会员黑名单',
          value: 'betblack'
        }]
      };
    }
  };
</script>