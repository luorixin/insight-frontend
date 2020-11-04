<template>
  <el-select
    v-model="result"
    @change="handleChange"
    filterable
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
</template>

<script>
import * as mediasApi from '@/api/analysisMedia.js'
import Util from '@/utils'
export default {
  name: 'mediaSelector',
  props: {
    placeholder: {
      type: String,
      default: 'Please select a media'
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
      mediasApi
        .list()
        .then(data => {
          this.dataList = data.map(item => {
            return { id: item, name: item }
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

<style scoped>
.handle-select {
  width: 120px;
}

.handle-input {
  width: 200px;
  display: inline-block;
}
</style>
