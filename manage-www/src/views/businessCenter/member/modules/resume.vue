<template>
  <div>
    <div class="module-query">
      <MapQuery
        :query="listQuery"
        :columns="queryColumns"
      />
      <SearchBtn :query.sync="listQuery" />
    </div>
    <div class="module-handle">
      <!-- <div>
        <span class="mr10">总在线{{ onlineCount.totalOnlineMember || 0 }}人</span>
        <svg-icon
          icon-class="pc"
          class-name="vat"
          style="font-size: 30px;"
        />{{ onlineCount.onlineMemberPc || 0 }}
        <svg-icon
          icon-class="andriod"
          class-name="ml10 vat"
          style="font-size: 30px;"
        />{{ onlineCount.onlineMemberAndriod || 0 }}
        <svg-icon
          icon-class="ios"
          class-name="ml10 vat"
          style="font-size: 30px;"
        />{{ onlineCount.onlineMemberIos || 0 }}
        <span class="mr10 ml20">总在线投注会员{{ onlineCount.totalOnlineMemberBet || 0 }}人</span>
        <svg-icon
          icon-class="pc"
          class-name="vat"
          style="font-size: 30px;"
        />{{ onlineCount.onlineMemberPcBet || 0 }}
        <svg-icon
          icon-class="andriod"
          class-name="ml10 vat"
          style="font-size: 30px;"
        />{{ onlineCount.onlineMemberAndriodBet || 0 }}
        <svg-icon
          icon-class="ios"
          class-name="ml10 vat"
          style="font-size: 30px;"
        />{{ onlineCount.onlineMemberIosBet || 0 }}
      </div> -->
      <div />
      <ColumnBtn :columns.sync="tableColumns" />
    </div>
    <div class="container-wrap">
      <table-page
        ref="paraentTable"
        v-loading.lock="loading"
        :data="data"
        :columns="tableColumns"
        :total="total"
        height="calc(100vh - 300px)"
        :page.sync="listQuery.page"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { totalPattern } from './options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          byHour: 0,
          sTime: '',
          eTime: ''
        },
        queryColumns: [{
          type: 'date',
          prop: ['sTime', 'eTime'],
          label: '时间'
        },{
          type: 'select',
          prop: 'byHour',
          label: '统计类型',
          noAll: true,
          options: totalPattern
        }],
        tableColumns: [{
          label: '时间',
          prop: 'tm',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '新会员充值人数',
          prop: 'moneyIn1',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '老会员充值人数',
          prop: 'moneyIn2',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '新会员点击人数',
          prop: 'click',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '新会员投注人数',
          prop: 'consume1',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '老会员投注人数',
          prop: 'consume2',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '新会员提款人数',
          prop: 'moneyOut1',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '老会员提款人数',
          prop: 'moneyOut2',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '会员注册人数',
          prop: 'reg',
          align: 'center',
          minWidth: '10%',
          visible: true
        }],
        data: [],
        onlineCount: {
          totalOnlineMember: 460,
          onlineMemberAndriod: 273,
          onlineMemberIos: 115,
          onlineMemberPc: 72,
          totalOnlineMemberBet: 283,
          onlineMemberAndriodBet: 178,
          onlineMemberIosBet: 73,
          onlineMemberPcBet: 32
        }
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const listQuery = Object.assign({}, this.listQuery, {
          page: this.listQuery.page - 1
        });
        const {
          data
        } = await this.$api.summaryUserToday(listQuery);
        const {
          totalCount,
          list
        } = data;
        this.total = totalCount;
        this.data = list;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.listQuery.page = 1;
        this.getList();
      }
    }
  };
</script>