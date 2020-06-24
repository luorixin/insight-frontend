<template>
  <div>
    <p>{{ $t('funnels.selectEventTip') }}</p>
    <el-button type="primary" icon="el-icon-plus" @click="handleAdd">{{
      $t('funnels.addEvents')
    }}</el-button>
    <div class="main-table">
      <el-table
        :data="currentList"
        border
        class="table dropTable"
        ref="table"
        v-loading="loading"
        header-row-class-name="main-table"
        row-key="id"
      >
        <el-table-column
          prop="step"
          :label="$t('funnels.eventTable.step')"
          width="80"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.$index + 1 }}
              <span v-show="scope.$index === currentList.length - 1">
                (final)</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          :label="$t('event.id')"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="eventName"
          :label="$t('event.name')"
          width="150"
        ></el-table-column>
        <el-table-column prop="url" :label="$t('event.url')" width="180">
          <template slot-scope="scope">
            <el-link :href="scope.row.url" target="_blank">{{
              scope.row.url
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="trackingType"
          :label="$t('event.trackingType')"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.tackingType ? 'success' : 'danger'">
              {{ scope.row.tackingType === 1 ? 'Universal' : 'Insight' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="updatedAt"
          :label="$t('event.lastEvent')"
          :formatter="dateFormater"
          width="150"
        >
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="modal"
      custom-class="slide-box slide-box-small"
      @open="addBodyClass"
      :append-to-body="true"
      :show-close="false"
      top="0"
    >
      <choose-event
        @getResult="handleSet"
        :chooses="currentList"
        :title="$t('funnels.selectEvents')"
        :visible="modal"
      >
      </choose-event>
    </el-dialog>
  </div>
</template>

<script>
import Util from '@/utils'
import moment from 'moment'
import Sortable from 'sortablejs'
import ChooseEvent from './ChooseEvent.vue'
import {
  SYNC_STATUS,
  TRACKING_TYPE,
  convertType,
  PAGE_SIZES
} from '@/utils/constant.js'
export default {
  name: 'eventDrag',
  components: {
    ChooseEvent
  },
  props: {
    results: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    results: {
      handler(newData, oldData) {
        this.currentList = newData.concat()
        this.sortedResult = newData.concat()
      },
      immediate: true
    }
  },
  data() {
    return {
      currentList: this.results,
      sortedResult: this.results,
      loading: false,
      modal: false
    }
  },
  mounted() {
    // 阻止默认行为
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.rowDrop()
  },
  methods: {
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(
        '.dropTable .el-table__body-wrapper tbody'
      )
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.currentList.splice(oldIndex, 1)[0]
          _this.currentList.splice(newIndex, 0, currRow)
          _this.$emit('changeEvent', _this.currentList)
        }
      })
    },
    // row日期转换
    dateFormater(row, column, cellValue, index) {
      if (!cellValue) return null
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    handleAdd() {
      this.modal = true
    },
    handleSet(result) {
      this.modal = false
      if (result) {
        console.log(result)
        this.currentList = result
        this.$emit('changeEvent', this.currentList)
        // this.currentList.forEach((item, index) => {
        //   item.step = index + 1
        //   if (index === this.currentList.length - 1) {
        //     item.step += ' (Final)'
        //   }
        // })
        // this.$nextTick(() => {
        //   this.rowDrop()
        // })
      } else {
        this.currentList = this.currentList.concat()
      }
    },
    addBodyClass() {
      document.getElementById('app').className = 'slide-body'
    },
    clearBodyClass() {
      document.getElementById('app').className = ''
    }
  }
}
</script>

<style scoped>
.main-table {
  margin-top: 20px;
}
</style>
