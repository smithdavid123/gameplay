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
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          title: {
            text: '审核图表',
            x: 'center'
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {
                type: ['line', 'bar']
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['充值审核', '提现审核', '风控审核'],
            axisTick: {
              alignWithLabel: true
            },
            boundaryGap: false
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: '',
            type: 'line',
            barWidth: '60%',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255, 158, 68)'
              }, {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }])
            },
            data: [0, 0, 0],
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            animationDelay: function (idx) {
              return idx * 100;
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