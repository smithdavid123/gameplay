<template>
  <div class="query-item">
    <span class="label">{{ name }}</span>
    <el-date-picker
      v-model="dateValue"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
    />
    <span
      v-for="item in dateList"
      :key="item.value"
      class="date-item"
      :class="{'active-class': item.value === typeValue }"
      @click="typeValue = item.value"
    >{{ item.label }}</span>
  </div>
</template>

<script>
  export default {
    name: 'DateQuery',
    props: {
      name: {
        type: String,
        default: '开奖时间'
      },
      dateType: {
        type: [String, Number],
        default: 0
      },
      beginTime: {
        type: String,
        default: ''
      },
      endTime: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        // typeValue: 0,
        dateList: [{
          label: '今天',
          value: 0
        }, {
          label: '昨天',
          value: 1
        }, {
          label: '上周',
          value: 2
        }, {
          label: '本周',
          value: 3
        }, {
          label: '上月',
          value: 4
        }, {
          label: '本月',
          value: 5
        }, {
          label: '年初',
          value: 6
        }]
      };
    },
    computed: {
      typeValue: {
        get() {
          return this.dateType;
        },
        set(val) {
          this.$emit('update:dateType', val);
        }
      },
      dateValue: {
        get() {
          return [this.beginTime, this.endTime];
        },
        set(val) {
          this.$emit('update:beginTime', val ? val[0] : '');
          this.$emit('update:endTime', val ? val[1] : '');
        }
      }
    },
    watch: {
      typeValue: {
        handler:function(val) {
          if (val === '') {
            this.dateValue = ['', ''];
          } else {
          let date = new Date();
          let day = date.getDay();
          !day && (day = 7);
          let time = date.getTime();
          let endTime = date.getTime();
          if (val === 0) {
            // 今天
            this.dateValue = [this.$format(time, 'yyyy-MM-dd'), this.$format(time, 'yyyy-MM-dd')];
          } else if (val === 1) {
            // 昨天
            time = time - 1 * 24 * 60 * 60 * 1000;
            this.dateValue = [this.$format(time, 'yyyy-MM-dd'), this.$format(time, 'yyyy-MM-dd')];
          } else if (val === 2) {
            // 上周
            time = time - ((day + 6) * 24 * 60 * 60 * 1000);
            endTime = endTime - ((day) * 24 * 60 * 60 * 1000);
            this.dateValue = [this.$format(time, 'yyyy-MM-dd'), this.$format(endTime, 'yyyy-MM-dd')];
          } else if (val === 3) {
            // 本周
            time = time - ((day - 1) * 24 * 60 * 60 * 1000);
            endTime = endTime + ((7 - day) * 24 * 60 * 60 * 1000);
            this.dateValue = [this.$format(time, 'yyyy-MM-dd'), this.$format(endTime, 'yyyy-MM-dd')];
          } else if (val === 4) {
            // 上月
            this.dateValue = [this.getMonthFirstDate('preMonth'), this.getMonthLastDate('preMonth')];
          } else if (val === 5) {
            // 本月
            this.dateValue = [this.getMonthFirstDate('thisMonth'), this.getMonthLastDate('thisMonth')];
          } else if (val === 6) {
            // 年初
            this.dateValue = [this.$format(time, 'yyyy-MM-dd').substring(0, 4) + '-01-01', this.$format(time,
              'yyyy-MM-dd')];
          }
          }
        },
        immediate: true
      }
    },
    mounted() {
      // this.typeValue = this.dateType
    },
    methods: {
      // 获取上个月
      getMonthFirstDate(selectDay) {
        let da = new Date();
        let year = da.getFullYear();
        let month = da.getMonth();
        if (selectDay === 'thisMonth') {
          month = month + 1;
        }
        if (month === 0) {
          month = 12;
          year = year - 1;
        }
        if (month < 10) {
          month = '0' + month;
        }
        return [year, month, '01'].join('-');
      },
      getMonthLastDate(selectDay) {
        let da = new Date();
        if (selectDay === 'preMonth') {
          da.setDate(1);
          da.setHours(-1);
        }
        let year = da.getFullYear();
        let month = da.getMonth();
        let date = new Date(da.getFullYear(), da.getMonth() + 1, 0);
        date = date.getDate();
        month = month + 1;
        if (month === 0) {
          month = 12;
          year = year - 1;
        }
        if (month < 10) {
          month = '0' + month;
        }
        if (date < 10) {
          date = '0' + date;
        }
        return [year, month, date].join('-');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .date-item {
    display: inline-block;
    width: auto;
    height: 36px;
    line-height: 36px;
    padding: 0 5px;
    background: #fff;
    border-radius: 2px;
    margin-left: 2px;
    border: 1px solid #d2d6de;
    cursor: pointer;
    vertical-align: middle;

    &.active-class {
      background-color: $primary;
      color: #fff;
    }
  }
</style>