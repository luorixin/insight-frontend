<template>
  <div class="chartGraph" ref="barMultiAxisChart">
    <div class="chartLegend">
      <div
        class="chartLegend_item"
        :style="{ height: legendHeight, 'line-height': legendHeight }"
        v-for="item in legend"
        :key="'barmultichart_' + item"
      >
        {{ item }}
        <el-tooltip class="item" effect="light" placement="top">
          <div slot="content" class="tooltip-content">
            {{ item }}
          </div>
          <span class="fa fa-question-circle-o"></span>
        </el-tooltip>
      </div>
    </div>
    <v-chart :options="options" :autoresize="true" />
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/timeline'
import 'echarts/lib/component/tooltip'
import Util from '@/utils'
export default {
  name: 'barMultiAxisChart',
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
    },
    height: {
      type: Number,
      default: 405
    }
  },
  watch: {
    datas: {
      handler(newName, oldName) {
        this.initData(newName)
      },
      immediate: true
    }
  },
  components: {
    'v-chart': ECharts
  },
  mounted() {
    if (this.datas.columns && this.datas.columns.length > 0) {
      this.initData(this.datas)
    }
  },
  data() {
    return {
      options: null,
      legend: null,
      legendHeight: null
    }
  },
  methods: {
    initData(datas) {
      if (!this.datas.columns || this.datas.columns.length === 0) {
        return
      }
      // console.log(datas.leftAxis)
      let xData = datas.columns //['A', 'B', 'C', 'D', 'E', 'F', 'G']
      let leftAxis = datas.leftAxis //[3, 20, 62, 34, 55, 65, 33]
      let rightAxis = datas.rightAxis //[11, 38, 23, 39, 66, 66, 79]
      let timeLineData = [1]
      let legend = datas.legend //['2017', '2018']
      let background = '#fff'
      let textColor = '#999'
      let lineColor = '#dfdfdf'
      let borderData = []
      let scale = 2
      borderData = xData.map(item => {
        return scale
      })
      let option = {
        baseOption: {
          color: this.color,
          backgroundColor: background,
          timeline: {
            show: false,
            top: 0,
            data: []
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            backgroundColor: '#f2f2f2',
            borderColor: '#dfdfdf',
            borderWidth: 1,
            textStyle: {
              color: '#333',
              fontFamily: 'Open Sans'
            },
            extraCssText: 'text-align:left;',
            formatter: function(params) {
              let result = ''

              if (params.length) {
                result =
                  '<p style="color:#999;font-size:10px">' +
                  params[0].name +
                  '</p>'
                params.forEach(function(item) {
                  if (item.seriesName != 'test') {
                    if (item.value) {
                      let unit = item.seriesIndex == '2' ? '%' : ''
                      let num =
                        item.seriesIndex == '2'
                          ? Util.formatNum(item.value, 2)
                          : Util.formatNum(item.value, 0)
                      result +=
                        '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' +
                        item.color +
                        '"></span>' +
                        item.seriesName +
                        ': ' +
                        num +
                        unit +
                        '</p>'
                    }
                  }
                })
              }
              return result
            }
          },
          grid: [
            {
              show: false,
              left: '0%',
              top: '0%',
              bottom: '0%',
              containLabel: true,
              width: '50%'
            },
            {
              show: false,
              left: '51%',
              top: '0%',
              bottom: '0%',
              width: '0%'
            },
            {
              show: false,
              right: '0%',
              top: '0%',
              bottom: '0%',
              containLabel: true,
              width: '50%'
            }
          ],
          xAxis: [
            {
              type: 'value',
              inverse: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: lineColor
                }
              },
              axisTick: {
                show: false
              },
              position: 'bottom',
              axisLabel: {
                show: true,
                showMaxLabel: false,
                formatter: function(value, index) {
                  return Util.getKWMformat(value)
                },
                color: textColor
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: lineColor
                }
              }
            },
            {
              gridIndex: 1,
              show: false
            },
            {
              gridIndex: 2,
              axisLine: {
                show: true,
                lineStyle: {
                  color: lineColor
                }
              },
              axisTick: {
                show: false
              },
              position: 'bottom',
              axisLabel: {
                show: true,
                showMaxLabel: false,
                formatter: function(value, index) {
                  return Util.getKWMformat(value)
                },
                color: textColor
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: lineColor
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'category',
              inverse: true,
              position: 'right',
              axisLine: {
                show: true,
                lineStyle: {
                  color: lineColor
                }
              },

              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              data: xData
            },
            {
              gridIndex: 1,
              type: 'category',
              inverse: true,
              position: 'left',
              show: false,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                padding: [30, 0, 0, 0],
                textStyle: {
                  color: '#ffffff',
                  fontSize: 20
                },
                align: 'center'
              },
              data: xData.map(function(value) {
                return {
                  value: value,
                  textStyle: {
                    align: 'center'
                  }
                }
              })
            },
            {
              gridIndex: 2,
              type: 'category',
              inverse: true,
              position: 'left',
              axisLine: {
                show: true,
                lineStyle: {
                  color: lineColor
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              data: xData
            }
          ],
          series: []
        },
        options: []
      }

      option.baseOption.timeline.data.push(timeLineData[0])
      option.options.push({
        series: [
          {
            name: legend[0],
            type: 'bar',
            barWidth: 25,
            stack: '1',
            label: {
              normal: {
                show: false
              }
            },
            data: leftAxis,
            animationEasing: 'elasticOut'
          },
          {
            name: legend[1],
            type: 'bar',
            stack: '2',
            barWidth: 25,
            xAxisIndex: 2,
            yAxisIndex: 2,
            label: {
              normal: {
                show: false
              }
            },
            data: rightAxis,
            animationEasing: 'elasticOut'
          }
        ]
      })
      let height = (this.height - 20) / xData.length + 'px'
      this.options = option
      this.legend = xData
      this.legendHeight = height
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
.echarts {
  flex: 1;
}
.chartGraph {
  display: flex;
  .chartLegend {
    width: 150px;
    .chartLegend_item {
      &:last-child {
        font-weight: bold;
      }
    }
  }
}
</style>
