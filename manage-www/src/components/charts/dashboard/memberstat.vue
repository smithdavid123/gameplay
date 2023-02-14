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
      height: {
        type: String,
        default: '600px'
      }
    },
    data() {
      return {
        option: {
          title: {
            text: '在线用户数',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#283b56'
              }
            }
          },
          legend: {
            data: ['用户数']
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {
                readOnly: false
              },
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom: {
            show: false,
            start: 0,
            end: 100
          },
          xAxis: [{
            type: 'category',
            boundaryGap: true,
            data: (function () {
              let res = [];
              let len = 10;
              while (len--) {
                res.push(10 - len - 1);
              }
              return res;
            })()
          }],
          yAxis: [{
            type: 'value',
            scale: true,
            name: '数量',
            min: 0,
            boundaryGap: [0.2, 0.2]
          }],
          series: [{
            name: '当前在线用户数',
            type: 'line',
            data: (function () {
              let res = [];
              let len = 0;
              while (len < 10) {
                res.push((Math.random() * 10 + 5).toFixed(1) - 0);
                len++;
              }
              return res;
            })()
          }]
        }
      };
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
        this.chart.setOption(this.option);
      }
    }
  };
</script>