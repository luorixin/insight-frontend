<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('property.title') }}</h1>
        </div>
      </div>
    </div>
    <div class="report-opt">
      <el-button
        icon="fa fa-download"
        @click="handleDownload"
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
      <el-tab-pane name="summary">
        <div slot="label">{{ $t('property.title') }}</div>
        <div id="summary">
          <date-selector-for-report
            @change="changeSummaryDate"
          ></date-selector-for-report>
          <hr class="reporthr" />
          <!-- performance snapshot -->
          <div class="plan-reports-con">
            <p class="plan-reports-title">
              {{ $t('property.performanceSnap') }}
            </p>
            <goal-selector
              @getResult="getGoalId"
              :defaultValue="formInline.goalId"
            >
            </goal-selector>
            <div
              class="plan-reports-result mr20"
              v-loading="performanceLoading"
            >
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
                <p class="plan-reports-result-inner_text">
                  {{
                    performanceData.current.uniqueConversions | toThousandFilter
                  }}
                </p>
                <p class="plan-reports-result-inner_textsub">
                  {{ $t('property.outOfConv') }}:
                  {{ performanceData.current.conversions | toThousandFilter }}
                </p>
                <div class="report-flex-row mr20">
                  <label>
                    {{ $t('common.vs') }}
                    {{
                      performanceData.previous.uniqueConversions
                        | toThousandFilter
                    }}
                  </label>
                  <div class="plan-growth">
                    <i
                      class="fa"
                      :class="
                        getRateClass(
                          performanceData.growthRate.uniqueConversionsRisingRate
                        )
                      "
                    ></i>
                    <span>{{
                      performanceData.growthRate.uniqueConversionsRisingRate
                    }}</span>
                  </div>
                </div>
                <div class="report-flex-row">
                  <label>
                    {{ $t('property.outOfConv') }}:
                    {{
                      performanceData.previous.conversions | toThousandFilter
                    }}
                  </label>
                  <div class="plan-growth">
                    <i
                      class="fa"
                      :class="
                        getRateClass(
                          performanceData.growthRate.conversionsRisingRate
                        )
                      "
                    ></i>
                    <span>{{
                      performanceData.growthRate.conversionsRisingRate
                    }}</span>
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
                <p class="plan-reports-result-inner_text">
                  {{
                    performanceData.current.uniqueCustomers | toThousandFilter
                  }}
                </p>
                <div class="report-flex-column mr10">
                  <div class="plan-growth">
                    <i
                      class="fa"
                      :class="
                        getRateClass(
                          performanceData.growthRate.conversionsRisingRate
                        )
                      "
                    ></i>
                    <span>{{
                      performanceData.growthRate.uniqueCustomersRisingRate
                    }}</span>
                  </div>
                  <label>
                    {{ $t('common.vs') }}
                    {{
                      performanceData.previous.uniqueCustomers
                        | toThousandFilter
                    }}
                  </label>
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
                <p class="plan-reports-result-inner_text">
                  {{ performanceData.current.paidCount | toThousandFilter }} :
                  {{ performanceData.current.nonePaidCount | toThousandFilter }}
                </p>
                <div class="report-flex-column mr10">
                  <label>
                    {{ $t('common.vs') }}
                    {{ performanceData.previous.paidCount | toThousandFilter }}
                    :
                    {{
                      performanceData.previous.nonePaidCount | toThousandFilter
                    }}
                  </label>
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
                      <label
                        >{{
                          performanceData.current.fullPath | toThousandFilter
                        }}
                        {{ $t('common.days') }}</label
                      >
                      <div class="report-flex-row">
                        <label>
                          {{ $t('common.vs') }}
                          {{
                            performanceData.previous.fullPath | toThousandFilter
                          }}
                          {{ $t('common.days') }}</label
                        >
                        <div class="plan-growth">
                          <i
                            class="fa"
                            :class="
                              getRateClass(
                                performanceData.growthRate.fullPathRisingRate
                              )
                            "
                          ></i>
                          <span
                            >{{
                              performanceData.growthRate.fullPathRisingRate
                            }}
                            {{ $t('common.days') }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="report-convert-inner mr10">
                    <label>{{ $t('property.lastMile') }}</label>
                    <div class="report-convert-inner__detail">
                      <label
                        >{{
                          performanceData.current.lastMile | toThousandFilter
                        }}
                        {{ $t('common.days') }}</label
                      >
                      <div class="report-flex-row">
                        <label>
                          {{ $t('common.vs') }}
                          {{
                            performanceData.previous.lastMile | toThousandFilter
                          }}
                          {{ $t('common.days') }}</label
                        >
                        <div class="plan-growth">
                          <i
                            class="fa"
                            :class="
                              getRateClass(
                                performanceData.growthRate.mileRisingRate
                              )
                            "
                          ></i>
                          <span
                            >{{ performanceData.growthRate.mileRisingRate }}
                            {{ $t('common.days') }}</span
                          >
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
          <div class="plan-reports-con" v-loading="trafficLoading">
            <p class="plan-reports-title">
              {{ $t('property.trafficSnapShot') }}
            </p>
            <div class="plan-reports-result mr20">
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
                    <p class="plan-reports-result-inner_text">
                      {{ trafficData.current.uniqueVisits | toThousandFilter }}
                    </p>
                    <div class="report-flex-column mr10">
                      <div class="plan-growth">
                        <i
                          class="fa"
                          :class="
                            getRateClass(
                              trafficData.growthRate.uniqueVisitsRate
                            )
                          "
                        ></i>
                        <span>{{
                          trafficData.growthRate.uniqueVisitsRate
                        }}</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{
                          trafficData.previous.uniqueVisits | toThousandFilter
                        }}
                      </label>
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
                    <p class="plan-reports-result-inner_text">
                      {{
                        trafficData.current.uniqueVisitors | toThousandFilter
                      }}
                    </p>
                    <div class="report-flex-column mr10">
                      <div class="plan-growth">
                        <i
                          class="fa"
                          :class="
                            getRateClass(
                              trafficData.growthRate.uniqueVisitorsRate
                            )
                          "
                        ></i>
                        <span>{{
                          trafficData.growthRate.uniqueVisitorsRate
                        }}</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{
                          trafficData.previous.uniqueVisitors | toThousandFilter
                        }}
                      </label>
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
              <div
                class="plan-reports-result-split__column"
                style="height: 290px;"
              >
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
                    <label class="report-flex-middle__detail">{{
                      trafficData.current.frequencyVisit
                    }}</label>
                    <div class="report-flex-middle__line"></div>
                    <div class="report-flex-middle__detail report-flex-column">
                      <div class="plan-growth">
                        <i
                          class="fa"
                          :class="
                            getRateClass(
                              trafficData.growthRate.frequencyVisitRate
                            )
                          "
                        ></i>
                        <span>{{
                          trafficData.growthRate.frequencyVisitRate
                        }}</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{ trafficData.previous.frequencyVisit }}
                      </label>
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
                    <label class="report-flex-middle__detail">{{
                      trafficData.current.averagePageViews
                    }}</label>
                    <div class="report-flex-middle__line"></div>
                    <div class="report-flex-middle__detail report-flex-column">
                      <div class="plan-growth">
                        <i
                          class="fa"
                          :class="
                            getRateClass(
                              trafficData.growthRate.averagePageViewsRate
                            )
                          "
                        ></i>
                        <span>{{
                          trafficData.growthRate.averagePageViewsRate
                        }}</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{ trafficData.previous.averagePageViews }}
                      </label>
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
                      {{ trafficData.current.newVistors }}
                    </p>
                    <div class="report-flex-column mr10">
                      <div class="plan-growth">
                        <i
                          class="fa"
                          :class="
                            getRateClass(trafficData.growthRate.newVistorsRate)
                          "
                        ></i>
                        <span>{{ trafficData.growthRate.newVistorsRate }}</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{ trafficData.previous.newVistors }}
                      </label>
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
                      {{ trafficData.current.repeatVistors }}
                    </p>
                    <div class="report-flex-column mr10">
                      <div class="plan-growth">
                        <i
                          class="fa"
                          :class="
                            getRateClass(
                              trafficData.growthRate.repeatVistorsRate
                            )
                          "
                        ></i>
                        <span>{{
                          trafficData.growthRate.repeatVistorsRate
                        }}</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{ trafficData.previous.repeatVistors }}
                      </label>
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
              <div
                class="plan-reports-result-split__column"
                style="height: 290px;"
              >
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
                    <label class="report-flex-middle__detail"
                      >{{ trafficData.current.bounceRate }}%</label
                    >
                    <div class="report-flex-middle__line"></div>
                    <div class="report-flex-middle__detail report-flex-column">
                      <div class="plan-growth">
                        <i
                          class="fa"
                          :class="
                            getRateClass(trafficData.growthRate.bounceRate)
                          "
                        ></i>
                        <span>{{ trafficData.growthRate.bounceRate }}%</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{ trafficData.previous.bounceRate }}%
                      </label>
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
                    <label class="report-flex-middle__detail">{{
                      trafficData.current.averageTimeSpan | toTimeSpanFilter
                    }}</label>
                    <div class="report-flex-middle__line"></div>
                    <div class="report-flex-middle__detail report-flex-column">
                      <div class="plan-growth">
                        <i
                          class="fa"
                          :class="
                            getRateClass(
                              trafficData.growthRate.averageTimeSpanRate
                            )
                          "
                        ></i>
                        <span
                          >{{
                            trafficData.growthRate.averageTimeSpanRate
                          }}s</span
                        >
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{
                          trafficData.previous.averageTimeSpan
                            | toTimeSpanFilter
                        }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="plan-reports-result mr15">
              <div class="plan-reports-result-inner" style="height: 340px;">
                <!-- timeDist -->
                <div class="plan-reports-result-inner_title">
                  {{ $t('property.timeDist') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('property.timeDistTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <div class="report-result-inner__graph" style="height: 250px;">
                  <div id="time_dist_map">
                    <bar-chart
                      :datas="timeDistData"
                      :color="timeDistDataColor"
                    ></bar-chart>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="audience">
        <div slot="label">{{ $t('audience.analysis') }}</div>
        <div id="audience">
          <date-selector-for-report
            :needVs="false"
            @change="changeAudienceDate"
          ></date-selector-for-report>
          <hr class="reporthr" />
          <div class="plan-reports-con mr20" v-loading="regionsLoading">
            <div class="plan-reports-result">
              <div class="plan-reports-result-inner" style="height: 460px;">
                <!-- world -->
                <div class="plan-reports-result-inner_title">
                  {{ $t('audience.regions') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('audience.regionsTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <div class="report-result-inner__graph" style="height: 370px;">
                  <div id="regions_map">
                    <region-world-chart
                      :datas="regionsData"
                      :color="regionsDataColor"
                    ></region-world-chart>
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
import LineChart from '@/components/charts/LineChart'
import BarChart from '@/components/charts/BarChart'
import RegionWorldChart from '@/components/charts/RegionWorldChart'
import MyHeader from '@/components/common/Header'
import Util from '@/utils'
import exportUtil from '@/utils/exportUtil'
import * as summaryApi from '@/api/summary'
import { ENUM_DATE, convertType } from '@/utils/constant'
export default {
  name: 'propertySummary',
  components: {
    DateSelectorForReport,
    GoalSelector,
    LineChart,
    BarChart,
    RegionWorldChart,
    MyHeader
  },
  data() {
    return {
      regionsLoading: false,
      performanceLoading: false,
      trafficLoading: false,
      isDownload: false,
      activeName: 'summary',
      currentName: 'summary',
      formInline: {
        goalId: -1,
        beginDate: null,
        endDate: null,
        preBeginDate: null,
        preEndDate: null,
        dateType: null
      },
      regionInline: {
        beginDate: null,
        endDate: null,
        dateType: null
      },
      debounceSearch: null,
      performanceData: {
        current: {},
        previous: {},
        growthRate: {}
      },
      trafficData: {
        current: {},
        previous: {},
        growthRate: {}
      },
      distributionData: {},
      uniqueVisits: [],
      uniqueVisitsColor: ['#ccc'],
      uniqueVisitors: [],
      uniqueVisitorsColor: ['#ccc'],
      newrepeqtVisitors: [],
      newrepeqtVisitorsColor: ['#ccc', '#4484CF'],
      timeDistData: [],
      timeDistDataColor: ['#F37A72'],
      regionsData: [],
      regionsDataColor: ['#EF4136'],
      dayConvert: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  computed: {
    loading() {
      return (
        this.trafficLoading && this.performanceLoading && this.regionsLoading
      )
    }
  },
  created() {
    this.makeDebounce()
    this.initData()
  },
  methods: {
    getDataList() {
      this.getPerformance()
      let promises = [
        summaryApi.traffic(this.formInline),
        summaryApi.distribution(this.formInline)
      ]
      this.trafficLoading = true
      Promise.all(promises)
        .then(([traffic, distribution]) => {
          this.trafficData = Object.assign({}, traffic)
          this.distributionData = Object.assign({}, distribution)
          this.timeDistData = this.dayConvert.map((item, index) => {
            let value = 0
            if (this.distributionData[item]) {
              value = this.distributionData[item]
            }
            return {
              date: index + '',
              value: value
            }
          })
          // 获取日期区间
          let dateRange = Util.getRangeByDate(
            this.formInline.beginDate,
            this.formInline.endDate
          )
          let timeRange = new Array(24).fill(1).map((item, index) => {
            return index + ''
          })
          this.uniqueVisits = []
          this.uniqueVisitors = []
          if (this.formInline.beginDate === this.formInline.endDate) {
            this.uniqueVisits.push(
              this.getLineChartHour(
                timeRange,
                this.trafficData.current.uniqueVisitsList
              )
            )
            this.uniqueVisitors.push(
              this.getLineChartHour(
                timeRange,
                this.trafficData.current.uniqueVisitorsList
              )
            )
            let newVisitorList = this.getLineChartHour(
              timeRange,
              this.trafficData.current.newVisitorList
            )
            let repeatVisitorsList = this.getLineChartHour(
              timeRange,
              this.trafficData.current.repeatVisitorsList
            )
            this.newrepeqtVisitors = [newVisitorList, repeatVisitorsList]
          } else {
            this.uniqueVisits.push(
              this.getLineChartDate(
                dateRange,
                this.trafficData.current.uniqueVisitsList
              )
            )
            this.uniqueVisitors.push(
              this.getLineChartDate(
                dateRange,
                this.trafficData.current.uniqueVisitorsList
              )
            )
            let newVisitorList = this.getLineChartDate(
              dateRange,
              this.trafficData.current.newVisitorList
            )
            let repeatVisitorsList = this.getLineChartDate(
              dateRange,
              this.trafficData.current.repeatVisitorsList
            )
            this.newrepeqtVisitors = [newVisitorList, repeatVisitorsList]
          }
        })
        .finally(() => {
          this.trafficLoading = false
        })
    },
    getLineChartHour(timeRange, list) {
      return timeRange.map(item => {
        let value = 0
        let find = this._findListValue(list, 'date', item)
        if (find) {
          value = find.value
        }
        let date = item.length < 2 ? '0' + item : item
        return {
          date: date + ':00',
          value: value
        }
      })
    },
    getLineChartDate(dateRange, list) {
      return dateRange.map(item => {
        let value = 0
        let find = this._findListValue(list, 'date', item, '20')
        if (find) {
          value = find.value
        }
        return {
          date: item,
          value: value
        }
      })
    },
    _findListValue(list, key, value, special = '') {
      if (!list || list.length === 0) return null
      let find = list.find(item => special + item[key] === value)
      return find
    },
    getPerformance() {
      this.performanceLoading = false
      if (this.formInline.goalId === -1) return
      this.performanceLoading = true
      summaryApi
        .performance(this.formInline)
        .then(performance => {
          this.performanceData = Object.assign({}, performance)
        })
        .finally(() => {
          this.performanceLoading = false
        })
    },
    getRegions() {
      this.regionsLoading = true
      summaryApi
        .regions(this.regionInline)
        .then(regions => {
          // this.regionsData = regions
        })
        .finally(() => {
          this.regionsLoading = false
        })
    },
    initData() {
      // let makeData = size => {
      //   return new Array(size).fill(1).map((item, index) => {
      //     return {
      //       date: '2019-05-0' + (index + 1),
      //       value: Math.random() * 20000
      //     }
      //   })
      // }
      // let example = makeData(30)
      // this.uniqueVisits = [example]
      // let example2 = makeData(30)
      // this.uniqueVisitors = [example2]
      // this.newrepeqtVisitors = [this.uniqueVisits[0], this.uniqueVisitors[0]]
      // this.timeDistData = [
      //   { date: '0', value: 118974390 },
      //   { date: '1', value: 132721289 },
      //   { date: '2', value: 142809968 },
      //   { date: '3', value: 149229238 },
      //   { date: '4', value: 139460403 },
      //   { date: '5', value: 138566027 },
      //   { date: '6', value: 124059245 }
      // ]
    },
    makeDebounce() {
      this.debounceSearch = Util.debounce(this.getDataList, 250)
    },
    getGoalId(result) {
      this.formInline.goalId = result ? result.id : -1
      this.getPerformance()
    },
    changeTab(tab) {
      if (this.currentName !== tab.name) {
        this.currentName = tab.name
        if (this.activeName === 'audience') {
          this.regionsData = [
            { name: 'Afghanistan', value: 28397812 },
            { name: 'Angola', value: 19549124 },
            { name: 'Albania', value: 3150143 },
            { name: 'United Arab Emirates', value: 8441537 },
            { name: 'Argentina', value: 40374224 },
            { name: 'Armenia', value: 2963496 },
            { name: 'French Southern and Antarctic Lands', value: 268065 },
            { name: 'Australia', value: 22404488 },
            { name: 'Austria', value: 8401924 },
            { name: 'Azerbaijan', value: 9094718 },
            { name: 'Burundi', value: 9232753 },
            { name: 'Belgium', value: 10941288 },
            { name: 'Benin', value: 9509798 },
            { name: 'Burkina Faso', value: 15540284 },
            { name: 'Bangladesh', value: 151125475 },
            { name: 'Bulgaria', value: 7389175 },
            { name: 'The Bahamas', value: 66402316 },
            { name: 'Bosnia and Herzegovina', value: 3845929 },
            { name: 'Belarus', value: 949107 },
            { name: 'Belize', value: 308595 },
            { name: 'Bermuda', value: 64951 },
            { name: 'Bolivia', value: 716939 },
            { name: 'Brazil', value: 195210154 },
            { name: 'Brunei', value: 27223 },
            { name: 'Bhutan', value: 716939 },
            { name: 'Botswana', value: 1969341 },
            { name: 'Central African Republic', value: 4349921 },
            { name: 'Canada', value: 3412624 },
            { name: 'Switzerland', value: 7830534 },
            { name: 'Chile', value: 1715076 },
            { name: 'China', value: 1359821465 },
            { name: 'Ivory Coast', value: 60508978 },
            { name: 'Cameroon', value: 20624343 },
            { name: 'Democratic Republic of the Congo', value: 62191161 },
            { name: 'Republic of the Congo', value: 3573024 },
            { name: 'Colombia', value: 46444798 },
            { name: 'Costa Rica', value: 4669685 },
            { name: 'Cuba', value: 11281768 },
            { name: 'Northern Cyprus', value: 1468 },
            { name: 'Cyprus', value: 1103685 },
            { name: 'Czech Republic', value: 10553701 },
            { name: 'Germany', value: 83017404 },
            { name: 'Djibouti', value: 834036 },
            { name: 'Denmark', value: 5550959 },
            { name: 'Dominican Republic', value: 10016797 },
            { name: 'Algeria', value: 3706282 },
            { name: 'Ecuador', value: 15001072 },
            { name: 'Egypt', value: 78075705 },
            { name: 'Eritrea', value: 5741159 },
            { name: 'Spain', value: 46182038 },
            { name: 'Estonia', value: 1298533 },
            { name: 'Ethiopia', value: 87095281 },
            { name: 'Finland', value: 5367693 },
            { name: 'Fiji', value: 860559 },
            { name: 'Falkland Islands', value: 49581 },
            { name: 'France', value: 63230866 },
            { name: 'Gabon', value: 1556222 },
            { name: 'United Kingdom', value: 6206635 },
            { name: 'Georgia', value: 4388674 },
            { name: 'Ghana', value: 24262901 },
            { name: 'Guinea', value: 10876033 },
            { name: 'Gambia', value: 168064 },
            { name: 'Guinea Bissau', value: 10876033 },
            { name: 'Equatorial Guinea', value: 696167 },
            { name: 'Greece', value: 11109999 },
            { name: 'Greenland', value: 56546 },
            { name: 'Guatemala', value: 14341576 },
            { name: 'French Guiana', value: 231169 },
            { name: 'Guyana', value: 786126 },
            { name: 'Honduras', value: 7621204 },
            { name: 'Croatia', value: 4338027 },
            { name: 'Haiti', value: 98964 },
            { name: 'Hungary', value: 10014633 },
            { name: 'Indonesia', value: 240676485 },
            { name: 'India', value: 12054648 },
            { name: 'Ireland', value: 4467561 },
            { name: 'Iran', value: 240676485 },
            { name: 'Iraq', value: 3096238 },
            { name: 'Iceland', value: 318042 },
            { name: 'Israel', value: 7420368 },
            { name: 'Italy', value: 60508978 },
            { name: 'Jamaica', value: 2741485 },
            { name: 'Jordan', value: 6454554 },
            { name: 'Japan', value: 127352833 },
            { name: 'Kazakhstan', value: 15921127 },
            { name: 'Kenya', value: 40909194 },
            { name: 'Kyrgyzstan', value: 5334223 },
            { name: 'Cambodia', value: 14364931 },
            { name: 'South Korea', value: 51452352 },
            { name: 'Kosovo', value: 97743 },
            { name: 'Kuwait', value: 299158 },
            { name: 'Laos', value: 6395713 },
            { name: 'Lebanon', value: 4341092 },
            { name: 'Liberia', value: 395799 },
            { name: 'Libya', value: 6040612 },
            { name: 'Sri Lanka', value: 20758779 },
            { name: 'Lesotho', value: 2008921 },
            { name: 'Lithuania', value: 3068457 },
            { name: 'Luxembourg', value: 507885 },
            { name: 'Latvia', value: 2090519 },
            { name: 'Morocco', value: 3164236 },
            { name: 'Moldova', value: 103619 },
            { name: 'Madagascar', value: 21079532 },
            { name: 'Mexico', value: 117886404 },
            { name: 'Macedonia', value: 507885 },
            { name: 'Mali', value: 13985961 },
            { name: 'Myanmar', value: 51931231 },
            { name: 'Montenegro', value: 620078 },
            { name: 'Mongolia', value: 2712738 },
            { name: 'Mozambique', value: 23967265 },
            { name: 'Mauritania', value: 360942 },
            { name: 'Malawi', value: 15013694 },
            { name: 'Malaysia', value: 28275835 },
            { name: 'Namibia', value: 2178967 },
            { name: 'New Caledonia', value: 246379 },
            { name: 'Niger', value: 15893746 },
            { name: 'Nigeria', value: 15970778 },
            { name: 'Nicaragua', value: 5822209 },
            { name: 'Netherlands', value: 16615243 },
            { name: 'Norway', value: 4891251 },
            { name: 'Nepal', value: 26846016 },
            { name: 'New Zealand', value: 4368136 },
            { name: 'Oman', value: 2802768 },
            { name: 'Pakistan', value: 173149306 },
            { name: 'Panama', value: 3678128 },
            { name: 'Peru', value: 2926283 },
            { name: 'Philippines', value: 93444322 },
            { name: 'Papua New Guinea', value: 6858945 },
            { name: 'Poland', value: 38198754 },
            { name: 'Puerto Rico', value: 3709671 },
            { name: 'North Korea', value: 1468 },
            { name: 'Portugal', value: 10589792 },
            { name: 'Paraguay', value: 6459721 },
            { name: 'Qatar', value: 1749713 }
          ]
        }
      }
    },
    changeSummaryDate(result) {
      if (result && result.titleCur && result.titlePrev) {
        this.formInline.beginDate = result.titleCur[0]
        this.formInline.endDate = result.titleCur[1] || result.titleCur[0]
        this.formInline.preBeginDate = result.titlePrev[0]
        this.formInline.preEndDate = result.titlePrev[1] || result.titlePrev[0]
        this.formInline.dateType = convertType(result.id, ENUM_DATE).label
        this.debounceSearch()
      }
    },
    changeAudienceDate(result) {
      if (result && result.titleCur && result.titlePrev) {
        this.regionInline.beginDate = result.titleCur[0]
        this.regionInline.endDate = result.titleCur[1] || result.titleCur[0]
        this.regionInline.dateType = convertType(result.id, ENUM_DATE).label
        this.getRegions()
      }
    },
    getRateClass(rate) {
      return rate < 0 ? 'fa-caret-down' : 'fa-caret-up'
    },
    handleDownload() {
      this.isDownload = true
      let current = Util.formateDate(new Date(), 'yyyyMMddhhmm')

      exportUtil.initDom(this.activeName)

      exportUtil.fixCanvas(this.activeName)

      this.getPdf('#reports_pdf', `PropertySummaryAnalysis_${current}`, () => {
        this.isDownload = false
        document.getElementById('reports_pdf').parentNode.style.display = 'none'
      })
    }
  }
}
</script>

<style scoped></style>
