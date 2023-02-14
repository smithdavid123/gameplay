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
          @click="handleAdd()"
        >
          <svg-icon icon-class="check-square" />增加
        </div>
        <!-- <div
          class="primary-btn"
          @click="checkValidate() && handleAdd()"
        >
          <svg-icon icon-class="check-square" />编辑
        </div> -->
        <div
          class="primary-btn"
          @click="checkValidate() && handleWatch()"
        >
          <svg-icon icon-class="check-square" />查看
        </div>
        <div
          v-permission:3="{ fn: handleRemove, args: 'delMessage', validate: checkValidate }"
          class="primary-btn"
        >
          <svg-icon icon-class="check-square" />删除
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
        @pagination="getList"
        @selection-change="checked = $event"
      />
    </div>
    <el-dialog
      v-drag-dialog
      :title="`站内信-${handleType? '查看' : '新增'}`"
      :visible.sync="addVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="form"
            :columns="formColumns"
            label-width="100px"
          >
            <template
              
              slot="inputMemberName-column"
            >
              <el-input
                v-if="!handleType"
                v-model.trim="username"
                auto-complete="off"
                placeholder="请输入用户名进行查询"
                style="width: 200px;"
              />
              <div
                v-if="!handleType"
                class="primary-btn ml20"
                @click="handleSearchUser"
              >
                <svg-icon icon-class="search" />搜索
              </div>
              <template
                v-for="item in form.toUser"
              >
                <div
                  v-if="handleType"
                  :key="item"
                  class="tag-aqua"
                >
                  {{ item }}
                </div>
              </template>
            </template>
          </json-form>
          <el-transfer
            v-if="!handleType"
            v-model="form.toUser"
            :data="userList"
            :titles="['待选用户', '已选用户']"
          />
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          v-if="!handleType"
          class="primary-btn small-btn"
          @click="sureAdd"
        >
          保存
        </div>
        <div
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="addVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import resize from '../../../mixins';
  export default {
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          page: 1,
          size: 20,
          title: '',
          fromUser: '',
          sDate: '',
          eDate: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'title',
          label: '标题'
        },{
          type: 'input',
          prop: 'fromUser',
          label: '创建人'
        },{
          type: 'date',
          prop: ['sDate', 'eDate'],
          label: '发送时间',
        }],
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          }, {
          label: '标题',
          prop: 'title',
          align: 'center',
          minWidth: '10%',
          visible: true
        }, {
          label: '内容',
          prop: 'content',
          align: 'center',
          minWidth: '30%',
          visible: true
        }, {
          label: '发送数量',
          prop: 'userCount',
          align: 'center',
          minWidth: '6%',
          visible: true
        }, {
          label: '发送人',
          prop: 'fromUser',
          align: 'center',
          minWidth: '6%',
          visible: true
        }, {
          label: '接受人',
          prop: 'toUser',
          align: 'center',
          minWidth: '10%',
          visible: true,
          render(row) {
            return row.toUser.length > 16 ? row.toUser.substr(0,16) + '...' : row.toUser;
          }
        }, {
          label: '发送时间',
          prop: 'createTime',
          align: 'center',
          minWidth: '10%',
          visible: true
        }
        ],
        data: [],
        checked: [],
        // 添加
        handleType: 0,
        addVisible: false,
        username: '',
        form: {
          title: '',
          content: '',
          isSys: 1,
          toUser: []
        },
        formColumns: [{
            type: 'input',
            label: '标题',
            prop: 'title',
            placeholder: '必填'
          },
          {
            type: 'textarea',
            label: '内容',
            prop: 'content',
            placeholder: '必填'
          },
          {
            label: '选择用户',
            prop: 'username',
            slotName: 'inputMemberName-column'
          }
        ],
        userList: []
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
        } = await this.$api.listMessageSys(listQuery);
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
      // 获取用户列表
      async handleSearchUser() {
        if (this.username) {
          const {
            data
          } = await this.$api.memberloginList({username: this.username});
          const {
            list
          } = data;
          this.userList = list.map(item=> {
            item.key = item.username;
            item.label = item.username;
            return item;
          });
        } else {
          this.$message.error('请输入用户名!');
        }
      },
      handleAdd() {
        this.handleType = 0;
        this.addVisible = true;
        this.$nextTick(() => {
            this.form = this.$options.data().form;
            this.userList = [];
            this.username = '';
        });
      },
      // 提交
      async sureAdd() {
        const { toUser, ...formData } = this.form;
        if (toUser.length) {
          formData.toUser = toUser.join(',');
          const { error } = await this.$api.sendMessageSys(formData);
          !error && this.$message.success('提交成功');
          this.getList();
          this.addVisible = false;
        } else {
          this.$message.error('请选择用户!');
        }
      },
      // 查看
      handleWatch() {
        this.handleType = 1;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.clearValidate();
          const data = this.checked[0];
          this.form.title = data.title;
          this.form.content = data.content;
          this.form.toUser = data.toUser.split(',');
        });
      }
    }
  };
</script>