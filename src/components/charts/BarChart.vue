<template>
  <div class="chartGraph">
    <v-chart :options="options" :autoresize="true" />
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import Util from '@/utils'
export default {
  name: 'barChart',
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
      options: null
    }
  },
  methods: {
    initData(timeDistribution) {
      let weeks_trans = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6
      }
      let category = [],
        seriesData = []
      for (let i in weeks_trans) {
        category.push(i)
        let insert = false
        for (let index = 0; index < timeDistribution.length; index++) {
          if (timeDistribution[index].date == weeks_trans[i]) {
            seriesData.push(timeDistribution[index].value)
            insert = true
          }
        }
        !insert && seriesData.push(0)
      }
      this.options = {
        color: this.color,
        grid: {
          bottom: '20',
          left: '20',
          right: '20',
          top: '20'
        },
        tooltip: {
          show: false
        },
        xAxis: {
          axisLabel: {
            textStyle: {
              color: '#999',
              fontSize: 10
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          boundaryGap: true,
          data: category,
          splitLine: {
            show: false
          },
          type: 'category'
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [
          {
            cursor: 'default',
            data: seriesData,
            type: 'bar',
            barWidth: 80,
            showAllSymbol: true,
            label: {
              normal: {
                show: true,
                position: 'top',
                color: '#333',
                formatter: function(data) {
                  return Util.formatNum(data.value, 0)
                }
              }
            }
          }
        ]
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
