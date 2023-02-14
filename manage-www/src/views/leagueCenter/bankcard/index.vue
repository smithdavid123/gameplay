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
      active: 'leaguebank',
      tags: [{
          label: '平台收款银行',
          value: 'leaguebank'
        }, {
          label: '用户转账银行',
          value: 'bankconfig'
        }],
    };
  }
};
</script>