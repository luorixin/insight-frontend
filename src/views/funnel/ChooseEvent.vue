<template>
  <div>
    <div class="slide-close" @click="closeModal">
      <i class="fa fa-close"></i>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="title" name="basic">
        <div class="slide-content" v-loading="loading">
          <div class="main-table">
            <el-table
              :data="currentList"
              border
              class="table"
              ref="eventTable"
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
                width="120"
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
import Util from '@/utils'
import ChooseTab from '@/components/chooseTab/Index.vue'
import {
  SYNC_STATUS,
  TRACKING_TYPE,
  convertType,
  PAGE_SIZES
} from '@/utils/constant.js'
export default {
  name: 'chooseEvent',
  components: {
    ChooseTab
  },
  props: {
    title: {
      type: String,
      default: 'Select Events'
    },
    chooses: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'basic',
      loading: false,
      datas: [],
      selecteds: this.chooses,
      currentSelects: [],
      allList: [],
      currentList: [],
      formInline: {
        search: null,
        page: 1,
        pageSize: 5
      },
      isChangePage: false,
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
      this.allList = [
        {
          id: 1,
          eventName: 'test',
          urls: 'http://www.baidu.com',
          trackingType: 0,
          isGoal: false,
          isFunnel: true,
          status: false,
          updatedAt: '2020-02-02'
        },
        {
          id: 2,
          eventName: 'test0',
          urls: 'http://www.baidu.com',
          trackingType: 0,
          isGoal: false,
          isFunnel: true,
          status: false,
          updatedAt: '2020-02-02'
        },
        {
          id: 3,
          eventName: 'test3',
          urls: 'http://www.baidu.com',
          trackingType: 1,
          isGoal: false,
          isFunnel: true,
          status: false,
          updatedAt: '2020-02-02'
        },
        {
          id: 4,
          eventName: 'test2',
          urls: 'http://www.baidu.com',
          trackingType: 0,
          isGoal: true,
          isFunnel: true,
          status: false,
          updatedAt: '2020-02-02'
        },
        {
          id: 5,
          eventName: 'test33',
          urls: 'http://www.baidu.com',
          trackingType: 0,
          isGoal: true,
          isFunnel: true,
          status: false,
          updatedAt: '2020-02-02'
        },
        {
          id: 6,
          eventName: 'test32',
          urls: 'http://www.baidu.com',
          trackingType: 0,
          isGoal: false,
          isFunnel: true,
          status: false,
          updatedAt: '2020-02-02'
        }
      ]
      this.currentList = this.allList.slice(0, this.formInline.pageSize)
      this.totalCount = this.allList.length
    },
    closeModal() {
      this.$emit('getResult', false)
    },
    handleSave() {
      this.$emit('getResult', this.selecteds)
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
        this.$nextTick(() => {
          this.handleSelect()
        })
        this.loading = false
      }, 250)
    },
    // 分页导航
    handleCurrentChange(val) {
      this.formInline.page = val
      this.isChangePage = true
      // 数组处理
      this.debounceSearch(this.formInline.search)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.isChangePage = true
      this.debounceSearch(this.formInline.search)
    },
    handleSelectionChange(val) {
      if (!this.isChangePage) {
        this.currentSelects = val
        this.selecteds = this.selecteds.filter(item => {
          return !this.currentList.find(cur => cur.id === item.id)
        })
        this.selecteds = this.selecteds.concat(this.currentSelects)
      }
    },
    handleSelect() {
      this.selecteds.forEach(item => {
        this.currentList.forEach(cur => {
          if (item.id === cur.id) {
            this.$refs.eventTable.toggleRowSelection(cur, true)
          }
        })
      })
      this.isChangePage = false
    }
  }
}
</script>

<style scoped lang="scss">
.pagination {
  ::v-deep input {
    width: 100px !important;
  }
}
.main-table {
  ::v-deep thead {
    th:first-child {
      .cell {
        display: none;
      }
    }
  }
}
</style>
