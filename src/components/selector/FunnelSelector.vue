<template>
  <div style="position:relative;">
    <el-select
      v-model="result"
      @change="handleChange"
      filterable
      class="handle-select"
      :class="{ pd30: needdot }"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      v-loading="loading"
    >
      <el-option
        v-for="item in dataList"
        :key="item.id"
        :value="item.id"
        :label="item.name"
      ></el-option>
    </el-select>
    <i class="dot" v-if="needdot" :style="{ background: dotColor }"></i>
  </div>
</template>

<script>
import * as funnelsApi from '@/api/funnels.js'
import Util from '@/utils'
export default {
  name: 'funnelSelector',
  props: {
    placeholder: {
      type: String,
      default: 'Please select a funnel'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Number,
      default: null
    },
    needdot: {
      type: Boolean,
      default: false
    },
    dotColor: {
      type: String,
      default: '#4484CF'
    }
  },
  data() {
    return {
      dataList: [],
      loading: false,
      result: this.defaultValue,
      totalCount: 0
    }
  },
  created() {
    this.getDataList()
  },
  watch: {
    defaultValue(newVal, oldVal) {
      if (newVal === oldVal) return
      this.$nextTick(() => {
        if (newVal !== null) {
          this.result = newVal
        }
      })
    }
  },
  methods: {
    getDataList() {
      this.loading = true
      funnelsApi
        .list()
        .then(data => {
          this.dataList = data.concat().filter(item => {
            return item.status === 1
          })
          this.totalCount = this.dataList.length
          if (this.dataList.length === 0) {
            this.result = this.$t('common.noResult')
            this.$emit('getResult', null)
          } else {
            if (
              this.result == -1 ||
              this.result == this.$t('common.noResult')
            ) {
              this.result = this.dataList[0].id //默认选中第一个。
              this.$emit('getResult', this.dataList[0])
            } else {
              this.handleChange(this.result)
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleChange(val) {
      let result = this.dataList.find(item => item.id == val)
      this.$emit('getResult', result)
    }
  }
}
</script>

<style scoped lang="scss">
.handle-select {
  width: 189px;
}

.handle-input {
  width: 200px;
  display: inline-block;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  display: inline-block;
  position: absolute;
  left: 10px;
  top: 12px;
}
.pd30 {
  ::v-deep .el-input__inner {
    padding-left: 30px;
  }
}
</style>
