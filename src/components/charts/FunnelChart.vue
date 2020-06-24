<template>
  <div class="chartGraph">
    <div class="funnelLegend funnelEntrance">
      <div class="funnelLegend-detail">
        <div class="funnelLegend-detail_exit">
          <span class="fa fa-caret-right"></span>
          <p>Entrance</p>
          <div class="exit_con">
            <div><span>signin.html</span><span>687 (11.11%)</span></div>
            <div><span>store.html</span><span>354 (11.11%)</span></div>
            <div><span>basket.html</span><span>267 (11.11%)</span></div>
          </div>
        </div>
        <div class="funnelLegend-detail_line"></div>
      </div>
    </div>
    <v-chart
      :options="options"
      style="width:250px;z-index:999;"
      :autoresize="true"
    />
    <div class="funnelLegend">
      <div
        class="funnelLegend-detail"
        v-for="(item, i) in datas"
        :key="'funnelChart_' + item.name"
      >
        <div class="funnelLegend-detail_line"></div>
        <!-- <div class="funnelLegend-detail_con">
          <p>{{ item.name }}</p>

          <p>{{ item.value | toThousandFilter }}</p>
          <p>( {{ getPer(item.value) }}%)</p>
        </div> -->
        <div
          class="funnelLegend-detail_process"
          :style="{ left: processLeft(i) }"
          v-if="i > 0"
        >
          <p>proceed to {{ item.name }}</p>
          <p>{{ item.value | toThousandFilter }} ({{ getPer(item.value) }}%)</p>
        </div>
        <div class="funnelLegend-detail_exit" v-if="item.Exit">
          <span class="fa fa-caret-right"></span>
          <p>{{ $t('funnelAnalysis.exit') }}</p>
          <div class="exit_con">
            <div
              v-for="(exits, key, index) in item.Exit"
              :key="'exit_' + index"
            >
              <span>{{ key }}</span>
              <span>{{ exits }} ( 11.11% )</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/funnel'
import 'echarts/lib/component/tooltip'
import Util from '@/utils'
export default {
  name: 'funnelChart',
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
    },
    height: {
      type: Number,
      default: 475
    }
  },
  components: {
    'v-chart': ECharts
  },
  data() {
    let min = 0,
      max = 100,
      _min = 1,
      total = 0,
      seriesData = [],
      fixedValue = [20, 40, 60, 80, 100]
    for (let i = 0; i < this.datas.length; i++) {
      let data = this.datas[i]
      let value = parseFloat(data.value)
      total += value
      if (min == 0 || min > value) {
        min = value
      }
      if (max < value) {
        max = value
      }
      if (value == 0) {
        _min = 0
      }
      let fixedObj = Object.assign(data, {
        trueValue: data.value,
        value: fixedValue[i]
      })
      seriesData.push(fixedObj)
    }
    if (_min == 0) {
      min = 0
    }
    return {
      options: {
        color: this.color,
        tooltip: {
          trigger: 'item',
          backgroundColor: '#f2f2f2',
          borderColor: '#dfdfdf',
          borderWidth: 1,
          show: false,
          textStyle: {
            color: '#333',
            fontFamily: 'Open Sans'
          },
          extraCssText: 'text-align:left;',
          formatter: function(params) {
            // console.log(params)
            let _li = ''
            let _header =
              '<label style="font-size: 12px;float:left;overflow:hidden;text-overflow:ellipsis;width:120px;margin:0 5px;font-weight:bold;">' +
              params.name +
              '</label>'
            if (params.data.Channels) {
              for (let j in params.data.Channels) {
                _li +=
                  '<li style="z-index:99999;display:block;white-space:nowrap;box-sizing: border-box;float:left;overflow:hidden;text-overflow:ellipsis;width:180px;height:25px;line-height:25px;" title="' +
                  j +
                  '">' +
                  '<span style="float:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:110px;">' +
                  j +
                  '</span>' +
                  '<span style="float:right;">' +
                  Util.getKWMformat(params.data.Channels[j]) +
                  '</span>' +
                  '</li>'
              }
            }
            let _html =
              '<div style="width:200px;overflow:hidden;zoom:1;">' +
              _header +
              '<ul style="float:left;list-style:none;padding:0;margin:0 5px;position:relative">' +
              _li +
              '</ul></div>'
            return _html
          }
        },
        calculable: true,
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '0%',
            top: 0,
            bottom: 0,
            width: '100%',
            // min: min,
            // max: max,
            minSize: '20%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
              fontFamily: 'Open Sans',
              formatter: ['{a|{b}}', '{c}'].join('\n'),
              rich: {
                a: {
                  lineHeight: 30,
                  color: '#fff',
                  fontWeight: 'bold'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1
              }
            },
            data: seriesData
          }
        ]
      },
      total: total
    }
  },
  methods: {
    getPer(value) {
      return this.total == 0
        ? 0
        : parseFloat(((value * 100) / this.total).toFixed(2))
    },
    processLeft(index) {
      return (-(250 / (this.datas.length + 1)) / 2) * index + 10 + 'px'
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
  width: 1018px;
  margin: auto;
}
.funnelLegend {
  display: flex;
  flex-direction: column;
  flex: 1;
  .funnelLegend-detail {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    z-index: 99;
    .funnelLegend-detail_line {
      height: 1px;
      width: 280px;
      margin-left: -125px;
      background: #dfdfdf;
    }
    .funnelLegend-detail_con {
      margin: 0 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        line-height: 20px;
        &:first-child {
          font-weight: bold;
        }
      }
    }
    .funnelLegend-detail_exit {
      width: 160px;
      // align-self: flex-end;
      border: 1px solid #dfdfdf;
      padding: 10px;
      background: #fff;
      position: relative;
      opacity: 0.99;
      .fa {
        position: absolute;
        left: 0;
        top: 15px;
      }
      p {
        font-weight: bold;
        line-height: 20px;
      }
      .exit_con {
        div {
          display: flex;
          justify-content: space-between;
          line-height: 20px;
          span {
            font-size: 10px;
            color: #151515;
          }
        }
      }
    }
    .funnelLegend-detail_process {
      position: absolute;
      top: -10px;
      p {
        line-height: 17px;
        &:first-child {
          font-weight: bold;
        }
      }
    }
  }
}
.funnelEntrance {
  position: relative;
  .funnelLegend-detail {
    &:first-child {
      position: absolute;
      top: -50px;
      right: 0;
    }
  }
}
</style>