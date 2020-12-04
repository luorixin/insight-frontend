<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('media.title') }}</h1>
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
        <div slot="label">{{ $t('media.title') }}</div>
        <div id="channel">
          <div style="position:relative;">
            <date-selector-for-report
              :needVs="false"
              reportTitle="MediaAnalysis"
              reportType="media"
              @change="changeTrafficDate"
            ></date-selector-for-report>
            <hr class="reporthr" />
            <div class="page-form">
              <div class="page-form__item">
                <label>{{ $t('media.channel') }}</label>
                <el-select
                  v-model="formInline.channelId"
                  @change="getPageChannel"
                  :placeholder="$t('common.selOption')"
                  style="width: 120px;"
                >
                  <el-option
                    v-for="item in channelIds"
                    v-show="!['1', '8'].includes(item.value)"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </div>
              <div class="page-form__item">
                <label>{{ $t('media.media') }}</label>
                <el-select
                  v-model="pageMedia"
                  v-loading="mediaLoading"
                  :multiple="true"
                  :multiple-limit="10"
                  collapse-tags
                  @change="getPageMedia"
                  :placeholder="$t('common.selOption')"
                  style="width: 180px;"
                >
                  <el-option
                    v-for="item in mediaList"
                    v-show="!['direct', 'others'].includes(item.value)"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </div>
            </div>
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
                    {{ $t('media.breakdown') }}
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content" class="tooltip-content">
                        {{ $t('media.breakdownTip') }}
                      </div>
                      <span class="fa fa-question-circle-o"></span>
                    </el-tooltip>
                  </div>
                  <div class="plan-reports-result-inner__opt">
                    <el-radio-group
                      v-model="trafficBreakdownForm.type"
                      @change="changeTrafficBreakdownType"
                      style="position:absolute; left:20px;"
                      size="small"
                    >
                      <el-radio-button label="channel">
                        {{ $t('media.channel') }}
                      </el-radio-button>
                      <el-radio-button label="device">
                        {{ $t('media.device') }}
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
                  <div
                    class="report-result-inner__graph"
                    style="height: 375px;"
                  >
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
                    {{ $t('media.trafficSource') }}
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content" class="tooltip-content">
                        {{ $t('media.trafficSourceTip') }}
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
                    {{ $t('media.trafficTrend') }}
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content" class="tooltip-content">
                        {{ $t('media.trafficTrendTip') }}
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
                        {{ $t('media.channel') }}
                      </el-radio-button>
                      <el-radio-button label="device">
                        {{ $t('media.device') }}
                      </el-radio-button>
                    </el-radio-group>
                    <!-- <channel-selector
                      v-show="trafficTrendForm.type === 'channel'"
                      @getResult="getTrafficTrendChannel"
                      :defaultValue="trafficTrendForm.channelId"
                    >
                    </channel-selector> -->
                    <el-select
                      v-model="trafficTrendForm.channel"
                      @change="getTrafficTrendChannel"
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
                  <div
                    class="report-result-inner__graph"
                    style="height: 335px;"
                  >
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
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!--
      <el-tab-pane name="audience">
        <div slot="label">{{ $t('audience.analysis') }}</div>
        <div id="audience">
          <date-selector-for-report
            :needVs="false"
            @change="changeAudienceDate"
            reportType="media"
            reportTitle="MediaAnalysis"
          ></date-selector-for-report>
          <hr class="reporthr" />
          <div class="plan-reports-con mr20">
            <div class="plan-reports-result">
              <div
                class="plan-reports-result-inner"
                v-loading="regionsLoading"
                style="height: 500px;"
              >
                
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
      -->
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
import * as analysisMediaApi from '@/api/analysisMedia'
import {
  ENUM_DATE,
  CHANNEL_TYPE,
  CHANNEL_NAME,
  CHANNEL_ID,
  DEVICE_TYPE,
  convertType
} from '@/utils/constant'
export default {
  name: 'mediaAnalysis',
  components: {
    DateSelectorForReport,
    GoalSelector,
    // ChannelSelector,
    NoresultReport,
    LineTrendChart,
    BarMultiAxisChart,
    // RegionWorldChart,
    MyHeader
  },
  data() {
    return {
      mediaLoading: false,
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
      channelIds: CHANNEL_ID,
      pageChannel: 'display',
      pageMedia: [],
      mediaList: [],
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
        channel: 'conversions'
      },
      formInline: {
        beginDate: null,
        endDate: null,
        dateType: null,
        channelId: '2',
        medias: ''
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
    async getDataList() {
      await this.getMediaList()
      this.getData()
    },
    getData() {
      if (this.pageMedia.length === 0) {
        this.$message.error(this.$t('common.selOption'))
        return
      }
      this.getTrafficBreakDown()
      this.getTrafficSource()
      this.getTrafficTrend()
    },
    async getMediaList() {
      return new Promise(resolve => {
        this.mediaLoading = true
        analysisMediaApi
          .list(this.formInline)
          .then(data => {
            let media_channel = data.find(res => {
              return res.channelid == this.formInline.channelId
            })
            if (media_channel && media_channel.mediaList.length > 0) {
              this.mediaList = media_channel.mediaList.map(item => {
                return { value: item, label: item }
              })
              this.pageMedia = media_channel.mediaList.slice(0, 10)
              this.formInline.medias = this.pageMedia.join(',')
            }
          })
          .finally(() => {
            this.mediaLoading = false
            resolve()
          })
      })
    },
    getTrafficBreakDown() {
      this.trafficBreakdownLoading = false
      // if (this.trafficBreakdownForm.goalId === -1) return
      if (this.formInline.medias.length === 0) return
      this.trafficBreakdownLoading = true
      let form = Object.assign({}, this.formInline, this.trafficBreakdownForm)
      analysisMediaApi
        .trafficBreakdown(form)
        .then(trafficBreakdown => {
          this.trafficBreakdown = { isEmpty: true }
          let leftAxis = trafficBreakdown[this.trafficBreakdownForm.type]
          let rightAxis = trafficBreakdown.goal

          let mediasName = this.pageMedia.map(item => {
            return { value: item, label: item }
          })
          let yAxis =
            this.trafficBreakdownForm.type === 'channel'
              ? mediasName
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
                  ? channel.mediaName
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
            return Object.assign(
              {
                value: value,
                axis: convertType(
                  this.trafficBreakdownForm.channel,
                  CHANNEL_TYPE
                ).label
              },
              channel
            )
          })

          // rightchannel 为conversion时候，取goal的conversions，否则取对应channel
          this.trafficBreakdown.rightAxis = yAxis.map(item => {
            let channel = rightAxis.find(channel => {
              let y =
                this.trafficBreakdownForm.type === 'channel'
                  ? channel.mediaName
                  : channel.device
              return y === item.label
            })
            let channelLeft = leftAxis.find(channel => {
              let y =
                this.trafficBreakdownForm.type === 'channel'
                  ? channel.mediaName
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
            return Object.assign(
              {
                value: value,
                axis: convertType(
                  this.trafficBreakdownForm.rightChannel,
                  CHANNEL_TYPE
                ).label
              },
              channel
            )
          })
          // console.log(this.trafficBreakdown)
          this.justifyBreakdown()
        })
        .finally(() => {
          this.trafficBreakdownLoading = false
        })
    },
    getTrafficSource() {
      this.trafficSourceLoading = true
      analysisMediaApi
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
        this.trafficTrendForm.channel === -1
      )
        return
      if (this.formInline.medias.length === 0) return
      this.trafficTrendLoading = true
      let form = Object.assign({}, this.formInline, this.trafficTrendForm)
      analysisMediaApi
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
                form.channel
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
    getPageChannel() {
      this.getDataList()
    },
    getPageMedia() {
      this.formInline.medias = this.pageMedia.join(',')
      this.getData()
    },
    _findListValue(list, key, value, special = '') {
      if (!list || list.length === 0) return null
      let find = list.find(item => special + item[key] === value)
      return find
    },
    getRegions() {
      this.regionsLoading = false
      if (this.regionInline.channelId === -1) return
      this.regionsLoading = true
      analysisMediaApi
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
          item.axis = convertType(
            this.trafficBreakdownForm.channel,
            CHANNEL_TYPE
          ).label
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
          item.axis = convertType(
            this.trafficBreakdownForm.rightChannel,
            CHANNEL_TYPE
          ).label
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
    getTrafficTrendChannel(result) {
      this.trafficTrendForm.channel = result
      this.changeTrafficChannel()
    },
    changeTrafficChannel() {
      for (let trend in this.trafficTrend) {
        if (this.trafficTrend[trend].data) {
          this.trafficTrend[trend].data.forEach(item => {
            item.value = item[this.trafficTrendForm.channel] || 0
          })
        }
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
    getRegionChannelId(result) {
      this.regionInline.channelId = result ? result.id : -1
      this.getRegions()
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

      this.getPdf('#reports_pdf', `MediaAnalysis_${current}`, () => {
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
</style>
