<template>
  <div class="chartGraph">
    <v-chart :options="options" :autoresize="true" />
  </div>
</template>

<script>
/**
 * 先一图一组件后面在优化提取
 */
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import Util from '@/utils'
export default {
  name: 'lineChart',
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
        series = []
      for (let index = 0; index < datas.length; index++) {
        let data = datas[index]
        if (index === 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].date) {
              xAxis.push(data[i].date)
            }
          }
        }
        let seriesData = []
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i].value != 'undefined') {
            seriesData.push(data[i].value)
          }
        }
        series.push({
          data: seriesData,
          symbol: 'circle',
          symbolSize: '6',
          showSymbol: false,
          smooth: true,
          type: 'line',
          areaStyle: {
            normal: {
              color: this.color[index]
            }
          }
        })
      }
      this.options = {
        color: this.color,
        grid: {
          left: '0',
          bottom: '0',
          top: '0',
          right: '0'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          show: false,
          data: xAxis
        },
        yAxis: {
          type: 'value',
          show: false
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#f2f2f2',
          borderColor: '#dfdfdf',
          borderWidth: 1,
          textStyle: {
            color: '#333',
            fontFamily: 'Open Sans'
          },
          extraCssText: 'text-align:left;',
          formatter: function(params) {
            if (params.length < 2) {
              return (
                '<p><span style="color:#999;">' +
                params[0].name +
                '</span></p><p><b>' +
                Util.formatNum(params[0].value, 0) +
                '</b></p>'
              )
            } else {
              return (
                '<p><span style="color:#999;">' +
                params[0].name +
                '</span></p><p><b>' +
                Util.formatNum(params[0].value, 0) +
                '</b> vs <b>' +
                Util.formatNum(params[1].value, 0) +
                '</b></p>'
              )
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
