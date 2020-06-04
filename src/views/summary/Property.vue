<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('property.title') }}</h1>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" type="card" class="report-pane">
      <el-tab-pane name="summary">
        <div slot="label">{{ $t('property.title') }}</div>
        <div>
          <date-selector-for-report></date-selector-for-report>
          <hr class="reporthr" />
          <!-- performance snapshot -->
          <div class="plan-reports-con">
            <p class="plan-reports-title">
              {{ $t('property.performanceSnap') }}
            </p>
            <goal-selector @getResult="getGoalId" :defaultValue="goalId">
            </goal-selector>
            <div class="plan-reports-result mr20">
              <!-- unique conversion -->
              <div class="plan-reports-result-inner">
                <div
                  class="plan-reports-result-inner_title"
                  style="height: 42px;"
                >
                  {{ $t('property.uniqueConv') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('property.uniqueConvTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <p class="plan-reports-result-inner_text">123</p>
                <p class="plan-reports-result-inner_textsub">
                  {{ $t('property.outOfConv') }}: 23123
                </p>
                <div class="report-flex-row mr20">
                  <label> {{ $t('common.vs') }} 1372 </label>
                  <div class="plan-growth">
                    <i class="fa fa-caret-up"></i>
                    <span>1.18</span>
                  </div>
                </div>
                <div class="report-flex-row">
                  <label> {{ $t('property.outOfConv') }}: 1372 </label>
                  <div class="plan-growth">
                    <i class="fa fa-caret-up"></i>
                    <span>1.18</span>
                  </div>
                </div>
              </div>
              <!-- unique customers -->
              <div class="plan-reports-result-inner">
                <div
                  class="plan-reports-result-inner_title"
                  style="height: 42px;"
                >
                  {{ $t('property.uniqueCustomers') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('property.uniqueCustomersTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <p class="plan-reports-result-inner_text">3123</p>
                <div class="report-flex-column mr10">
                  <div class="plan-growth">
                    <i class="fa fa-caret-up"></i>
                    <span>1.18</span>
                  </div>
                  <label> {{ $t('common.vs') }} 1372 </label>
                </div>
              </div>
              <!-- last mile ratio -->
              <div class="plan-reports-result-inner">
                <div
                  class="plan-reports-result-inner_title"
                  style="height: 42px;"
                >
                  {{ $t('property.lastMileRatio') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('property.lastMileRatio') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                  <div class="plan-reports-result-inner__subtitle">
                    {{ $t('property.search') }} {{ $t('common.vs') }}
                    {{ $t('property.nonSearch') }}
                  </div>
                </div>
                <p class="plan-reports-result-inner_text">0.40 : 1</p>
                <div class="report-flex-column mr10">
                  <label> {{ $t('common.vs') }} 1372 : 0.9 </label>
                </div>
              </div>
              <!-- Time-to-Convert -->
              <div class="plan-reports-result-inner">
                <div
                  class="plan-reports-result-inner_title"
                  style="height: 42px;"
                >
                  {{ $t('property.timeToConvert') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('property.timeToConvertTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <div class="report-convert mr-10">
                  <div class="report-convert-inner">
                    <label>{{ $t('property.fullPath') }}</label>
                    <div class="report-convert-inner__detail">
                      <label>3.02 {{ $t('common.days') }}</label>
                      <div class="report-flex-row">
                        <label>
                          {{ $t('common.vs') }} 1372
                          {{ $t('common.days') }}</label
                        >
                        <div class="plan-growth">
                          <i class="fa fa-caret-up"></i>
                          <span>1.18 {{ $t('common.days') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="report-convert-inner mr10">
                    <label>{{ $t('property.lastMile') }}</label>
                    <div class="report-convert-inner__detail">
                      <label>3.02 {{ $t('common.days') }}</label>
                      <div class="report-flex-row">
                        <label>
                          {{ $t('common.vs') }} 1372
                          {{ $t('common.days') }}</label
                        >
                        <div class="plan-growth">
                          <i class="fa fa-caret-up"></i>
                          <span>1.18 {{ $t('common.days') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr class="reporthr" />
          <!-- traffic snapshot -->
          <div class="plan-reports-con">
            <p class="plan-reports-title">
              {{ $t('property.trafficSnapShot') }}
            </p>
            <div class="plan-reports-result">
              <div
                class="plan-reports-result-inner"
                style="flex:1.6;height: 290px;"
              >
                <!-- unique visits -->
                <div class="plan-reports-result-split__row">
                  <div class="split-row__detail">
                    <div class="plan-reports-result-inner_title">
                      {{ $t('property.uniqueVisit') }}
                      <el-tooltip class="item" effect="light" placement="top">
                        <div slot="content" class="tooltip-content">
                          {{ $t('property.uniqueVisitTip') }}
                        </div>
                        <span class="fa fa-question-circle-o"></span>
                      </el-tooltip>
                    </div>
                    <p class="plan-reports-result-inner_text">3123</p>
                    <div class="report-flex-column mr10">
                      <div class="plan-growth">
                        <i class="fa fa-caret-up"></i>
                        <span>1.18</span>
                      </div>
                      <label> {{ $t('common.vs') }} 1372 </label>
                    </div>
                    <div class="report-result-inner__graph">
                      <div id="unique_visits_map">
                        <line-chart
                          :datas="uniqueVisits"
                          :color="uniqueVisitsColor"
                        ></line-chart>
                      </div>
                    </div>
                  </div>
                  <div class="split-row__line"></div>
                  <!-- unique visitors -->
                  <div class="split-row__detail">
                    <div class="plan-reports-result-inner_title">
                      {{ $t('property.uniqueVisitors') }}
                      <el-tooltip class="item" effect="light" placement="top">
                        <div slot="content" class="tooltip-content">
                          {{ $t('property.uniqueVisitorsTip') }}
                        </div>
                        <span class="fa fa-question-circle-o"></span>
                      </el-tooltip>
                    </div>
                    <p class="plan-reports-result-inner_text">3123</p>
                    <div class="report-flex-column mr10">
                      <div class="plan-growth">
                        <i class="fa fa-caret-up"></i>
                        <span>1.18</span>
                      </div>
                      <label> {{ $t('common.vs') }} 1372 </label>
                    </div>
                    <div class="report-result-inner__graph">
                      <div id="unique_visitors_map">
                        <line-chart
                          :datas="uniqueVisitors"
                          :color="uniqueVisitorsColor"
                        ></line-chart>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="plan-reports-result-split__column">
                <div class="plan-reports-result-inner">
                  <!-- frequency visits -->
                  <div class="plan-reports-result-inner_title">
                    {{ $t('property.frequencyVisit') }}
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content" class="tooltip-content">
                        {{ $t('property.frequencyVisitTip') }}
                      </div>
                      <span class="fa fa-question-circle-o"></span>
                    </el-tooltip>
                  </div>
                  <div class="report-flex-middle mr20">
                    <label class="report-flex-middle__detail">1.16</label>
                    <div class="report-flex-middle__line"></div>
                    <div class="report-flex-middle__detail report-flex-column">
                      <div class="plan-growth">
                        <i class="fa fa-caret-up"></i>
                        <span>1.18</span>
                      </div>
                      <label> {{ $t('common.vs') }} 1372 </label>
                    </div>
                  </div>
                </div>
                <div class="plan-reports-result-inner">
                  <!-- avg page views -->
                  <div class="plan-reports-result-inner_title">
                    {{ $t('property.avgPageView') }}
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content" class="tooltip-content">
                        {{ $t('property.avgPageViewTip') }}
                      </div>
                      <span class="fa fa-question-circle-o"></span>
                    </el-tooltip>
                  </div>
                  <div class="report-flex-middle mr20">
                    <label class="report-flex-middle__detail">11.16</label>
                    <div class="report-flex-middle__line"></div>
                    <div class="report-flex-middle__detail report-flex-column">
                      <div class="plan-growth">
                        <i class="fa fa-caret-up"></i>
                        <span>11.18</span>
                      </div>
                      <label> {{ $t('common.vs') }} 1372 </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="plan-reports-result mr15">
              <div
                class="plan-reports-result-inner"
                style="flex:1.6;height: 290px;"
              >
                <!-- newVisitors visits repeatVisitors -->
                <div class="plan-reports-result-inner_title">
                  {{ $t('property.newVisitors') }} {{ $t('common.vs') }}
                  {{ $t('property.repeatVisitors') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('property.newVisitorsTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <div class="plan-reports-result-split__row split-row-middle">
                  <div class="split-row__detail">
                    <p class="plan-reports-result-inner_text">
                      3123
                    </p>
                    <div class="report-flex-column mr10">
                      <div class="plan-growth">
                        <i class="fa fa-caret-up"></i>
                        <span>1.18</span>
                      </div>
                      <label> {{ $t('common.vs') }} 1372 </label>
                    </div>
                  </div>
                  <div class="split-row__detail split-row__detail-vs">
                    {{ $t('common.vs') }}
                  </div>
                  <!-- repeat visitors -->
                  <div class="split-row__detail">
                    <p
                      class="plan-reports-result-inner_text"
                      style="color:#4484CF;"
                    >
                      60.18
                    </p>
                    <div class="report-flex-column mr10">
                      <div class="plan-growth">
                        <i class="fa fa-caret-up"></i>
                        <span>1.18</span>
                      </div>
                      <label> {{ $t('common.vs') }} 1372 </label>
                    </div>
                  </div>
                </div>
                <div
                  class="report-result-inner__graph"
                  style="margin-top: -15px"
                >
                  <div id="new_repeat_visits_map">
                    <line-chart
                      :datas="newrepeqtVisitors"
                      :color="newrepeqtVisitorsColor"
                    ></line-chart>
                  </div>
                </div>
              </div>
              <div class="plan-reports-result-split__column">
                <div class="plan-reports-result-inner">
                  <!-- frequency visits -->
                  <div class="plan-reports-result-inner_title">
                    {{ $t('property.bounceRate') }}
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content" class="tooltip-content">
                        {{ $t('property.bounceRateTip') }}
                      </div>
                      <span class="fa fa-question-circle-o"></span>
                    </el-tooltip>
                  </div>
                  <div class="report-flex-middle mr20">
                    <label class="report-flex-middle__detail">60.15%</label>
                    <div class="report-flex-middle__line"></div>
                    <div class="report-flex-middle__detail report-flex-column">
                      <div class="plan-growth">
                        <i class="fa fa-caret-up"></i>
                        <span>7.31%</span>
                      </div>
                      <label> {{ $t('common.vs') }} 67.82% </label>
                    </div>
                  </div>
                </div>
                <div class="plan-reports-result-inner">
                  <!-- avg page views -->
                  <div class="plan-reports-result-inner_title">
                    {{ $t('property.avgTimeSpan') }}
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content" class="tooltip-content">
                        {{ $t('property.avgTimeSpanTip') }}
                      </div>
                      <span class="fa fa-question-circle-o"></span>
                    </el-tooltip>
                  </div>
                  <div class="report-flex-middle mr20">
                    <label class="report-flex-middle__detail">00:02:24</label>
                    <div class="report-flex-middle__line"></div>
                    <div class="report-flex-middle__detail report-flex-column">
                      <div class="plan-growth">
                        <i class="fa fa-caret-up"></i>
                        <span>11s</span>
                      </div>
                      <label> {{ $t('common.vs') }} 00:02:56 </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="audience">
        <div slot="label">{{ $t('audience.analysis') }}</div>
        <div>
          <date-selector-for-report :needVs="false"></date-selector-for-report>
          <hr class="reporthr" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DateSelectorForReport from '@/components/dateSelectorForReport/Index.vue'
import GoalSelector from '@/components/selector/GoalSelector'
import LineChart from '@/components/charts/LineChart'
export default {
  name: 'propertySummary',
  components: {
    DateSelectorForReport,
    GoalSelector,
    LineChart
  },
  data() {
    return {
      loading: false,
      activeName: 'summary',
      goalId: -1,
      uniqueVisits: [],
      uniqueVisitsColor: ['#ccc'],
      uniqueVisitors: [],
      uniqueVisitorsColor: ['#ccc'],
      newrepeqtVisitors: [],
      newrepeqtVisitorsColor: ['#ccc', '#4484CF']
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.loading = false
      this.uniqueVisits = [
        [
          { date: '2019-05-05', value: 5049 },
          { date: '2019-05-06', value: 13778 },
          { date: '2019-05-07', value: 8295 },
          { date: '2019-05-08', value: 5345 },
          { date: '2019-05-09', value: 4487 },
          { date: '2019-05-10', value: 5838 },
          { date: '2019-05-11', value: 3928 },
          { date: '2019-05-12', value: 6123 },
          { date: '2019-05-13', value: 9054 },
          { date: '2019-05-14', value: 80103 },
          { date: '2019-05-15', value: 6416 },
          { date: '2019-05-16', value: 9852 },
          { date: '2019-05-17', value: 13021 },
          { date: '2019-05-18', value: 3876 },
          { date: '2019-05-19', value: 3502 },
          { date: '2019-05-20', value: 3820 },
          { date: '2019-05-21', value: 5644 },
          { date: '2019-05-22', value: 4788 },
          { date: '2019-05-23', value: 7635 },
          { date: '2019-05-24', value: 10084 },
          { date: '2019-05-25', value: 5194 },
          { date: '2019-05-26', value: 4938 },
          { date: '2019-05-27', value: 4900 },
          { date: '2019-05-28', value: 5336 },
          { date: '2019-05-29', value: 2800 },
          { date: '2019-05-30', value: 494 },
          { date: '2019-05-31', value: 234 },
          { date: '2019-06-01', value: 215 },
          { date: '2019-06-02', value: 267 },
          { date: '2019-06-03', value: 19188 }
        ]
      ]
      this.uniqueVisitors = this.uniqueVisits
      this.newrepeqtVisitors = [this.uniqueVisits[0], this.uniqueVisitors[0]]
    },
    getGoalId(result) {
      this.formInline.goalId = result ? result.id : -1
    }
  }
}
</script>

<style scoped></style>
