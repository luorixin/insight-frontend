<template>
  <div class="chartGraph">
    <v-chart
      :options="options"
      ref="worldChart"
      :autoresize="true"
      style="width:600px"
    />
    <div class="regionDetail">
      <div
        class="regionDetail_info"
        v-for="(item, index) in currentRegions"
        :key="'region_' + item.name"
        @mouseover="showChartTip(item.name)"
        @mouseout="hideChartTip(item.name)"
      >
        <div class="regionDetail_info-label">
          {{ index + 1 + (page - 1) * 10 }}. {{ item.name }}
        </div>
        <div class="regionDetail_info-progress">
          <el-progress
            :show-text="false"
            :stroke-width="15"
            :percentage="item.per"
          ></el-progress>
        </div>
        <div class="regionDetail_info-result">
          <p>{{ item.per | toMoneyFilter }}%</p>
        </div>
      </div>
      <div class="regionDetail_pagenate">
        <div :class="{ disabled: page === 1 }" @click="changePage(-1)">
          <span class="el-icon-arrow-left"></span>
        </div>
        <div :class="{ disabled: page === totalPage }" @click="changePage(1)">
          <span class="el-icon-arrow-right"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/map'
import 'echarts/map/js/world.js'
import 'echarts/lib/component/tooltip'
import Util from '@/utils'
import WORLD_MAP from '@/utils/worldMap'
export default {
  name: 'regionWorldChart',
  props: {
    color: {
      type: Array,
      default: () => [
        '#EF4136',
        '#FFBD00',
        '#4484CF',
        '#946EDB',
        '#8D7B7B',
        '#54C7B0',
        '#F47920',
        '#194283',
        '#59C754'
      ]
    },
    datas: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    datas: {
      handler(newName, oldName) {
        this.initData(newName.concat())
      },
      immediate: true
    }
  },
  components: {
    'v-chart': ECharts
  },
  mounted() {
    if (this.datas.length > 0) {
      this.initData(this.datas)
    }
  },
  data() {
    return {
      options: null,
      currentRegions: [],
      allRegions: [],
      page: 1,
      pageSize: 10,
      totalPage: 1,
      totalCount: 0
    }
  },
  methods: {
    initData(data) {
      let colorMapArr = {
        '#EF4136': [
          '#e0c9c9',
          '#ecd3d3',
          '#eab7b7',
          '#eca5a7',
          '#fa7373',
          '#ef4136'
        ],
        '#FFBD00': [
          '#FFBD00',
          '#FFCB38',
          '#FFDA70',
          '#FFE8A8',
          '#FFF7E0',
          '#E7D8B2'
        ].reverse(),
        '#4484CF': [
          '#4484CF',
          '#6D9FD9',
          '#96BAE4',
          '#BFD5EE',
          '#E8F0F9',
          '#CDD9E8'
        ].reverse()
      }
      let rangeColor = colorMapArr[this.color[0] ? this.color[0] : '#EF4136']

      let symbolSizeRange = [5, 20]
      let min = 0,
        max = 0,
        _min = 1
      //转化名字
      let newRegion = data.map(function(item) {
        return {
          name: WORLD_MAP[item.name] ? WORLD_MAP[item.name] : item.name,
          value: item.value
        }
      })
      for (let i = 0; i < newRegion.length; i++) {
        if (!newRegion[i].name) newRegion[i].name = 'null'
        let isOthers =
          newRegion[i].name == '未知' ||
          newRegion[i].name == 'Unknown' ||
          newRegion[i].name == 'UNKNOWN' ||
          newRegion[i].name == 'Overseas'
        if (!isOthers) {
          let value = parseInt(newRegion[i].value)
          if (min == 0 || min > value) {
            min = value
          }
          if (max < value) {
            max = value
          }
          if (value == 0) {
            _min = 0
          }
        }
      }
      if (_min == 0) {
        min = 0
      }
      max = max + 10
      this.options = {
        tooltip: {
          backgroundColor: '#f2f2f2',
          borderColor: '#dfdfdf',
          borderWidth: 1,
          textStyle: {
            fontSize: 10,
            fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif',
            color: '#333'
          },
          extraCssText: 'text-align:left;',
          formatter: function(params) {
            let value = params.value
            if (isNaN(params.value)) return
            return (
              '<p><b style="font-weight:bold">Country: ' +
              params.name +
              '</b></p><p>Audience: ' +
              Util.formatNum(value, 0) +
              '</p>'
            )
          }
        },
        visualMap: {
          min: min,
          max: max,
          type: 'piecewise',
          left: 'left',
          top: 'bottom',
          text: ['High', 'Low'],
          orient: 'horizontal',
          selectedMode: false,
          hoverLink: true,
          splitNumber: 6,
          inverse: true,
          itemGap: 3,
          itemWidth: 8,
          itemHeight: 15,
          seriesIndex: [0],
          textStyle: {
            fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
          },
          inRange: {
            symbolSize: symbolSizeRange,
            color: rangeColor
          },
          calculable: true
        },
        geo: {
          map: 'world',
          // roam: true,
          cursor: 'default',
          label: {
            normal: {
              show: false,
              textStyle: {
                color: 'rgba(0,0,0,0.4)'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#fff'
            },
            emphasis: {
              areaColor: '',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          nameMap: WORLD_MAP
        },
        series: [
          {
            name: '数量',
            type: 'map',
            mapType: 'world',
            cursor: 'default',
            geoIndex: 0,
            silent: true,
            // tooltip: {show: false},
            data: newRegion
          },
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            cursor: 'default',
            geoIndex: 1,
            data: [],
            symbolSize: 20,
            symbol: '',
            symbolRotate: 35,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#F06C00'
              }
            }
          }
        ]
      }
      this.initRegionsParty(newRegion)
    },
    initRegionsParty(data) {
      if (data.length === 0) return
      let total = data.reduce((total, cur) => total + parseFloat(cur.value), 0)
      this.allRegions = data.map(item => {
        let per = (parseFloat(item.value) / total) * 100
        return {
          name: item.name,
          per: per,
          value: item.value
        }
      })
      this.allRegions = this.allRegions.sort(
        Util.sortJson('desc', 'value', 'parseFloat')
      )
      this.totalCount = this.allRegions.length
      this.totalPage =
        parseInt(this.totalCount / this.pageSize) +
        (this.totalCount % this.pageSize > 0 ? 1 : 0)
      let all = this.allRegions.concat()
      if (all.length > this.pageSize) {
        let start = (this.page - 1) * this.pageSize
        this.currentRegions = all.splice(start, this.pageSize)
      } else {
        this.currentRegions = all
      }
    },
    changePage(change) {
      if (this.page + change > 0 && this.page + change <= this.totalPage) {
        this.page += change
        let start = (this.page - 1) * this.pageSize
        let all = this.allRegions.concat()
        if (this.page === this.totalPage) {
          this.currentRegions = all.splice(start)
        } else {
          this.currentRegions = all.splice(start, this.pageSize)
        }
      }
    },
    showChartTip(name) {
      this.$refs.worldChart.dispatchAction({
        type: 'hideTip',
        seriesIndex: '0'
      })
      this.$refs.worldChart.dispatchAction({
        type: 'downplay',
        seriesIndex: '0'
      })
      this.$refs.worldChart.dispatchAction({
        type: 'showTip',
        seriesIndex: '0',
        name: name
      })
      this.$refs.worldChart.dispatchAction({
        type: 'highlight',
        seriesIndex: '0',
        name: name
      })
    },
    hideChartTip(name) {
      this.$refs.worldChart.dispatchAction({
        type: 'hideTip',
        seriesIndex: '0'
      })
      this.$refs.worldChart.dispatchAction({
        type: 'downplay',
        seriesIndex: '0'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.chartGraph,
.echarts {
  width: 100%;
  height: 100%;
}
.chartGraph {
  display: flex;
  justify-content: center;
  .regionDetail {
    display: flex;
    flex-direction: column;
    width: 350px;
    .regionDetail_info {
      height: 25px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:hover {
        background: #ddd;
      }
      .regionDetail_info-label {
        width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-indent: 10px;
      }
      .regionDetail_info-progress {
        width: 150px;
      }
      .regionDetail_info-result {
        flex: 1;
        margin-left: 20px;
      }
    }
    .regionDetail_pagenate {
      display: flex;
      justify-content: center;
      div {
        height: 20px;
        width: 20px;
        line-height: 20px;
        text-align: center;
        border: 1px solid #dfdfdf;
        background: #fff;
        font-weight: bold;
        cursor: pointer;
        & ~ div {
          border-left: none;
        }
        &.disabled {
          cursor: initial;
          background: #e8ebec;
          color: #999;
        }
      }
    }
  }
}
</style>
