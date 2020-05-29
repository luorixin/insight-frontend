import Cookies from 'js-cookie'
import { Message, MessageBox } from 'element-ui'
import i18n from '../locale'

let Util = {}
Util.title = title => {
  title = title || process.env.VUE_APP_TITLE
  window.document.title = title
}

const TokenKey = 'Iactivate-Token'

Util.getToken = () => {
  return Cookies.get(TokenKey)
}

Util.setToken = token => {
  return Cookies.set(TokenKey, token)
}

Util.removeToken = () => {
  return Cookies.remove(TokenKey)
}

/**
 * 存储localStorage
 */
Util.setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
Util.getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
Util.removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 统一报错信息
 */
Util.errorProcessor = (vm, error, callback) => {
  // console.log(error);
  let result = error.response ? error.response.data.message : error.message
  Message.error(result || error.statusText || 'error')
}

/* eslint-disable prettier/prettier */
/* istanbul ignore next */
Util.showMsg = (msg, $confirm, type = 'alert', icon = 'cubeic-alert') => {
  $confirm
    ? MessageBox.alert(msg, i18n.t('common.tip'), {
      confirmButtonText: i18n.t('common.confirm'),
      callback: action => {
        $confirm()
      },
    })
    : Message.error(msg)
}

/**
 * json排序
 */
Util.sortJson = (order, sortBy, fun) => {
  let ordAlpah = order == 'asc' ? '>' : '<'
  let sortFun = new Function(
    'a',
    'b',
    'if (a.' +
      sortBy +
      '==null){a.' +
      sortBy +
      '=0};if (b.' +
      sortBy +
      '==null){b.' +
      sortBy +
      '=0};return ' +
      fun +
      '(a.' +
      sortBy +
      ')' +
      ordAlpah +
      fun +
      '(b.' +
      sortBy +
      ')?1:-1',
  )
  return sortFun
}

/**
 * json数组排序
 */
Util.sortTree = (data, order, sortBy, fun) => {
  data = data.sort(Util.sortJson(order, sortBy, fun))
  data.forEach(item => {
    if (item.childrens !== null && item.childrens.length > 0) {
      Util.sortTree(item.childrens, order, sortBy, fun)
    }
  })
  return data
}

/**
 * 简单数组比较
 */
Util.scalarArrayEquals = (array1, array2) => {
  return (
    array1.length == array2.length &&
    array1.every(function(v, i) {
      return v === array2[i]
    })
  )
}

/**
 * 数组查值
 */
Util.findItemFromArray = (array, children, key, value) => {
  let findItem = null
  let newArray = array.slice()
  let _find = arr => {
    let _isFind = false
    arr.forEach(item => {
      if (!_isFind) {
        if (item[key] && item[key] === value) {
          _isFind = true
          findItem = Object.assign({}, item)
        } else {
          item[children] && _find(item[children])
        }
      }
    })
  }
  _find(newArray)
  return findItem
}
/**
 * 按每N个元素分割成二维数组
 */
Util.splitArray = (N, Q) => {
  let R = [],
    F
  for (F = 0; F < Q.length; ) R.push(Q.slice(F, (F += N)))
  return R
}

/**
 * 将树形json某一字段全部取出存入数组
 * @onlyChildren 是否只显示children为空的字段
 */
Util.treeToArray = (json, key, onlyChildren) => {
  let arr = [],
    _json = Object.assign({}, json)
  let doPush = item => {
    if (onlyChildren) {
      if (!item.children || item.children.length === 0) {
        arr.push(item[key])
      }
    } else {
      arr.push(item[key])
    }
  }
  if (_json && key) {
    if (json[key]) {
      doPush(json)
      let _valtoArr = _arr => {
        _arr.forEach(item => {
          if (item[key]) {
            doPush(item)
          }
          if (item.children && item.children.length > 0) {
            _valtoArr(item.children)
          }
        })
      }
      if (json.children && json.children.length > 0) {
        _valtoArr(json.children)
      }
    }
  }
  return arr
}

/**
 * 将数字转换为汉字
 * @param {Number} money
 */
Util.convertCurrency = money => {
  //汉字的数字
  let cnNums = new Array(
    '零',
    '壹',
    '贰',
    '叁',
    '肆',
    '伍',
    '陆',
    '柒',
    '捌',
    '玖',
  )
  //基本单位
  let cnIntRadice = new Array('', '拾', '佰', '仟')
  //对应整数部分扩展单位
  let cnIntUnits = new Array('', '万', '亿', '兆')
  //对应小数部分单位
  let cnDecUnits = new Array('角', '分', '毫', '厘')
  //整数金额时后面跟的字符
  let cnInteger = '整'
  //整型完以后的单位
  let cnIntLast = '元'
  //最大处理的数字
  let maxNum = 999999999999999.9999
  //金额整数部分
  let integerNum
  //金额小数部分
  let decimalNum
  //输出的中文金额字符串
  let chineseStr = ''
  //分离金额后用的数组，预定义
  let parts
  if (money == '') {
    return ''
  }
  money = parseFloat(money)
  if (money >= maxNum) {
    //超出最大处理数字
    return ''
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  //转换为字符串
  money = money.toString()
  if (money.indexOf('.') == -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    let IntLen = integerNum.length
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum.substr(i, 1)
      let p = IntLen - i - 1
      let q = p / 4
      let m = p % 4
      if (n == '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        //归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  //小数部分
  if (decimalNum != '') {
    let decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1)
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum == '') {
    chineseStr += cnInteger
  }
  return chineseStr
}

Util.debounce = (func, wait, immediate) => {
  var timeout, result

  var debounced = function() {
    var context = this
    var args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout
      timeout = setTimeout(function() {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args)
      }, wait)
    }
    return result
  }

  debounced.cancel = function() {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}

Util.isNumber = n => {
  let RE = /^-{0,1}\d*\.{0,1}\d+$/
  return RE.test(n)
}

Util.trim = str => {
  return (str || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

Util.isEmpty = str => {
  return (
    str === null || typeof str === 'undefined' || Util.trim(str + '') === ''
  )
}

Util.formatNum = (str, len) => {
  let newStr = ''
  let count = 0
  str = Number(str).toFixed(len) + ''
  Util.isNumber(len) || (len = 2)
  let zero = ''
  for (let j = 0; j < len; j++) {
    zero += '0'
  }
  if (str.indexOf('.') == -1) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    if (len == 0) {
      str = newStr
    } else {
      str = newStr + '.' + zero //自动补小数点后len位
    }
  } else {
    for (let i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr //逐个字符相接起来
      }
      count++
    }
    str = newStr + (str + zero).substr((str + zero).indexOf('.'), len + 1)
  }
  return str
}

Util.sumTotalDays = dates => {
  if (!dates || dates.length < 2) return
  function convertDate(date) {
    return new Date(date.replace(/-/g, '/'))
  }
  let diff =
    1 +
    (convertDate(dates[1]).getTime() - convertDate(dates[0]).getTime()) /
      (60 * 60 * 24 * 1000)
  return diff
}

/**
 * 格式化日期
 */
Util.formateDate = (date = new Date(), fmt = 'yyyy-MM-dd') => {
  let o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    )
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      )
  return fmt
}

/**
 * 获取最近x天的日期范围
 */
Util.getLastXDays = (total = 0, fmt = 'yyyy-MM-dd') => {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * total)
  end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
  return [Util.formateDate(start, fmt), Util.formateDate(end, fmt)]
}

export default Util
