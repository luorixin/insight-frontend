let exportUtil = {}

const EXPORT_ID = 'reports_pdf'
const EXPORT_TITLE_ID = 'title_pdf'

exportUtil.initDom = conId => {
  document.body.scrollTop = 0
  document.body.scrollLeft = 0
  document.documentElement.scrollTop = 0
  document.documentElement.scrollLeft = 0
  let width = document.getElementById(conId).offsetWidth + 40
  document
    .getElementById(EXPORT_TITLE_ID)
    .getElementsByClassName(
      'headerWrapper'
    )[0].style = `position:relative;width: ${width}px!important;min-width:${width}px!important`
  let html =
    document.getElementById(EXPORT_TITLE_ID).innerHTML +
    '<div style="padding: 20px">' +
    document.getElementById(conId).innerHTML +
    '</div>'

  let cloneConId = conId
  document.getElementById(EXPORT_ID).innerHTML = html
  document.getElementById(EXPORT_ID).style.width = '100%'
  document.getElementById(EXPORT_ID).style.height = '100%'
  // document.getElementById(EXPORT_ID).style.padding = '20px'
  document.getElementById(EXPORT_ID).parentNode.style.display = 'block'
}

exportUtil.fixCanvas = cloneConId => {
  // radioGroup
  document
    .getElementById(EXPORT_ID)
    .querySelectorAll('.el-radio-group')
    .forEach((group, index) => {
      group.querySelectorAll('[type=radio]').forEach(item => {
        item.setAttribute('name', 'export_tab_select' + index)
        if (item.parentNode.classList.contains('is-active')) {
          item.checked = true
        }
      })
    })

  // canvas
  function getParentId($this) {
    var id = $this.getAttribute('id')
    if (id) {
      return id
    } else {
      return getParentId($this.parentNode)
    }
  }
  document
    .getElementById(EXPORT_ID)
    .querySelectorAll('canvas')
    .forEach(function(item, i) {
      let container = item.parentNode
      let cloneId = getParentId(container)
      let width = parseInt(cloneId.offsetWidth)
      let oldCanvas = document.querySelectorAll('#' + cloneConId + ' canvas')[i]
      let oldStyle = document
        .querySelectorAll('#' + cloneConId + ' canvas')
        [i].getAttribute('style')
      //create a new canvas
      let newCanvas = document.createElement('canvas')
      let context = newCanvas.getContext('2d')

      //set dimensions
      newCanvas.width = oldCanvas.width
      newCanvas.height = oldCanvas.height
      newCanvas.style = oldCanvas.style

      //apply the old canvas to the new one
      context.drawImage(oldCanvas, 0, 0)
      // container.html(newCanvas);
      item.insertAdjacentElement('afterend', newCanvas)
      item.nextElementSibling.setAttribute('style', oldStyle)
      item.parentNode.removeChild(item)
    })
}

export default exportUtil
