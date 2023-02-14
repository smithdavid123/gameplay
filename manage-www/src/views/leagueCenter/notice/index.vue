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
      active: 'info',
      tags: [{
          label: '系统公告',
          value: 'info'
        }],
    };
  }
};
</script>