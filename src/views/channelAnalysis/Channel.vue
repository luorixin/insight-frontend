<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('channel.title') }}</h1>
        </div>
      </div>
    </div>
    <el-tabs
      v-model="activeName"
      type="card"
      class="report-pane"
      @tab-click="changeTab"
    >
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
                <div class="report-result-inner__graph" style="height: 405px;">
                  <div id="traffic_breakdown_map">
                    <bar-multi-axis-chart
                      :datas="trafficBreakdown"
                      :height="405"
                      :color="trafficBreakdownColor"
                    ></bar-multi-axis-chart>
                  </div>
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
          <div class="plan-reports-con mr20">
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
  </div>
</template>

<script>
import DateSelectorForReport from '@/components/dateSelectorForReport/Index.vue'
import GoalSelector from '@/components/selector/GoalSelector'
import NoresultReport from '@/components/report/Noresult.vue'
import LineTrendChart from '@/components/charts/LineTrendChart'
import BarMultiAxisChart from '@/components/charts/BarMultiAxisChart'
import RegionWorldChart from '@/components/charts/RegionWorldChart'
export default {
  name: 'channelAnalysis',
  components: {
    DateSelectorForReport,
    GoalSelector,
    NoresultReport,
    LineTrendChart,
    BarMultiAxisChart,
    RegionWorldChart
  },
  data() {
    return {
      loading: false,
      activeName: 'summary',
      currentName: 'summary',
      goalId: -1,
      breakdownOpt: 'channel',
      trafficTrendOpt: 'channel',
      trafficTrend: [],
      trafficTrendColor: [],
      trafficBreakdown: [],
      trafficBreakdownColor: ['#8D7B7B', '#4484CF'],
      regionsData: [],
      regionsDataColor: ['#EF4136']
    }
  },
  created() {
    this.initData()
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
  methods: {
    initData() {
      this.loading = false
    },
    getGoalId(result) {
      this.formInline.goalId = result ? result.id : -1
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
    }
  }
}
</script>

<style scoped></style>
