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
      active: 'recharge',
      tags: [{
          label: '充值设置',
          value: 'recharge'
        }, {
          label: '提现设置',
          value: 'withdrawal'
        },{
          label: '奖金返点配置',
          value: 'bonus'
        },{
          label: '会员信息配置',
          value: 'memberinfo'
        },{
          label: '充提接口配置',
          value: 'apayinfo'
        }],
    };
  }
};
</script>