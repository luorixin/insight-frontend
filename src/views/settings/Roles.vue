<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('roles.title') }}</h1>
        </div>
      </div>
    </div>
    <div class="container-wrapper">
      <div class="main-tool">
        <el-button
          type="primary"
          v-show="false"
          icon="el-icon-plus"
          @click="handleCreate"
          >{{ $t('roles.create') }}</el-button
        >
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
        >
          <el-table-column
            prop="name"
            :label="$t('roles.name')"
          ></el-table-column>
          <el-table-column
            prop="purview"
            :label="$t('roles.purview')"
            width="600"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('roles.status')"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">
                {{ scope.row.status == 0 ? 'Active' : 'Paused' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('roles.action')"
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
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="formInline.pageNum"
            :page-sizes="pageSizes"
            :page-size="formInline.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="totalCount"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 添加修改弹出框 -->
    <el-dialog
      :visible.sync="modal"
      custom-class="slide-box"
      @open="addBodyClass"
      @closed="clearBodyClass"
      :show-close="false"
      top="0"
    >
      <role-modal
        @getResult="handleSet"
        :title="optTitle"
        :id="selectId"
        :visible="modal"
      >
      </role-modal>
    </el-dialog>
  </div>
</template>

<script>
import * as rolesApi from '@/api/roles'
import Util from '@/utils'
import moment from 'moment'
import RoleModal from './RoleModal'
import { PAGE_SIZES } from '@/utils/constant.js'
export default {
  name: 'Users',
  components: {
    RoleModal
  },
  data() {
    return {
      loading: false,
      formInline: {
        search: null,
        pageNum: 1,
        pageSize: 10
      },
      totalCount: 0,
      pageSizes: PAGE_SIZES,
      firstWidth: 200,
      allList: [],
      currentList: [],
      optTitle: 'Create',
      modal: false,
      selectId: null,
      row: null
    }
  },
  created() {
    this.getDataList()
    this.makeDebounce()
    if (window.innerWidth > 1600) {
      this.firstWidth = ''
    } else {
      this.firstWidth = 200
    }
  },
  methods: {
    getDataList() {
      this.loading = true
      rolesApi
        .list(this.formInline)
        .then(data => {
          this.allList = data.list.concat()
          this.currentList = this.allList.slice()
          this.totalCount = this.allList.length
        })
        .finally(() => {
          this.loading = false
        })
    },
    makeDebounce() {
      this.debounceSearch = Util.debounce(search => {
        this.formInline.search = search
        this.getDataList()
      }, 250)
    },
    // row日期转换
    dateFormater(row, column, cellValue, index) {
      if (!cellValue) return null
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    joinArray(row, column, cellValue, index) {
      if (!cellValue) return null
      let result = []
      cellValue.forEach(item => {
        result.push(item.name)
      })
      return result.slice(0, 10).join(',')
    },
    handleSearch(val) {
      this.formInline.pageNum = 1
      this.debounceSearch(val)
    },
    handleCreate() {
      this.optTitle = this.$t('common.create') + ' ' + this.$t('roles.create')
      this.selectId = null
      this.modal = true
    },
    handleEdit(index, row) {
      this.optTitle = this.$t('common.edit') + ' ' + this.$t('roles.create')
      this.selectId = row.id
      this.modal = true
    },
    handleSet(result) {
      this.modal = false
      if (result) {
        this.formInline.pageNum = 1
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
      this.formInline.pageNum = val
      // 数组处理
      this.debounceSearch(this.formInline.search)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.debounceSearch(this.formInline.search)
    }
  }
}
</script>

<style scoped lang="scss">
.main-tool {
  display: flex;
  .input-search {
    margin-left: 0px;
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
