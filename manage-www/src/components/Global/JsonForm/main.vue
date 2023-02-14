<template>
  <el-form
    ref="dataForm"
    :model="form"
    label-position="right"
    :label-width="labelWidth"
  >
    <el-row :gutter="20">
      <el-col
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        :md="24"
        :lg="column.span"
      >
        <el-form-item
          v-if="column.type === undefined"
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <slot
            :name="column.slotName"
            :formData="form"
            :item="column"
          />
        </el-form-item>
        <el-form-item
          v-else-if="column.type==='radio'"
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <el-radio-group
            v-model="form[column.prop]"
            class="ml20"
            :disabled="column.disabled"
          >
            <el-radio
              v-for="radio in column.options"
              :key="`${radio.label}-${radio.value}`"
              :label="radio.value"
            >
              {{ radio.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-else-if="column.type==='number'"
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <el-input-number
            v-model="form[column.prop]"
            controls-position="right"
            :disabled="column.disabled"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item
          v-else-if="column.type==='switch'"
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <el-switch
            v-model="form[column.prop]"
            class="ml20"
            :active-value="column.values[0]"
            :inactive-value="column.values[1]"
            active-text="开启"
            inactive-text="关闭"
            :disabled="column.disabled"
          />
        </el-form-item>
        <el-form-item
          v-else-if="column.type==='select'"
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <el-select
            v-model="form[column.prop]"
            :placeholder="column.placeholder"
            clearable
            style="width: 100%;"
            :readonly="column.readonly"
            :disabled="column.disabled"
          >
            <el-option
              v-for="select in column.options"
              :key="select.value"
              :label="select.label"
              :value="select.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-else-if="column.type==='cascade'"
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <el-cascader
            v-model="form[column.prop]"
            :placeholder="column.placeholder"
            :options="column.options"
            :props="{ emitPath: false }"
            :show-all-levels="false"
            clearable
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item
          v-else-if="column.type==='date'"
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <el-date-picker
            v-model="form[column.prop]"
            type="date"
            clearable
            :placeholder="column.placeholder"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
            :readonly="column.readonly"
            :disabled="column.disabled"
          />
        </el-form-item>
        <el-form-item
          v-else-if="column.type==='daterange'"
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <el-date-picker
            v-model="form[column.prop]"
            type="daterange"
            clearable
            :placeholder="column.placeholder"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
            :readonly="column.readonly"
            :disabled="column.disabled"
          />
        </el-form-item>
        <el-form-item
          v-else-if="column.type==='datetime'"
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <el-date-picker
            v-model="form[column.prop]"
            type="datetime"
            clearable
            :placeholder="column.placeholder"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            :readonly="column.readonly"
            :disabled="column.disabled"
          />
        </el-form-item>
        <el-form-item
          v-else-if="column.type==='textarea'"
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <el-input
            v-model.trim="form[column.prop]"
            type="textarea"
            :rows="6"
            :placeholder="column.placeholder"
            :readonly="column.readonly"
            :disabled="column.disabled"
          />
        </el-form-item>
        <slot
          v-else-if="column.type === 'handle'"
          :name="column.slotName"
          :formData="form"
          :item="column"
        />
        <el-form-item
          v-else
          :label="column.label"
          :prop="column.prop"
          :rules="column.rules"
        >
          <el-input
            v-model.trim="form[column.prop]"
            auto-complete="off"
            :placeholder="column.placeholder"
            clearable
            :type="column.attr"
            :readonly="column.readonly"
            :disabled="column.disabled"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'JsonForm',
  props: {
    form: {
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
    },
    labelWidth: {
      type: String,
      default () {
        return '110px';
      }
    }
  },
  methods: {
    // 单个字段校验
    fileValidate(prop) {
      this.$refs['dataForm'].validateField(prop);
    },
    // 表单重置
    resetValidate () {
      this.$refs['dataForm'].resetFields();
    },
    // 清除校验结果
    clearValidate() {
      this.$refs['dataForm'].clearValidate();
    },
    // 提交校验
    validate(fn) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          fn();
        } else {
          return false;
        }
      });
    }
  }
};
</script>
