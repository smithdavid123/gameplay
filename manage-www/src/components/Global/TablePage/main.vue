<template>
  <div>
    <el-table
      ref="table"
      :data="data"
      :border="border"
      :size="size"
      :stripe="stripe"
      :height="height"
      :row-key="rowKey"
      default-expand-all
      :show-header="showHeader"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      :current-row-key="currentRowKey"
      :row-class-name="rowClassName"
      :empty-text="emptyText"
      :tooltip-effect="tooltipEffect"
      :style="tableStyle"
      @header-click="(column, event) => emitEventHandler('header-click', column, event)"
      @selection-change="(selection) => emitEventHandler('selection-change', selection)"
      @row-click="(row, column, event) => emitEventHandler('row-click', row, column, event)"
    >
      <slot name="prepend" />
      <template v-for="(column, columnIndex) in columns">
        <el-table-column
          v-if="column.type === undefined && column.visible"
          :key="columnIndex"
          :prop="column.prop"
          :label="column.label"
          :width="column.minWidth ? '-' : (column.width || 140)"
          :min-width="column.minWidth || column.width || 140"
          :render-header="column.renderHeader"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :align="column.align"
          :sortable="column.sortable"
          :header-align="column.headerAlign || column.align"
        >
          <template
            slot-scope="scope"
          >
            <span v-if="column.filter">
              {{ Vue.filter(column.filter)(scope.row[column.prop]) }}
            </span>
            <span v-else-if="column.slotName">
              <slot
                :name="column.slotName"
                :row="scope.row"
                :$index="scope.$index"
              />
            </span>
            <span v-else-if="column.render">
              {{ column.render(scope.row) }}
            </span>
            <span v-else>
              {{ getProp(column.prop, scope.row) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="column.type"
          :key="columnIndex"
          v-bind="column"
        />
      </template>

      <slot name="append" />
    </el-table>
    <!-- <el-table
      :data="data"
      border
      >
      <template v-for="(column, columnIndex) in columns">
        <el-table-column
          v-if="column.type === undefined && column.visible"
          :key="columnIndex"
          :prop="column.prop"
          :label="column.label"
          :width="column.minWidth ? '-' : (column.width || 140)"
          :min-width="column.minWidth || column.width || 140"
          :render-header="column.renderHeader"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :align="column.align"
          :header-align="column.headerAlign || column.align"
        >
          <template
            slot-scope="scope"
          >
            <span v-if="column.filter">
              {{ Vue.filter(column.filter)(scope.row[column.prop]) }}
            </span>
            <span v-else-if="column.slotName">
              <slot
                :name="column.slotName"
                :row="scope.row"
                :$index="scope.$index"
              />
            </span>
            <span v-else-if="column.render">
              {{ column.render(scope.row) }}
            </span>
            <span v-else>
              {{ getProp(column.prop, scope.row) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="column.type"
          :key="columnIndex"
          v-bind="column"
        />
      </template>
    </el-table> -->
    <!-- <div
      class="module-summary"
      :class="{'hidden':hiddenSummary}"
    >
      <p
        v-if="columns[0].type"
        class="module-summary-item"
        :style="{'width': `${columns[0].width}px`}"
      />
      <p
        v-for="(item, index) in summaryColumn"
        :key="index"
        class="module-summary-item"
        :style="{'width': item.minWidth, 'text-align': item.align}"
      >
        <span v-if="index">{{ summary[item.prop] }}</span>
        <span
          v-else
          class="link-type"
        >刷新总计</span>
      </p>
    </div> -->
    <div
      :class="{'hidden':hiddenPagination}"
      class="module-pagination"
    >
      <el-pagination
        :background="background"
        :current-page.sync="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="limit"
        :layout="layout"
        :total="total"
        v-bind="$attrs"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import props from './props';

export default {
    name: 'TablePage',
    props,
    data () {
        return {
            Vue
        };
    },
    computed: {
        currentPage: {
            get () {
                return this.page;
            },
            set (val) {
                this.$emit('update:page', val);
            }
        },
        limit: {
            get () {
                return this.offset;
            },
            set (val) {
                this.$emit('update:offset', val);
            }
        },
        summaryColumn: function() {
          return this.columns[0].type ? this.columns.filter(item=> !item.type && item.visible) : this.columns;
        }
    },
    beforeUpdate() {
      // 增删column时 跳动闪动问题
      this.$nextTick(()=>{ this.$refs.table.doLayout(); });
    },
    methods: {
        // 解析参数
        getProp(prop, row) {
          try {
            const propArray = prop.split('.');
            let value;
            if (propArray.length > 1) {
              value = row[propArray[0]][propArray[1]];
            } else {
              value = row[propArray[0]];
            }
            return value || value === 0 ? value : '-';
          } catch (error) {
            return '-';
          }
          
        },
        getSummaries(param) {
          const { columns } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (this.summary[column.property]) {
              sums[index] = this.summary[column.property].toFixed(2);
            } else {
              sums[index] = '';
            }
          });
          return sums;
        },
        // 分页
        handleCurrentChange (val) {
            this.$emit('pagination', { page: val });
        },
        // 每页条数
        handleSizeChange (val) {
            this.$emit('pagination', { offset: val });
        },
        // 全选
        toggleSelection (checkedAll) {
            if (checkedAll) {
                this.$refs.table.toggleAllSelection();
            } else {
                this.$refs.table.clearSelection();
            }
        },
        // 表格事件
        emitEventHandler (event, ...args) {
            this.$emit(event, ...args);
        }
    }
};
</script>
