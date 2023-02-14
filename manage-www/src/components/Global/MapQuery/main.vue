<template>
  <div
    class="module-query-wrap"
    :style="{height: height, 'max-height': maxHeight}"
  >
    <p
      v-show="show"
      @click="handleFold"
    >
      <i
        class="el-icon-arrow-down fold-icon"
        :class="{active: flag}"
      />
    </p>
    <div
      ref="queryleft"
      class="module-query-left"
    >
      <template v-for="(column, columnIndex) in columns">
        <CheckBtn
          v-if="column.type === 'check'"
          :key="columnIndex"
          :name="column.label"
          :flag="column.flag"
          :value.sync="query[column.prop]"
        />
        <DateQuery
          v-else-if="column.type === 'date'"
          :key="columnIndex"
          :name="column.label"
          :date-type.sync="column.dateType"
          :begin-time.sync="query[column.prop[0]]"
          :end-time.sync="query[column.prop[1]]"
        />
        <div
          v-else-if="column.type === 'input'"
          :key="columnIndex"
          class="query-item"
        >
          <span class="label">{{ column.label }}</span>
          <el-input
            v-model.trim="query[column.prop]"
            auto-complete="off"
            :placeholder="column.placeholder"
            :readonly="column.readonly"
            :disabled="column.disabled"
          />
        </div>
        <div
          v-else-if="column.type === 'rangeInput'"
          :key="columnIndex"
          class="query-item"
        >
          <span class="label">{{ column.label }}</span>
          <el-input
            v-model.trim="query[column.prop[0]]"
            auto-complete="off"
          />
          <span class="p10">-</span>
          <el-input
            v-model.trim="query[column.prop[1]]"
            auto-complete="off"
          />
        </div>
        <div
          v-else-if="column.type === 'select'"
          :key="columnIndex"
          class="query-item"
        >
          <span class="label">{{ column.label }}</span>
          <el-select
            v-model="query[column.prop]"
            placeholder="请选择"
          >
            <el-option
              v-if="!column.noAll"
              :label="column.allName || '全部'"
              value=""
            />
            <el-option
              v-for="item in column.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div
          v-else
          :key="columnIndex"
          class="query-item"
        >
          <span class="label">{{ column.label }}</span>
          <el-select
            v-model="query[column.prop]"
            placeholder="请选择"
          >
            <el-option
              v-if="!column.noAll"
              :label="column.allName || '全部'"
              value=""
            />
            <el-option-group
              v-for="group in column.options"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import resize from './mixins/resize';
export default {
  name: 'MapQuery',
  mixins: [resize],
  props: {
    query: {
      type: Object,
      required: true,
      default () {
        return {};
      }
    },
    columns: {
      type: Array,
      required: true,
      default () {
        return [];
      }
    }
  },
  data() {
    return {
      show: false,
      flag: false,
      height: '50px',
      maxHeight: '60px'
    };
  },
  methods: {
    handleFold() {
      this.height = this.flag ? '50px' : 'auto';
      this.maxHeight = this.flag ? '60px' : '150px';
      this.flag = !this.flag;
    }
  }
};
</script>
