<template>
  <div>
    <moduleTags
      :tags="tags"
      active="dashboard"
    />
    <moduleHome />
  </div>
</template>

<script>
  import moduleTags from '@/layout/modules/tags';
  import moduleHome from './home';
  export default {
    components: {
      moduleTags,
      moduleHome
    },
    data() {
      return {
        tags: [{
          label: '首页',
          value: 'dashboard'
        }]
      };
    }
  };
</script>