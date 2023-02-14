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
        <div
          class="primary-btn"
          @click="handleUpdate"
        >
          <svg-icon icon-class="edit" />保存
        </div>
        <div
          class="primary-btn"
          @click="handleUpdateAll"
        >
          <svg-icon icon-class="edit" />快捷修改返点
        </div>
        <div class="tag-aqua ml10">
          比如个人返点为9%，即1980，花1元买1注定位胆，定位胆基本奖金设置为18（以2为单位，最高则为20，18为90%），则中奖金额为：20*(90%+9%)/2=9.9元
        </div>
      </div> -->
      <div />
      <ColumnBtn :columns.sync="tableColumns" />
    </div>
    <div class="container-wrap">
      <table-page
        ref="paraentTable"
        v-loading.lock="loading"
        :data="data"
        row-key="methodName"
        :columns="tableColumns"
        :hidden-pagination="true"
        height="calc(100vh - 244px)"
      >
        <template
          slot="bonus-column"
          slot-scope="{row}"
        >
          <span v-if="!row.groupName">-</span>
          <el-input
            v-else
            v-model.number="row.bonus"
            auto-complete="off"
          />
        </template>
        <template
          slot="rebate-column"
          slot-scope="{row}"
        >
          <span v-if="!row.groupName">-</span>
          <el-input
            v-else
            v-model.number="row.rebate"
            auto-complete="off"
          />
        </template>
        <template
          slot="showOrder-column"
          slot-scope="{row}"
        >
          <span v-if="!row.groupName">-</span>
          <el-input
            v-else
            v-model.number="row.showOrder"
            auto-complete="off"
          />
        </template>
        <template
          slot="showOrder-column"
          slot-scope="{row}"
        >
          <span v-if="!row.groupName">-</span>
          <el-input
            v-else
            v-model.number="row.showOrder"
            auto-complete="off"
          />
        </template>
        <template
          slot="handle-column"
          slot-scope="{row}"
        >
          <span v-if="!row.groupName">-</span>
          <div
            v-else
            class="tag-aqua"
            @click="updateData(row)"
          >
            修改
          </div>
        </template>
      </table-page>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: true,
        listQuery: {
          lottery: ''
        },
        // 查詢配置
        queryColumns: [{
          type: 'group',
          prop: 'lottery',
          label: '彩种',
          noAll: true,
          options: []
        }],
        // 列表配置
        tableColumns: [{
          label: '玩法',
          prop: 'name',
          align: 'left',
          minWidth: '40%',
          visible: true,
          render(row) {
            return row.groupName ? `${row.name} (${row.methodName})` : row.name;
          }
        }, {
          label: '基本奖金（元）',
          prop: 'bonus',
          align: 'center',
          minWidth: '15%',
          visible: true,
          slotName: 'bonus-column'
        }, {
          label: '基本返点',
          prop: 'rebate',
          align: 'center',
          minWidth: '15%',
          visible: true,
          slotName: 'rebate-column'
        }, {
          label: '排序',
          prop: 'showOrder',
          align: 'center',
          minWidth: '15%',
          visible: true,
          slotName: 'showOrder-column'
        }, {
          label: '彩票命中率',
          prop: 'hitRate',
          align: 'center',
          minWidth: '15%',
          visible: true
        }, {
          label: '操作',
          align: 'center',
          width: '200',
          visible: true,
          slotName: 'handle-column'
        }],
        data: [],
        // 编辑记录
        editVisible: false,
        form: {
          lotteryBetRebate: ''
        }
      };
    },
    created() {
      this.getLotteryList();
    },
    methods: {
      // 获取彩种
      async getLotteryList() {
        const {
          data
        } = await this.$api.lotteryList();
        this.queryColumns[0].options = data.reduce((total, current, index) => {
          index === 1 && (this.listQuery.lottery = current.code, this.getList());
          if (!current.parentCode) {
            total.push({
              label: current.name,
              options: []
            });
          } else {
            total[total.length - 1].options.push({
              value: current.code,
              label: current.name
            });
          }
          return total;
        }, []);
      },
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.lotterybetList(this.listQuery);
        this.data = Object.keys(data).reduce((total, current)=> {
          let findParent = total.filter(item=> item.name === data[current].groupName);
          !findParent.length ? total.push({
            name: data[current].groupName,
            groupName: '',
            children: [data[current]]
          }) : findParent[0].children.push(data[current]);
          return total;
        }, []);
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      },
      // 保存修改
      async updateData(row) {
        const { id, showOrder, rebate, bonus, type, methodName} = row;
        const formData = {
          lottery: this.listQuery.lottery,
          method: methodName,
          type,
          bonus,
          rebate,
          showOrder,
          id
        };
        const { error } = await this.$api.setLotteryMethodLoss(formData);
        !error && this.$message.success('修改成功');
      }
    }
  };
</script>