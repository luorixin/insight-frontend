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
            <el-form-item :label="$t('goals.name')" prop="name">
              <el-input
                v-model="ruleForm.name"
                :placeholder="$t('goals.namePlaceholder')"
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
            <el-form-item :label="$t('goals.selectConversion')" prop="eventId">
              <el-select
                v-model="ruleForm.eventId"
                :filterable="true"
                :placeholder="$t('common.selOption')"
                class="handleSelect"
              >
                <el-option
                  v-for="item in events"
                  :key="item.id"
                  :label="item.eventName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
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
import * as goalsApi from '@/api/goals'
import Util from '@/utils'
import { STATUS, convertType } from '@/utils/constant'
export default {
  name: 'goalModal',
  props: {
    title: {
      type: String,
      default: 'Create an Goal'
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
        this.goalId = newName
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
      goalId: null,
      statusList: STATUS,
      events: [],
      ruleForm: {
        name: null
      },
      baseData: {
        name: null,
        eventId: null,
        status: '1'
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('goals.namePlaceholder'),
            trigger: 'change'
          }
        ],
        eventId: [
          {
            required: true,
            message: this.$t('goals.eventId'),
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
      if (this.goalId) {
        goalsApi
          .toUpdate(this.goalId)
          .then(data => {
            this.events = data.eventList.concat()
            this.ruleForm = Object.assign({}, data.data)
            this.ruleForm.status += ''
          })
          .finally(() => {
            this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
            this.loading = false
          })
      } else {
        goalsApi
          .toCreate()
          .then(data => {
            this.events = data.concat()
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
          if (this.goalId) {
            promise = goalsApi.update(this.ruleForm)
          } else {
            promise = goalsApi.create(this.ruleForm)
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
