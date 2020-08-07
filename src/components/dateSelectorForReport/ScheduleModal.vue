<template>
  <div>
    <div class="slide-close" @click="closeModal">
      <i class="fa fa-close"></i>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="title" name="basic">
        <div class="slide-content" v-loading="loading">
          <el-form
            :model="ruleForm"
            ref="ruleForm"
            :rules="rules"
            label-width="200px"
            label-position="left"
            class="ruleForm"
          >
            <el-form-item
              :label="$t('scheduleReport.period')"
              prop="dateRangeArr"
            >
              <el-date-picker
                v-model="ruleForm.dateRangeArr"
                type="daterange"
                @change="changeDate"
                :picker-options="pickerOptions"
                range-separator=" ~ "
                :start-placeholder="$t('common.start')"
                :end-placeholder="$t('common.end')"
                value-format="yyyy-MM-dd"
                align="right"
              >
              </el-date-picker>
              <p style="font-size:12px;">
                {{ $t('common.total') }}: {{ diff }} {{ $t('common.days') }}
              </p>
            </el-form-item>
            <hr style="margin:0 -20px 20px -20px" />
            <el-form-item :label="$t('scheduleReport.emailNotify')">
              <el-input type="textarea" :rows="5" v-model="ruleForm.emails">
              </el-input>
            </el-form-item>
            <hr style="margin:0 -20px 20px -20px" />
            <el-form-item :label="$t('scheduleReport.reportName')">
              <el-input :disabled="true" v-model="ruleForm.name"> </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="slide-bottom">
      <el-button type="primary" @click="handleSave">{{
        $t('common.save')
      }}</el-button>
      <el-button type="cancel" @click="closeModal">{{
        $t('common.cancel')
      }}</el-button>
    </div>
  </div>
</template>

<script>
import * as goalsApi from '@/api/goals'
import Util from '@/utils'
import pickerOption from '@/mixins/pickerOption'
export default {
  name: 'scheduleModal',
  mixins: [pickerOption],
  props: {
    title: {
      type: String,
      default: 'Schedule Report'
    },
    reportTitle: {
      type: String,
      default: 'ChannelAnalysis'
    },
    id: {
      type: Number,
      default: null
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    id: {
      handler(newName, oldName) {
        this.goalId = newName
      },
      immediate: true
    },
    visible: {
      handler(newName, oldName) {
        this.activeName = 'basic'
        newName && this.getDataList()
      },
      immediate: true
    }
  },
  data() {
    return {
      activeName: 'basic',
      ruleForm: {
        name: null,
        emails: null,
        dateRangeArr: []
      },
      baseData: {
        name: null,
        emails: null,
        dateRange: null,
        dateRangeArr: null
      },
      diff: 0,
      rules: {
        dateRangeArr: [
          {
            required: true,
            message: this.$t('common.selPeriod'),
            trigger: 'change'
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    getDataList() {
      // this.loading = true
      // if (this.goalId) {
      //   goalsApi
      //     .update(this.goalId)
      //     .then(data => {
      //       this.events = data.eventList.concat()
      //       this.ruleForm = Object.assign({}, data.data)
      //       this.ruleForm.eventId += ''
      //       this.ruleForm.status += ''
      //     })
      //     .finally(() => {
      //       this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      //       this.loading = false
      //     })
      // } else {
      //   goalsApi
      //     .create()
      //     .then(data => {
      //       this.events = data.concat()
      //       this.ruleForm = Object.assign({}, this.baseData)
      //     })
      //     .finally(() => {
      //       this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      //       this.loading = false
      //     })
      // }
    },
    closeModal() {
      this.$emit('getResult', false)
    },
    changeDate(val) {
      this.diff = Util.sumTotalDays(val)
      let current = Util.formateDate(new Date(), 'yyyyMMddhhmm')
      let period = val.map(item => item.replace(/-/g, '')).join('-')
      this.ruleForm.name = [current, this.reportTitle, period].join('_')
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid, model) => {
        if (valid) {
          // this.loading = true
          // let promise = null
          // if (this.goalId) {
          //   promise = goalsApi.doUpdate(this.ruleForm)
          // } else {
          //   promise = goalsApi.doCreate(this.ruleForm)
          // }
          // promise
          //   .then(data => {
          //     this.$emit('getResult', true)
          //     this.$message.success(this.$t('common.optSuccess'))
          //   })
          //   .finally(() => {
          //     this.loading = false
          //   })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.time-con {
  display: flex;
  font-size: 12px;
  margin-top: -10px;
  .time-con__detail ~ .time-con__detail {
    margin-left: 10px;
  }
  .handleSelect {
    width: 120px;
    input {
      width: 120px;
    }
  }
}
</style>
