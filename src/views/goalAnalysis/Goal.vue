<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('goalAnalysis.title') }}</h1>
        </div>
      </div>
    </div>
    <div class="report-opt">
      <el-button
        icon="fa fa-download"
        @click="handleDownload"
        v-hasPermission="'analysisgoal.download'"
        :disabled="isDownload || loading"
        >{{ $t('common.export') }}</el-button
      >
    </div>
    <el-tabs
      v-model="activeName"
      type="card"
      class="report-pane"
      @tab-click="changeTab"
    >
      <el-tab-pane name="goal">
        <div slot="label">{{ $t('goalAnalysis.title') }}</div>
        <div id="goal">
          <div style="position:relative;">
            <date-selector-for-report
              :needVs="false"
              :needCustom="false"
              reportTitle="GoalAnalysis"
              reportType="goal"
              @change="changeGoalDate"
            ></date-selector-for-report>
            <hr class="reporthr" />
            <div class="page-form">
              <div class="page-form__item">
                <label>{{ $t('goalAnalysis.goal') }}</label>
                <goal-selector
                  @getResult="getGoalId"
                  :defaultValue="formInline.goalId"
                  style="width: 200px;margin-left: 15px;"
                >
                </goal-selector>
              </div>
            </div>

            <div class="plan-reports-con mr20">
              <!-- goal source-->
              <div class="plan-reports-result mr15">
                <div
                  class="plan-reports-result-inner"
                  v-loading="goalSourceLoading"
                  style="height: 350px;"
                >
                  <div class="plan-reports-result-inner_title">
                    {{ $t('goalAnalysis.source') }}
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content" class="tooltip-content">
                        {{ $t('goalAnalysis.sourceTip') }}
                      </div>
                      <span class="fa fa-question-circle-o"></span>
                    </el-tooltip>
                  </div>
                  <div
                    class="report-result-inner__graph"
                    style="height: 335px;"
                  >
                    <div
                      class="multi-pie-con"
                      v-show="goalSource && goalSource.length > 0"
                    >
                      <div
                        class="multi-pie"
                        v-for="(item, index) in goalSource"
                        :key="'source_' + index"
                      >
                        <pie-chart :datas="item"></pie-chart>
                      </div>
                    </div>
                  </div>
                  <noresult-report
                    v-show="!goalSource || goalSource.length === 0"
                  ></noresult-report>
                </div>
              </div>
              <!-- goal trend -->
              <div class="plan-reports-result mr15">
                <div
                  class="plan-reports-result-inner"
                  v-loading="goalTrendLoading"
                  style="height: 460px;"
                >
                  <div class="plan-reports-result-inner_title">
                    {{ $t('goalAnalysis.trend') }}
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content" class="tooltip-content">
                        {{ $t('goalAnalysis.trendTip') }}
                      </div>
                      <span class="fa fa-question-circle-o"></span>
                    </el-tooltip>
                  </div>
                  <div class="plan-reports-result-inner__opt">
                    <el-radio-group
                      v-model="goalTrendForm.type"
                      @change="changeGoalTrendType"
                      size="small"
                    >
                      <el-radio-button label="channel">
                        {{ $t('goalAnalysis.channel') }}
                      </el-radio-button>
                      <el-radio-button label="media">
                        {{ $t('goalAnalysis.media') }}
                      </el-radio-button>
                      <el-radio-button label="campaign">
                        {{ $t('goalAnalysis.campaign') }}
                      </el-radio-button>
                    </el-radio-group>
                  </div>
                  <div
                    class="report-result-inner__graph"
                    style="height: 330px;"
                  >
                    <div id="goal_trend_map">
                      <noresult-report
                        v-show="!goalTrend || goalTrend.length === 0"
                      ></noresult-report>
                      <line-trend-chart
                        v-show="goalTrend && goalTrend.length > 0"
                        :datas="goalTrend"
                        tipTitle="cnt"
                      ></line-trend-chart>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div id="export">
      <!-- 为生成导出做的准备 -->
      <!-- Title 标题信息-->
      <div class="hide" style="position:absolute;z-index:0;opacity:0">
        <div class="clearfix h30"></div>
        <div id="title_pdf">
          <my-header :isExport="true"></my-header>
        </div>
      </div>
      <!-- report报表信息-->
      <div class="hide" style="position:absolute;z-index:0;opacity:0;">
        <div class="clearfix h30"></div>
        <div id="reports_pdf"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DateSelectorForReport from '@/components/dateSelectorForReport/Index.vue'
