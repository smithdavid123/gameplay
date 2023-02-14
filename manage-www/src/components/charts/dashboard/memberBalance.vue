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
          color: ['#0073b7'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {
                type: ['line', 'bar']
              }
            }
          },
          title: {
            show: false,
            x: 'center',
            text: '总金额（元）',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['账户', '账户可用', '账户冻结'],
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: '',
            type: 'bar',
            barWidth: '60%',
            data: [0, 0, 0],
            animationDelay: function (idx) {
              return idx * 100;
            },
            label: {
              normal: {
                show: true,
                position: 'top'
              }
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