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
        v-hasPermission="'analysissummary.download'"
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
            reportType="summary"
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
              <!-- <div class="plan-reports-result-inner">
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
              </div> -->
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
                  {{ performanceData.current.conversions | toThousandFilter }}
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
                      performanceData.growthRate.conversionsRisingRate
                        | toThousandFilter
                    }}</span>
                  </div>
                  <label>
                    {{ $t('common.vs') }}
                    {{
                      performanceData.previous.conversions | toThousandFilter
                    }}
                  </label>
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
                          performanceData.growthRate.uniqueCustomersRisingRate
                        )
                      "
                    ></i>
                    <span>{{
                      performanceData.growthRate.uniqueCustomersRisingRate
                        | toThousandFilter
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
                      {{ $t('property.lastMileRatioTip') }}
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
                      <label>{{
                        performanceData.current.fullPath | formatSeconds
                      }}</label>
                      <div class="report-flex-row">
                        <label>
                          {{ $t('common.vs') }}
                          {{
                            performanceData.previous.fullPath | formatSeconds
                          }}
                        </label>
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
                                | formatSeconds
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="report-convert-inner mr10">
                    <label>{{ $t('property.lastMile') }}</label>
                    <div class="report-convert-inner__detail">
                      <label
                        >{{ performanceData.current.lastMile | formatSeconds }}
                      </label>
                      <div class="report-flex-row">
                        <label>
                          {{ $t('common.vs') }}
                          {{
                            performanceData.previous.lastMile | formatSeconds
                          }}
                        </label>
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
                            >{{
                              performanceData.growthRate.mileRisingRate
                                | formatSeconds
                            }}
                          </span>
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
                            | toThousandFilter
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
                            | toThousandFilter
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
                      trafficData.current.frequencyVisit | toMoneyFilter
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
                            | toMoneyFilter
                        }}</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{
                          trafficData.previous.frequencyVisit | toMoneyFilter
                        }}
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
                      trafficData.current.averagePageViews | toMoneyFilter
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
                            | toMoneyFilter
                        }}</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{
                          trafficData.previous.averagePageViews | toMoneyFilter
                        }}
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
                      {{ trafficData.current.newVistors | toThousandFilter }}
                    </p>
                    <div class="report-flex-column mr10">
                      <div class="plan-growth">
                        <i
                          class="fa"
                          :class="
                            getRateClass(trafficData.growthRate.newVistorsRate)
                          "
                        ></i>
                        <span>{{
                          trafficData.growthRate.newVistorsRate
                            | toThousandFilter
                        }}</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{ trafficData.previous.newVistors | toThousandFilter }}
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
                      {{ trafficData.current.repeatVistors | toThousandFilter }}
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
                            | toThousandFilter
                        }}</span>
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{
                          trafficData.previous.repeatVistors | toThousandFilter
                        }}
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
                  <!-- bounce rate -->
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
                      >{{
                        trafficData.current.bounceRate | toMoneyFilter
                      }}%</label
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
                        <span
                          >{{
                            trafficData.growthRate.bounceRate | toMoneyFilter
                          }}%</span
                        >
                      </div>
                      <label>
                        {{ $t('common.vs') }}
                        {{ trafficData.previous.bounceRate | toMoneyFilter }}%
                      </label>
                    </div>
                  </div>
                </div>
                <div class="plan-reports-result-inner">
                  <!-- avg time span -->
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
            reportType="summary"
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
                    <noresult-report
                      v-show="!regionsData || regionsData.length === 0"
                    ></noresult-report>
                    <region-world-chart
                      v-show="regionsData && regionsData.length > 0"
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
import NoresultReport from '@/components/report/Noresult.vue'
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
    NoresultReport,
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
          this.regionsData = regions.map(item => {
            return {
              name: item.enname,
              value: item.uniqueVisits
            }
          })
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
