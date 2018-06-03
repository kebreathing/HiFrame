// 监听当前事件
// 事件处理程序
function onCreateFrame (e) {
  manager.addFrame()
}

// 删除当前框
function onDeleteFrame (e) {
  manager.deleteFrame()
}

function onPosFrame (e) {
  var pos = manager.posFrame()
  let str = 'l: ' + pos.left + '; t: ' + pos.top + '; w: ' + pos.width + "; h: " + pos.height + ";"
  var dialog = new Dialog('框位置', str)
  dialog.create()
}

// 位置锁定
function onFixFrame (e) {
  e.innerHTML = manager.fixFrame() ? '位置解锁' : '位置锁定'
}

// 大小锁定
function onLockFrame (e) {
  e.innerHTML = manager.lockFrame() ? '大小解锁' : '大小锁定'
}

// 上移层
function onUpperFrame (e) {
  manager.modifyFrameLayer(1)
}

// 下移层
function onLowerFrame (e) {
  manager.modifyFrameLayer(-1)
}

// 截屏：获取平布
function oncutFrame (e) {
  // 剪切
  var pos = manager.posFrame()
  canvas.width = pos.width
  canvas.height = pos.height
  // canvas的位置可以不用发生变化
  // canvas.style.top = pos.top
  // canvas.style.left = pos.left

  let img = document.getElementById('pimg')
  ctx.drawImage(img,
    pos.left, pos.top, pos.width, pos.height,
    0, 0, pos.width, pos.height)

  var tmpsrc = canvas.toDataURL('image/png')
  $('.display-view').css({
    'width': pos.width + 'px',
    'height': pos.height + 'px',
    'display': 'block'
  })
  $('#dimg').attr({
    'src': tmpsrc
  })
}

// 放大镜
function onglassFrame (e) {
  var status = manager.get_status()
  var txt
  switch (status) {
    case 'frame':
      status = 'glass'
      txt = '开启:放大镜'
      manager.setStatus('glass')
      manager.addGlassFrame()
      canvas.width = 200
      canvas.height = 200
      window.glassitvl = setInterval(function () {
        let pos = manager.posFrame()
        // 截取图片块
        let img = document.getElementById('pimg')
        ctx.drawImage(img,
          pos.left, pos.top, pos.width, pos.height,
          0, 0, pos.width * 2, pos.height * 2)

        // 显示在左边
        var tmpsrc = canvas.toDataURL('image/png')
        $('#gimg').attr('src', tmpsrc)
        $('#gimg').css('opacity', '1')
      }, 100)
      break;
    case 'glass':
      status = 'frame'
      txt = '关闭:放大镜'
      window.clearInterval(window.glassitvl)
      manager.clear()
      break;
    default:
      console.log('可自定义添加新的状态')
  }

  e.innerHTML = txt
}

// 弹出提示层
function onSelectDialog (e) {
  var dialog = new Dialog('提示', '手动框选功能尚未开通！')
  dialog.create()
}

$(document).ready(() => {
  // 插件管理：上传图片
  $('#fimg-uploader').change(function () {
    var reader = new FileReader()
    reader.onload = function () {
      $('#pimg').attr({
        'src': reader.result,
      })
      $('#pimg').css({
        'opacity': 1
      })

      // 上传图片要清空当前已经存在的框
      manager.clear()

      // 获取图片宽高
      setTimeout(function () {
        var img_width = _int($('#pimg').css('width'))
        var img_height= _int($('#pimg').css('height'))
        $('#parent').css({
          'width': img_width + 'px',
          'height': img_height + 'px'
        })
        manager.updatePSize()

        // 修改canvas的大小
        canvas.width = img_width
        canvas.height = img_height
        ctx.drawImage(document.getElementById('pimg'), 0, 0)
      }, 300)
    }

    reader.readAsDataURL(this.files[0])
  })
})
