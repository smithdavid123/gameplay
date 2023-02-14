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
      active: 'thirdPartyRecharge',
      tags: [{
          label: '线上充值订单',
          value: 'thirdPartyRecharge'
        },{
          label: '线下充值订单',
          value: 'bankcardtransfer'
        },{
          label: '充值接口统计',
          value: 'rechargeCount'
        }],
    };
  }
};
</script>