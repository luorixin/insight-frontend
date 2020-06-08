<template>
  <div class="data-selector-con">
    <label v-show="!needSelf">{{ currentTitle }}</label>
    <label v-show="needSelf">{{ dateRangeTitle }}</label>
    <div v-show="!needSelf">
      <el-radio-group
        v-model="initDate"
        size="mini"
        :class="{ hasCustomise: needCustom }"
      >
        <el-radio-button
          v-for="item in rangeArr"
          :label="item.id"
          :key="'dateRange_' + item.id"
        >
          {{ item.name }}
        </el-radio-button>
      </el-radio-group>
      <div v-if="needCustom" class="customise" @click="showCustomise">
        <span>{{ $t('common.customise') }}</span>
      </div>
    </div>
    <div v-show="needSelf">
      <el-date-picker
        v-model="dateRangeArr"
        type="daterange"
        @change="changeDate"
        :picker-options="pickerOptions"
        range-separator=" ~ "
        :start-placeholder="$t('common.start')"
        :end-placeholder="$t('common.end')"
        :clearable="false"
        value-format="yyyy-MM-dd"
        align="right"
      >
      </el-date-picker>
    </div>
    <el-dialog
      :visible.sync="modal"
      custom-class="slide-box"
      @open="addBodyClass"
      @closed="clearBodyClass"
      :show-close="false"
      top="0"
    >
      <schedule-modal
        @getResult="handleSet"
        :title="optTitle"
        :reportTitle="reportTitle"
        :visible="modal"
      >
      </schedule-modal>
    </el-dialog>
  </div>
</template>

<script>
import Util from '@/utils'
import moment from 'moment'
import pickerOptionReport from '@/mixins/pickerOptionReport'
import ScheduleModal from './ScheduleModal'
export default {
  name: 'dateSelectorForReport',
  components: {
    ScheduleModal
  },
  mixins: [pickerOptionReport],
  props: {
    dataRanges: {
      type: Array,
      default: () => [-1, 7, 30, '1week', '1month']
    },
    initChoose: {
      type: [String, Number],
      default: 7
    },
    needSelf: {
      type: Boolean,
      default: false
    },
    needCustom: {
      type: Boolean,
      default: true
    },
    needVs: {
      type: Boolean,
      default: true
    },
    reportTitle: {
      type: String,
      default: 'SummaryAnalysis'
    }
  },
  data() {
    return {
      title: '',
      titleMap: {},
      optTitle: '',
      modal: false,
      loading: false,
      initDate: this.initChoose,
      rangeArr: [],
      result: [],
      dateRangeArr: [],
      dateRangeTitle: ''
    }
  },
  created() {
    this.init()
  },
  computed: {
    currentTitle() {
      let current = this.rangeArr.find(item => item.id === this.initDate)
      let prev = this.needVs
        ? ' ' +
          this.$t('common.vs') +
          ' ' +
          current.titlePrev.join('~') +
          ' (' +
          this.$t('common.prev') +
          ')'
        : ''
      return current.titleCur.join('~') + prev
    }
  },
  methods: {
    init() {
      this.titleMap = {
        '-1': this.$t('dateRange.yesterday'),
        '7': this.$t('dateRange.last7days'),
        '30': this.$t('dateRange.last30days'),
        '1week': this.$t('dateRange.lastweek'),
        '1month': this.$t('dateRange.lastmonth')
      }
      this.dataRanges.forEach(item => {
        if (item === -1) {
          let dateTitle = Util.getLastXDays(2)
          this.rangeArr.push({
            titleCur: [dateTitle[1]],
            titlePrev: [dateTitle[0]],
            name: this.titleMap[item],
            id: item
          })
        } else {
          let dateTitleCur, dateTitlePrev
          if (item > 0) {
            dateTitleCur = Util.getLastXDays(item)
            dateTitlePrev = Util.getLastXDays(item, 'yyyy-MM-dd', item + 1)
          } else {
            if (item.indexOf('month') > -1) {
              dateTitleCur = Util.getLastXMonths(parseInt(item))
              dateTitlePrev = Util.getLastXMonths(parseInt(item) + 1)
            }
            if (item.indexOf('week') > -1) {
              dateTitleCur = Util.getLastXWeeks(parseInt(item))
              dateTitlePrev = Util.getLastXWeeks(parseInt(item) + 1)
            }
          }
          if (dateTitleCur) {
            this.rangeArr.push({
              titleCur: dateTitleCur,
              titlePrev: dateTitlePrev,
              id: item,
              name: this.titleMap[item]
            })
          }
        }
      })

      if (this.needSelf) {
        let range = Util.getLastXDays(7)
        this.dateRangeArr = range.concat()
        this.computeDateRangeTitle()
      }
    },
    changeDate(val) {
      this.justifyDate(val)
      this.computeDateRangeTitle()
    },
    computeDateRangeTitle() {
      let dateTitleCur = this.dateRangeArr
      let diff = Util.sumTotalDays(this.dateRangeArr)
      let diff2Cur = Util.sumTotalDays([
        this.dateRangeArr[0],
        Util.formateDate(new Date())
      ])
      let dateTitlePrev = Util.getLastXDays(diff, 'yyyy-MM-dd', diff2Cur)
      let prev = this.needVs
        ? ' ' +
          this.$t('common.vs') +
          ' ' +
          dateTitlePrev.join('~') +
          ' (' +
          this.$t('common.prev') +
          ')'
        : ''
      this.dateRangeTitle = dateTitleCur.join('~') + prev
    },
    justifyDate(val) {
      let diff = Util.sumTotalDays(val)
      if (diff > 100) {
        this.formInline.dateRangeArr = Util.getLastXDays(100)
        this.$message.error(this.$t('common.dateRangeBaiduErr'))
      }
    },
    showCustomise() {
      this.optTitle = this.$t('scheduleReport.create')
      this.modal = true
    },
    handleSet(result) {
      this.modal = false
      if (result) {
        // 跳转
      }
    },
    addBodyClass() {
      document.getElementById('app').className = 'slide-body'
    },
    clearBodyClass() {
      document.getElementById('app').className = ''
    }
  }
}
</script>

<style scoped lang="scss">
.data-selector-con {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  & > label {
    font-weight: bold;
  }
}
.hasCustomise {
  ::v-deep .el-radio-button {
    &:last-child {
      span {
        border-radius: 0 !important;
      }
    }
  }
}
.customise {
  position: relative;
  display: inline-block;
  outline: none;
  span {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    vertical-align: middle;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    font-weight: 500;
    border-left: 0;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    position: relative;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    padding: 7px 15px;
    font-size: 12px !important;
    border-radius: 0 4px 4px 0;
    &:hover {
      color: #ef4136;
    }
  }
}
</style>
