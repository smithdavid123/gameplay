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
      active: 'insideletter',
      tags: [{
          label: '站内信',
          value: 'insideletter'
        }],
    };
  }
};
</script>