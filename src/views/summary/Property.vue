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
        <date-selector-for-report></date-selector-for-report>
        <hr class="reporthr" />
        <!-- performance snapshot -->
        <div class="plan-reports-con">
          <p class="plan-reports-title">{{ $t('property.performanceSnap') }}</p>
          <goal-selector @getResult="getGoalId" :defaultValue="goalId">
          </goal-selector>
          <div class="plan-reports-result mr20">
            <!-- unique conversion -->
            <div class="plan-reports-result-inner">
              <div class="plan-reports-result-inner_title">
                {{ $t('property.uniqueConv') }}
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content" style="width: 200px;">
                    {{ $t('property.uniqueConv') }}
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
              <div class="plan-reports-result-inner_title">
                {{ $t('property.uniqueCustomers') }}
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content" style="width: 200px;">
                    {{ $t('property.uniqueCustomers') }}
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
              <div class="plan-reports-result-inner_title">
                {{ $t('property.lastMileRatio') }}
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content" style="width: 200px;">
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
              <div class="plan-reports-result-inner_title">
                {{ $t('property.timeToConvert') }}
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content" style="width: 200px;">
                    {{ $t('property.timeToConvert') }}
                  </div>
                  <span class="fa fa-question-circle-o"></span>
                </el-tooltip>
              </div>
              <div class="report-convert">
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
          <p class="plan-reports-title">{{ $t('property.trafficSnapShot') }}</p>
          <div class="plan-reports-result">
            <!-- unique visits -->
            <div class="plan-reports-result-inner" style="flex:2;">
              <div class="plan-reports-result-inner_title">
                {{ $t('property.uniqueVisit') }}
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content" style="width: 200px;">
                    {{ $t('property.uniqueVisit') }}
                  </div>
                  <span class="fa fa-question-circle-o"></span>
                </el-tooltip>
              </div>
            </div>
            <!-- unique visitors -->
            <div class="plan-reports-result-inner">
              <div class="plan-reports-result-inner_title">
                {{ $t('property.uniqueVisit') }}
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content" style="width: 200px;">
                    {{ $t('property.uniqueVisit') }}
                  </div>
                  <span class="fa fa-question-circle-o"></span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="消息中心">
        <div slot="label">{{ $t('property.title') }}</div>
        消息中心</el-tab-pane
      >
    </el-tabs>
  </div>
</template>

<script>
import DateSelectorForReport from '@/components/dateSelectorForReport/Index.vue'
import GoalSelector from '@/components/selector/GoalSelector'
export default {
  name: 'propertySummary',
  components: {
    DateSelectorForReport,
    GoalSelector
  },
  data() {
    return {
      loading: false,
      activeName: 'summary',
      goalId: -1
    }
  },
  created() {
    this.initData()
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
