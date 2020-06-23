<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('goals.title') }}</h1>
        </div>
      </div>
    </div>
    <div class="container-wrapper">
      <div class="main-tool">
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">{{
          $t('goals.create')
        }}</el-button>
        <el-dropdown class="more-menu" @command="handleBatch">
          <el-button type="primary">
            {{ $t('goals.batch')
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="width: 140px;">
            <el-dropdown-item command="live">Active</el-dropdown-item>
            <el-dropdown-item command="paused">Pause</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-input
          :placeholder="$t('common.search')"
          v-model="formInline.search"
          class="input-search"
          @input="handleSearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearch(formInline.search)"
          ></el-button>
        </el-input>
      </div>
      <div class="main-table">
        <el-table
          :data="currentList"
          border
          class="table"
          ref="table"
          v-loading="loading"
          header-row-class-name="main-table"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            prop="id"
            :label="$t('goals.id')"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="name"
            :label="$t('goals.name')"
          ></el-table-column>
          <el-table-column
            prop="status"
            :label="$t('goals.status')"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.status ? 'success' : 'danger'">
                {{ scope.row.status ? 'Active' : 'Paused' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="modifyDate"
            :label="$t('goals.lastUpdate')"
            :formatter="dateFormater"
            width="160"
          >
          </el-table-column>
          <el-table-column
            :label="$t('goals.action')"
            width="120"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div
                class="fa-icon-box"
                @click="handleEdit(scope.$index, scope.row)"
              >
                <i class="fa fa-edit"></i>
              </div>
              <div
                class="fa-icon-box"
                @click="handleHistory(scope.$index, scope.row)"
              >
                <i class="fa fa-history"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="formInline.page"
            :page-sizes="pageSizes"
            :page-size="formInline.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="totalCount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      :title="$t('common.tip')"
      :visible.sync="tipVisible"
      width="300px"
      center
    >
      <div class="del-dialog-cnt">{{ $t('common.confirmTitle') }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipVisible = false">{{
          $t('common.cancel')
        }}</el-button>
        <el-button type="primary" @click="doChange" :loading="subLoading">{{
          $t('common.confirm')
        }}</el-button>
      </span>
    </el-dialog>

    <!-- 添加修改弹出框 -->
    <el-dialog
      :visible.sync="modal"
      custom-class="slide-box"
      @open="addBodyClass"
      @closed="clearBodyClass"
      :show-close="false"
      top="0"
    >
      <goal-modal
        @getResult="handleSet"
        :title="optTitle"
        :id="selectId"
        :visible="modal"
      >
      </goal-modal>
    </el-dialog>
  </div>
</template>

<script>
import * as goalsApi from '@/api/goals'
import GoalModal from './GoalModal'
import Util from '@/utils'
import moment from 'moment'
import {
  SYNC_STATUS,
  TRACKING_TYPE,
  convertType,
  PAGE_SIZES
} from '@/utils/constant.js'
export default {
  name: 'goalList',
  components: {
    GoalModal
  },
  data() {
    return {
      loading: false,
      subLoading: false,
      tipVisible: false,
      changeStatus: null,
      allList: [],
      currentList: [],
      formInline: {
        search: null,
        page: 1,
        pageSize: 10
      },
      totalCount: 0,
      pageSizes: PAGE_SIZES,
      optTitle: 'Create',
      modal: false,
      selectId: null,
      row: null,
      multipleSelection: []
    }
  },
  created() {
    this.getDataList()
    this.makeDebounce()
  },
  methods: {
    getDataList() {
      this.loading = true
      goalsApi
        .list(this.formInline.search)
        .then(data => {
          this.allList = data.concat()
          this.currentList = this.allList.slice(0, this.formInline.pageSize)
          this.totalCount = this.allList.length
        })
        .finally(() => {
          this.loading = false
        })
    },
    makeDebounce() {
      this.debounceSearch = Util.debounce(search => {
        this.loading = true
        if (search) {
          let reg = new RegExp(search, 'gi')
          this.currentList = this.allList.filter(item => {
            if (reg.test(item.eventId) || reg.test(item.name)) {
              reg.lastIndex = 0
              return true
            }
            return false
          })
        } else {
          this.currentList = this.allList.concat()
        }
        this.totalCount = this.currentList.length
        if (this.currentList.length > this.formInline.pageSize) {
          let start = (this.formInline.page - 1) * this.formInline.pageSize
          this.currentList = this.currentList.splice(
            start,
            this.formInline.pageSize
          )
        }
        this.loading = false
      }, 250)
    },
    // row日期转换
    dateFormater(row, column, cellValue, index) {
      if (!cellValue) return null
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    statusFormatter(row, column, cellValue, index) {
      return convertType(cellValue, SYNC_STATUS)
    },
    trackingTypeFormatter(row, column, cellValue, index) {
      return convertType(cellValue, TRACKING_TYPE).label
    },
    handleSearch(val) {
      this.formInline.page = 1
      this.debounceSearch(val)
    },
    handleCreate() {
      this.optTitle = this.$t('common.create') + this.$t('goals.createTitle')
      this.selectId = null
      this.modal = true
    },
    handleEdit(index, row) {
      this.optTitle = this.$t('common.edit') + this.$t('goals.createTitle')
      this.selectId = row.id
      this.modal = true
    },
    handleHistory(index, row) {},
    handleSet(result) {
      this.modal = false
      if (result) {
        this.formInline.page = 1
        this.formInline.pageSize = 10
        this.getDataList()
      }
    },
    addBodyClass() {
      document.getElementById('app').className = 'slide-body'
    },
    clearBodyClass() {
      document.getElementById('app').className = ''
    },
    // 分页导航
    handleCurrentChange(val) {
      this.formInline.page = val
      // 数组处理
      this.debounceSearch(this.formInline.search)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.debounceSearch(this.formInline.search)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleBatch(status) {
      if (this.multipleSelection.length === 0) {
        this.$message.error(this.$t('common.selOption'))
      } else {
        this.changeStatus = status
        this.tipVisible = true
      }
    },
    doChange() {
      this.subLoading = true
      let goalIds = this.multipleSelection.map(item => item.id)
      let params = {
        goalIds: goalIds,
        batchType: this.changeStatus
      }
      goalsApi
        .batchUpdate(params)
        .then(data => {
          this.allList.forEach(item => {
            goalIds.forEach(eventId => {
              if (item.id == eventId) {
                item.status = !item.status
              }
            })
          })
          // this.currentList.forEach(item => {
          //   if (item.eventId === this.row.eventId) {
          //     item.status = !this.row.status
          //   }
          // })
          this.tipVisible = false
          this.$message.success(this.$t('common.optSuccess'))
        })
        .finally(() => {
          this.subLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-tool {
  display: flex;
  .input-search {
    margin-left: 20px;
    width: 250px;
  }
  .more-menu {
    margin-left: 20px;
    button {
      background-color: #fff;
      border-color: #dfdfdf;
      color: #333;
    }
  }
}
.main-table {
  margin-top: 20px;
}
</style>
