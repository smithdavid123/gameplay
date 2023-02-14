<template>
  <div
    class="container-wrap"
    style="height: calc(100vh - 104px);"
  >
    <memberstat ref="memberstat" />
  </div>
</template>

<script>
  import memberstat from '@/components/charts/dashboard/memberstat';
  export default {
    components: {
      memberstat
    },
    created() {
      this.getData();
      this.timer = setInterval(() => {
        this.getData();
      }, 2e3);
    },
    beforeDestroy() {
      if (this.timer) clearInterval(this.timer);
    },
    methods: {
      // 获取数据
      async getData() {
        const {
          data
        } = await this.$api.statOnlineUser();
        this.$nextTick(_ => {
          this.$refs.memberstat.option.series[0].data.shift();
          this.$refs.memberstat.option.series[0].data.push(data.count);
          const axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
          this.$refs.memberstat.option.xAxis[0].data.shift();
          this.$refs.memberstat.option.xAxis[0].data.push(axisData);
          this.$refs.memberstat.initChart();
        });
      }
    }
  };
</script>