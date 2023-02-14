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
      <div>
        <div
          class="primary-btn"
          @click="checkValidate() && upOrDown(0)"
        >
          <svg-icon icon-class="edit" />启用
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && upOrDown(1)"
        >
          <svg-icon icon-class="edit" />停用
        </div>
        <div
          v-permission:3="{ fn: handleRemove, args: 'deleteRegistLink', validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="edit" />删除
        </div>
      </div>
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
        @selection-change="checked = $event"
        @pagination="getList"
      >
        <template
          slot="registerType-column"
          slot-scope="{row}"
        >
          <div :class="row.type | formatterMemberTypeTagClass">
            {{ row.type | formatterMemberType }}
          </div>
        </template>
        <template
          slot="spreadStatus-column"
          slot-scope="{row}"
        >
          <div :class="['tag-green', 'tag-gray'][row.status]">
            {{ row.status | formatterSpreadStatus }}
          </div>
        </template>
        <template
          slot="delStatus-column"
          slot-scope="{row}"
        >
          <div :class="['tag-green', 'tag-red'][row.isDel]">
            {{ row.isDel | formatterDelStatus }}
          </div>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
  import resize from '../../../mixins';
  import {
    spreadStatus,
    delStatus
  } from './options';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          username: '',
          code: '',
          status: '',
          isDel: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'username',
          label: '用户名'
        }, {
          type: 'input',
          prop: 'code',
          label: '邀请码'
        }, {
          type: 'select',
          prop: 'status',
          label: '链接状态',
          options: spreadStatus
        }, {
          type: 'select',
          prop: 'isDel',
          label: '是否已删除',
          options: delStatus
        }],
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        }, {
          label: '用户名称',
          prop: 'accountId',
          align: 'left',
          minWidth: '8%',
          visible: true
        }, {
          label: '推广代理会员备注',
          prop: 'mark',
          align: 'left',
          minWidth: '10%',
          visible: true
        }, {
          label: '访问数量',
          prop: 'visited',
          align: 'center',
          minWidth: '6%',
          visible: true
        }, {
          label: '注册人数',
          prop: 'amount',
          align: 'center',
          minWidth: '6%',
          visible: true
        }, {
          label: '注册类型',
          prop: 'type',
          align: 'center',
          minWidth: '8%',
          visible: true,
          slotName: 'registerType-column'
        }, {
            label: '链接状态',
            prop: 'status',
            align: 'center',
            minWidth: '8%',
            visible: true,
            slotName: 'spreadStatus-column'
          }, {
          label: '链接返点',
          prop: 'point',
          align: 'center',
          minWidth: '6%',
          visible: true
        }, {
          label: '邀请码',
          prop: 'code',
          align: 'center',
          minWidth: '8%',
          visible: true
        }, {
          label: '推广链接',
          prop: 'url',
          align: 'center',
          minWidth: '14%',
          visible: true
        }, {
            label: '是否已删除',
            prop: 'isDel',
            align: 'center',
            minWidth: '8%',
            visible: true,
            slotName: 'delStatus-column'
          }, {
          label: '创建日期',
          prop: 'addTime',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render: row => {
            return this.$format(row.addTime, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          label: '结束日期',
          prop: 'expireTime',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render: row => {
            return row.expireTime ? row.expireTime : '2030-01-01 00:00:00';
          }
        }],
        data: [],
        checked: []
      };
    },
    created() {
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
        } = await this.$api.listRegistLink(listQuery);
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
      },
      // 开启与停用
      async upOrDown(flag) {
        if (this.checked[0].status === flag) return false;
        const formData = {'id': this.checked[0].id, 'status': 1 - this.checked[0].status};
        const { error } = await this.$api.setLinkStatus(formData);
        !error && this.$message.success('提交成功');
        this.getList();
      }
    }
  };
</script>