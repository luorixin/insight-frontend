<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('event.title') }}</h1>
        </div>
      </div>
    </div>
    <div class="container-wrapper">
      <div class="main-tool">
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">{{
          $t('event.create')
        }}</el-button>
        <el-dropdown class="more-menu" @command="handleBatch">
          <el-button type="primary">
            {{ $t('event.batch')
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" style="width: 140px;">
            <el-dropdown-item command="active">Active</el-dropdown-item>
            <el-dropdown-item command="pause">Pause</el-dropdown-item>
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
            :label="$t('event.id')"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="eventName"
            :label="$t('event.name')"
            width="180"
          ></el-table-column>
          <el-table-column prop="urls" :label="$t('event.url')" width="180">
            <template slot-scope="scope">
              <el-link :href="scope.row.urls" target="_blank">{{
                scope.row.urls
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="trackingType"
            :label="$t('event.trackingType')"
            width="120"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.trackingType ? 'success' : 'danger'">
                {{ scope.row.trackingType ? 'Insight' : 'Universal' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="isGoal"
            :label="$t('event.includedGoal')"
            width="180"
          >
            <template slot-scope="scope">
              <choose-tab :choose="scope.row.isGoal"></choose-tab>
              <!-- <el-tag :type="scope.row.isGoal ? 'success' : 'danger'">
                {{ scope.row.isGoal ? 'Yes' : 'No' }}
              </el-tag> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="isFunnel"
            :label="$t('event.includedFunnel')"
            width="180"
          >
            <template slot-scope="scope">
              <choose-tab :choose="scope.row.isFunnel"></choose-tab>
              <!-- <el-tag :type="scope.row.isFunnel ? 'success' : 'danger'">
                {{ scope.row.isFunnel ? 'Yes' : 'No' }}
              </el-tag> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('event.status')"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.status ? 'success' : 'danger'">
                {{ scope.row.status ? 'Active' : 'Paused' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="updatedAt"
            :label="$t('event.lastEvent')"
            :formatter="dateFormater"
            width="160"
          >
          </el-table-column>
          <el-table-column
            :label="$t('event.action')"
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
              <div
                class="fa-icon-box"
                @click="handleDownload(scope.$index, scope.row)"
              >
                <i class="fa fa-download"></i>
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
      <event-modal
        @getResult="handleSet"
        :title="optTitle"
        :id="selectId"
        :visible="modal"
      >
      </event-modal>
    </el-dialog>
  </div>
</template>

<script>
import * as eventsApi from '@/api/events'
import EventModal from './EventModal'
import ChooseTab from '@/components/chooseTab/Index.vue'
import Util from '@/utils'
import moment from 'moment'
import {
  SYNC_STATUS,
  TRACKING_TYPE,
  convertType,
  PAGE_SIZES
} from '@/utils/constant.js'
export default {
  name: 'eventList',
  components: {
    EventModal,
    ChooseTab
  },
  data() {
    return {
      loading: false,
      subLoading: false,
      tipVisible: false,
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
      // this.loading = true
      // eventsApi
      //   .list(this.formInline.search)
      //   .then(data => {
      //     this.allList = data.concat()
      //     this.currentList = this.allList.slice(0, this.formInline.pageSize)
      //     this.totalCount = this.allList.length
      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })
      this.allList = [
        {
          id: 1,
          eventName: 'test',
          urls: 'http://www.baidu.com',
          tackingType: 0,
          isGoal: false,
          isFunnel: true,
          status: false,
          updatedAt: '2020-02-02'
        }
      ]
      this.currentList = this.allList.slice(0, this.formInline.pageSize)
      this.totalCount = this.allList.length
    },
    makeDebounce() {
      this.debounceSearch = Util.debounce(search => {
        this.loading = true
        if (search) {
          let reg = new RegExp(search, 'gi')
          this.currentList = this.allList.filter(item => {
            if (reg.test(item.eventId) || reg.test(item.eventName)) {
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
      this.optTitle = this.$t('common.create') + this.$t('event.title')
      this.selectId = null
      this.modal = true
    },
    handleEdit(index, row) {
      this.optTitle = this.$t('common.edit') + this.$t('event.title')
      this.selectId = row.id
      this.modal = true
    },
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
        this.tipVisible = true
      }
    },
    doChange() {
      this.subLoading = true
      console.log(this.multipleSelection)
      let params = {
        eventId: this.row.eventId,
        statusType: this.row.status ? 'paused' : 'live'
      }
      eventsApi
        .changStatus(params)
        .then(data => {
          this.allList.forEach(item => {
            if (item.eventId === this.row.eventId) {
              item.status = !item.status
            }
          })
          this.currentList.forEach(item => {
            if (item.eventId === this.row.eventId) {
              item.status = !this.row.status
            }
          })
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
