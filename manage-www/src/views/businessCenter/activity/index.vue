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
        tags: [
        //   {
        //   label: '优惠活动',
        //   value: 'preferential'
        // }, 
        {
          label: '活动设置',
          value: 'config'
        }, {
          label: '活动奖金记录',
          value: 'moneyrecord'
        },
        // {
        //   label: '客户签到设置',
        //   value: 'memberSignMain'
        // }
        ]
      };
    }
  };
</script>