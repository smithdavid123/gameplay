<template>
  <div class="p20">
    <div class="module-count">
      <el-row :gutter="30">
        <el-col
          v-for="(item, index) in overview"
          :key="index"
          :span="6"
        >
          <div
            class="count-wrap"
            :class="item.key"
          >
            <div>
              <p class="count-value">
                {{ item.value }}
              </p>
              <p class="count-name">
                {{ item.label }}
              </p>
            </div>
            <svg-icon
              :icon-class="item.key"
              class-name="count-icon"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="module-chart">
      <div class="module-header has-border">
        <h3 class="header-title">
          今日数据
        </h3>
        <h3 class="header-title isdate">
          {{ date }}
        </h3>
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <todayData1 ref="todayData1" />
        </el-col>
        <el-col :span="12">
          <todayData2 ref="todayData2" />
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="30">
      <el-col :span="12">
        <div class="module-chart">
          <div class="module-header has-border">
            <h3 class="header-title">
              统计数据
            </h3>
          </div>
          <userAmount ref="userAmount" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="module-chart">
          <div class="module-header has-border">
            <h3 class="header-title">
              总金额 (元)
            </h3>
          </div>
          <memberBalance ref="memberBalance" />
        </div>
      </el-col>
    </el-row>
    <div class="module-chart nomb">
      <el-row :gutter="30">
        <el-col :span="16">
          <auditAmount ref="auditAmount" />
        </el-col>
        <el-col
          :span="8"
          style="padding-top: 10px;"
        >
          <div class="box-info ris-Mmnagement">
            <div class="box-info-icon">
              <svg-icon
                icon-class="ris-Mmnagement"
                class-name="info-icon"
              />
            </div>
            <div class="box-info-value">
              <p class="label">
                风控审核
              </p>
              <p class="value">
                {{ auditCount.risk }}
              </p>
            </div>
          </div>
          <div class="box-info reflect">
            <div class="box-info-icon">
              <svg-icon
                icon-class="reflect"
                class-name="info-icon"
              />
            </div>
            <div class="box-info-value">
              <p class="label">
                体现审核
              </p>
              <p class="value">
                {{ auditCount.finance }}
              </p>
            </div>
          </div>
          <div class="box-info recharge">
            <div class="box-info-icon">
              <svg-icon
                icon-class="reflect"
                class-name="info-icon"
              />
            </div>
            <div class="box-info-value">
              <p class="label">
                充值审核
              </p>
              <p class="value">
                {{ auditCount.recharge }}
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import modules from '@/components/charts/dashboard';
  export default {
    components: {
      ...modules
    },
    data() {
      return {
        overview: [{
          key: 'todayReg',
          label: '今日注册(人)',
          value: 0
        }, {
          key: 'todayLogin',
          label: '今日登录(人)',
          value: 0
        }, {
          key: 'todayActive',
          label: '今日活跃用户(人)',
          value: 0
        }, {
          key: 'todayOnline',
          label: '当前在线(人)',
          value: 0
        }],
        date: '',
        auditCount: {
          risk: 0,
          finance: 0,
          recharge: 0
        }
      };
    },
    created() {
      this.initData();
      this.timer = setInterval(() => {
        this.initData();
      }, 15e3);
    },
    beforeDestroy() {
      if (this.timer) clearInterval(this.timer);
    },
    methods: {
      // 获取数据
      initData() {
        this.statTodayUser();
        this.statAudit();
        this.statBalance();
        this.statAll();
        this.statToday();
      },
      // 今日用户统计
      async statTodayUser() {
        const {
          data
        } = await this.$api.statTodayUser();
        this.overview.forEach(item=> {
          item.value = data[item.key];
        });
      },
      // 审核统计
      async statAudit() {
        const {
          data
        } = await this.$api.statAudit();
        this.auditCount = data;
        this.$nextTick(_=> {
          this.$refs.auditAmount.chart.setOption({
            series: [{
              data: [Math.round(data.recharge), Math.round(data.finance), Math.round(
                data.risk)]
            }]
          });
        });
        
      },
      // 总金额
      async statBalance() {
        const { data } = await this.$api.statBalance();
        this.$refs.memberBalance.chart.setOption({
          series: [{
            name: '',
            type: 'bar',
            barWidth: '60%',
            data: [Math.round(data.money), Math.round(data.moneyAvaiable), Math.round(data.moneyBlocked)]
          }]
        });
      },
      // 统计数据
      async statAll() {
        const { data } = await this.$api.statAll();
        this.$refs.userAmount.chart.setOption({
          series: [{
            name: '注册总数（人）',
            type: 'bar',
            data: [Math.round(data.reg)],
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            }
          }, {
            name: '有效总投注（元）',
            type: 'bar',
            data: [Math.round(data.consume)],
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            }
          }, {
            name: '派奖总金额（元）',
            type: 'bar',
            data: [Math.round(data.bonus)],
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            }
          }, {
            name: '充值总金额（元）',
            type: 'bar',
            data: [Math.round(data.recharge)],
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            }
          }, {
            name: '提现总金额（元）',
            type: 'bar',
            data: [Math.round(data.withdraw)],
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            }
          }]
        });
      },
      // 今日数据
      async statToday() {
        const { data } = await this.$api.statToday();
        this.date = data.time;
        this.$refs.todayData1.chart.setOption({
          series: [{
            // 第一个饼图
            name: '充值提现金额',
            type: 'pie',
            data: [{
              value: Math.round(data.recharge),
              name: '充值金额'
            }, {
              value: Math.round(data.withdraw),
              name: '提现金额'
            }]
          }]
        });
        this.$refs.todayData2.chart.setOption({
          series: [{
            name: '投注中奖金额',
            type: 'pie',
            data: [{
              value: Math.round(data.consume),
              name: '有效投注'
            }, {
              value: Math.round(data.bonus),
              name: '派奖金额'
            }]
          }]
        });
      },
    }
  };
