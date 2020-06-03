<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('eventLog.title') }}</h1>
        </div>
      </div>
    </div>
    <div class="container-wrapper">
      <div class="main-filter clearfix">
        <div class="main-filter__con">
          <div class="main-filter__detail">
            <el-date-picker
              v-model="formInline.date"
              type="date"
              :placeholder="$t('common.selPeriod')"
              :clearable="false"
              value-format="yyyy-MM-dd"
              align="right"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="main-filter__con">
          <div class="main-filter__detail">
            <el-time-picker
              is-range
              range-separator="~"
              v-model="formInline.timeArr"
              :clearable="false"
              :placeholder="$t('common.selPeriod')"
              @change="changeTime"
              style="width: 250px;"
            >
            </el-time-picker>
          </div>
        </div>
        <div class="main-filter__con">
          <div class="main-filter__detail">
            <event-selector
              @getResult="getEventId"
              :defaultValue="formInline.eventId"
              :placeholder="$t('common.selOption')"
            >
            </event-selector>
          </div>
        </div>
        <div class="main-filter__con">
          <div class="main-filter__detail">
            <el-button type="primary" @click="handleView">
              {{ $t('eventLog.view') }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="main-tool">
        <el-input
          :placeholder="$t('common.search')"
          v-model="formInline.eventName"
          class="input-search"
          @input="handleName"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleName(formInline.eventName)"
          ></el-button>
        </el-input>
        <div class="main-opt">
          <el-button
            icon="fa fa-download"
            @click="handleDownload"
            :disabled="isDownload || loading"
            >{{ $t('common.download') }}</el-button
          >
        </div>
      </div>
      <div class="main-table">
        <el-table
          :data="currentDatas"
          border
          class="table"
          ref="table"
          v-loading="loading"
          header-row-class-name="main-table"
        >
          <el-table-column
            prop="eventTime"
            :label="$t('event.lastEvent')"
            :formatter="dateFormater"
            width="160"
          >
          </el-table-column>
          <el-table-column
            prop="eventName"
            :label="$t('eventLog.name')"
            width=""
          >
          </el-table-column>
          <el-table-column prop="from" :label="$t('eventLog.from')" width="100">
          </el-table-column>
          <el-table-column prop="to" :label="$t('eventLog.to')" width="100">
          </el-table-column>
          <el-table-column prop="url" :label="$t('eventLog.url')" width="100">
          </el-table-column>
          <el-table-column
            prop="visitorIp"
            :label="$t('eventLog.visitorIp')"
            width="100"
          >
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
            :disabled="loading"
            :total="totalCount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as eventsApi from '@/api/events'
import Util from '@/utils'
import moment from 'moment'
import EventSelector from '@/components/selector/EventSelector'
import { convertType, PAGE_SIZES } from '@/utils/constant.js'
export default {
  name: 'eventLog',
  components: {
    EventSelector
  },
  data() {
    return {
      loading: false,
      allDatas: [],
      currentDatas: [],
      formInline: {
        eventName: null,
        eventId: -1,
        date: null,
        timeArr: [],
        startTime: null,
        endTime: null,
        page: 1,
        pageSize: 10
      },
      totalCount: 0,
      pageSizes: PAGE_SIZES,
      isDownload: false
    }
  },
  created() {
    this.initData()
    // this.getDataList();
    this.makeDebounce()
  },
  methods: {
    // 目前前端分页，如果要后端分页，需要把总数传给我
    getDataList() {
      this.loading = false
      if (this.formInline.eventId === -1) return
      this.loading = true
      let params = {
        startTime: this.formInline.timeArr[0],
        endTime: this.formInline.timeArr[1],
        date: this.formInline.date,
        pageNum: 1,
        pageSize: 10000
      }
      eventsApi
        .list(params)
        .then(data => {
          this.allDatas = data.adgroups.concat()
          this.subtotel = this.allDatas.length > 0 ? data.total : null
          if (this.subtotel) {
            this.subtotel.name = this.$t('common.subTotel')
            this.subtotel.currencyCode = this.allDatas[0].currencyCode
          }
          if (this.formInline.adgroupName) {
            this.doSearch(this.formInline.adgroupName)
          } else {
            let start = 0
            let end = this.formInline.pageSize * this.formInline.page
            if (this.allDatas.length > this.formInline.pageSize) {
              start = (this.formInline.page - 1) * this.formInline.pageSize
            }
            this.currentDatas = this.allDatas.slice(start, end)
            this.totalCount = this.allDatas.length
            if (this.subtotel) {
              this.currentDatas = [this.subtotel, ...this.currentDatas]
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    initData() {
      if (this.formInline.date === null) {
        this.formInline.date = Util.formateDate(new Date())
      }
      if (this.formInline.timeArr.length < 1) {
        let range = Util.getLastXHours(6, new Date())
        this.formInline.timeArr = range.concat()
      }
    },
    getEventId(result) {
      let id = result ? result.id : -1
      this.formInline.eventId = id
      this.formInline.eventId !== -1 && (this.loading = true)
    },
    makeDebounce() {
      this.debounceSearch = Util.debounce(this.doSearch, 250)
    },
    doSearch(search) {
      this.loading = true
      if (search) {
        let reg = new RegExp(search, 'gi')
        this.currentDatas = this.allDatas.filter(item => {
          if (reg.test(item.eventName)) {
            reg.lastIndex = 0
            return true
          }
          return false
        })
      } else {
        this.currentDatas = this.allDatas.concat()
      }
      this.totalCount = this.currentDatas.length
      if (this.currentDatas.length > this.formInline.pageSize) {
        let start = (this.formInline.page - 1) * this.formInline.pageSize
        this.currentDatas = this.currentDatas.splice(
          start,
          this.formInline.pageSize
        )
      }
      if (this.subtotel) {
        this.currentDatas = [this.subtotel, ...this.currentDatas]
      }
      this.loading = false
    },
    // row日期转换
    dateFormater(row, column, cellValue, index) {
      if (!cellValue) return null
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    changeTime(val) {
      this.getDataList()
    },
    handleName(val) {
      this.formInline.page = 1
      this.debounceSearch(val)
    },
    // 分页导航
    handleCurrentChange(val) {
      this.formInline.page = val
      // 数组处理
      this.debounceSearch(this.formInline.adgroupName)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.debounceSearch(this.formInline.adgroupName)
    },
    handleView() {},
    handleDownload() {
      this.isDownload = true
      let params = {
        campaignId:
          this.formInline.campaignId === -1 ? null : this.formInline.campaignId,
        searchAccountId: this.formInline.searchAccountId,
        status:
          this.formInline.status === 'all' ? null : this.formInline.status,
        startDate: this.formInline.dateRangeArr[0],
        endDate: this.formInline.dateRangeArr[1]
      }
      eventsApi
        .downExcel(params)
        .then(data => {
          const blob = new Blob([data])
          const fileName =
            'AdGroup_' + moment(new Date()).format('YYYYMMDD_HHmmss') + '.xlsx'
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
          this.isDownload = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-tool {
  display: flex;
  .input-search {
    margin-right: 20px;
    width: 250px;
  }
  .main-opt {
    flex: 1;
    text-align: right;
    .refresh {
      padding-left: 10px;
      padding-right: 5px;
    }
  }
}
.main-table {
  margin-top: 20px;
}
.main-filter {
  margin-bottom: 20px;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  padding: 20px;
  .main-filter__con {
    margin-right: 20px;
    float: left;
    p {
      font-size: 12px;
      font-weight: bold;
      line-height: 20px;
    }
  }
}
.table-link {
  font-size: 18px;
  color: #5d9cec;
  word-break: break-word;
}
</style>
