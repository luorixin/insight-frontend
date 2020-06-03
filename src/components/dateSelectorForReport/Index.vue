<template>
  <div class="data-selector-con">
    <label v-show="!needSelf">{{ currentTitle }}</label>
    <label v-show="needSelf">{{ dateRangeTitle }}</label>
    <div v-show="!needSelf">
      <el-radio-group v-model="initDate" size="mini">
        <el-radio-button
          v-for="item in rangeArr"
          :label="item.id"
          :key="'dateRange_' + item.id"
        >
          {{ item.name }}
        </el-radio-button>
      </el-radio-group>
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
  </div>
</template>

<script>
import Util from '@/utils'
import moment from 'moment'
import pickerOptionReport from '@/mixins/pickerOptionReport'
export default {
  name: 'dateSelectorForReport',
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
    needVs: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      title: '',
      titleMap: {},
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
      return (
        current.titleCur.join('~') +
        ' ' +
        this.$t('common.vs') +
        ' ' +
        current.titlePrev.join('~') +
        ' (' +
        this.$t('common.prev') +
        ')'
      )
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
      this.dateRangeTitle =
        dateTitleCur.join('~') +
        ' ' +
        this.$t('common.vs') +
        ' ' +
        dateTitlePrev.join('~') +
        ' (' +
        this.$t('common.prev') +
        ')'
    },
    justifyDate(val) {
      let diff = Util.sumTotalDays(val)
      if (diff > 100) {
        this.formInline.dateRangeArr = Util.getLastXDays(100)
        this.$message.error(this.$t('common.dateRangeBaiduErr'))
      }
    }
  }
}
</script>

<style scoped lang="scss">
.data-selector-con {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
</style>