</script>


<style lang="scss" scoped>
  .module-count {
    width: 100%;
    margin-bottom: 30px;

    .count-wrap {
      width: 100%;
      height: 104px;
      border-radius: 2px;
      position: relative;
      color: #fff;
      padding: 0 20px;
      @include flex-base(space-between);

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 6px;
        background: rgba(0, 0, 0, 0.1);
      }

      &.todayReg {
        background-color: #0073b7;
      }

      &.todayLogin {
        background-color: #f39c12;
      }

      &.todayActive {
        background-color: #dd4b39;
      }

      &.todayOnline {
        background-color: #00a65a;
      }

      .count-name {
        font-size: 16px;
        // line-height: 50px;
      }

      .count-value {
        font-size: 40px;
        font-weight: bold;
        line-height: 1;
      }

      .count-icon {
        font-size: 90px;
        color: rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: all .3s;

        &:hover {
          transform: scale(1.2, 1.2);
        }
      }
    }
  }

  .module-chart {
    position: relative;
    border-radius: 3px;
    background: #ffffff;
    border-top: 3px solid #dd4b39;
    margin-bottom: 20px;
    width: 100%;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

    &.nomb {
      margin-bottom: 0;
    }

    .module-header {
      color: #444;
      display: block;
      padding: 10px;
      position: relative;
      text-align: center;

      &.has-border {
        border-bottom: 1px solid #f4f4f4;
      }

      .header-title {
        font-size: 18px;
        margin: 0;
        font-weight: bold;

        &.isdate {
          font-weight: normal;
          font-size: 13px;
          color: gray;
          margin-top: 4px;
        }
      }
    }

    .box-info {
      min-height: 86px;
      background: #fff;
      width: 100%;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      margin-bottom: 15px;
      @include flex-base(left);

      &.ris-Mmnagement {
        background-color: #00a65a;
      }

      &.reflect {
        background-color: #f39c12;
      }

      &.recharge {
        background-color: #0073b7;
      }

      &-icon {
        height: 86px;
        width: 86px;
        text-align: center;
        font-size: 45px;
        line-height: 90px;
        background: rgba(0, 0, 0, 0.2);
        color: #fff;

        .info-icon {
          font-size: 45px;
          vertical-align: inherit;
        }
      }

      &-value {
        padding: 10px;
        color: #fff;

        .label {
          font-size: 14px;
        }

        .value {
          font-weight: bold;
          font-size: 18px;
        }
      }
    }
  }
</style>