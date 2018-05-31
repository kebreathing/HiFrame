/**
* Author: chris
* Created at 2018.5.30
*/

function _uuid () {
  return Math.floor(Math.random() * 1000000) + ''
}

class FrameManager {
  constructor (pid) {
    this.pid = pid
    this.pel = $('#' + pid)

    // 状态变量记录
    this.isInitial = false
    this.isMouseDown = false

    // 当前框的相关变量记录
    this.current_id = undefined
    this.current_frame = undefined

    // 所有框记录
    this.frameMap = new Map()
  }

  // 信息同步：非manager内容
  syncControlView () {
    if (this.current_frame === undefined) {
      $('#btn-fix').text('位置锁定')
      $('#btn-lock').text('大小锁定')
      return
    }
    $('#btn-fix').text(this.current_frame.isFixed ? '位置解锁' : '位置锁定')
    $('#btn-lock').text(this.current_frame.isResizable ? '大小解锁' : '大小锁定')
  }

  validateAction () {
    return this.current_frame !== undefined
  }
}

FrameManager.prototype.initEventListener = function () {
  function onmousedown (e) {
    that.isMouseDown = true

    if (e.target) {
      let id = e.target.id
      that.current_id = id.split('_')[1]
      if (id.indexOf('f_') >= 0) {
        that.isFrame = true
        // 让上一个current_frame失去焦点
        that.current_frame !== undefined && that.current_frame.blur()
        that.current_frame = that.frameMap.get(that.current_id)
        that.current_frame.focus()

        that.current_frame.record_move()
        that.syncControlView()
      } else if (id.indexOf('dot') >= 0) {
        that.isDot = true
        that.current_frame !== undefined && that.current_frame.blur()
        that.current_frame = that.frameMap.get(that.current_id)
        that.current_frame.focus()

        that.current_frame.record_move()
        that.current_frame.record_dot(id)
        that.syncControlView()
      }

      that.diffX = e.clientX
      that.diffY = e.clientY
    }
  }

  function onmousemove (e) {
    if (!that.isMouseDown) {
      return
    }


    let dx = e.clientX - that.diffX
    let dy = e.clientY - that.diffY

    // 获取当前截点id
    if (that.isFrame) {
      that.current_frame.setPos(dy, dx)
    } else if (that.isDot) {
      that.current_frame.setSize(dy, dx)
    }
  }

  function onmouseup (e) {
    that.isMouseDown = that.isFrame = that.isDot = false
    that.diffX = that.diffY = 0
  }

  // 事件绑定
  var that = this

  $(document).bind('mousedown', onmousedown)
  $(document).bind('mousemove', onmousemove)
  $(document).bind('mouseup', onmouseup)
}

FrameManager.prototype.addFrame = function () {
  let fid = _uuid()
  let frame = new Frame(fid, this.pid)

  this.pel.append(frame.get_el())
  this.current_frame !== undefined && this.current_frame.blur()
  this.current_frame = frame
  this.current_frame.focus()

  this.frameMap.set(fid, frame)
  this.syncControlView()
}

FrameManager.prototype.deleteFrame = function () {
  if (!this.validateAction()) {
    return
  }

  this.frameMap.delete(this.current_id)
  this.current_frame.delete()

  this.current_id = undefined
  this.current_frame = undefined
  this.syncControlView()
}

FrameManager.prototype.fixFrame = function () {
  // 固定当前框位置
  if (!this.validateAction()) {
    return
  }

  let isFixed = !this.current_frame.isFixed
  this.current_frame.setFixed(isFixed)
  return isFixed
}


FrameManager.prototype.lockFrame = function () {
  // 固定当前框大小
  if (!this.validateAction()) {
    return
  }

  let isLocked = !this.current_frame.isResizable
  this.current_frame.setResizable(isLocked)
  return isLocked
}

FrameManager.prototype.modifyFrameLayer = function (offset) {
  // 修改框的层级
  if (!this.validateAction()) {
    return
  }

  this.current_frame.setZIndex(offset)
}


// 事件处理程序
function onCreateFrame (e) {
  manager.addFrame()
}

// 删除当前框
function onDeleteFrame (e) {
  manager.deleteFrame()
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
