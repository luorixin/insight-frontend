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
            <el-form-item :label="$t('roles.name')" prop="name">
              <el-input
                v-model="ruleForm.name"
                :maxlength="100"
                :placeholder="$t('roles.namePlaceholder')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('roles.memo')">
              <el-input v-model="ruleForm.memo"></el-input>
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
            <el-form-item :label="$t('roles.purview')">
              <role-table
                style="width:90%;"
                :choose="ruleForm.purview"
                @chooseFn="choosePurview"
              ></role-table>
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
import * as rolesApi from '@/api/roles'
import RoleTable from '@/components/roleTable/Index.vue'
import Util from '@/utils'
import { ACCOUNT_STATUS, convertType } from '@/utils/constant'
export default {
  name: 'RoleModal',
  components: {
    RoleTable
  },
  props: {
    title: {
      type: String,
      default: 'Create a Role'
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
        this.roleId = newName
        newName && this.getDataList()
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
      roleId: null,
      statusList: ACCOUNT_STATUS,
      ruleForm: {
        name: null,
        status: null,
        memo: null,
        purview: null
      },
      chooses: {},
      baseData: {
        name: null,
        status: '1',
        memo: null,
        purview: null
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('roles.namePlaceholder'),
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
      if (this.roleId) {
        rolesApi
          .toUpdate(this.roleId)
          .then(data => {
            this.ruleForm = Object.assign({}, data.role)
            this.ruleForm.status += ''
            this.ruleForm.purview = Object.assign({}, data.role.purview)
            this.chooses = Object.assign({}, data.role.purview)
          })
          .finally(() => {
            this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
            this.loading = false
          })
      } else {
        // rolesApi
        //   .toCreate()
        //   .then(data => {
        //     this.ruleForm = Object.assign({}, this.baseData)
        //   })
        //   .finally(() => {
        //     this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        //     this.loading = false
        //   })
      }
    },
    closeModal() {
      this.$emit('getResult', false)
    },
    choosePurview(res) {
      if (res) {
        this.chooses = {}
        for (let key in res) {
          if (res[key]) {
            let keyArr = key.split('$$$')
            if (!this.chooses[keyArr[0]]) {
              this.chooses[keyArr[0]] = [keyArr[1]]
            } else {
              this.chooses[keyArr[0]].push(keyArr[1])
            }
          }
        }
        for (let k in this.chooses) {
          this.chooses[k] = this.chooses[k].join(',')
        }
      }
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid, model) => {
        if (valid) {
          this.loading = true
          let promise = null
          let subForm = Object.assign({}, this.ruleForm, {
            purview: this.chooses
          })
          if (this.roleId) {
            promise = rolesApi.doUpdate(subForm)
          } else {
            // promise = rolesApi.create(subForm)
          }
          promise &&
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
