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
      active: 'backstageUserList',
      tags: [{
          label: '后台用户管理',
          value: 'backstageUserList'
        },
        // {
        //   label: '后台用户组管理',
        //   value: 'backstageUserGroupList'
        // }
        ]
    };
  }
};
</script>