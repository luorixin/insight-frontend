<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('funnelAnalysis.title') }}</h1>
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
      <el-tab-pane name="funnel">
        <div slot="label">{{ $t('funnelAnalysis.tabTitle') }}</div>
        <div id="funnel">
          <date-selector-for-report
            :needVs="false"
            reportTitle="FunnelAnalysis"
            @change="changeFunnelDate"
          ></date-selector-for-report>
          <hr class="reporthr" />
          <div class="plan-reports-con mr20">
            <div class="plan-reports-result">
              <div
                class="plan-reports-result-inner"
                v-loading="funnelLoading"
                style="height: 600px;"
              >
                <!-- Funnel -->
                <div class="plan-reports-result-inner_title">
                  {{ $t('funnelAnalysis.funnel') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('funnelAnalysis.funnelTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <div class="report-flex-middle">
                  <funnel-selector
                    @getResult="getFunnelId"
                    :defaultValue="funnelForm.funnelId"
                  >
                  </funnel-selector>
                </div>
                <div class="report-result-inner__graph" style="height: 475px;">
                  <div id="funnel_map">
                    <noresult-report
                      v-show="!funnelData || funnelData.length === 0"
                    ></noresult-report>
                    <funnel-chart
                      v-if="funnelData && funnelData.length > 0"
                      :datas="funnelData"
                      :height="475"
                      :color="funnelDataColor"
                    ></funnel-chart>
                  </div>
                </div>
              </div>
            </div>
            <div class="plan-reports-result mr15">
              <div
                class="plan-reports-result-inner"
                v-loading="breakdownLoading"
                style="height: 275px;"
              >
                <!-- Funnel Breakdown -->
                <div class="plan-reports-result-inner_title">
                  {{ $t('funnelAnalysis.breakdown') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" class="tooltip-content">
                      {{ $t('funnelAnalysis.breakdownTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </div>
                <div class="report-flex-middle">
                  <el-input
                    style="width: 189px;"
                    :disabled="true"
                    :value="$t('funnelAnalysis.allGoals')"
                  >
                    <i slot="prefix" class="reddot"></i>
                  </el-input>
                  <div style="margin: 0 20px;">{{ $t('common.vs') }}</div>
                  <funnel-selector
                    @getResult="getBreakdownFunnelId"
                    :defaultValue="breakdownForm.funnelId"
                    :needdot="true"
                  >
                  </funnel-selector>
                </div>
                <div class="plan-reports-result-inner__breakdown mr20">
                  <div class="breakdown_detail">
                    <div>{{ $t('funnelAnalysis.repeatVisitor') }}</div>
                    <div>
                      {{
                        breakdownData.allsite.repeatVisitorRate | toMoneyFilter
                      }}%
                    </div>
                  </div>
                  <div class="breakdown_line"></div>
                  <div class="breakdown_detail">
                    <div>
                      {{
                        breakdownData.funnel.repeatVisitorRate | toMoneyFilter
                      }}%
                    </div>
                  </div>
                </div>
                <div class="plan-reports-result-inner__breakdown">
                  <div class="breakdown_detail">
                    <div>{{ $t('funnelAnalysis.frequencyVisit') }}</div>
                    <div>
                      {{ breakdownData.allsite.frequencVisits | toMoneyFilter }}
                    </div>
                  </div>
                  <div class="breakdown_line"></div>
                  <div class="breakdown_detail">
                    <div>
                      {{ breakdownData.funnel.frequencVisits | toMoneyFilter }}
                    </div>
                  </div>
                </div>
                <div class="plan-reports-result-inner__breakdown">
                  <div class="breakdown_detail">
                    <div>{{ $t('funnelAnalysis.avgPageView') }}</div>
                    <div>
                      {{
                        breakdownData.allsite.averagePageView | toMoneyFilter
                      }}
                    </div>
                  </div>
                  <div class="breakdown_line"></div>
                  <div class="breakdown_detail">
                    <div>
                      {{ breakdownData.funnel.averagePageView | toMoneyFilter }}
                    </div>
                  </div>
                </div>
                <div class="plan-reports-result-inner__breakdown">
                  <div class="breakdown_detail">
                    <div>{{ $t('funnelAnalysis.avgTimeSpan') }}</div>
                    <div>
                      {{
                        breakdownData.allsite.averageTimeSpan | toTimeSpanFilter
                      }}
                    </div>
                  </div>
                  <div class="breakdown_line"></div>
                  <div class="breakdown_detail">
                    <div>
                      {{
                        breakdownData.funnel.averageTimeSpan | toTimeSpanFilter
                      }}
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
            reportTitle="FunnelAnalysis"
            @change="changeAudienceDate"
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
                  <funnel-selector
                    @getResult="getRegionFunnelId"
                    :defaultValue="regionInline.funnelId"
                    :needdot="false"
                  >
                  </funnel-selector>
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
import FunnelSelector from '@/components/selector/FunnelSelector'
import NoresultReport from '@/components/report/Noresult.vue'
import FunnelChart from '@/components/charts/FunnelChart'
import RegionWorldChart from '@/components/charts/RegionWorldChart'
import MyHeader from '@/components/common/Header'
import Util from '@/utils'
import exportUtil from '@/utils/exportUtil'
import * as analysisFunnelApi from '@/api/analysisFunnel'
import {
  ENUM_DATE,
  CHANNEL_TYPE,
  DEVICE_TYPE,
  convertType
} from '@/utils/constant'
export default {
  name: 'funnelAnalysis',
  components: {
    DateSelectorForReport,
    FunnelSelector,
    FunnelChart,
    RegionWorldChart,
    MyHeader,
    NoresultReport
  },
  data() {
    return {
      funnelLoading: false,
      breakdownLoading: false,
      regionsLoading: false,
      isDownload: false,
      activeName: 'funnel',
      currentName: 'funnel',
      breakdownOpt: 'channel',
      trafficTrendOpt: 'channel',
      funnelForm: {
        funnelId: -1
      },
      breakdownForm: {
        funnelId: -1
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
        funnelId: -1
      },
      funnelData: [],
      funnelDataColor: ['#EF4136', '#AF0400', '#590E0E'],
      breakdownData: {
        allsite: {},
        funnel: {}
      },
      regionsData: [],
      regionsDataColor: ['#EF4136']
    }
  },
  computed: {
    loading() {
      return this.breakdownLoading && this.funnelLoading && this.regionsLoading
    }
  },
  created() {
    this.makeDebounce()
    // this.initData()
  },
  methods: {
    getDataList() {
      this.getFunnelData()
      this.getBreakdownData()
    },
    getFunnelData() {
      this.funnelLoading = false
      if (this.funnelForm.funnelId === -1) return
      this.funnelLoading = true
      let form = Object.assign({}, this.formInline, this.funnelForm)
      analysisFunnelApi
        .detail(form)
        .then(data => {
          this.funnelData = []
          if (data && data.length > 0) {
            let _makeOthers = (list, otherName = 'Other') => {
              let max = 5
              let result = list || []
              if (list && list.length > max) {
                result = list.slice(0, max - 1)
                let last = { page_cnt: 0, rate: 0, page_name: otherName }
                let lastArr = list.slice(max - 1)
                lastArr.forEach(item => {
                  last.page_cnt += item.page_cnt
                  last.rate = (last.rate * 100 + item.rate * 100) / 100
                })
                result.push(last)
              }
              return result
            }
            this.funnelData = data.map(item => {
              let modify = []
              item.entrance = _makeOthers(item.entrance)
              item.exit = _makeOthers(item.exit)
              return item
            })
          }
        })
        .finally(() => {
          this.funnelLoading = false
        })
    },
    getBreakdownData() {
      this.breakdownLoading = false
      if (this.breakdownForm.funnelId === -1) return
      this.breakdownLoading = true
      let form = Object.assign({}, this.formInline, this.breakdownForm)
      analysisFunnelApi
        .breakdown(form)
        .then(data => {
          this.breakdownData = Object.assign({}, data)
        })
        .finally(() => {
          this.breakdownLoading = false
        })
    },
    getRegions() {
      this.regionsLoading = false
      if (this.regionInline.funnelId === -1) return
      this.regionsLoading = true
      analysisFunnelApi
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
      this.funnelData = [
        {
          totalEvents: 35287,
          eventName: 'Newsletter',
          next: {
            'Organic Search': 1308000,
            Direct: 844000,
            Social: 998000,
            Referral: 1250000,
            Display: 612000,
            'Paid Search': 1512000,
            Others: 509000
          },
          Exit: {
            'signin.html': 687,
            'store.html': 354,
            'basket.html': 267
          }
        },
        {
          totalEvents: 23478,
          eventName: 'Enquiry',
          next: {
            'Organic Search': 130800,
            Direct: 854000,
            Social: 998000,
            Referral: 125000,
            Display: 612000,
            'Paid Search': 1512000,
            Others: 509000
          },
          Exit: {
            'signin.html': 687,
            'store.html': 354,
            'basket.html': 267
          }
        },
        {
          totalEvents: 11695,
          eventName: 'Booking',
          next: {
            'Organic Search': 130800,
            Direct: 844000,
            Social: 998000,
            Referral: 1250000,
            Display: 612000,
            'Paid Search': 1512000,
            Others: 509000
          },
          Exit: {
            'signin.html': 687,
            'store.html': 354,
            'basket.html': 267
          }
        }
      ]
    },
    makeDebounce() {
      this.debounceSearch = Util.debounce(this.getDataList, 250)
      this.debounceGetRegions = Util.debounce(this.getRegions, 250)
    },
    getFunnelId(result) {
      this.funnelForm.funnelId = result ? result.id : -1
      this.getFunnelData()
    },
    getBreakdownFunnelId(result) {
      this.breakdownForm.funnelId = result ? result.id : -1
      this.getBreakdownData()
    },
    getRegionFunnelId(result) {
      this.regionInline.funnelId = result ? result.id : -1
      this.debounceGetRegions()
    },
    changeTab(tab) {
      if (this.currentName !== tab.name) {
        this.currentName = tab.name
      }
    },
    changeFunnelDate(result) {
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
        this.debounceGetRegions()
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

      this.getPdf('#reports_pdf', `FunnelAnalysis_${current}`, () => {
        this.isDownload = false
        document.getElementById('reports_pdf').parentNode.style.display = 'none'
      })
    }
  }
}
</script>

<style scoped></style>
