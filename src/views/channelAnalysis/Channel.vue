<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('channel.title') }}</h1>
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
      <el-tab-pane name="channel">
        <div slot="label">{{ $t('channel.title') }}</div>
        <div id="channel">
          <date-selector-for-report
            :needVs="false"
            reportTitle="ChannelAnalysis"
            @change="changeTrafficDate"
          ></date-selector-for-report>
          <hr class="reporthr" />
          <!-- traffic snapshot -->
          <div class="plan-reports-con mr20">
            <div class="plan-reports-result">
              <div
                class="plan-reports-result-inner"
                v-loading="trafficBreakdownLoading"
                style="flex:2.5;height: 500px;"
              >
                <!-- Traffic Breakdown -->
                <div class="plan-reports-result-inner_title">
                  {{ $t('channel.breakdown') }}
                  <!-- <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('channel.breakdownTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip> -->
                </div>
                <div class="plan-reports-result-inner__opt">
                  <el-radio-group
                    v-model="trafficBreakdownForm.type"
                    @change="changeTrafficBreakdownType"
                    style="position:absolute; left:20px;"
                    size="small"
                  >
                    <el-radio-button label="channel">
                      {{ $t('channel.channel') }}
                    </el-radio-button>
                    <el-radio-button label="device">
                      {{ $t('channel.device') }}
                    </el-radio-button>
                  </el-radio-group>
                  <!-- <channel-selector
                    v-show="trafficBreakdownForm.type === 'channel'"
                    @getResult="getBreakDownChannel"
                    :defaultValue="trafficBreakdownForm.channel"
                  >
                  </channel-selector> -->
                  <div class="chooseBreakdown" style="margin-right: 0px;">
                    <div
                      style="width: 135px;margin-right:15px;"
                      v-show="
                        trafficBreakdownForm.rightChannel === 'conversions'
                      "
                    ></div>
                    <el-select
                      v-model="trafficBreakdownForm.channel"
                      @change="getBreakDownChannel"
                      :placeholder="$t('common.selOption')"
                      style="width: 135px;"
                    >
                      <el-option
                        v-for="item in channelTypes"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      ></el-option>
                    </el-select>

                    <!-- <el-select
                      v-model="trafficBreakdownForm.device"
                      v-show="trafficBreakdownForm.type === 'device'"
                      @change="getTraffciBreakdownDevice"
                      :placeholder="$t('common.selOption')"
                    >
                      <el-option
                        v-for="item in deviceTypes"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      ></el-option>
                    </el-select> -->
                    <span style="margin:0 7.5px;line-height: 30px;">{{
                      $t('common.vs')
                    }}</span>
                    <el-select
                      v-model="trafficBreakdownForm.rightChannel"
                      @change="getBreakDownRightChannel"
                      :placeholder="$t('common.selOption')"
                      style="width: 135px;"
                    >
                      <el-option
                        v-for="item in channelTypes"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      ></el-option>
                    </el-select>
                    <goal-selector
                      @getResult="getBreakDownGoalId"
                      v-show="
                        trafficBreakdownForm.rightChannel === 'conversions'
                      "
                      :defaultValue="trafficBreakdownForm.goalId"
                      style="width: 135px;margin-left: 15px;"
                    >
                    </goal-selector>
                  </div>
                </div>
                <div class="report-result-inner__graph" style="height: 375px;">
                  <div id="traffic_breakdown_map">
                    <noresult-report
                      v-show="trafficBreakdown.isEmpty"
                    ></noresult-report>
                    <bar-multi-axis-chart
                      v-show="!trafficBreakdown.isEmpty"
                      :datas="trafficBreakdown"
                      :height="375"
                      :color="trafficBreakdownColor"
                    ></bar-multi-axis-chart>
                  </div>
                </div>
              </div>
              <div
                class="plan-reports-result-inner"
                v-loading="trafficSourceLoading"
                style="height: 500px;"
              >
                <!-- Traffic Source -->
                <div class="plan-reports-result-inner_title">
                  {{ $t('channel.trafficSource') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('channel.trafficSourceTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <!-- <div class="report-flex-middle">
                  <goal-selector @getResult="getGoalId" :defaultValue="goalId">
                  </goal-selector>
                </div> -->
                <div class="report-result-inner__rank">
                  <noresult-report
                    v-show="!trafficSource || trafficSource.length === 0"
                  ></noresult-report>
                  <ul v-show="trafficSource && trafficSource.length > 0">
                    <li
                      v-for="(item, index) in trafficSource"
                      :key="'rank_' + item.name"
                    >
                      <span class="rank_ico">{{ index + 1 }}</span>
                      <label>{{ item.name }}</label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- trafic trend -->
            <div class="plan-reports-result mr15">
              <div
                class="plan-reports-result-inner"
                v-loading="trafficTrendLoading"
                style="height: 460px;"
              >
                <div class="plan-reports-result-inner_title">
                  {{ $t('channel.trafficTrend') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('channel.trafficTrendTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <div class="plan-reports-result-inner__opt">
                  <el-radio-group
                    v-model="trafficTrendForm.type"
                    @change="changeTrafficTrendType"
                    size="small"
                  >
                    <el-radio-button label="channel">
                      {{ $t('channel.channel') }}
                    </el-radio-button>
                    <el-radio-button label="device">
                      {{ $t('channel.device') }}
                    </el-radio-button>
                  </el-radio-group>
                  <!-- <channel-selector
                    v-show="trafficTrendForm.type === 'channel'"
                    @getResult="getTrafficTrendChannelId"
                    :defaultValue="trafficTrendForm.channelId"
                  >
                  </channel-selector> -->
                  <el-select
                    v-model="trafficTrendForm.channelId"
                    @change="getTrafficTrendChannelId"
                    :placeholder="$t('common.selOption')"
                  >
                    <el-option
                      v-for="item in channelTypes"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>

                  <!-- <el-select
                    v-model="trafficTrendForm.device"
                    v-show="trafficTrendForm.type === 'device'"
                    @change="getTraffciTrendDevice"
                    :placeholder="$t('common.selOption')"
                  >
                    <el-option
                      v-for="item in deviceTypes"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select> -->
                </div>
                <div class="report-result-inner__graph" style="height: 335px;">
                  <div id="traffic_trend_map">
                    <noresult-report
                      v-show="!trafficTrend || trafficTrend.length === 0"
                    ></noresult-report>
                    <line-trend-chart
                      v-show="trafficTrend && trafficTrend.length > 0"
                      :datas="trafficTrend"
                    ></line-trend-chart>
                  </div>
                </div>
              </div>
            </div>
            <div class="plan-reports-result mr15">
              <div
                class="plan-reports-result-inner"
                v-loading="assistLoading"
                style="flex:2;height: 650px;width:0;"
              >
                <!-- Assist analysis -->
                <div class="plan-reports-result-inner_title">
                  {{ $t('channel.assist') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('channel.assistTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <div class="plan-reports-result-inner__opt">
                  <campaigns-selector
                    @getResult="getCampaignId"
                    :defaultValue="assistForm.campaign"
                  >
                  </campaigns-selector>
                </div>
                <noresult-report
                  v-show="assist.columns.length === 0"
                ></noresult-report>
                <div class="main-table" v-show="assist.columns.length > 0">
                  <el-table
                    :data="assist.data"
                    border
                    class="table"
                    ref="table"
                    :max-height="500"
                    v-loading="assistLoading"
                    header-row-class-name="main-table"
                  >
                    <el-table-column
                      :label="$t('channel.topAssist')"
                      class-name="greyColumn"
                      :width="assist.columns.length > 4 ? '150px' : ''"
                      :fixed="assist.columns.length > 4"
                      prop="name"
                    >
                      <template slot-scope="scope">
                        <span style="font-weight:bold;">
                          {{
                            scope.row.name === 'Total'
                              ? $t('channel.total')
                              : scope.row.name
                          }}
                        </span>
                      </template>
                    </el-table-column>
                    <template v-for="col in assist.columns">
                      <el-table-column
                        :label="col.label"
                        :width="assist.columns.length > 4 ? '120px' : ''"
                        :prop="col.prop"
                        :key="col.prop"
                      >
                        <template slot-scope="scope">
                          <span
                            :class="{
                              'max-val': isMaxVal(col.prop, scope.row.assistId)
                            }"
                          >
                            {{ scope.row[col.prop] }}
                          </span>
                        </template>
                      </el-table-column>
                    </template>
                    <!-- <el-table-column
                      :label="$t('channel.totalAssist')"
                      width="120px"
                      prop="total"
                    >
                      <template slot-scope="scope">
                        <span
                          style="font-weight:bold;"
                          :class="{
                            'max-val': isMaxVal('total', scope.row.assistId)
                          }"
                        >
                          {{ scope.row['total'] }}
                        </span>
                      </template>
                    </el-table-column> -->
                  </el-table>
                  <p style="color:#ef4136;margin-top: 20px;">
                    {{ $t('channel.assistNotice') }}
                  </p>
                </div>
              </div>
              <div
                class="plan-reports-result-inner"
                v-loading="conversionPathLoading"
                style="height: 650px;"
              >
                <!-- Top Conversion -->
                <div class="plan-reports-result-inner_title">
                  {{ $t('channel.conversionPaths') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('channel.conversionPathsTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <!-- <p>
                  {{ $t('channel.goal') }}:
                  <b style="font-weight: bold;">Booking</b>
                </p> -->
                <div class="plan-reports-result-inner__opt mr10">
                  <goal-selector
                    @getResult="getConversionPathGoalId"
                    :defaultValue="conversionPathForm.goalId"
                  >
                  </goal-selector>
                </div>
                <noresult-report
                  v-show="!conversionPaths || conversionPaths.length === 0"
                ></noresult-report>
                <div
                  class="plan-reports-result-inner__tablelike mr10"
                  v-show="conversionPaths && conversionPaths.length > 0"
                >
                  <div class="tablelike_title">
                    <div style="text-align: center;">
                      {{ $t('channel.conversion') }}
                    </div>
                    <div></div>
                    <div>{{ $t('channel.campaign') }}</div>
                  </div>
                  <div
                    class="tablelike_tr"
                    v-for="(item, index) in conversionPaths"
                    :key="'conversion_' + item.name + index"
                  >
                    <div class="tablelike_td" style="flex-direction: column;">
                      <p class="mainTitle">{{ item.rate }}%</p>
                      <p>
                        {{ item.conversion | toThousandFilter }}/{{
                          item.total | toThousandFilter
                        }}
                      </p>
                    </div>
                    <div class="tablelike_td">
                      <el-progress
                        :show-text="false"
                        :stroke-width="15"
                        :percentage="parseInt(item.rate)"
                      ></el-progress>
                    </div>
                    <div class="tablelike_td">
                      <el-tooltip
                        :content="item.name"
                        effect="light"
                        :disabled="item.name && item.name.length < 17"
                      >
                        <p class="textOverflow" style="width: 100px;">
                          {{ item.name }}
                        </p>
                      </el-tooltip>
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
        <div id="audience">
          <date-selector-for-report
            :needVs="false"
            @change="changeAudienceDate"
            reportTitle="ChannelAnalysis"
          ></date-selector-for-report>
          <hr class="reporthr" />
          <div class="plan-reports-con mr20">
            <div class="plan-reports-result">
              <div
                class="plan-reports-result-inner"
                v-loading="regionsLoading"
                style="height: 500px;"
              >
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
                <div class="plan-reports-result-inner__opt">
                  <channel-selector
                    @getResult="getRegionChannelId"
                    :defaultValue="regionInline.channelId"
                  >
                  </channel-selector>
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
import ChannelSelector from '@/components/selector/ChannelSelector'
import CampaignsSelector from '@/components/selector/CampaignsSelector'
import NoresultReport from '@/components/report/Noresult.vue'
import LineTrendChart from '@/components/charts/LineTrendChart'
import BarMultiAxisChart from '@/components/charts/BarMultiAxisChart'
import RegionWorldChart from '@/components/charts/RegionWorldChart'
import MyHeader from '@/components/common/Header'
import Util from '@/utils'
import exportUtil from '@/utils/exportUtil'
import * as analysisChannelApi from '@/api/analysisChannel'
import {
  ENUM_DATE,
  CHANNEL_TYPE,
  CHANNEL_NAME,
  DEVICE_TYPE,
  convertType
} from '@/utils/constant'
export default {
  name: 'channelAnalysis',
  components: {
    DateSelectorForReport,
    GoalSelector,
    ChannelSelector,
    CampaignsSelector,
    NoresultReport,
    LineTrendChart,
    BarMultiAxisChart,
    RegionWorldChart,
    MyHeader
  },
  data() {
    return {
      trafficBreakdownLoading: false,
      trafficSourceLoading: false,
      trafficTrendLoading: false,
      conversionPathLoading: false,
      assistLoading: false,
      regionsLoading: false,
      isDownload: false,
      activeName: 'channel',
      currentName: 'channel',
      channelTypes: CHANNEL_TYPE,
      deviceTypes: DEVICE_TYPE,
      channelNames: CHANNEL_NAME,
      trafficBreakdownForm: {
        type: 'channel',
        device: 'Computer',
        goalId: -1,
        goalName: '',
        channel: 'conversions',
        rightChannel: 'conversions'
      },
      trafficTrendForm: {
        type: 'channel',
        device: 'Computer',
        channelId: 'conversions'
      },
      conversionPathForm: {
        goalId: -1
      },
      assistForm: {
        campaign: -1
      },
      formInline: {
        beginDate: null,
        endDate: null,
        dateType: null
      },
      regionInline: {
        beginDate: null,
        endDate: null,
        dateType: null,
        channelId: -1
      },
      goalId: -1,
      trafficTrend: [],
      trafficTrendColor: [],
      trafficBreakdown: {
        isEmpty: true
      },
      trafficBreakdownColor: ['#8D7B7B', '#4484CF'],
      trafficSource: [],
      conversionPaths: [],
      assist: {
        columns: [],
        assists: [],
        data: [],
        max: {}
      },
      regionsData: [],
      regionsDataColor: ['#EF4136']
    }
  },
  computed: {
    loading() {
      return (
        this.trafficBreakdownLoading &&
        this.trafficSourceLoading &&
        this.trafficTrendLoading &&
        this.conversionPathLoading &&
        this.assistLoading &&
        this.regionsLoading
      )
    }
  },
  created() {
    this.makeDebounce()
    // this.initData()
  },
  methods: {
    getDataList() {
      this.getTrafficBreakDown()
      this.getTrafficSource()
      this.getTrafficTrend()
      this.getConversionPath()
      this.getAssist()
    },
    getTrafficBreakDown() {
      this.trafficBreakdownLoading = false
      if (this.trafficBreakdownForm.goalId === -1) return
      this.trafficBreakdownLoading = true
      let form = Object.assign({}, this.formInline, this.trafficBreakdownForm)
      analysisChannelApi
        .trafficBreakdown(form)
        .then(trafficBreakdown => {
          this.trafficBreakdown = { isEmpty: true }
          let leftAxis = trafficBreakdown[this.trafficBreakdownForm.type]
          let rightAxis = trafficBreakdown.goal

          let yAxis =
            this.trafficBreakdownForm.type === 'channel'
              ? this.channelNames
              : this.deviceTypes

          this.trafficBreakdown.columns = yAxis.map(item => item.label)
          this.trafficBreakdown.legend = [
            this.trafficBreakdownForm.type,
            this.trafficBreakdownForm.goalName
          ]
          this.trafficBreakdown.leftAxis = yAxis.map(item => {
            let channel = leftAxis.find(channel => {
              let y =
                this.trafficBreakdownForm.type === 'channel'
                  ? channel.channelName
                  : channel.device
              return y === item.label
            })
            let value = 0
            if (channel) {
              value = channel[this.trafficBreakdownForm.channel]
              channel.channelLabel = item.label
            } else {
              channel = {
                channelName: item.value,
                device: item.value,
                channelLabel: item.label
              }
            }
            return Object.assign({ value: value }, channel)
          })

          // rightchannel 为conversion时候，取goal的conversions，否则取对应channel
          this.trafficBreakdown.rightAxis = yAxis.map(item => {
            let channel = rightAxis.find(channel => {
              let y =
                this.trafficBreakdownForm.type === 'channel'
                  ? channel.channelName
                  : channel.device
              return y === item.label
            })
            let channelLeft = leftAxis.find(channel => {
              let y =
                this.trafficBreakdownForm.type === 'channel'
                  ? channel.channelName
                  : channel.device
              return y === item.label
            })
            let value = 0
            if (!channel) {
              channel = {
                channelName: item.label,
                device: item.label,
                channelLabel: item.label,
                conversions: 0
              }
            }
            channel = Object.assign(channelLeft || {}, channel)
            value = channel[this.trafficBreakdownForm.rightChannel] // goal固定的
            channel.channelLabel = item.label
            return Object.assign({ value: value }, channel)
          })
          console.log(this.trafficBreakdown)
          this.justifyBreakdown()
        })
        .finally(() => {
          this.trafficBreakdownLoading = false
        })
    },
    getTrafficSource() {
      this.trafficSourceLoading = true
      analysisChannelApi
        .trafficSource(this.formInline)
        .then(trafficSource => {
          this.trafficSource = trafficSource.concat()
        })
        .finally(() => {
          this.trafficSourceLoading = false
        })
    },
    getTrafficTrend() {
      this.trafficTrendLoading = false
      if (
        this.trafficTrendForm.type === 'channel' &&
        this.trafficTrendForm.channelId === -1
      )
        return
      this.trafficTrendLoading = true
      let form = Object.assign({}, this.formInline, this.trafficTrendForm)
      analysisChannelApi
        .trafficTrend(form)
        .then(trafficTrend => {
          // 获取日期区间
          this.trafficTrend = []
          let dateRange = Util.getRangeByDate(form.beginDate, form.endDate)
          for (let trend in trafficTrend) {
            this.trafficTrend.push({
              name: trend,
              data: this.getLineChartDate(
                dateRange,
                trafficTrend[trend],
                form.channelId
              )
            })
          }
          if (form.type === 'device') {
            let sortArr = ['Computer', 'Mobile', 'Tablet', 'Unknown']
            this.trafficTrend = Util.sortListByAssign(
              this.trafficTrend,
              sortArr,
              'name'
            )
          }
        })
        .finally(() => {
          this.trafficTrendLoading = false
        })
    },
    getLineChartDate(dateRange, list, type) {
      return dateRange.map(item => {
        let value = 0
        let find = this._findListValue(list, 'beginDate', item, '20')
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
    getConversionPath() {
      this.conversionPathLoading = false
      if (this.conversionPathForm.goalId === -1) return
      this.conversionPathLoading = true
      let form = Object.assign({}, this.formInline, this.conversionPathForm)
      analysisChannelApi
        .conversionPath(form)
        .then(conversionPath => {
          let total = conversionPath.reduce(
            (total, item) => total + item.conversion,
            0
          )
          this.conversionPaths = conversionPath.map(item => {
            let rate = ((item.conversion / total) * 100).toFixed(2)
            return {
              conversion: item.conversion,
              name: item.name,
              rate: rate,
              total: total
            }
          })
        })
        .finally(() => {
          this.conversionPathLoading = false
        })
    },
    getAssist() {
      this.assistLoading = false
      if (this.assistForm.campaign === -1) return
      this.assistLoading = true
      let form = Object.assign({}, this.formInline, this.assistForm)
      analysisChannelApi
        .assistAnalysis(form)
        .then(assist => {
          this.assist = {
            columns: [],
            assists: [],
            data: [],
            max: {}
          }
          if (!assist.detail || assist.detail.length === 0) return
          // 获取column, assist
          let columns = []
          let assists = []
          let max = {}
          // example
          // assist.detail = [
          //   {
          //     originid: '1_3',
          //     rate: 100.0,
          //     assistCount: 1,
          //     origin: 'Google(Paid Search)',
          //     assist: 'Baidu',
          //     assistid: '1_3'
          //   },
          //   {
          //     originid: '3_5',
          //     rate: 80.0,
          //     assistCount: 1,
          //     origin: 'Google(Paid)',
          //     assist: 'Bing',
          //     assistid: '3_5'
          //   },
          //   {
          //     originid: '2_3',
          //     rate: 21.0,
          //     assistCount: 1,
          //     origin: 'Baidu(Paid Search)',
          //     assist: 'Google(Paid Search)',
          //     assistid: '1_3'
          //   },
          //   {
          //     originid: '4_5',
          //     rate: 33.0,
          //     assistCount: 1,
          //     origin: 'Baidu(Paid)',
          //     assist: 'bing(Paid Search)',
          //     assistid: '4_3'
          //   }
          // ]
          assist.detail.forEach(item => {
            columns.push({
              label: item.origin,
              prop: item.originid
            })
            assists.push({
              label: item.assist,
              assistId: item.assistid,
              rate: item.rate,
              assistCount: item.assistCount
            })
            max[item.originid] = {
              value: 0,
              name: item.assist,
              assistId: item.assistid
            }
          })
          // 去重排序
          this.assist.columns = Util.uniqueAndSortArr(columns, 'prop')
          this.assist.assists = Util.uniqueAndSortArr(assists, 'assistId')

          // 获取table数据
          this.assist.data = this.assist.assists.map(item => {
            let result = { name: item.label, assistId: item.assistId }
            this.assist.columns.forEach(column => {
              let find = assist.detail.find(detail => {
                return (
                  detail.originid === column.prop &&
                  detail.assistid === result.assistId
                )
              })
              if (find) {
                result[column.prop] = Util.formatNum(find.rate) + '%'
                if (max[column.prop]['value'] < find.rate) {
                  max[column.prop] = {
                    value: find.rate,
                    name: result.name,
                    assistId: result.assistId
                  }
                }
              } else {
                result[column.prop] = '0.00%'
              }
            })
            return result
          })

          // 补充total列
          // total最大值
          max['total'] = {
            value: 0,
            name: this.assist.data[0].name,
            assistId: this.assist.data[0].assistId
          }
          let columnTotal = 0
          this.assist.data.forEach(item => {
            item.total = '0.00%'
            for (let i in assist.total) {
              if (i === item.name) {
                item.total = Util.formatNum(assist.total[i]) + '%'
                columnTotal += assist.total[i]
                if (max['total']['value'] < assist.total[i]) {
                  max['total'] = {
                    value: assist.total[i],
                    name: item.name,
                    assistId: item.assistId
                  }
                }
              }
            }
          })
          // 增加total行
          let totalData = { name: 'Total' }
          this.assist.columns.forEach(item => {
            let total = this.assist.data.reduce(
              (total, data) => total + parseFloat(data[item.prop]),
              0
            )
            totalData[item.prop] = Util.formatNum(total) + '%'
          })
          totalData.total = Util.formatNum(columnTotal) + '%'
          // this.assist.data.push(totalData)

          // 获取列的最大值
          this.assist.max = max
          // console.log(this.assist.max)
        })
        .finally(() => {
          this.assistLoading = false
        })
    },
    getRegions() {
      this.regionsLoading = false
      if (this.regionInline.channelId === -1) return
      this.regionsLoading = true
      analysisChannelApi
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
    isMaxVal(col, assistId) {
      return this.assist.max &&
        this.assist.max[col] &&
        this.assist.max[col]['assistId'] === assistId
        ? true
        : false
    },
    initData() {
      let makeData = size => {
        return new Array(size).fill(1).map((item, index) => {
          return {
            date: '2019-05-0' + (index + 1),
            value: Math.random() * 20000
          }
        })
      }
      let example = makeData(30)
      let example2 = makeData(30)
      this.trafficTrend = [example, example2]
    },
    makeDebounce() {
      this.debounceSearch = Util.debounce(this.getDataList, 250)
    },
    getGoalId(result) {
      this.formInline.goalId = result ? result.id : -1
    },
    getBreakDownChannel(result) {
      this.trafficBreakdownForm.channel = result
      this.changeBreakdownChannelChart()
    },
    getBreakDownRightChannel(result) {
      this.trafficBreakdownForm.rightChannel = result
      this.changeBreakdownRightChannelChart()
    },
    changeBreakdownChannelChart() {
      if (
        this.trafficBreakdown.leftAxis &&
        this.trafficBreakdown.leftAxis.length > 0
      ) {
        this.trafficBreakdown.leftAxis.forEach(item => {
          item.value = item[this.trafficBreakdownForm.channel]
        })
        this.justifyBreakdown()
      }
    },
    changeBreakdownRightChannelChart() {
      if (
        this.trafficBreakdown.rightAxis &&
        this.trafficBreakdown.rightAxis.length > 0
      ) {
        this.trafficBreakdown.rightAxis.forEach(item => {
          item.value = item[this.trafficBreakdownForm.rightChannel]
        })
        this.justifyBreakdown()
      }
    },
    justifyBreakdown() {
      let findLeft = this.trafficBreakdown.leftAxis.find(item => item.value > 0)
      let findRight = this.trafficBreakdown.rightAxis.find(
        item => item.value > 0
      )
      this.trafficBreakdown.isEmpty = !(findLeft || findRight)
    },
    getTraffciBreakdownDevice(result) {
      this.trafficBreakdownForm.device = result
      this.getTrafficBreakDown()
    },
    getBreakDownGoalId(result) {
      this.trafficBreakdownForm.goalId = result ? result.id : -1
      this.trafficBreakdownForm.goalName = result ? result.name : ''
      this.getTrafficBreakDown()
    },
    changeTrafficBreakdownType(result) {
      this.trafficBreakdownForm.type = result
      this.getTrafficBreakDown()
    },
    getTrafficTrendChannelId(result) {
      this.trafficTrendForm.channelId = result
      this.changeTrafficChannel()
    },
    changeTrafficChannel() {
      for (let trend in this.trafficTrend) {
        this.trafficTrend[trend].data.forEach(item => {
          item.value = item[this.trafficTrendForm.channelId] || 0
        })
      }
      this.trafficTrend = this.trafficTrend.concat()
    },
    changeTrafficTrendType(result) {
      this.trafficTrendForm.type = result
      this.getTrafficTrend()
    },
    getTraffciTrendDevice(result) {
      this.trafficTrendForm.device = result
      this.getTrafficTrend()
    },
    getConversionPathGoalId(result) {
      this.conversionPathForm.goalId = result ? result.id : -1
      this.getConversionPath()
    },
    getRegionChannelId(result) {
      this.regionInline.channelId = result ? result.id : -1
      this.getRegions()
    },
    getCampaignId(result) {
      this.assistForm.campaign = result ? result.id : -1
      this.getAssist()
    },
    changeTab(tab) {
      if (this.currentName !== tab.name) {
        this.currentName = tab.name
      }
    },
    changeTrafficDate(result) {
      if (result && result.titleCur && result.titlePrev) {
        this.formInline.beginDate = result.titleCur[0]
        this.formInline.endDate = result.titleCur[1] || result.titleCur[0]
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

      this.getPdf('#reports_pdf', `ChannelAnalysis_${current}`, () => {
        this.isDownload = false
        document.getElementById('reports_pdf').parentNode.style.display = 'none'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.chooseBreakdown {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-left: 150px;
  margin-right: 0px;
}
.main-table {
  margin-top: 20px;
  ::v-deep .cell {
    word-break: break-word;
  }
  // ::v-deep .el-table__row:last-child {
  //   .cell span {
  //     font-weight: bold !important;
  //   }
  //   .greyColumn {
  //     background: #fff !important;
  //   }
  // }
  // ::v-deep .el-table__row {
  //   & > td:last-child {
  //     .cell span {
  //       font-weight: bold !important;
  //     }
  //   }
  // }
  ::v-deep .el-table--enable-row-hover {
    .el-table__body {
      tr {
        &:hover {
          & > td {
            &.greyColumn {
              background: #dfdfdf;
            }
          }
        }
      }
    }
  }
  ::v-deep .el-table__body tr.hover-row > td.greyColumn {
    background: #dfdfdf;
  }
  .max-val {
    color: #ef4136;
  }
}
</style>
