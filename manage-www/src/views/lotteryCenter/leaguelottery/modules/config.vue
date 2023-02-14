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
          @click="checkValidate() && leaguelotteryForm()"
        >
          <svg-icon icon-class="check-square" />玩法分组
        </div>
        <div
          class="primary-btn"
          @click="lotterySeqForm"
        >
          <svg-icon icon-class="sort" />彩种玩法排序
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
        :hidden-pagination="true"
        height="calc(100vh - 244px)"
        @selection-change="checked = $event"
        @row-click="handleRowClick"
      >
        <template
          slot="state-column"
          slot-scope="{row}"
        >
          <span v-if="row.isParent">-</span>
          <div
            v-else
            :class="['tag-green', 'tag-gray'][row.state]"
          >
            {{ row.state > 0 ? '停止销售': '正常销售' }}
          </div>
        </template>
        <template
          slot="enableFlag-column"
          slot-scope="{row}"
        >
          <span v-if="row.isParent">-</span>
          <div
            v-else
            :class="['tag-gray', 'tag-green'][row.enableFlag]"
          >
            {{ row.enableFlag > 0 ? '已上架': '已下架' }}
          </div>
        </template>
        <template
          slot="isLevel-column"
          slot-scope="{row}"
        >
          <span v-if="row.isParent">-</span>
          <div
            v-else
            :class="[row.isLevel < 0 ? 'tag-gray' :row.isLevel <= 8 ? 'tag-green': 'tag-orange']"
          >
            {{ row.isLevel > 0 ? row.map.isLevel: '无限制' }}
          </div>
        </template>
        <template
          slot="selfOpenEnable-column"
          slot-scope="{row}"
        >
          <span v-if="row.isParent">-</span>
          <div
            v-else
            :class="['tag-green', 'tag-gray'][row.selfOpenEnable - 1]"
          >
            {{ row.selfOpenEnable === 1 ? '是' : '否' }}
          </div>
        </template>
        <template
          slot="killNumberEnable-column"
          slot-scope="{row}"
        >
          <span v-if="row.isParent">-</span>
          <div
            v-else
            :class="['tag-gray', 'tag-green'][row.killNumberEnable]"
          >
            {{ ['关闭', '开启' ][row.killNumberEnable] }}
          </div>
        </template>
      </table-page>
    </div>
    <el-dialog
      v-drag-dialog
      title="彩票配置-编辑"
      :visible.sync="editVisible"
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
              slot="selfOpenEnable-column"
              slot-scope="{formData, item}"
            >
              <el-switch
                v-model="formData[item.prop]"
                class="ml20"
                :active-value="1"
                :inactive-value="0"
              />
              <span
                class="ml20"
                style="color: #FF5722;"
              ><img
                src="../../../../assets/image/warn.jpg"
                alt=""
                style="width: 30px; vertical-align: middle;"
              > 自营彩请勿关闭，否则会导致开奖结果错乱</span>
            </template>
            <template
              slot="profitability-column"
              slot-scope="{formData, item}"
            >
              <el-input
                v-model.trim="formData[item.prop]"
                auto-complete="off"
                placeholder="杀号盈利率"
                style="width: 200px;"
              />
              <span class="ml20">输入0.01表示1%</span>
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
          @click="updateData"
        >
          保存
        </div>
        <div
          class="disabled-btn small-btn ml16"
          @click="editVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog
      title="彩票配置-玩法分组"
      :visible.sync="betVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <div class="mb20">
            <div
              class="primary-btn small-btn"
              @click="ztreeObj.checkAllNodes(true)"
            >
              <svg-icon icon-class="check-square" />全选中
            </div>
            <div
              class="primary-btn small-btn ml10"
              @click="ztreeObj.checkAllNodes(false)"
            >
              <svg-icon icon-class="no-check" />全取消
            </div>
          </div>
          <tree
            :setting="setting"
            :nodes="zNodes"
            @onCreated="ztreeObj = $event"
          />
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="leaguelotterySave"
        >
          保存
        </div>
        <div
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="betVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-drag-dialog
      title="彩票配置-玩法排序编辑"
      :visible.sync="seqVisible"
      width="50%"
    >
      <div class="module-form-scroll">
        <el-scrollbar>
          <el-tabs
            v-model="activeLottery"
            @tab-click="getSeqData"
          >
            <el-tab-pane
              v-for="item in lotteryCategoryCode"
              :key="item.value"
              :label="item.label"
              :name="item.value"
            />
          </el-tabs>
          <table-page
            ref="paraentTable"
            :data="seqData"
            :columns="seqTableColumns"
            :hidden-pagination="true"
          >
            <template
              slot="lotteryGameName-column"
              slot-scope="{row}"
            >
              <el-input
                v-model.number="row.lotteryGameName"
                auto-complete="off"
                readonly
              />
            </template>
            <template
              slot="seq-column"
              slot-scope="{row}"
            >
              <el-input
                v-model.number="row.seq"
                auto-complete="off"
              />
            </template>
          </table-page>
        </el-scrollbar>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div
          class="primary-btn small-btn"
          @click="leaguelotterySave"
        >
          保存
        </div>
        <div
          class="disabled-btn small-btn"
          style="margin-left: 16px;"
          @click="seqVisible = false"
        >
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    saleState,
    enableFlag,
    selfOpenEnable,
    killNumberEnable
  } from './options';
    import {
    lotteryCategoryCode
  } from '@/utils/options';
  import tree from 'vue-giant-tree';
  import resize from '../../../mixins';
  export default {
    components: {
      tree
    },
    mixins: [resize],
    data() {
      return {
        lotteryCategoryCode,
        loading: true,
        listQuery: {
          state: '',
          enableFlag: '',
          selfOpenEnable: '',
          killNumberEnable: '',
        },
        // 查询配置
        queryColumns: [{
            type: 'select',
            prop: 'state',
            label: '销售状态',
            options: saleState
          },
          {
            type: 'select',
            prop: 'enableFlag',
            label: '上下架',
            options: enableFlag
          },
          {
            type: 'select',
            prop: 'selfOpenEnable',
            label: '自营',
            options: selfOpenEnable
          },
          {
            type: 'select',
            prop: 'killNumberEnable',
            label: '杀号',
            options: killNumberEnable
          }
        ],
        // 列表配置
        tableColumns: [{
            type: 'selection',
            width: '55',
            align: 'center'
          },
          {
            prop: 'name',
            label: '彩票名称',
            minWidth: '15%',
            align: 'left',
            visible: true
          },
          {
            label: 'id',
            prop: 'id',
            align: 'center',
            width: '55',
            visible: false
          },
          {
            prop: 'state',
            label: '销售状态',
            minWidth: '8%',
            align: 'center',
            visible: true,
            slotName: 'state-column'
          },
          {
            prop: 'enableFlag',
            label: '上下架',
            minWidth: '8%',
            align: 'center',
            visible: true,
            slotName: 'enableFlag-column'
          },
          {
            prop: 'stopDelay',
            label: '截止间隔(秒)',
            minWidth: '8%',
            align: 'center',
            visible: true
          },
          {
            prop: 'isLevel',
            label: '控制投注球数',
            minWidth: '8%',
            align: 'center',
            visible: true,
            slotName: 'isLevel-column'
          },
          {
            prop: 'selfOpenEnable',
            label: '自营',
            minWidth: '5%',
            align: 'center',
            visible: true,
            slotName: 'selfOpenEnable-column'
          },
          {
            label: '杀号盈利率',
            prop: 'killRate',
            align: 'center',
            minWidth: '5%',
            visible: true
          },
          {
            prop: 'killNumberEnable',
            label: '是否杀号',
            minWidth: '8%',
            align: 'center',
            visible: true,
            slotName: 'killNumberEnable-column'
          },
          {
            prop: 'code',
            label: '彩种编码',
            minWidth: '10%',
            align: 'center',
            visible: true
          }
        ],
        data: [],
        // 编辑记录
        checked: [],
        currentLottery: {},
        editVisible: false,
        form: {
          showName: '',
          lottery: '',
          status: 1,
          isShow: '',
          selfOpenEnable: '',
          killNumberEnable: '',
          killRate: '',
          stopDelay: ''
        },
        formColumns: [{
            type: 'input',
            label: '彩种名称',
            prop: 'showName',
            placeholder: '请输入彩种名称'
          },
          {
            type: 'select',
            label: '销售状态',
            prop: 'status',
            placeholder: '请选择销售状态',
            options: saleState
          },
          {
            type: 'switch',
            label: '上下架',
            prop: 'isShow',
            values: [1, -1]
          },
          {
            label: '自营',
            prop: 'selfOpenEnable',
            slotName: 'selfOpenEnable-column',
          },
          {
            type: 'switch',
            label: '杀号',
            prop: 'killNumberEnable',
            values: [1, 0]
          },
          {
            label: '杀号盈利率',
            prop: 'killRate',
            slotName: 'profitability-column',
          },
          {
            type: 'input',
            label: '截止时间间隔(秒)',
            prop: 'stopDelay',
            placeholder: '截止时间为正数则比官方提前，负数为比官方推后'
          },
          // {
          //   type: 'input',
          //   label: '控制投注球数',
          //   prop: 'isLevel',
          //   placeholder: '控制投注球数默认值-1不进行任何设置操作'
          // }
        ],
        // 玩法分组
        ztreeObj: null,
        betVisible: false,
        setting: {
          view: {
            selectedMulti: false
          },
          check: {
            enable: true
          },
          data: {
            simpleData: {
              enable: true,
              idKey: 'code',
              pIdKey: 'parentCode',
              rootPId: '0'
            }
          }
        },
        zNodes: [{
            'code': 'ssc_cq_5x_zhx_fs',
            'parentCode': 'ssc_cq_5x_zhx',
            'name': '五星直选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_zhx_ds',
            'parentCode': 'ssc_cq_5x_zhx',
            'name': '五星直选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_zhx_zh',
            'parentCode': 'ssc_cq_5x_zhx',
            'name': '五星直选组合',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_zhx',
            'parentCode': 'ssc_cq_5x',
            'name': '五星直选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_zx_120',
            'parentCode': 'ssc_cq_5x_zx',
            'name': '五星组选120',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_zx_60',
            'parentCode': 'ssc_cq_5x_zx',
            'name': '五星组选60',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_zx_30',
            'parentCode': 'ssc_cq_5x_zx',
            'name': '五星组选30',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_zx_20',
            'parentCode': 'ssc_cq_5x_zx',
            'name': '五星组选20',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_zx_10',
            'parentCode': 'ssc_cq_5x_zx',
            'name': '五星组选10',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_zx_5',
            'parentCode': 'ssc_cq_5x_zx',
            'name': '五星组选5',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_zx',
            'parentCode': 'ssc_cq_5x',
            'name': '五星组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_ts_1',
            'parentCode': 'ssc_cq_5x_ts',
            'name': '五星特殊一帆风顺',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_ts_2',
            'parentCode': 'ssc_cq_5x_ts',
            'name': '五星特殊好事成双',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_ts_3',
            'parentCode': 'ssc_cq_5x_ts',
            'name': '五星特殊三星报喜',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_ts_4',
            'parentCode': 'ssc_cq_5x_ts',
            'name': '五星特殊四季发财',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_ts',
            'parentCode': 'ssc_cq_5x',
            'name': '五星特殊',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_qt_lhh',
            'parentCode': 'ssc_cq_5x_qt',
            'name': '五星龙虎和',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_qt_zhdxds',
            'parentCode': 'ssc_cq_5x_qt',
            'name': '五星总和大小单双',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_qt_long',
            'parentCode': 'ssc_cq_5x_qt',
            'name': '五星龙虎和-龙',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_qt_hu',
            'parentCode': 'ssc_cq_5x_qt',
            'name': '五星龙虎和-虎',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_qt_he',
            'parentCode': 'ssc_cq_5x_qt',
            'name': '五星龙虎和-和',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x_qt',
            'parentCode': 'ssc_cq_5x',
            'name': '五星其他',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_5x',
            'parentCode': '0',
            'name': '五星',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2_zhx_fs',
            'parentCode': 'ssc_cq_q2_zhx',
            'name': '前二直选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2_zhx_ds',
            'parentCode': 'ssc_cq_q2_zhx',
            'name': '前二直选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2_zhx_zh',
            'parentCode': 'ssc_cq_q2_zhx',
            'name': '前二直选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2_zhx_kd',
            'parentCode': 'ssc_cq_q2_zhx',
            'name': '前二直选跨度',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2_zhx',
            'parentCode': 'ssc_cq_q2',
            'name': '前二直选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2_zx_fs',
            'parentCode': 'ssc_cq_q2_zx',
            'name': '前二组选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2_zx_ds',
            'parentCode': 'ssc_cq_q2_zx',
            'name': '前二组选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2_zx_zh',
            'parentCode': 'ssc_cq_q2_zx',
            'name': '前二组选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2_zx_bd',
            'parentCode': 'ssc_cq_q2_zx',
            'name': '前二组选包胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2_zx',
            'parentCode': 'ssc_cq_q2',
            'name': '前二组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q2',
            'parentCode': '0',
            'name': '前二',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2_zhx_fs',
            'parentCode': 'ssc_cq_h2_zhx',
            'name': '后二直选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2_zhx_ds',
            'parentCode': 'ssc_cq_h2_zhx',
            'name': '后二直选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2_zhx_zh',
            'parentCode': 'ssc_cq_h2_zhx',
            'name': '后二直选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2_zhx_kd',
            'parentCode': 'ssc_cq_h2_zhx',
            'name': '后二直选跨度',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2_zhx',
            'parentCode': 'ssc_cq_h2',
            'name': '后二直选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2_zx_fs',
            'parentCode': 'ssc_cq_h2_zx',
            'name': '后二组选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2_zx_ds',
            'parentCode': 'ssc_cq_h2_zx',
            'name': '后二组选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2_zx_zh',
            'parentCode': 'ssc_cq_h2_zx',
            'name': '后二组选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2_zx_bd',
            'parentCode': 'ssc_cq_h2_zx',
            'name': '后二组选包胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2_zx',
            'parentCode': 'ssc_cq_h2',
            'name': '后二组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2',
            'parentCode': '0',
            'name': '后二',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zhx_fs',
            'parentCode': 'ssc_cq_h2super_zhx',
            'name': '2000后二直选复式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zhx_ds',
            'parentCode': 'ssc_cq_h2super_zhx',
            'name': '2000后二直选单式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zhx_hz',
            'parentCode': 'ssc_cq_h2super_zhx',
            'name': '2000后二直选和值',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zhx_kd',
            'parentCode': 'ssc_cq_h2super_zhx',
            'name': '2000后二直选跨度',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zhx_repeat',
            'parentCode': 'ssc_cq_h2super_zhx',
            'name': '2000后二直选复式前两位一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zhx_norepeat',
            'parentCode': 'ssc_cq_h2super_zhx',
            'name': '2000后二直选复式前两位不一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zhx',
            'parentCode': 'ssc_cq_h2super',
            'name': '超级2000后二直选',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zx_fs',
            'parentCode': 'ssc_cq_h2super_zx',
            'name': '2000后二组选复式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zx_ds',
            'parentCode': 'ssc_cq_h2super_zx',
            'name': '2000后二组选单式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zx_zh',
            'parentCode': 'ssc_cq_h2super_zx',
            'name': '2000后二组选和值',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zx_bd',
            'parentCode': 'ssc_cq_h2super_zx',
            'name': '2000后二组选包胆',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zx_repeat',
            'parentCode': 'ssc_cq_h2super_zx',
            'name': '2000后二组选复式前两位一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zx_norepeat',
            'parentCode': 'ssc_cq_h2super_zx',
            'name': '2000后二组选复式前两位不一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super_zx',
            'parentCode': 'ssc_cq_h2super',
            'name': '超级2000后二组选',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h2super',
            'parentCode': '0',
            'name': '后二',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zhx_fs',
            'parentCode': 'ssc_cq_q3_zhx',
            'name': '前三直选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zhx_ds',
            'parentCode': 'ssc_cq_q3_zhx',
            'name': '前三直选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zhx_zh',
            'parentCode': 'ssc_cq_q3_zhx',
            'name': '前三直选组合',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zhx_hz',
            'parentCode': 'ssc_cq_q3_zhx',
            'name': '前三直选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zhx_kd',
            'parentCode': 'ssc_cq_q3_zhx',
            'name': '前三直选跨度',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zhx',
            'parentCode': 'ssc_cq_q3',
            'name': '前三直选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zx_fs3',
            'parentCode': 'ssc_cq_q3_zx',
            'name': '前三组三复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zx_ds3',
            'parentCode': 'ssc_cq_q3_zx',
            'name': '前三组三单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zx_fs6',
            'parentCode': 'ssc_cq_q3_zx',
            'name': '前三组六复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zx_ds6',
            'parentCode': 'ssc_cq_q3_zx',
            'name': '前三组六单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zx_hh',
            'parentCode': 'ssc_cq_q3_zx',
            'name': '前三混合组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zx_hz',
            'parentCode': 'ssc_cq_q3_zx',
            'name': '前三组选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zx_bd',
            'parentCode': 'ssc_cq_q3_zx',
            'name': '前三组选包胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_zx',
            'parentCode': 'ssc_cq_q3',
            'name': '前三组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_qt_hz',
            'parentCode': 'ssc_cq_q3_qt',
            'name': '前三和值尾数',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_qt_tsh',
            'parentCode': 'ssc_cq_q3_qt',
            'name': '前三特殊号',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_qt_tshdz',
            'parentCode': 'ssc_cq_q3_qt',
            'name': '前三特殊号对子',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_qt_tshbz',
            'parentCode': 'ssc_cq_q3_qt',
            'name': '前三特殊号豹子',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_qt_tshsz',
            'parentCode': 'ssc_cq_q3_qt',
            'name': '前三特殊号顺子',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3_qt',
            'parentCode': 'ssc_cq_q3',
            'name': '前三其他',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_q3',
            'parentCode': '0',
            'name': '前三',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zhx_fs',
            'parentCode': 'ssc_cq_z3_zhx',
            'name': '中三直选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zhx_ds',
            'parentCode': 'ssc_cq_z3_zhx',
            'name': '中三直选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zhx_zh',
            'parentCode': 'ssc_cq_z3_zhx',
            'name': '中三直选组合',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zhx_hz',
            'parentCode': 'ssc_cq_z3_zhx',
            'name': '中三直选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zhx_kd',
            'parentCode': 'ssc_cq_z3_zhx',
            'name': '中三直选跨度',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zhx',
            'parentCode': 'ssc_cq_z3',
            'name': '中三直选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zx_fs3',
            'parentCode': 'ssc_cq_z3_zx',
            'name': '中三组三复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zx_ds3',
            'parentCode': 'ssc_cq_z3_zx',
            'name': '中三组三单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zx_fs6',
            'parentCode': 'ssc_cq_z3_zx',
            'name': '中三组六复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zx_ds6',
            'parentCode': 'ssc_cq_z3_zx',
            'name': '中三组六单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zx_hh',
            'parentCode': 'ssc_cq_z3_zx',
            'name': '中三混合组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zx_hz',
            'parentCode': 'ssc_cq_z3_zx',
            'name': '中三组选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zx_bd',
            'parentCode': 'ssc_cq_z3_zx',
            'name': '中三组选包胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_zx',
            'parentCode': 'ssc_cq_z3',
            'name': '中三组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_qt_hz',
            'parentCode': 'ssc_cq_z3_qt',
            'name': '中三和值尾数',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_qt_tsh',
            'parentCode': 'ssc_cq_z3_qt',
            'name': '中三特殊号',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3_qt',
            'parentCode': 'ssc_cq_z3',
            'name': '中三其他',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_z3',
            'parentCode': '0',
            'name': '中三',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zhx_fs',
            'parentCode': 'ssc_cq_h3_zhx',
            'name': '后三直选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zhx_ds',
            'parentCode': 'ssc_cq_h3_zhx',
            'name': '后三直选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zhx_zh',
            'parentCode': 'ssc_cq_h3_zhx',
            'name': '后三直选组合',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zhx_hz',
            'parentCode': 'ssc_cq_h3_zhx',
            'name': '后三直选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zhx_kd',
            'parentCode': 'ssc_cq_h3_zhx',
            'name': '后三直选跨度',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zhx',
            'parentCode': 'ssc_cq_h3',
            'name': '后三直选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zx_fs3',
            'parentCode': 'ssc_cq_h3_zx',
            'name': '后三组三复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zx_ds3',
            'parentCode': 'ssc_cq_h3_zx',
            'name': '后三组三单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zx_fs6',
            'parentCode': 'ssc_cq_h3_zx',
            'name': '后三组六复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zx_ds6',
            'parentCode': 'ssc_cq_h3_zx',
            'name': '后三组六单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zx_hh',
            'parentCode': 'ssc_cq_h3_zx',
            'name': '后三混合组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zx_hz',
            'parentCode': 'ssc_cq_h3_zx',
            'name': '后三组选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zx_bd',
            'parentCode': 'ssc_cq_h3_zx',
            'name': '后三组选包胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_zx',
            'parentCode': 'ssc_cq_h3',
            'name': '后三组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_qt_hz',
            'parentCode': 'ssc_cq_h3_qt',
            'name': '后三和值尾数',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_qt_tsh',
            'parentCode': 'ssc_cq_h3_qt',
            'name': '后三特殊号',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3_qt',
            'parentCode': 'ssc_cq_h3',
            'name': '后三其他',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3',
            'parentCode': '0',
            'name': '后三',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zhx_fs',
            'parentCode': 'ssc_cq_h3super_zhx',
            'name': '2000后三直选复式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zhx_ds',
            'parentCode': 'ssc_cq_h3super_zhx',
            'name': '2000后三直选单式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zhx_hz',
            'parentCode': 'ssc_cq_h3super_zhx',
            'name': '2000后三直选和值',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zhx_kd',
            'parentCode': 'ssc_cq_h3super_zhx',
            'name': '2000后三直选跨度',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zhx_repeat',
            'parentCode': 'ssc_cq_h3super_zhx',
            'name': '2000后三直选复式前两位一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zhx_norepeat',
            'parentCode': 'ssc_cq_h3super_zhx',
            'name': '2000后三直选复式前两位不一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zhx',
            'parentCode': 'ssc_cq_h3super',
            'name': '超级2000后三直选',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_fs3',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '2000后三组三复式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_ds3',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '2000后三组三单式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_fs6',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '2000后三组六复式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_ds6',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '2000后三组六单式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_hh',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '2000后三混合组选',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_hz',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '2000后三组选和值',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_bd',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '2000后三组选包胆',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_repeat11',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '组选前2位一致，后三位有重复号',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_repeat01',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '组选前2位不一致，后三位有重复号',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_repeat10',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '组选前2位一致，后三位无重复号',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx_repeat00',
            'parentCode': 'ssc_cq_h3super_zx',
            'name': '组选前2位不一致，后三位无重复号',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_zx',
            'parentCode': 'ssc_cq_h3super',
            'name': '超级2000后三组选',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_bdd_h31m',
            'parentCode': 'ssc_cq_h3super_bdd',
            'name': '2000后三一码不定胆',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_bdd_1mrepeat',
            'parentCode': 'ssc_cq_h3super_bdd',
            'name': '后三一码前2位一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_bdd_1mnorepeat',
            'parentCode': 'ssc_cq_h3super_bdd',
            'name': '后三一码前2位不一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_bdd_h32m',
            'parentCode': 'ssc_cq_h3super_bdd',
            'name': '2000后三二码不定胆',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_bdd_2mrepeat',
            'parentCode': 'ssc_cq_h3super_bdd',
            'name': '后三二码前2位一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_bdd_2mnorepeat',
            'parentCode': 'ssc_cq_h3super_bdd',
            'name': '后三二码前2位不一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super_bdd',
            'parentCode': 'ssc_cq_h3super',
            'name': '超级2000后三不定胆',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h3super',
            'parentCode': '0',
            'name': '后三',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_h4_zhx_fs',
            'parentCode': 'ssc_cq_h4_zhx',
            'name': '四星直选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h4_zhx_ds',
            'parentCode': 'ssc_cq_h4_zhx',
            'name': '四星直选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h4_zhx_zh',
            'parentCode': 'ssc_cq_h4_zhx',
            'name': '四星直选组合',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h4_zhx',
            'parentCode': 'ssc_cq_h4',
            'name': '四星直选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h4_zx_24',
            'parentCode': 'ssc_cq_h4_zx',
            'name': '四星组选24',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h4_zx_12',
            'parentCode': 'ssc_cq_h4_zx',
            'name': '四星组选12',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h4_zx_6',
            'parentCode': 'ssc_cq_h4_zx',
            'name': '四星组选6',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h4_zx_4',
            'parentCode': 'ssc_cq_h4_zx',
            'name': '四星组选4',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h4_zx',
            'parentCode': 'ssc_cq_h4',
            'name': '四星组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_h4',
            'parentCode': '0',
            'name': '四星',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dwd_dwd_dwd',
            'parentCode': 'ssc_cq_dwd_dwd',
            'name': '定位胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dwd_dwd',
            'parentCode': 'ssc_cq_dwd',
            'name': '定位胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dwd',
            'parentCode': '0',
            'name': '定位胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dwdsuper_dwd_dwd',
            'parentCode': 'ssc_cq_dwdsuper_dwd',
            'name': '2000定位胆',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_dwdsuper_dwd_repeat',
            'parentCode': 'ssc_cq_dwdsuper_dwd',
            'name': '2000定位胆前两位一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_dwdsuper_dwd_norepeat',
            'parentCode': 'ssc_cq_dwdsuper_dwd',
            'name': '2000定位胆前两位不一致',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_dwdsuper_dwd',
            'parentCode': 'ssc_cq_dwdsuper',
            'name': '超级2000定位胆',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_dwdsuper',
            'parentCode': '0',
            'name': '定位胆',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp_zh_fs',
            'parentCode': 'ssc_cq_lmp_zh',
            'name': '整合',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp_zh',
            'parentCode': 'ssc_cq_lmp',
            'name': '整合',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp_hsds_fs',
            'parentCode': 'ssc_cq_lmp_hsds',
            'name': '和数单双',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp_hsds',
            'parentCode': 'ssc_cq_lmp',
            'name': '和数单双',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp_lhh_lhh',
            'parentCode': 'ssc_cq_lmp_lhh',
            'name': '两面盘龙虎和',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp_lhh_xlh',
            'parentCode': 'ssc_cq_lmp_lhh',
            'name': '两面盘新龙虎',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp_lhh_he',
            'parentCode': 'ssc_cq_lmp_lhh',
            'name': '两面盘龙虎和-和',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp_lhh_long',
            'parentCode': 'ssc_cq_lmp_lhh',
            'name': '两面盘龙虎和-龙',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp_lhh_hu',
            'parentCode': 'ssc_cq_lmp_lhh',
            'name': '两面盘龙虎和-虎',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp_lhh',
            'parentCode': 'ssc_cq_lmp',
            'name': '龙虎和',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_lmp',
            'parentCode': '0',
            'name': '两面盘',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dxds_2x_q2dxds',
            'parentCode': 'ssc_cq_dxds_2x',
            'name': '前二大小单双',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dxds_2x_h2dxds',
            'parentCode': 'ssc_cq_dxds_2x',
            'name': '后二大小单双',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dxds_2x',
            'parentCode': 'ssc_cq_dxds',
            'name': '二星',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dxds_3x_q3dxds',
            'parentCode': 'ssc_cq_dxds_3x',
            'name': '前三大小单双',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dxds_3x_h3dxds',
            'parentCode': 'ssc_cq_dxds_3x',
            'name': '后三大小单双',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dxds_3x',
            'parentCode': 'ssc_cq_dxds',
            'name': '三星',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_dxds',
            'parentCode': '0',
            'name': '大小单双',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r2_zhx_fs',
            'parentCode': 'ssc_cq_r2_zhx',
            'name': '任二直选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r2_zhx_ds',
            'parentCode': 'ssc_cq_r2_zhx',
            'name': '任二直选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r2_zhx_hz',
            'parentCode': 'ssc_cq_r2_zhx',
            'name': '任二直选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r2_zhx',
            'parentCode': 'ssc_cq_r2',
            'name': '任二直选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r2_zx_fs',
            'parentCode': 'ssc_cq_r2_zx',
            'name': '任二组选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r2_zx_ds',
            'parentCode': 'ssc_cq_r2_zx',
            'name': '任二组选单式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_r2_zx_hz',
            'parentCode': 'ssc_cq_r2_zx',
            'name': '任二组选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r2_zx',
            'parentCode': 'ssc_cq_r2',
            'name': '任二组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r2',
            'parentCode': '0',
            'name': '任选二',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zhx_fs',
            'parentCode': 'ssc_cq_r3_zhx',
            'name': '任三直选复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zhx_ds',
            'parentCode': 'ssc_cq_r3_zhx',
            'name': '任三直选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zhx_hz',
            'parentCode': 'ssc_cq_r3_zhx',
            'name': '任三直选和值',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zhx',
            'parentCode': 'ssc_cq_r3',
            'name': '任三直选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zx_fs3',
            'parentCode': 'ssc_cq_r3_zx',
            'name': '任三组三复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zx_ds3',
            'parentCode': 'ssc_cq_r3_zx',
            'name': '任三组三单式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zx_fs6',
            'parentCode': 'ssc_cq_r3_zx',
            'name': '任三组六复式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zx_ds6',
            'parentCode': 'ssc_cq_r3_zx',
            'name': '任三组六单式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zx_hh',
            'parentCode': 'ssc_cq_r3_zx',
            'name': '任三混合组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zx_hz',
            'parentCode': 'ssc_cq_r3_zx',
            'name': '任三组选和值',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3_zx',
            'parentCode': 'ssc_cq_r3',
            'name': '任三组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r3',
            'parentCode': '0',
            'name': '任选三',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_3x_q31m',
            'parentCode': 'ssc_cq_bdd_3x',
            'name': '前三一码不定胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_3x_h31m',
            'parentCode': 'ssc_cq_bdd_3x',
            'name': '后三一码不定胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_3x_q32m',
            'parentCode': 'ssc_cq_bdd_3x',
            'name': '前三二码不定胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_3x_h32m',
            'parentCode': 'ssc_cq_bdd_3x',
            'name': '后三二码不定胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_3x',
            'parentCode': 'ssc_cq_bdd',
            'name': '三星',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_4x_h41m',
            'parentCode': 'ssc_cq_bdd_4x',
            'name': '后四一码不定胆',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_4x_h42m',
            'parentCode': 'ssc_cq_bdd_4x',
            'name': '后四二码不定胆',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_4x',
            'parentCode': 'ssc_cq_bdd',
            'name': '四星',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_5x_2m',
            'parentCode': 'ssc_cq_bdd_5x',
            'name': '五星二码不定胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_5x_3m',
            'parentCode': 'ssc_cq_bdd_5x',
            'name': '五星三码不定胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd_5x',
            'parentCode': 'ssc_cq_bdd',
            'name': '五星',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_bdd',
            'parentCode': '0',
            'name': '不定胆',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r4_zhx_fs',
            'parentCode': 'ssc_cq_r4_zhx',
            'name': '任四直选复式',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_r4_zhx_ds',
            'parentCode': 'ssc_cq_r4_zhx',
            'name': '任四直选单式',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r4_zhx',
            'parentCode': 'ssc_cq_r4',
            'name': '任四直选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r4_zx_24',
            'parentCode': 'ssc_cq_r4_zx',
            'name': '任四组选24',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_r4_zx_12',
            'parentCode': 'ssc_cq_r4_zx',
            'name': '任四组选12',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_r4_zx_6',
            'parentCode': 'ssc_cq_r4_zx',
            'name': '任四组选6',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_r4_zx_4',
            'parentCode': 'ssc_cq_r4_zx',
            'name': '任四组选4',
            'checked': false,
            'map': {}
          },
          {
            'code': 'ssc_cq_r4_zx',
            'parentCode': 'ssc_cq_r4',
            'name': '任四组选',
            'checked': true,
            'map': {}
          },
          {
            'code': 'ssc_cq_r4',
            'parentCode': '0',
            'name': '任选四',
            'checked': true,
            'map': {}
          }
        ],
        // 玩法排序
        seqVisible: false,
        lotteryList: [],
        activeLottery: 'ssc',
        seqData: [{
          lotteryGameName: '五星',
          seq: 1
        }],
        seqTableColumns: [{
            label: '玩法名称',
            prop: 'lotteryGameName',
            align: 'left',
            minWidth: '50%',
            visible: true,
            slotName: 'lotteryGameName-column'
          }, {
            label: '排序',
            prop: 'seq',
            align: 'left',
            minWidth: '50%',
            visible: true,
            slotName: 'seq-column'
          }]
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取列表
      async getList() {
        this.loading = true;
        const {
          data
        } = await this.$api.lotteryList(this.listQuery);
        this.data = data.reduce((total, current) => {
          if (!current.parentCode) {
            current.children = [];
            total.push(current);
          } else {
            (this.listQuery.state === '' || this.listQuery.state === current.state) &&
            (this.listQuery.enableFlag === '' || this.listQuery.enableFlag === current.enableFlag) &&
            (this.listQuery.selfOpenEnable === '' || this.listQuery.selfOpenEnable === current.selfOpenEnable) &&
            (this.listQuery.killNumberEnable === '' || this.listQuery.killNumberEnable === current.killNumberEnable) &&
            total[total.length - 1].children.push(current);
          }
          return total;
        }, []);
        this.loading = false;
      },
      // 搜索
      handleSearch() {
        this.getList();
      },
      // 编辑记录
      handleRowClick(row, column, event) {
        if (!row.isParent) {
          this.currentLottery = row;
          this.editVisible = true;
          this.$nextTick(() => {
            this.$refs.jsonForm.clearValidate();
            this.form.showName = row.name;
            this.form.lottery = row.code;
            this.form.status = row.state;
            this.form.isShow = row.enableFlag;
            this.form.selfOpenEnable = row.selfOpenEnable;
            this.form.killNumberEnable = row.killNumberEnable;
            this.form.killRate = row.killRate;
            this.form.stopDelay = row.stopDelay;
          });
        }
      },
      // 确认修改
      updateData() {
        this.$refs.jsonForm.validate(async _ => {
          const { error } = await this.$api.lotteryEdit(this.form);
          !error && this.$message.success('提交成功');
          this.getList();
          this.editVisible = false;
        });
      },
      // 玩法分组
      leaguelotteryForm() {
        this.betVisible = true;
      },
      leaguelotterySave() {
        // const nodes = this.treeObj.getCheckedNodes(true);
        // const ids = nodes.map(node=> node.code).join(',');
        // formSubmit("leaguelotterySave");
      },
      // 玩法排序
      lotterySeqForm() {
        this.seqVisible = true;
      },
      // 获取玩法数据
      getSeqData(tab) {
        // 获取当前彩票的玩法
      }
    }
  };
</script>