import GoalSelector from '@/components/selector/GoalSelector'
import NoresultReport from '@/components/report/Noresult.vue'
import LineTrendChart from '@/components/charts/LineTrendChart'
import PieChart from '@/components/charts/PieChart'
import MyHeader from '@/components/common/Header'
import Util from '@/utils'
import exportUtil from '@/utils/exportUtil'
import * as analysisGoalApi from '@/api/analysisGoal'
import { ENUM_DATE, convertType } from '@/utils/constant'
export default {
  name: 'GoalAnalysis',
  components: {
    DateSelectorForReport,
    GoalSelector,
    NoresultReport,
    LineTrendChart,
    PieChart,
    MyHeader
  },
  data() {
    return {
      isDownload: false,
      activeName: 'goal',
      currentName: 'goal',
      goalTrendLoading: false,
      goalSourceLoading: false,
      goalTrendForm: {
        type: 'channel'
      },
      formInline: {
        beginDate: null,
        endDate: null,
        dateType: null,
        goalId: -1
      },
      goalId: -1,
      goalSource: [],
      goalSourceColor: [],
      goalTrend: [],
      goalTrendColor: []
    }
  },
  computed: {
    loading() {
      return this.goalTrendLoading && this.goalSourceLoading
    }
  },
  created() {
    this.makeDebounce()
  },
  methods: {
    makeDebounce() {
      this.debounceSearch = Util.debounce(this.getDataList, 250)
    },
    getDataList() {
      if (this.formInline.goalId === -1) return
      this.getGoalSource()
      this.getGoalTrend()
    },
    getGoalSource() {
      this.goalSourceLoading = true
      analysisGoalApi
        .source(this.formInline)
        .then(source => {
          this.goalSource = []
          if (Object.keys(source).length > 0) {
            for (let key in source) {
              if (source[key].length > 0) {
                let data = source[key].map(i => {
                  return {
                    value: i.cnt,
                    name: i.media,
                    percent: i.rate * 100
                  }
                })
                data = data.sort(Util.sortJson('desc', 'name', 'parseFloat'))
                this.goalSource.push({
                  title: key,
                  data: data
                })
              }
            }
          }
        })
        .finally(() => {
          this.goalSourceLoading = false
        })
    },
    getGoalTrend() {
      this.goalTrendLoading = true
      let form = Object.assign({}, this.formInline, this.goalTrendForm)
      analysisGoalApi
        .trend(form)
        .then(goalTrend => {
          // 获取日期区间
          this.goalTrend = []
          if (Object.keys(goalTrend).length > 0) {
            let dateRange = Util.getRangeByDate(form.beginDate, form.endDate)
            for (let trend in goalTrend) {
              this.goalTrend.push({
                name: trend,
                data: this.getLineChartDate(dateRange, goalTrend[trend], 'cnt')
              })
            }
          }
        })
        .finally(() => {
          this.goalTrendLoading = false
        })
    },
    getLineChartDate(dateRange, list, type) {
      return dateRange.map(item => {
        let value = 0
        let find = this._findListValue(list, 'date', item, '20')
        if (find) {
          value = find[type] ? find[type] : 0
        } else {
          find = {}
        }
        return Object.assign(
          {
            date: item,
            value: value
          },
          find
        )
      })
    },
    _findListValue(list, key, value, special = '') {
      if (!list || list.length === 0) return null
      let find = list.find(item => special + item[key] === value)
      return find
    },
    getGoalId(result) {
      this.formInline.goalId = result ? result.id : -1
      this.debounceSearch()
    },
    changeTab(tab) {
      if (this.currentName !== tab.name) {
        this.currentName = tab.name
      }
    },
    changeGoalDate(result) {
      if (result && result.titleCur && result.titlePrev) {
        this.formInline.beginDate = result.titleCur[0]
        this.formInline.endDate = result.titleCur[1] || result.titleCur[0]
        this.formInline.dateType = convertType(result.id, ENUM_DATE).label
        this.debounceSearch()
      }
    },
    changeGoalTrendType(result) {
      this.goalTrendForm.type = result
      this.getGoalTrend()
    },
    handleDownload() {
      this.isDownload = true
      let current = Util.formateDate(new Date(), 'yyyyMMddhhmm')

      exportUtil.initDom(this.activeName)

      exportUtil.fixCanvas(this.activeName)

      this.getPdf('#reports_pdf', `GoalAnalysis_${current}`, () => {
        this.isDownload = false
        document.getElementById('reports_pdf').parentNode.style.display = 'none'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-form {
  position: absolute;
  display: flex;
  left: 140px;
  top: -3px;
  .page-form__item {
    margin-left: 10px;
    & > label {
      margin-right: 10px;
    }
  }
}
.multi-pie-con {
  display: flex;
  justify-content: space-between;
  width: 1000px;
  margin: auto;
  .multi-pie {
    width: 250px;
    height: 250px;
  }
}
</style>
