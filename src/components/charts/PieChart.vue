<template>
  <div class="chartGraph">
    <v-chart :options="options" :autoresize="true" />
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import Util from '@/utils'
export default {
  name: 'pieChart',
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
      type: Object,
      default: () => {}
    }
  },
  watch: {
    datas: {
      handler(newName, oldName) {
        this.initData(newName)
      },
      immediate: true
    },
    '$i18n.locale'() {
      this.initData(this.datas)
    }
  },
  components: {
    'v-chart': ECharts
  },
  mounted() {
    if (Object.keys(this.datas).length > 0) {
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
      let title = datas.title
      let seriesData = datas.data
      this.options = {
        title: {
          text: this.$t('goalAnalysis.' + title),
          top: -5,
          left: 'center',
          textAlign: 'left',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        color: this.color,
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return (
              '<p><b>' +
              params.name +
              '</b></p><p>' +
              // params.data.percent.toFixed(2) +
              Util.formatNum(params.data.value, 0) +
              '</p>'
            )
          },
          backgroundColor: '#f2f2f2',
          borderColor: '#dfdfdf',
          borderWidth: 1,
          textStyle: {
            fontSize: 10,
            fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif',
            color: '#333'
          },
          extraCssText: 'text-align:left;'
        },
        legend: {
          show: false
        },
        series: [
          {
            name: 'PieChart',
            type: 'pie',
            cursor: 'default',
            // radius: ['40%', '70%'],
            hoverAnimation: false,
            avoidLabelOverlap: false,
            selectedOffset: 5,
            label: {
              normal: {
                show: false,
                position: 'outside',
                formatter: '{d}%',
                textStyle: {
                  color: '#333',
                  fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                }
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 5,
                length2: 0
              }
            },
            data: seriesData
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
