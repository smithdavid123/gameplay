<template>
  <div>
    <el-tabs
      v-model="activeModule"
      type="card"
      style="background: #fff;"
      class="pt10"
    >
      <el-tab-pane
        label="签到设置"
        name="config"
      />
      <el-tab-pane
        label="签到记录"
        name="record"
      />
    </el-tabs>
    <component :is="`sign-${activeModule}`" />
  </div>
</template>
<script>
  import signConfig from './signConfig';
  import signRecord from './signRecord';
  export default {
    components: {
      signConfig,
      signRecord
    },
    data() {
      return {
        activeModule: 'config'
      };
    }
  };
</script>