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
          color: ['#00a65a', '#dd4b39'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 'left',
            data: ['有效投注', '派奖金额']
          },
          series: [{
            name: '投注中奖金额',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [{
              value: 0,
              name: '有效投注'
            }, {
              value: 0,
              name: '派奖金额'
            }],
            label: {
              normal: {
                textStyle: {
                  color: '#333',
                  fontSize: 13
                },
                formatter: function (param) {
                  return param.name + ':\n' + param.value + '元';
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  width: 2
                }
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 30,
                shadowColor: 'rgba(0, 0, 0, 0.4)'
              }
            },
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
              return idx * 5;
            }
          }]
        };
        this.chart.setOption(option);
      }
    }
  };
</script>