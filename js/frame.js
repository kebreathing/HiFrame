/**
* Author: chris
* Created at 2018.5.30
*/
const _FRAME_STR = {
  container: function (id) {
    return '<div class="frame c-border-blue" id="' + id + '"></div>'
  },
  dotlu: function (id) {
    return '<i class="fa fa-circle dot dot-lu c-dot-blue" id="' + id + '"></i>'
  },
  dotru: function (id) {
    return '<i class="fa fa-circle dot dot-ru c-dot-blue" id="' + id + '"></i>'
  },
  dotlb: function (id) {
    return '<i class="fa fa-circle dot dot-lb c-dot-blue" id="' + id + '"></i>'
  },
  dotrb: function (id) {
    return '<i class="fa fa-circle dot dot-rb c-dot-blue" id="' + id + '"></i>'
  },
  layer: function (id, text) {
    return '<span class="layer c-dot-blue">' + text + '</span>'
  }
}

const _FRAME_STYLE = {
  focus_frame: 'c-border-yellow',
  focus_dot: 'c-dot-yellow',
  active_dot: 'c-dot-red',
  blur_frame: 'c-border-blue',
  blur_dot: 'c-dot-blue'
}

const _DOT_TYPE = {
  LEFT_UP: 'LU',
  RIGHT_UP: 'RU',
  LEFT_BOTTOM: 'LB',
  RIGHT_BOTTOM: 'RB'
}

function _get_dot (id) {
  if (id.indexOf('lu') >= 0) {
    return _DOT_TYPE.LEFT_UP
  } else if (id.indexOf('ru') >= 0) {
    return _DOT_TYPE.RIGHT_UP
  } else if (id.indexOf('lb') >= 0) {
    return _DOT_TYPE.LEFT_BOTTOM
  } else if (id.indexOf('rb') >= 0) {
    return _DOT_TYPE.RIGHT_BOTTOM
  }
}

function _int (str) {
  return parseInt(str)
}

class Frame {
  constructor (id, pid) {
    this.id = id
    this.pid = pid

    // 是否固定
    this.isResizable = false
    this.isFixed = false
    this.create()
  }

  create () {
    var that = this

    // 可自定义选择组件
    var el = $(_FRAME_STR.container('f_' + this.id))
    var dlu = $(_FRAME_STR.dotlu('dotlu_' + this.id))
    var dru = $(_FRAME_STR.dotru('dotru_' + this.id))
    var dlb = $(_FRAME_STR.dotlb('dotlb_' + this.id))
    var drb = $(_FRAME_STR.dotrb('dotrb_' + this.id))
    var slayer = $(_FRAME_STR.layer('span_' + this.id, 5))
    el.append(dlu)
        .append(dru)
          .append(dlb)
            .append(drb)
              .append(slayer)

    this.el = el
    this.dlu = dlu
    this.dru = dru
    this.dlb = dlu
    this.drb = drb
    this.slayer = slayer
  }

  // 记录frame的当前坐标
  record_move () {
    this.startX = _int(this.el.css('left'))
    this.startY = _int(this.el.css('top'))
  }

  // 记录当前被拖动的点
  record_dot (id) {
    this.dotType = _get_dot(id)
    // 记录当前的操作点
    this.act_dotType = _get_dot(id)
    this.startWidth = _int(this.el.css('width'))
    this.startHeight = _int(this.el.css('height'))
  }

  get_pos () {
    return {
      left: _int(this.el.css('left')),
      top: _int(this.el.css('top')),
      width: _int(this.el.css('width')),
      height: _int(this.el.css('height'))
    }
  }

  get_el () {
    return this.el
  }

  setResizable (value) {
    this.isResizable = value
  }

  setFixed (value) {
    this.isFixed = value
  }

  setZIndex (value) {
    let zindex = _int(this.el.css('z-index')) + value

    if (zindex < 0) {
      return
    }

    this.slayer.text(zindex)
    this.el.css({'z-index': zindex})
  }

  setPos (top, left, width, height) {
    if (this.isFixed) {
      console.log('已经固定: isFixed = true')
      return
    }

    // 框坐标设置
    let _top = this.startY + top
    let _left = this.startX + left
    let _width = _int(this.el.css('width'))
    let _height = _int(this.el.css('height'))

    if (_top < 0
      || _left < 0
      || _left + _width > width - 5
      || _top + _height > height - 5) {
        return
    }

    this.el.css({
      'top': _top  + 'px',
      'left': _left + 'px'
    })
  }

  setSize (top, left, width, height) {
    if (this.isResizable) {
      console.log('不可改变: isResizable = true')
      return
    }
    var that = this

    var _width = that.startWidth
    var _height = that.startHeight
    var _x = that.startX
    var _y = that.startY

    // 固定位置
    switch (that.act_dotType) {
      case _DOT_TYPE.LEFT_UP:
        top = -top
        left = -left

        if (_y - top < 0
          || _x - left < 0
          || _width + left < 0 || _height + top < 0) {
          return
        }
        that.el.css({
          'top': _y - top + 'px',
          'left': _x - left + 'px'
        })
        break;
      case _DOT_TYPE.RIGHT_UP:
        top = -top
        if (_y - top < 0
          || _x + left + _width > width - 5
          || _width + left < 0 || _height + top < 0) {
          return
        }
        that.el.css({
          'top': _y - top + 'px'
        })
        break;
      case _DOT_TYPE.LEFT_BOTTOM:
        left = -left
        if (_x - left < 0
          || _y + top + _height > height - 5
          || _width + left < 0 || _height + top < 0) {
          return
        }
        that.el.css({
          'left': _x - left + 'px'
        })
        break
      case _DOT_TYPE.RIGHT_BOTTOM:
        if (_x + left + _width > width - 5
          || _y + top + _height > height - 5
          || _width + left < 0 || _height + top < 0) {
          return
        }
        break;
      default:
        console.log('add your own position function')
    }

    that.el.css({
      'width': _width + left + 'px',
      'height': _height + top + 'px'
    })
  }
}

// 失去焦点
Frame.prototype.blur = function (cb) {
  $('#f_' + this.id).removeClass(_FRAME_STYLE.focus_frame)
  $('#f_' + this.id).children().removeClass(_FRAME_STYLE.focus_dot)
  return true
}

// 获取焦点
Frame.prototype.focus = function (cb) {
  $('#f_' + this.id).addClass(_FRAME_STYLE.focus_frame)
  $('#f_' + this.id).children().addClass(_FRAME_STYLE.focus_dot)
  return true
}

// 删除
Frame.prototype.delete = function (cb) {
  $('#f_' + this.id).remove()
}
