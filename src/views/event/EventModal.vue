<template>
  <div ref="modalRef">
    <div class="slide-close" @click="closeModal">
      <i class="fa fa-close"></i>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="title" name="basic">
        <div class="slide-content" v-loading="loading">
          <el-form
            :model="ruleForm"
            ref="ruleForm"
            :rules="rules"
            label-width="200px"
            label-position="left"
            class="ruleForm"
          >
            <el-form-item :label="$t('event.name')" prop="eventName">
              <el-input
                v-model="ruleForm.eventName"
                :maxlength="100"
                :placeholder="$t('event.namePlaceholder')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.status')">
              <el-select
                v-model="ruleForm.status"
                :placeholder="$t('common.status')"
                class="handleSelect"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('event.nature')" prop="eventType">
              <el-select
                v-model="ruleForm.eventType"
                :filterable="true"
                :placeholder="$t('common.selOption')"
                class="handleSelect"
              >
                <el-option
                  v-for="item in natureList"
                  :key="'nature_' + item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <hr style="margin:0 -20px 20px -20px" />
            <el-form-item :label="$t('event.trackingSettings')">
              <el-radio-group v-model="ruleForm.tackingType">
                <el-radio :label="0">
                  {{ $t('event.trackInsight') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" style="width: 200px;">
                      {{ $t('event.trackInsightTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </el-radio>
                <el-radio :label="1">
                  {{ $t('event.trackUniversal') }}
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content" style="width: 200px;">
                      {{ $t('event.trackUniversalTip') }}
                    </div>
                    <span class="fa fa-question-circle-o"></span>
                  </el-tooltip>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="ruleForm.tackingType === 0">
              <insight-tag-table
                :results="ruleForm.tagList"
                :currencyList="currencyList"
                :tagTypeList="tagTypeList"
                @getResult="getInsightTag"
              ></insight-tag-table>
            </el-form-item>
            <el-form-item v-show="ruleForm.tackingType === 1">
              <el-select
                v-model="ruleForm.filterType"
                :placeholder="$t('common.selOption')"
                class="handleSelect"
              >
                <el-option
                  :label="$t('event.universalTable.filterTypeKeyword')"
                  value="k"
                >
                </el-option>
                <el-option
                  :label="$t('event.universalTable.filterTypeRegular')"
                  value="r"
                >
                </el-option>
              </el-select>
              <p style="margin-top: 10px;">
                {{ $t('event.universalTable.keywordsPerLine') }}
              </p>
              <el-input
                type="textarea"
                :rows="5"
                :placeholder="$t('event.universalTable.keywordsPerLineTip')"
                v-model="ruleForm.urls"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <p>
                {{ $t('event.universalTable.thirdParty') }}
              </p>
              <el-input
                type="textarea"
                :rows="5"
                :placeholder="$t('event.universalTable.keywordsPerLineTip')"
                v-model="ruleForm.javascripts"
              >
              </el-input>
            </el-form-item>
            <hr style="margin:0 -20px 20px -20px" />
            <el-form-item :label="$t('event.removeDup')">
              <el-radio-group v-model="ruleForm.deduplication">
                <el-radio :label="0">
                  {{ $t('event.removeDupDisable') }}
                </el-radio>
                <el-radio :label="1">
                  {{ $t('event.removeDupEnable') }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              style="margin-top: -10px;"
              v-show="ruleForm.deduplication === 1"
            >
              <p style="font-size: 12px;">
                {{ $t('event.removeDupEnableBase') }}
              </p>
              <el-select
                v-model="ruleForm.deduplicationType"
                :filterable="true"
                :placeholder="$t('common.selOption')"
                class="handleSelect"
              >
                <el-option
                  v-for="item in deduplicationTypeList"
                  :key="'deduplicationType_' + item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <hr style="margin:0 -20px 20px -20px" />
            <el-form-item :label="$t('event.isIncludedGoal')">
              <el-radio-group v-model="ruleForm.isGoal">
                <el-radio :label="0">
                  {{ $t('common.no') }}
                </el-radio>
                <el-radio :label="1">
                  {{ $t('common.yes') }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <hr style="margin:0 -20px 20px -20px" />
            <el-form-item :label="$t('event.isIncludedFunnel')">
              <el-radio-group v-model="ruleForm.isFunnel">
                <el-radio :label="0">
                  {{ $t('common.no') }}
                </el-radio>
                <el-radio :label="1">
                  {{ $t('common.yes') }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="slide-bottom">
      <el-button type="primary" @click="handleSave">{{
        $t('common.save')
      }}</el-button>
      <el-button type="cancel" @click="closeModal">{{
        $t('common.cancel')
      }}</el-button>
    </div>
  </div>
</template>

<script>
import * as eventsApi from '@/api/events'
import InsightTagTable from './InsightTagTable.vue'
import { mapState } from 'vuex'
import Util from '@/utils'
import {
  STATUS,
  NATURE_LIST,
  DEDUPLICATION_LIST,
  convertType
} from '@/utils/constant'
export default {
  name: 'eventModal',
  components: {
    InsightTagTable
  },
  props: {
    title: {
      type: String,
      default: 'Create an Event'
    },
    id: {
      type: Number,
      default: null
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    id: {
      handler(newName, oldName) {
        this.eventId = newName
      },
      immediate: true
    },
    visible: {
      handler(newName, oldName) {
        this.activeName = 'basic'
        newName && this.getDataList()
      },
      immediate: true
    }
  },
  computed: {
    ...mapState('user', ['currentClientId'])
  },
  data() {
    return {
      activeName: 'basic',
      eventId: null,
      statusList: STATUS,
      natureList: NATURE_LIST,
      deduplicationTypeList: DEDUPLICATION_LIST,
      events: [],
      currentsInsightTag: [],
      currencyList: [],
      tagTypeList: [],
      ruleForm: {
        eventName: null,
        eventType: null,
        tackingType: 0,
        filterType: 'k',
        status: '1',
        deduplication: 0,
        deduplicationType: '-2',
        isGoal: 0,
        isFunnel: 0,
        tagList: [],
        urls: null,
        javascripts: null
      },
      baseData: {
        eventName: null,
        eventType: null,
        tackingType: 0,
        filterType: 'k',
        status: '1',
        deduplication: 0,
        deduplicationType: '-2',
        isGoal: 0,
        isFunnel: 0,
        eventId: null,
        urls: null,
        javascripts: null
      },
      rules: {
        eventName: [
          {
            required: true,
            message: this.$t('event.namePlaceholder'),
            trigger: 'change'
          }
        ],
        eventType: [
          {
            required: true,
            message: this.$t('common.selOption'),
            trigger: 'change'
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    getDataList() {
      this.loading = true
      if (this.eventId) {
        eventsApi
          .toUpdate(this.eventId)
          .then(data => {
            this.tagTypeList = data.tagTypeList.concat()
            this.currencyList = data.currencyList.concat()
            this.ruleForm = Object.assign({}, data.eventInfoModel)
            this.specialHanlder()
          })
          .finally(() => {
            this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
            this.loading = false
          })
      } else {
        eventsApi
          .toCreate()
          .then(data => {
            this.tagTypeList = data.tagTypeList.concat()
            this.currencyList = data.currencyList.concat()
            this.ruleForm = Object.assign(
              {},
              data.eventInfoModel,
              this.baseData
            )
            this.specialHanlder()
          })
          .finally(() => {
            this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
            this.loading = false
          })
      }
    },
    specialHanlder() {
      this.ruleForm.deduplicationType += ''
      this.ruleForm.status = this.ruleForm.status ? '1' : '0'
      this.ruleForm.isFunnel = this.ruleForm.isFunnel ? 1 : 0
      this.ruleForm.isGoal = this.ruleForm.isGoal ? 1 : 0
    },
    closeModal() {
      this.$emit('getResult', false)
    },
    getInsightTag(results) {
      this.ruleForm.tagList = results.concat()
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid, model) => {
        if (valid) {
          if (this.ruleForm.tackingType === 0) {
            if (this.ruleForm.tagList.length > 0) {
              let isEmptyName = this.ruleForm.tagList.find(item => {
                return Util.isEmpty(item.name)
              })
              if (typeof isEmptyName !== 'undefined') {
                this.$message.error(this.$t('event.insightTagTable.fillName'))
                this.$refs.modalRef.parentNode.scrollTop = 250
                return
              }
            }
          }
          this.loading = true
          let promise = null
          let params = Object.assign({}, this.ruleForm)
          params.specialHanlder = parseInt(params.specialHanlder)
          params.status = params.status === '1' ? true : false
          params.isFunnel = params.isFunnel === 1 ? true : false
          params.isGoal = params.isGoal === 1 ? true : false
          params.oldClientId = this.currentClientId
          if (this.eventId) {
            promise = eventsApi.update(params)
          } else {
            promise = eventsApi.create(params)
          }
          promise
            .then(data => {
              this.$emit('getResult', true)
              this.$message.success(this.$t('common.optSuccess'))
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>
