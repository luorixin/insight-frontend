<template>
  <div>
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
            <el-form-item :label="$t('funnels.name')" prop="name">
              <el-input
                v-model="ruleForm.name"
                :placeholder="$t('funnels.namePlaceholder')"
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
            <el-form-item :label="$t('funnels.selectEvent')">
              <event-drag
                v-if="!loading"
                :results="ruleForm.steps"
                @changeEvent="eventChange"
              ></event-drag>
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
import * as funnelsApi from '@/api/funnels'
import EventDrag from './EventDrag.vue'
import Util from '@/utils'
import { STATUS, convertType } from '@/utils/constant'
export default {
  name: 'funnelModal',
  components: {
    EventDrag
  },
  props: {
    title: {
      type: String,
      default: 'Create a Funnel'
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
        this.funnelId = newName
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
  data() {
    return {
      activeName: 'basic',
      funnelId: null,
      statusList: STATUS,
      ruleForm: {
        name: null,
        status: null,
        steps: []
      },
      baseData: {
        name: null,
        status: '1',
        steps: []
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('funnels.namePlaceholder'),
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
      if (this.funnelId) {
        funnelsApi
          .toUpdate(this.funnelId)
          .then(data => {
            this.ruleForm = Object.assign({}, data.funnel)
            this.ruleForm.status += ''
            this.ruleForm.steps.forEach(item => (item.id = item.eventId))
          })
          .finally(() => {
            this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
            this.loading = false
          })
      } else {
        funnelsApi
          .toCreate()
          .then(data => {
            this.ruleForm = Object.assign({}, this.baseData)
          })
          .finally(() => {
            this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
            this.loading = false
          })
      }
    },
    closeModal() {
      this.$emit('getResult', false)
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid, model) => {
        if (valid) {
          this.loading = true
          let promise = null
          if (this.funnelId) {
            promise = funnelsApi.update(this.ruleForm)
          } else {
            promise = funnelsApi.create(this.ruleForm)
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
    },
    eventChange(results) {
      if (results && results.length > 0) {
        this.ruleForm.steps = results.map((item, index) => {
          return {
            step: index + 1,
            funnelId: this.funnelId,
            eventId: item.id,
            eventName: item.eventName
          }
        })
      }
    }
  }
}
</script>

<style lang="scss"></style>
