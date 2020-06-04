<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('channel.title') }}</h1>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" type="card" class="report-pane">
      <el-tab-pane name="summary">
        <div slot="label">{{ $t('channel.title') }}</div>
        <div>
          <date-selector-for-report :needVs="false"></date-selector-for-report>
          <hr class="reporthr" />
          <!-- traffic snapshot -->
          <div class="plan-reports-con mr20">
            <div class="plan-reports-result">
              <div
                class="plan-reports-result-inner"
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
              </div>
              <div class="plan-reports-result-inner" style="height: 500px;">
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
                <div class="report-flex-middle">
                  <goal-selector @getResult="getGoalId" :defaultValue="goalId">
                  </goal-selector>
                </div>
                <div class="report-result-inner__rank">
                  <ul>
                    <li v-for="item in 10" :key="'rank_' + item">
                      <span class="rank_ico">{{ item }}</span>
                      <label>http://www.baidu.com</label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- trafic trend -->
            <div class="plan-reports-result mr15">
              <div class="plan-reports-result-inner" style="height: 460px;">
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
                  <el-radio-group v-model="trafficTrendOpt" size="small">
                    <el-radio-button label="channel">
                      {{ $t('channel.channel') }}
                    </el-radio-button>
                    <el-radio-button label="device">
                      {{ $t('channel.device') }}
                    </el-radio-button>
                  </el-radio-group>
                  <goal-selector @getResult="getGoalId" :defaultValue="goalId">
                  </goal-selector>
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
                <noresult-report></noresult-report>
              </div>
              <div class="plan-reports-result-inner" style="height: 650px;">
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
                <p>
                  {{ $t('channel.goal') }}:
                  <b style="font-weight: bold;">Booking</b>
                </p>
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
import NoresultReport from '@/components/report/Noresult.vue'
import LineTrendChart from '@/components/charts/LineTrendChart'
export default {
  name: 'channelAnalysis',
  components: {
    DateSelectorForReport,
    GoalSelector,
    NoresultReport,
    LineTrendChart
  },
  data() {
    return {
      loading: false,
      activeName: 'summary',
      goalId: -1,
      breakdownOpt: 'channel',
      trafficTrendOpt: 'channel',
      trafficTrend: [],
      trafficTrendColor: []
    }
  },
  created() {
    this.initData()
    let example = [
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
    this.trafficTrend = [example[0], example[0]]
  },
  methods: {
    initData() {
      this.loading = false
    },
    getGoalId(result) {
      this.formInline.goalId = result ? result.id : -1
    }
  }
}
</script>

<style scoped></style>
