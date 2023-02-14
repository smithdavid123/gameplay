<template>
  <div id="app">
    <router-view />
    <!-- 选择提示弹框 -->
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="tipVisible"
      width="300px"
      top="40vh"
    >
      <p>{{ message }}</p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="tipVisible = false"
        >
          确认
        </div>
      </div>
    </el-dialog>
    <!-- 删除记录弹框 -->
    <el-dialog
      v-drag-dialog
      title="信息"
      :visible.sync="removeVisible"
      width="360px"
      top="40vh"
    >
      <p>确认删除此数据?</p>
      <div
        slot="footer"
        class="dialog-footer ta"
      >
        <div
          class="primary-btn small-btn"
          @click="sureRemove"
        >
          确认
        </div>
        <div
          class="disabled-btn small-btn ml16"
          @click="removeVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <!-- 用户信息弹框 -->
    <el-dialog
      v-drag-dialog
      class="tab-dialog"
      :visible.sync="memberInfoVisible"
      width="90%"
      top="5vh"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="会员首页"
          name="userInfo"
        />
        <el-tab-pane
          label="账变"
          name="accountChange"
        />
        <el-tab-pane
          label="提款订单"
          name="aduitrisk"
        />
        <el-tab-pane
          label="存款订单"
          name="thirdPartyRecharge"
        />
        <el-tab-pane
          label="银行卡"
          name="bankCard"
        />
        <el-tab-pane
          label="用户输赢报表"
          name="lotteryReport"
        />
        <el-tab-pane
          label="第三方报表"
          name="thirdReport"
        />
        <el-tab-pane
          label="彩票投注记录"
          name="order"
        />
        <el-tab-pane
          label="套利查询"
          name="repeat"
        />
      </el-tabs>
      <div
        class="module-form-scroll"
        style="height: 80vh;"
      >
        <el-scrollbar>
          <component
            :is="activeName"
            v-if="memberInfoVisible"
            :user-item="userItem"
          />
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import modules from '@/components/userInfo';
  export default {
    name: 'App',
    components: {
      ...modules
    },
    data() {
      return {
        // 提示信息
        tipVisible: false,
        message: '',
        // 用户详情弹框
        memberInfoVisible: false,
        userItem: {},
        activeName: 'userInfo',
        // 删除记录
        removeVisible: false,
        removeId: '',
        delApiName: ''
      };
    },
    methods: {
      handleDetail(val) {
        this.userItem = val;
        this.activeName = 'userInfo';
        this.memberInfoVisible = true;
      },
      // 删除记录
      async sureRemove() {
        const { error } = await this.$api[this.delApiName]({ id: this.removeId });
        !error && this.$message.success('删除成功');
          this.$store.dispatch('app/Refresh');
          this.removeVisible = false;
      }
    }
  };
</script>