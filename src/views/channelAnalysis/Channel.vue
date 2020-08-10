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
                style="flex:2;height: 500px;"
              >
                <!-- Traffic Breakdown -->
                <div class="plan-reports-result-inner_title">
                  {{ $t('channel.breakdown') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('channel.breakdownTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <div class="plan-reports-result-inner__opt">
                  <el-radio-group
                    v-model="trafficBreakdownForm.type"
                    @change="changeTrafficBreakdownType"
                    size="small"
                  >
                    <el-radio-button label="channel">
                      {{ $t('channel.channel') }}
                    </el-radio-button>
                    <el-radio-button label="device">
                      {{ $t('channel.device') }}
                    </el-radio-button>
                  </el-radio-group>
                  <el-select
                    v-model="trafficBreakdownForm.channel"
                    @change="getBreakDownChannel"
                    :placeholder="$t('common.selOption')"
                  >
                    <el-option
                      v-for="item in channelTypes"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                  <span style="margin-right: 15px;line-height: 30px;">{{
                    $t('common.vs')
                  }}</span>
                  <goal-selector
                    @getResult="getBreakDownGoalId"
                    :defaultValue="trafficBreakdownForm.goalId"
                  >
                  </goal-selector>
                </div>
                <div class="report-result-inner__graph" style="height: 375px;">
                  <div id="traffic_breakdown_map">
                    <bar-multi-axis-chart
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
                  <ul>
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
                  <channel-selector
                    v-show="trafficTrendForm.type === 'channel'"
                    @getResult="getTrafficTrendChannelId"
                    :defaultValue="trafficTrendForm.channelId"
                  >
                  </channel-selector>

                  <el-select
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
                  </el-select>
                </div>
                <div class="report-result-inner__graph" style="height: 335px;">
                  <div id="traffic_trend_map">
                    <line-trend-chart :datas="trafficTrend"></line-trend-chart>
                  </div>
                </div>
              </div>
            </div>
            <div class="plan-reports-result mr15">
              <div
                class="plan-reports-result-inner"
                v-loading="assistLoading"
                style="flex:2;height: 650px;"
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
                    :defaultValue="assistForm.campaignId"
                  >
                  </campaigns-selector>
                </div>
                <noresult-report></noresult-report>
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
                <div class="plan-reports-result-inner__tablelike mr10">
                  <div class="tablelike_title">
                    <div style="text-align: center;">
                      {{ $t('channel.conversion') }}
                    </div>
                    <div></div>
                    <div>{{ $t('channel.campaign') }}</div>
                  </div>
                  <div
                    class="tablelike_tr"
                    v-for="i in 10"
                    :key="'conversion_' + i"
                  >
                    <div class="tablelike_td" style="flex-direction: column;">
                      <p class="mainTitle">20.42%</p>
                      <p>6,788/32,247</p>
                    </div>
                    <div class="tablelike_td">
                      <el-progress
                        :show-text="false"
                        :stroke-width="15"
                        :percentage="70"
                      ></el-progress>
                    </div>
                    <div class="tablelike_td">
                      <p>Baidu Brand Zone</p>
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
              <div class="plan-reports-result-inner" style="height: 500px;">
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
      trafficBreakdownForm: {
        type: 'channel',
        goalId: -1,
        channel: 'conversions'
      },
      trafficTrendForm: {
        type: 'channel',
        device: 'Computer',
        channelId: -1
      },
      conversionPathForm: {
        goalId: -1
      },
      assistForm: {
        campaignId: -1
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
      trafficBreakdown: null,
      trafficBreakdownColor: ['#8D7B7B', '#4484CF'],
      trafficSource: [],
      conversionPaths: [],
      assist: null,
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
    this.initData()
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
          this.trafficBreakdown = [] //Object.assign({}, trafficBreakdown)
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
          this.trafficTrend = trafficTrend.concat()
        })
        .finally(() => {
          this.trafficTrendLoading = false
        })
    },
    getConversionPath() {
      this.conversionPathLoading = false
      if (this.conversionPathForm.goalId === -1) return
      this.conversionPathLoading = true
      let form = Object.assign({}, this.formInline, this.conversionPathForm)
      analysisChannelApi
        .conversionPath(form)
        .then(conversionPath => {
          this.conversionPaths = conversionPath.concat()
        })
        .finally(() => {
          this.conversionPathLoading = false
        })
    },
    getAssist() {
      this.assistLoading = false
      if (this.assistForm.campaignId === -1) return
      this.assistLoading = true
      let form = Object.assign({}, this.formInline, this.assistForm)
      analysisChannelApi
        .assistAnalysis(form)
        .then(assist => {
          this.assist = Object.assign({}, assist)
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
          // this.regionsData = regions
        })
        .finally(() => {
          this.regionsLoading = false
        })
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
      // this.getTrafficBreakDown()
    },
    getBreakDownGoalId(result) {
      this.trafficBreakdownForm.goalId = result ? result.id : -1
      this.getTrafficBreakDown()
    },
    changeTrafficBreakdownType(result) {
      this.trafficBreakdownForm.type = result
      this.getTrafficBreakDown()
    },
    getTrafficTrendChannelId(result) {
      this.trafficTrendForm.channelId = result ? result.id : -1
      this.getTrafficTrend()
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
      this.assistForm.campaignId = result ? result.id : -1
      this.getAssist()
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

<style scoped></style>
