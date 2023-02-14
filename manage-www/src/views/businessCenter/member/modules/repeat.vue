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
      >
        <template
          slot="memberName-column"
          slot-scope="{row}"
        >
          <span
            class="link-type"
          >{{ row.memberName }}</span>
        </template>
        <template
          slot="memberType-column"
          slot-scope="{row}"
        >
          <div
            :class="row.type | formatterMemberTypeTagClass"
          >
            {{ row.type | formatterMemberType }}
          </div>
        </template>
        <template
          slot="status-column"
          slot-scope="{row}"
        >
          <div
            :class="['tag-green', 'tag-red'][row.status]"
          >
            {{ row.status | formatterAllowAgent }}
          </div>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
import { repeatInfoType } from './options';
  export default {
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          type: 'realName',
          repeat: ''
        },
        queryColumns: [{
          type: 'select',
          prop: 'type',
          label: '重复信息类型',
          noAll: true,
          options: repeatInfoType
        }, {
          type: 'input',
          prop: 'repeat',
          label: '重复信息'
        }],
        repeatInfoType,
        tableColumns: [{
          label: '用户名',
          prop: 'username',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '用户类型',
          prop: 'type',
          align: 'center',
          minWidth: '10%',
          visible: true,
          slotName: 'memberType-column'
        },{
          label: '真实姓名',
          prop: 'realName',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '密码',
          prop: 'password',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render(row) {
            return row.password.substr(0,4) + '******';
          }
        }, {
          label: '注册IP',
          prop: 'regIp',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '注册时间',
          prop: 'registTime',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '最后登录IP',
          prop: 'loginTime',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '状态',
          prop: 'status',
          align: 'center',
          minWidth: '10%',
          visible: true,
          slotName: 'status-column'
        }],
        data: []
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
        } = await this.$api.findAbnormal(listQuery);
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