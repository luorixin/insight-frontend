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
              @change="changeDate"
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
        <div class="main-opt" v-hasPermission="'eventlog.download'">
          <label style="color:#666;">{{ $t('eventLog.tip') }} </label>
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
            width="200"
          >
          </el-table-column>
          <el-table-column
            v-if="eventInfoSelect.eventOneName"
            prop="eventOne"
            :label="eventInfoSelect.eventOneName"
            width="100"
          >
          </el-table-column>
          <el-table-column
            v-if="eventInfoSelect.eventTwoName"
            prop="eventTwo"
            :label="eventInfoSelect.eventTwoName"
            width="100"
          >
          </el-table-column>
          <el-table-column
            v-if="eventInfoSelect.eventThreeName"
            prop="eventThree"
            :label="eventInfoSelect.eventThreeName"
            width="100"
          >
          </el-table-column>
          <el-table-column
            v-if="eventInfoSelect.eventFourName"
            prop="eventFour"
            :label="eventInfoSelect.eventFourName"
            width="100"
          >
          </el-table-column>
          <el-table-column
            v-if="eventInfoSelect.eventFiveName"
            prop="eventFive"
            :label="eventInfoSelect.eventFiveName"
            width="100"
          >
          </el-table-column>
          <el-table-column
            v-if="eventInfoSelect.eventSixName"
            prop="eventSix"
            :label="eventInfoSelect.eventSixName"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="url" :label="$t('eventLog.url')">
          </el-table-column>
          <el-table-column
            prop="visitorIp"
            :label="$t('eventLog.visitorIp')"
            width="120"
          >
          </el-table-column>

          <el-table-column
            prop="channel"
            :label="$t('eventLog.channel')"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="media"
            :label="$t('eventLog.media')"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="campaign"
            :label="$t('eventLog.campaign')"
            width="120"
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
        clientId: -1,
        date: null,
        timeArr: [],
        startTime: null,
        endTime: null,
        page: 1,
        pageSize: 10
      },
      eventInfoSelect: {
        eventOneName: null,
        eventTwoName: null,
        eventThreeName: null,
        eventFourName: null,
        eventFiveName: null,
        eventSixName: null
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
        eventId: this.formInline.eventId,
        clientId: this.formInline.clientId,
        startTime: moment(this.formInline.timeArr[0]).format('HH:mm:ss'),
        endTime: moment(this.formInline.timeArr[1]).format('HH:mm:ss'),
        date: this.formInline.date,
        page: 1, //this.formInline.page,
        size: 500 //this.formInline.pageSize
      }
      eventsApi
        .eventLogTable(params)
        .then(data => {
          this.allDatas = data.eventLogList.concat()
          this.eventInfoSelect = Object.assign({}, data.eventInfoSelect)
          if (this.formInline.eventName) {
            this.doSearch(this.formInline.eventName)
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
      if (this.$route.params) {
        if (this.$route.params.eventId) {
          this.formInline.eventId = this.$route.params.eventId
        }
        if (this.$route.params.clientId) {
          this.formInline.clientId = this.$route.params.clientId
        }
      }
      if (this.formInline.date === null) {
        this.formInline.date = Util.formateDate(new Date())
      }
      if (this.formInline.timeArr.length < 1) {
        // let range = Util.getLastXHours(6, new Date())
        let range = [
          new Date(new Date().setHours(0, 0, 0, 0)),
          new Date(new Date().setHours(23, 59, 59, 999))
        ]
        this.formInline.timeArr = range.concat()
      }
    },
    getEventId(result) {
      let id = result ? result.id : -1
      let clientId = result ? result.clientId : -1
      this.formInline.eventId = id
      this.formInline.clientId = clientId
      this.formInline.eventId !== -1 && (this.loading = true)
      this.getDataList()
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
    changeDate(val) {
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
      this.debounceSearch(this.formInline.eventName)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.debounceSearch(this.formInline.eventName)
    },
    handleView() {
      this.formInline.page = 1
      this.getDataList()
    },
    handleDownload() {
      this.isDownload = true
      let params = {
        eventId: this.formInline.eventId,
        startTime: moment(this.formInline.timeArr[0]).format('HH:mm:ss'),
        endTime: moment(this.formInline.timeArr[1]).format('HH:mm:ss'),
        date: this.formInline.date,
        page: 1, //this.formInline.page,
        size: 10000 //this.formInline.pageSize
      }
      eventsApi
        .exportXls(params)
        .then(data => {
          const blob = new Blob([data])
          const fileName =
            'eventLog_' +
            this.formInline.eventId +
            '_' +
            moment(new Date()).format('YYYYMMDD_HHmmss') +
            '.xls'
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
