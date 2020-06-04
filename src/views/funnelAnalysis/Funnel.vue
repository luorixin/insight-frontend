<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('funnelAnalysis.title') }}</h1>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" type="card" class="report-pane">
      <el-tab-pane name="summary">
        <div slot="label">{{ $t('funnelAnalysis.tabTitle') }}</div>
        <div>
          <date-selector-for-report :needVs="false"></date-selector-for-report>
          <hr class="reporthr" />
          <div class="plan-reports-con mr20">
            <div class="plan-reports-result">
              <div class="plan-reports-result-inner" style="height: 600px;">
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
                    :defaultValue="funnelId"
                  >
                  </funnel-selector>
                </div>
              </div>
            </div>
            <div class="plan-reports-result mr15">
              <div class="plan-reports-result-inner" style="height: 275px;">
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
                    style="width: 175px;"
                    :disabled="true"
                    :value="$t('funnelAnalysis.allFunnels')"
                  >
                    <i slot="prefix" class="reddot"></i>
                  </el-input>
                  <div style="margin: 0 20px;">{{ $t('common.vs') }}</div>
                  <funnel-selector
                    @getResult="getFunnelId"
                    :defaultValue="funnelId"
                    :needdot="true"
                  >
                  </funnel-selector>
                </div>
                <div class="plan-reports-result-inner__breakdown mr20">
                  <div class="breakdown_detail">
                    <div>{{ $t('funnelAnalysis.repeatVisitor') }}</div>
                    <div>30.00%</div>
                  </div>
                  <div class="breakdown_line"></div>
                  <div class="breakdown_detail">
                    <div>20.00%</div>
                  </div>
                </div>
                <div class="plan-reports-result-inner__breakdown">
                  <div class="breakdown_detail">
                    <div>{{ $t('funnelAnalysis.frequencyVisit') }}</div>
                    <div>1.16</div>
                  </div>
                  <div class="breakdown_line"></div>
                  <div class="breakdown_detail">
                    <div>1.00</div>
                  </div>
                </div>
                <div class="plan-reports-result-inner__breakdown">
                  <div class="breakdown_detail">
                    <div>{{ $t('funnelAnalysis.avgPageView') }}</div>
                    <div>1.45</div>
                  </div>
                  <div class="breakdown_line"></div>
                  <div class="breakdown_detail">
                    <div>1.98</div>
                  </div>
                </div>
                <div class="plan-reports-result-inner__breakdown">
                  <div class="breakdown_detail">
                    <div>{{ $t('funnelAnalysis.avgTimeSpan') }}</div>
                    <div>00:02:24</div>
                  </div>
                  <div class="breakdown_line"></div>
                  <div class="breakdown_detail">
                    <div>00:02:01</div>
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
import FunnelSelector from '@/components/selector/FunnelSelector'
import NoresultReport from '@/components/report/Noresult.vue'
export default {
  name: 'funnelAnalysis',
  components: {
    DateSelectorForReport,
    FunnelSelector
  },
  data() {
    return {
      loading: false,
      activeName: 'summary',
      funnelId: -1,
      breakdownOpt: 'channel',
      trafficTrendOpt: 'channel'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.loading = false
    },
    getFunnelId(result) {
      this.formInline.funnelId = result ? result.id : -1
    }
  }
}
</script>

<style scoped></style>
