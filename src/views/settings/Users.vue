<template>
  <div class="mainWrapper">
    <div class="page_title">
      <div class="row">
        <div class="client-row">
          <h1>{{ $t('users.title') }}</h1>
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
          >{{ $t('users.create') }}</el-button
        >
        <el-input
          :placeholder="$t('common.search')"
          v-model="formInline.name"
          class="input-search"
          @input="handleSearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearch(formInline.name)"
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
            :label="$t('users.name')"
          ></el-table-column>
          <el-table-column
            prop="roleId"
            :label="$t('users.role')"
            :formatter="getRoleName"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="agentList"
            :label="$t('users.agency')"
            :formatter="joinArray"
            width="350"
          >
          </el-table-column>
          <el-table-column
            prop="advertiserList"
            :label="$t('users.advertiser')"
            :formatter="joinArray"
            width="350"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('users.status')"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">
                {{ scope.row.status == 0 ? 'Active' : 'Paused' }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column
            :label="$t('users.action')"
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
          </el-table-column> -->
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
      <user-modal
        @getResult="handleSet"
        :title="optTitle"
        :id="selectId"
        :visible="modal"
      >
      </user-modal>
    </el-dialog>
  </div>
</template>

<script>
import * as usersApi from '@/api/users'
import * as rolesApi from '@/api/roles'
import Util from '@/utils'
import moment from 'moment'
import UserModal from './UserModal'
import { PAGE_SIZES } from '@/utils/constant.js'
export default {
  name: 'Users',
  components: {
    UserModal
  },
  data() {
    return {
      loading: false,
      formInline: {
        name: null,
        pageNum: 1,
        pageSize: 10
      },
      roleList: [],
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
  async created() {
    await this.getRoleList()
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
      usersApi
        .list(this.formInline)
        .then(data => {
          if (data && data.list && data.list.length > 0) {
            this.allList = data.list.concat()
          } else {
            this.allList = []
          }
          this.currentList = this.allList.slice()
          this.totalCount = data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    getRoleList() {
      return new Promise(resolve => {
        rolesApi
          .list({ pageNum: 1, pageSize: 10000 })
          .then(data => {
            if (data && data.list && data.list.length > 0) {
              this.roleList = data.list.concat()
            } else {
              this.roleList = []
            }
          })
          .finally(() => {
            resolve()
          })
      })
    },
    getRoleName(row, column, cellValue, index) {
      if (!cellValue || this.roleList.length === 0) return null
      let role = this.roleList.find(item => {
        return item.id == cellValue
      })
      return role ? role.name : cellValue
    },
    makeDebounce() {
      this.debounceSearch = Util.debounce(search => {
        this.formInline.name = search
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
      let moredot = result.length > 10 ? '...' : ''
      return result.slice(0, 10).join(',') + moredot
    },
    handleSearch(val) {
      this.formInline.pageNum = 1
      this.debounceSearch(val)
    },
    handleCreate() {
      this.optTitle = this.$t('common.create') + ' ' + this.$t('users.create')
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
      this.debounceSearch(this.formInline.name)
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.debounceSearch(this.formInline.name)
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
