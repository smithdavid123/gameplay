<template>
  <div
    ref="canvas"
    :style="{height:height,width:'100%',padding: '10px'}"
  />
</template>

<script>
  import echarts from 'echarts';
  import resize from '../mixins/resize';
  export default {
    mixins: [resize],
    props: {
      data: {
        type: Array,
        default: _ => {
          return [];
        }
      },
      height: {
        type: String,
        default: '300px'
      }
    },
    mounted() {
      this.chart = echarts.init(this.$refs.canvas);
      this.initChart();
    },
    beforeDestroy() {
      if (!this.chart) return;
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      initChart() {
        const option = {
          title: {
            text: '',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            type: 'scroll',
            data: ['注册总数（人）', '有效总投注（元）', '派奖总金额（元）', '充值总金额（元）',
              '提现总金额（元）'
            ]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category'
          },
          series: [{
            name: '注册总数（人）',
            type: 'bar',
            data: [0],
            animationDelay: function (idx) {
              return idx * 100;
            }
          }, {
            name: '有效总投注（元）',
            type: 'bar',
            data: [0],
            animationDelay: function (idx) {
              return idx * 200;
            }
          }, {
            name: '派奖总金额（元）',
            type: 'bar',
            data: [0],
            animationDelay: function (idx) {
              return idx * 300;
            }
          }, {
            name: '充值总金额（元）',
            type: 'bar',
            data: [0],
            animationDelay: function (idx) {
              return idx * 400;
            }
          }, {
            name: '提现总金额（元）',
            type: 'bar',
            data: [0],
            animationDelay: function (idx) {
              return idx * 600;
            }
          }],
          animationEasing: 'elasticOut',
          animationDelayUpdate: function (idx) {
            return idx * 5;
          }
        };
        this.chart.setOption(option);
      }
    }
  };
</script>