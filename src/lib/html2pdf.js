// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function(dom, title, callback) {
      if (!dom || !title) return
      let $dom = document.querySelector(dom)
      let width = $dom.offsetWidth // 获取dom 宽度
      let height = $dom.offsetHeight // 获取dom 高度
      let canvas = document.createElement('canvas') // 创建一个canvas节点
      let scale = 1 // 定义任意放大倍数 支持小数
      canvas.width = width * scale // 定义canvas 宽度 * 缩放
      canvas.height = height * scale // 定义canvas高度 *缩放
      canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale
      let opts = {
        scale: scale, // 添加的scale 参数
        canvas: canvas, // 自定义 canvas
        // logging: true, //日志开关，便于查看html2canvas的内部执行流程
        width: width, // dom 原始宽度
        height: height,
        useCORS: true // 【重要】开启跨域配置
      }
      html2Canvas($dom, opts).then(function(canvas) {
        // 1、单纯分页，内容可能被截断，但速度快
        /*
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        // 水印
        // let ctx = canvas.getContext('2d');
        // ctx.rotate(Math.PI / 180 * 20);
        // ctx.font = '60px microsoft yahei';
        // ctx.fillStyle = 'rgba(255,255,255,1)';
        // ctx.strokeText('iClick', 250, 50);
        let pageHeight = (contentWidth / 592.28) * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = (592.28 / contentWidth) * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
        callback && callback()
        */
        // 2、分页，尽量防止内容被截断，但是速度特别慢

        // 未生成pdf的html页面高度
        let leftHeight = canvas.height

        let a4Width = 595.28
        let a4Height = 841.89
        // 一页pdf显示html页面生成的canvas高度;
        let a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height)

        // pdf页面偏移
        let position = 0

        let pageData = canvas.toDataURL('image/jpeg', 1.0)

        let pdf = new JsPDF('x', 'pt', 'a4')
        let index = 1
        let canvas1 = document.createElement('canvas')
        let height
        pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen')

        function createImpl(canvas, index) {
          if (leftHeight > 0) {
            index++

            let checkCount = 0
            if (leftHeight > a4HeightRef) {
              let i = position + a4HeightRef
              for (i = position + a4HeightRef; i >= position; i--) {
                let isWrite = true
                for (let j = 0; j < canvas.width; j++) {
                  let c = canvas.getContext('2d').getImageData(j, i, 1, 1).data

                  if (c[0] !== 0xff || c[1] !== 0xff || c[2] !== 0xff) {
                    isWrite = false
                    break
                  }
                }
                if (isWrite) {
                  checkCount++
                  if (checkCount >= 10) {
                    break
                  }
                } else {
                  checkCount = 0
                }
              }
              height =
                Math.round(i - position) || Math.min(leftHeight, a4HeightRef)
              if (height <= 0) {
                height = a4HeightRef
              }
            } else {
              height = leftHeight
            }

            canvas1.width = canvas.width
            canvas1.height = height

            // console.log(index, 'height:', height, 'pos', position);

            let ctx = canvas1.getContext('2d')
            ctx.drawImage(
              canvas,
              0,
              position,
              canvas.width,
              height,
              0,
              0,
              canvas.width,
              height
            )

            let pageHeight = Math.round((a4Width / canvas.width) * height)
            // pdf.setPageSize(null, pageHeight)
            if (position !== 0) {
              pdf.addPage()
            }
            pdf.addImage(
              canvas1.toDataURL('image/jpeg', 1.0),
              'JPEG',
              0,
              0,
              a4Width,
              (a4Width / canvas1.width) * height
            )
            leftHeight -= height
            position += height
            if (leftHeight > 0) {
              setTimeout(createImpl, 500, canvas, index)
            } else {
              pdf.save(title + '.pdf')
              callback && callback()
            }
          }
        }

        // 当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < a4HeightRef) {
          pdf.addImage(
            pageData,
            'JPEG',
            0,
            0,
            a4Width,
            (a4Width / canvas.width) * leftHeight
          )
          pdf.save(title + '.pdf')
          callback && callback()
        } else {
          try {
            pdf.deletePage(0)
            setTimeout(createImpl, 500, canvas, index)
          } catch (err) {
            // console.log(err)
          }
        }
      })
    }
    Vue.prototype.getPdf2 = function(dom, title, callback) {
      const WGUTTER = 15 // 横向页边距
      let deleteNullPage = 0 // 这完全是我加的特殊逻辑了 不知道为啥生成canvas后的高度会比现在的高度高一些  就会多一个空页 用这个筛选掉 可能最后一页的页尾没了 不过还好吧...
      const SIZE = [595.28, 841.89] // a4宽高
      let node = document.querySelector(dom)
      let nodeH = node.clientHeight
      let nodeW = node.clientWidth
      const pageH = (nodeW / (SIZE[0] - 2 * WGUTTER)) * SIZE[1]
      let modules = node.childNodes
      let pageFooterH = 10 // 10为页尾的高度
      // this.addPageHeader(node, node.childNodes[0]); // 添加页头
      // console.log(node.clientHeight, node.clientWidth, pageH)
      for (let i = 0, len = modules.length; i < len; i++) {
        len = modules.length // 因为加了页头页尾后modules.length会变 这里更新一下len
        let item = modules[i]
        if (typeof item.clientHeight === 'undefined') {
          // 过滤空元素
          continue
        }
        // div距离body的高度是pageH的倍数x,但是加上自身高度之后是pageH的倍数x+1
        let beforeH = item.offsetTop + pageFooterH
        let afterH = item.offsetTop + item.clientHeight + pageFooterH
        let currentPage = parseInt(beforeH / pageH)
        console.log(currentPage, parseInt(afterH / pageH))
        // console.log(pageH, item.offsetTop, item.clientHeight, currentPage, parseInt(afterH / pageH), item)
        if (
          currentPage !== parseInt(afterH / pageH) &&
          item.clientHeight < pageH
        ) {
          let diff = pageH - (item.offsetTop % pageH) - pageFooterH
          // console.log(pageH, item.offsetTop, item.clientHeight, lastItemAftarH, diff)
          // console.log(modules[j - 1].offsetTop, modules[j - 1].clientHeight)
          // 加页尾
          this.addPageFooter(node, item, currentPage + 1, diff)
          // 加页头
          this.addPageHeader(node, item)
        }
        if (i === modules.length - 1) {
          // 加了页头页尾后modules.length会变
          let diff = pageH - (afterH % pageH)
          deleteNullPage = diff + pageFooterH // 这完全是我加的特殊逻辑了 不知道为啥生成canvas后的高度会比现在的高度高一些  就会多一个空页 我把这里加上之后
          // console.log(pageH, afterH, diff)
          // 加页尾
          this.addPageFooter(node, item, currentPage + 1, diff, true)
        }
      }
      let obj = document.querySelector(dom)
      let width = obj.clientWidth
      let height = obj.clientHeight
      let canvasBox = document.createElement('canvas')
      let scale = window.devicePixelRatio
      let rect = obj.getBoundingClientRect()
      canvasBox.width = width * scale
      canvasBox.height = height * scale

      canvasBox.style.width = width + 'px'
      canvasBox.style.height = height + 'px'
      canvasBox.getContext('2d').scale(scale, scale)
      canvasBox.getContext('2d').translate(-rect.left, -rect.top)

      // const WGUTTER = 10  // 横向页边距
      html2Canvas(document.querySelector(dom), {
        backgroundColor: null,
        background: '#FFFFFF',
        useCORS: true, //  看情况选用上面还是下面的，
        scale: scale,
        canvas: canvasBox,
        crossOrigin: 'Anonymous'
      }).then(function(canvas) {
        let pdf = new JsPDF('', 'pt', 'a4', true) // A4纸，纵向
        let ctx = canvas.getContext('2d')
        let a4w = SIZE[0] - 2 * WGUTTER
        let a4h = SIZE[1] // A4大小，210mm x 297mm，两边各保留10mm的边距，显示区域190x297
        let imgHeight = pageH // 按A4显示比例换算一页图像的像素高度
        let renderedHeight = 0

        let page
        while (renderedHeight < canvas.height + 1) {
          // 这个-1时因为有时
          page = document.createElement('canvas')
          page.width = canvas.width
          page.height = Math.min(
            imgHeight,
            canvas.height - renderedHeight - deleteNullPage
          ) // 可能内容不足一页

          // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
          page
            .getContext('2d')
            .putImageData(
              ctx.getImageData(
                0,
                renderedHeight,
                canvas.width,
                Math.min(imgHeight, canvas.height - renderedHeight)
              ),
              0,
              0
            )
          pdf.addImage(
            page.toDataURL('image/jpeg', 1.0),
            'JPEG',
            WGUTTER,
            0,
            a4w,
            (a4w * page.height) / page.width
          ) // 添加图像到页面
          // console.log(page.height, page.width, Math.min(a4h, a4w * page.height / page.width))

          renderedHeight += imgHeight
          console.log(renderedHeight, imgHeight, canvas.height, deleteNullPage)
          if (renderedHeight < canvas.height - deleteNullPage) {
            pdf.addPage() // 如果后面还有内容，添加一个空页
          } else {
            break
          }
        }
        pdf.save(title + '.pdf')
        callback && callback()
      })
    }
    Vue.prototype.addPageHeader = (node, item) => {
      let pageHeader = document.createElement('div')
      pageHeader.className = 'c-page-head'
      pageHeader.innerHTML = '页头内容'
      node.insertBefore(pageHeader, item)
    }
    Vue.prototype.addPageFooter = (
      node,
      item,
      currentPage,
      diff,
      isLastest
    ) => {
      console.log(item.offsetTop, diff)
      let pageFooter = document.createElement('div')
      pageFooter.className = 'c-page-foot'
      pageFooter.innerHTML = '第' + currentPage + ' 页'
      isLastest
        ? node.insertBefore(pageFooter, null)
        : node.insertBefore(pageFooter, item)
      pageFooter.style.marginTop = diff + 'px'
      pageFooter.style.marginBottom = '10px'
    }
  }
}
