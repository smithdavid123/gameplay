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
          <svg-icon icon-class="edit" />增加
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleEdit()"
        >
          <svg-icon icon-class="edit" />编辑
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handlePublish()"
        >
          <svg-icon icon-class="edit" />发布
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleCancel()"
        >
          <svg-icon icon-class="edit" />取消发布
        </div>
        <div
          class="primary-btn"
          @click="checkValidate() && handleDel()"
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
        :page.sync="listQuery.pageNumber"
        @selection-change="checked = $event"
        @pagination="getList"
      >
        <template
          slot="activityType-column"
          slot-scope="{row}"
        >
          <div
            class="tag-aqua"
          >
            {{ row.activityType | formatterActivityType }}
          </div>
        </template>
        <template
          slot="thirdType-column"
          slot-scope="{row}"
        >
          <div
            :class="row.thirdType | formatterPlatformTypeTagClass"
          >
            {{ row.thirdType | formatterPlatformType }}
          </div>
        </template>
        <template
          slot="applyFlag-column"
          slot-scope="{row}"
        >
          <div
            :class="['tag-aqua', 'tag-green'][row.applyFlag]"
          >
            {{ row.applyFlag | formatterApplyFlag }}
          </div>
        </template>
        <template
          slot="publishFlag-column"
          slot-scope="{row}"
        >
          <div
            :class="['tag-orange', 'tag-green'][row.memberType + 1]"
          >
            {{ row.publishFlag | formatterPlushType }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      :title="`优惠活动-${handleType?'编辑':'新增'}`"
      :visible.sync="addVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <json-form
            ref="jsonForm"
            :form="form"
            :columns="formColumns"
            label-width="140px"
          >
            <template
              slot="imgPath-column"
            >
              <el-upload
                action="/file/avatar"
                :show-file-list="false"
              >
                <div
                  class="upload-btn"
                >
                  <svg-icon icon-class="add" />上传图片
                </div>
              </el-upload>
              <span>建议尺寸：1920*580 支持jpg、png、jpeg格式</span>
            </template>
            <template
              slot="imgPathApp-column"
            >
              <el-upload
                action="/file/avatar"
                :show-file-list="false"
              >
                <div
                  class="upload-btn"
                >
                  <svg-icon icon-class="add" />上传图片
                </div>
              </el-upload>
              <span>建议尺寸：370*190 支持jpg、png、jpeg格式</span>
            </template>
            <template
              slot="content-column"
              slot-scope="{formData, item}"
            >
              <div class="form-handle-slot">
                <div class="form-handle-slot-title mb4">
                  内容
                </div>
                <VueUeditorWrap
                  v-model="formData[item.prop]"
                  :config="myConfig"
                />
              </div>
            </template>
            <template
              slot="remark-column"
              slot-scope="{formData, item}"
            >
              <div class="form-handle-slot">
                <div class="form-handle-slot-title mb4">
                  备注
                </div>
                <el-input
                  v-model.trim="formData[item.prop]"
                  type="textarea"
                  :rows="6"
                />
              </div>
            </template>
          </json-form>
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="sureEdit"
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
  import { activityType, publishFlag, publishFlag2, topFlag, thirdType, applyFlag, actId } from './options';
  import VueUeditorWrap from 'vue-ueditor-wrap';
  export default {
    components: {
      VueUeditorWrap
    },
    mixins: [resize],
    data() {
      return {
        loading: false,
        total: 0,
        listQuery: {
          pageNumber: 1,
          activityName: '',
          beginTime: '',
          endTime: '',
          activityType: '',
          publishFlag: ''
        },
        queryColumns: [{
          type: 'input',
          prop: 'activityName',
          label: '活动名称'
        },{
          type: 'date',
          prop: ['beginTime','endTime'],
          label: '创建时间'
        },{
          type: 'select',
          prop: 'activityType',
          label: '活动范围',
          options: activityType
        },{
          type: 'select',
          prop: 'publishFlag',
          label: '状态',
          options: publishFlag
        }],
        myConfig: {
          UEDITOR_HOME_URL: '/UEditor/',
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 300,
          // 初始容器宽度
          initialFrameWidth: '100%',
          elementPathEnabled : false,
          wordCount:false,
          zIndex: 3000
        },
        tableColumns: [{
          type: 'selection',
          width: '55',
          align: 'center'
        }, {
          label: '标题',
          prop: 'activityName',
          align: 'left',
          visible: true,
          minWidth: '10%'
        }, {
          label: '活动范围',
          prop: 'activityType',
          align: 'center',
          visible: true,
          minWidth: '10%',
          slotName: 'activityType-column'
        }, {
          label: '活动图片',
          prop: 'imgPath',
          align: 'center',
          visible: true,
          minWidth: '10%',
        }, {
          label: '统计类型',
          prop: 'thirdType',
          align: 'center',
          visible: true,
          minWidth: '10%',
          slotName: 'thirdType-column'
        }, {
          label: 'app端活动图片',
          prop: 'imgPathApp',
          align: 'center',
          visible: true,
          minWidth: '10%',
        }, {
          label: '创建用户',
          prop: 'createUser',
          align: 'center',
          visible: true,
          minWidth: '10%'
        }, {
          label: '创建日期',
          prop: 'createDate',
          align: 'center',
          visible: true,
          minWidth: '10%',
          render: row=> {
            return this.$format(row.createDate, 'yyyy-MM-dd HH:mm:ss');
          }
        }, {
          label: '需要申请',
          prop: 'applyFlag',
          align: 'center',
          visible: true,
          minWidth: '10%',
          slotName: 'applyFlag-column'
        }, {
          label: '状态',
          prop: 'publishFlag',
          align: 'center',
          visible: true,
          minWidth: '10%',
          slotName: 'publishFlag-column'
        }],
        data: [],
        // 操作
        checked: [],
        addVisible: false,
        handleType: 0,
        form: {
          activityName: '',
          activityType: 9,
          imgPath: '',
          thirdType: 1,
          imgPathApp: '',
          applyFlag: 0,
          actId: '',
          publishFlag: 1,
          topFlag: -1,
          content: '',
          remark: ''
        },
        formColumns: [{
          type: 'input',
          label: '标题',
          prop: 'activityName',
          placeholder: '必填'
        }, {
          type: 'select',
          label: '活动范围',
          prop: 'activityType',
          options: activityType
        }, {
          label: '活动图片',
          prop: 'imgPath',
          slotName: 'imgPath-column'
        }, {
          type: 'select',
          label: '统计类型',
          prop: 'thirdType',
          options: thirdType
        }, {
          label: 'app端活动图片',
          prop: 'imgPathApp',
          slotName: 'imgPathApp-column'
        }, {
          type: 'select',
          label: '需要申请',
          prop: 'applyFlag',
          options: applyFlag
        }, {
          type: 'select',
          label: '绑定活动',
          prop: 'actId',
          placeholder: '无',
          options: actId
        }, {
          type: 'select',
          label: '是否发布',
          prop: 'publishFlag',
          options: publishFlag2
        }, {
          type: 'select',
          label: '是否置顶',
          prop: 'topFlag',
          options: topFlag
        }, {
          type: 'handle',
          label: '内容',
          prop: 'content',
          slotName: 'content-column'
        }, {
          type: 'handle',
          label: '备注',
          prop: 'remark',
          slotName: 'remark-column'
        }]
      };
    },
    created() {
      // this.getList()
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.leaguelotteryList(this.listQuery);
        const {
          count,
          list
        } = data;
        this.total = count;
        this.data = list;
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        // to do
      },
      // 新增
      handleAdd() {
        this.handleType = 0;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.resetValidate();
        });
      },
      // 编辑
      handleEdit() {
        this.handleType = 1;
        this.addVisible = true;
        this.$nextTick(() => {
          this.$refs.jsonForm.resetValidate();
        });
      },
      // 发布
      handlePublish() {
        // to do
      },
      // 取消发布
      handleCancel() {
// to do
      },
      // 删除
      handleDel() {
// to do
      },
      // 确认
      sureEdit() {
// to do
      }
    }
  };
</script>