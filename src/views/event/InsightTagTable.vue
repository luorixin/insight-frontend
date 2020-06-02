<template>
  <div class="main-table">
    <el-table
      :data="datas"
      border
      class="table"
      ref="table"
      v-loading="loading"
      header-row-class-name="main-table"
    >
      <el-table-column
        prop="id"
        :label="$t('event.insightTagTable.parameter')"
        width="90"
      >
        <template slot-scope="scope">
          <div class="paramter-con">
            <span
              class="fa fa-minus-circle"
              v-if="scope.$index > 0"
              @click="handleMinus(scope.$index)"
            ></span>
            <label
              :style="scope.$index > 0 ? '' : 'width: 100%;text-align: right;'"
              >#{{ scope.row.id }}</label
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('event.insightTagTable.name')">
        <template slot-scope="scope">
          <div>
            <el-input
              v-model="scope.row.name"
              :disabled="scope.$index === 0"
              class="handleSelect"
              :placeholder="$t('event.insightTagTable.fillName')"
            ></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        :label="$t('event.insightTagTable.type')"
        width="160"
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.type"
            :disabled="scope.$index === 0"
            @change="changeType(scope.row)"
            class="handleSelect"
          >
            <el-option
              v-for="item in typeList"
              v-show="showRevenue(item.id, scope.row)"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="scope.row.currency"
            v-show="scope.row.currency != null"
            class="handleSelect"
            style="margin-top: 10px;"
          >
            <el-option
              v-for="item in currecnyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        :label="$t('event.insightTagTable.sample')"
        width="80"
      >
        <template slot-scope="scope">
          {{ convertType(scope.row.type, 'sample') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        :label="$t('event.insightTagTable.remarks')"
        width="160"
      >
        <template slot-scope="scope">
          {{ convertType(scope.row.type, 'remark') }}
        </template>
      </el-table-column>
    </el-table>
    <div class="addmore" @click="handleAdd">
      <span class="fa fa-plus-circle"></span>
      <label>{{ $t('event.insightTagTable.addMore') }}</label>
    </div>
    <div class="note-con">
      <span>{{ $t('event.insightTagTable.note') }}:</span>
      <label>{{ $t('event.insightTagTable.noteDetail') }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'insightTagTable',
  props: {
    results: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      datas: [
        {
          id: 1,
          name: 'Counter',
          type: 'counter',
          currency: null
        }
      ],
      currecnyList: [
        {
          id: 'HKD',
          name: 'HKD'
        },
        {
          id: 'RMB',
          name: 'RMB'
        },
        {
          id: 'USD',
          name: 'USD'
        }
      ],
      typeList: [
        {
          id: 'counter',
          name: 'Counter',
          remark:
            'Used for counting number of this event Rules: Integer; Greater than or equal to 1',
          sample: '1'
        },
        {
          id: 'text',
          name: 'Text/Key',
          remark:
            'Used for storing texts that cannot be calculated or aggregated(For example: Invoice number). This type can be used for de-duplication purpose. Rules：Letter, number or "_"',
          sample: 'R_99999'
        },
        {
          id: 'number',
          name: 'Number',
          remark:
            'Used for storing numbers that is not monetary in nature. It is generally used for recording quantities of goods purchased like number of rooms or nights for hotel booking Rules：Integer; Greater than 0',
          sample: '999'
        },
        {
          id: 'revenue',
          name: 'Revenue',
          remark:
            '*Used for storing monetary value; *Only one parameter can be defined as this type. It is generally referred to sales amount or membership fee. Rules：Greater than or equal to 0',
          sample: '199.99'
        }
      ],
      loading: false
    }
  },
  methods: {
    changeType(row) {
      if (row.type === 'revenue') {
        row.currency = 'HKD'
      } else {
        row.currency = null
      }
    },
    convertType(type, returnKey) {
      let find = this.typeList.find(item => item.id === type)
      if (find) {
        return find[returnKey]
      }
      return this.$t('common.noResult')
    },
    showRevenue(type, row) {
      if (type === 'revenue') {
        let chooseReve = this.datas.find(item => item.type === 'revenue')
        if (chooseReve && row.type !== 'revenue') {
          return false
        }
      }
      return true
    },
    handleMinus(index) {
      this.datas.splice(index, 1)
    },
    handleAdd() {
      if (this.datas.length < 10) {
        this.datas.push({
          id: this.datas.length + 1,
          name: null,
          currency: null,
          type: 'counter'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.handleSelect {
  width: 130px;
  ::v-deep .el-input__inner {
    width: 130px !important;
  }
}
.paramter-con {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  .fa-minus-circle {
    cursor: pointer;
    font-size: 14px;
    color: #ef4136;
  }
}
.addmore {
  height: 30px;
  line-height: 30px;
  background: #f2f2f2;
  color: #999;
  cursor: pointer;
  padding-left: 10px;
  label {
    font-size: 12px;
    cursor: pointer;
    margin-left: 10px;
  }
}
.note-con {
  margin-top: 20px;
  font-size: 12px;
  line-height: 20px;
  word-break: break-word;
  span {
    color: #ef4136;
    font-weight: bold;
  }
}
</style>
