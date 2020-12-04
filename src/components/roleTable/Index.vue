<template>
  <div>
    <template v-if="dataList.length > 0 || loading">
      <table
        class="role-table"
        v-loading="loading"
        v-for="(table, index) in dataList"
        :key="'roleTable_' + index"
      >
        <tbody>
          <tr>
            <td :colspan="table.mask.split(',').length + 1">
              {{ $t('roleTable.' + table.name) }}
            </td>
          </tr>
          <tr v-if="table.mask.length > 1">
            <td></td>
            <td
              v-for="_mask in table.mask.split(',')"
              :key="'roleTable_mask_' + index + _mask"
            >
              {{ $t('roleTable.' + _mask) }}
            </td>
          </tr>
          <tr
            v-for="child in table.children"
            :key="'roleTable_child_' + child.name"
          >
            <td>{{ $t('roleTable.' + child.name) }}</td>
            <td
              v-for="_child_mask in table.mask.split(',')"
              :key="'roleTable_child_mask_' + index + _child_mask"
            >
              <el-checkbox
                v-model="mapChecked[child.name + '$$$' + _child_mask]"
                :disabled="child.mask.indexOf(_child_mask) === -1"
                @change="handleClick"
              ></el-checkbox>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <div v-else>{{ $t('common.noResult') }}</div>
  </div>
</template>

<script>
import * as rolesApi from '@/api/roles'
export default {
  name: 'RoleTable',
  props: {
    choose: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    choose: {
      handler(newData, oldData) {
        this.selected = newData
        if (newData && !this.loading) {
          this.mapChecked = Object.assign({}, this.initChecked)
          for (let child in newData) {
            newData[child].split(',').forEach(key => {
              this.mapChecked[child + '$$$' + key] = true
            })
          }
        }
      },
      immediate: true
    }
  },
  created() {
    this.initTable()
  },
  data() {
    return {
      loading: false,
      selected: this.choose,
      mapChecked: {},
      initChecked: {},
      dataList: []
    }
  },
  methods: {
    initTable() {
      this.loading = true
      rolesApi
        .modules()
        .then(result => {
          this.dataList = result
          // 解决响应式和传值问题
          this.dataList.forEach(parent => {
            if (parent.children && parent.children.length > 0) {
              parent.children.forEach(child => {
                if (child.mask && child.mask.length > 0) {
                  child.mask.split(',').forEach(mask => {
                    this.$set(
                      this.mapChecked,
                      [child.name, mask].join('$$$'),
                      false
                    )
                    this.$set(
                      this.initChecked,
                      [child.name, mask].join('$$$'),
                      false
                    )
                  })
                }
              })
            }
          })
          if (this.selected) {
            for (let child in this.selected) {
              this.selected[child].split(',').forEach(key => {
                this.mapChecked[child + '$$$' + key] = true
              })
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClick(res) {
      this.$emit('chooseFn', this.mapChecked)
    }
  }
}
</script>

<style scoped lang="scss">
.role-table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 21px;
  border: 1px solid #dfdfdf;
  table-layout: fixed;
  text-align: center;
  & > tbody > tr:nth-of-type(odd) {
    background-color: #fafbfc;
  }
  tr {
    td {
      border: 1px solid #dfdfdf !important;
      padding: 7px 8px 8px 8px;
      vertical-align: middle;
      word-break: break-all;
      background: #fff;
    }
    &:hover td {
      background: #f2f2f2;
    }
  }
}
</style>
