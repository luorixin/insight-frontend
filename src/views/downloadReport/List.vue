<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('downloadReport.title') }}</h1>
        </div>
      </div>
    </div>
    <div class="container-wrapper">
      <!-- <div class="main-tool">
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
      </div> -->
      <div class="main-table">
        <el-table
          :data="currentAccounts"
          border
          class="table"
          ref="table"
          v-loading="loading"
          header-row-class-name="main-table"
        >
          <el-table-column
            prop="reportName"
            :label="$t('downloadReport.name')"
          ></el-table-column>
          <el-table-column
            prop="generatedTime"
            :label="$t('downloadReport.genTime')"
            :formatter="dateFormater"
            width="160"
          ></el-table-column>
          <el-table-column
            prop="status"
            :label="$t('downloadReport.status')"
            :formatter="statusFormatter"
            width="160"
          ></el-table-column>
          <el-table-column
            :label="$t('downloadReport.action')"
            width="100"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div
                class="fa-icon-box"
                v-if="!scope.row.returnMessage"
                @click="handleGenerate(scope.$index, scope.row)"
              >
                <i class="fa fa-download"></i>
              </div>
              <label v-else>{{ scope.row.returnMessage }}</label>
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
  </div>
</template>

<script>
import * as downloadReportsApi from '@/api/downloadReports'
import Util from '@/utils'
import moment from 'moment'
import {
  DOWNLOAD_STATUS,
  TRACKING_TYPE,
  convertType,
  PAGE_SIZES
} from '@/utils/constant.js'
export default {
  name: 'downLoadReports',
  data() {
    return {
      loading: false,
      allAccounts: [],
      currentAccounts: [],
      formInline: {
        search: null,
        page: 1,
        pageSize: 10
      },
      optTitle: 'Create',
      totalCount: 0,
      pageSizes: PAGE_SIZES
    }
  },
  created() {
    this.getDataList()
    this.makeDebounce()
  },
  methods: {
    getDataList() {
      this.loading = true
      downloadReportsApi
        .list()
        .then(data => {
          this.allAccounts = data.concat()
          this.currentAccounts = this.allAccounts.slice(
            0,
            this.formInline.pageSize
          )
          this.totalCount = this.allAccounts.length
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
          this.currentAccounts = this.allAccounts.filter(item => {
            if (reg.test(item.id) || reg.test(item.reportName)) {
              reg.lastIndex = 0
              return true
            }
            return false
          })
        } else {
          this.currentAccounts = this.allAccounts.concat()
        }
        this.totalCount = this.currentAccounts.length
        if (this.currentAccounts.length > this.formInline.pageSize) {
          let start = (this.formInline.page - 1) * this.formInline.pageSize
          this.currentAccounts = this.currentAccounts.splice(
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
      return convertType(cellValue, DOWNLOAD_STATUS).label
    },
    trackingTypeFormatter(row, column, cellValue, index) {
      return convertType(cellValue, TRACKING_TYPE).label
    },
    handleSearch(val) {
      this.formInline.page = 1
      this.debounceSearch(val)
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
    handleGenerate(index, row) {
      this.loading = true
      downloadReportsApi
        .download(row)
        .then(data => {
          const blob = new Blob([data])
          const fileName = row.fileName || row.reportName + '.xlsx'
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-tool {
  display: flex;
  .input-search {
    width: 250px;
  }
}
.main-table {
  margin-top: 20px;
}
</style>
