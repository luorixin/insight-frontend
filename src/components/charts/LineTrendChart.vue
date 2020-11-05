<template>
  <div class="chartGraph">
    <v-chart :options="options" :autoresize="true" />
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import Util from '@/utils'
export default {
  name: 'lineTrendChart',
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
  components: {
    'v-chart': ECharts
  },
  watch: {
    datas: {
      handler(newName, oldName) {
        this.initData(newName.concat())
      },
      immediate: true
    }
  },
  mounted() {
    if (this.datas.length > 0) {
      this.initData(this.datas)
    }
  },
  data() {
    return {
      options: null
    }
  },
  methods: {
    initData(datas) {
      let xAxis = [],
        series = [],
        legends = []
      for (let index = 0; index < datas.length; index++) {
        let data = datas[index]['data']
        let seriesName = datas[index]['name']
        if (!data) continue
        if (index === 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].date) {
              xAxis.push(data[i].date)
            }
          }
        }
        let seriesData = []
        for (let j = 0; j < data.length; j++) {
          if (typeof data[j].value != 'undefined') {
            seriesData.push(data[j].value)
          }
        }
        legends.push({
          icon: 'circle',
          name: seriesName,
          value: seriesName
        })
        series.push({
          data: seriesData,
          name: seriesName,
          symbol: 'circle',
          symbolSize: '6',
          type: 'line',
          smooth: false,
          showAllSymbol: true,
          hoverAnimation: false,
          cursor: 'default',
          areaStyle: {
            normal: {
              opacity: 0
            }
          }
        })
      }
      let axisinterval = xAxis.length - 2
      let defaultNoSelected = {}
      legends.forEach((item, index) => {
        defaultNoSelected[item.name] = true
        if (index > 4) {
          defaultNoSelected[item.name] = false
        }
      })
      if (xAxis.length < 9) {
        axisinterval = 0
      } else if (xAxis.length < 11) {
        axisinterval = 1
      } else if (xAxis.length < 21) {
        axisinterval = 2
      } else if (xAxis.length < 31) {
        axisinterval = 3
      }
      this.options = {
        title: {
          show: false
        },
        color: this.color,
        dataZoom: [
          {
            show: false
          }
        ],
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#f2f2f2',
          borderColor: '#dfdfdf',
          borderWidth: 1,
          textStyle: {
            color: '#333',
            fontFamily: 'Open Sans'
          },
          axisPointer: {
            lineStyle: {
              type: 'dotted'
            }
          },
          extraCssText: 'text-align:left;',
          formatter: function(params) {
            var result =
              '<p style="color:#999;font-size:10px">' +
              params[0].name +
              '</p>' +
              '</p>' +
              '<p style="color:#333;font-weight:bold;">Audience Scale</p>'
            params.forEach(function(item) {
              result +=
                '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' +
                item.color +
                '"></span>' +
                item.seriesName +
                ': ' +
                Util.formatNum(item.value, 0) +
                '</p>'
            })
            result += '</p>'
            return result
          }
        },
        legend: {
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 20,
          data: legends,
          bottom: 0,
          selected: defaultNoSelected
        },
        grid: {
          left: '0',
          bottom: '40',
          top: '40',
          right: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            // showMinLabel:false,
            interval: axisinterval,
            textStyle: {
              color: '#999',
              fontSize: 10
            }
          },
          min: 'dataMin',
          max: 'dataMax',
          boundaryGap: true,
          data: xAxis
        },
        yAxis: {
          type: 'value',
          splitNumber: 3,
          scale: true,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#dfdfdf'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            // showMinLabel:false,
            formatter: function(value, index) {
              return Util.formatNum(value, 0)
            },
            textStyle: {
              color: '#999',
              fontSize: 10
            }
          }
        },
        series: series
      }
    }
  }
}
</script>

<style scoped>
.chartGraph,
.echarts {
  width: 100%;
  height: 100%;
}
</style>
