// js of Draggable frame
class DraggableFrame {
  /**
  * id: attribute of element
  * css: editable css
  */
  constructor (id, parentId) {
    this.id = id
    this.parentId = parentId
  }
  init () {
    this.parentEl = $('#' + this.parentId)
    // create element
    this.el = $('<div class="draggable-frame" id="' + this.id + '"></div>')
    this.dot1 = $('<div class="dot" id="dot1"></div>')
    this.dot2 = $('<div class="dot" id="dot2"></div>')
    this.dot3 = $('<div class="dot" id="dot3"></div>')
    this.dot4 = $('<div class="dot" id="dot4"></div>')
    this.focus_dot = $('<div class="focus-dot"></div>')

    this.el.css('visibility', 'visible')
    this.el.append(this.dot1)
            .append(this.dot2)
            .append(this.dot3)
            .append(this.dot4)
            .append(this.focus_dot)

    this.initFrameEventListener()
    this.initDotEventListener()

    this.parentEl.append(this.el)
  }
  /**
  * 框事件绑定
  */
  initFrameEventListener () {
    var that = this

    // Movable Frame
    function onFrameMovable (e) {
      e.stopPropagation()
      // 获得焦点
      that.get_focus()
      var diffX = e.clientX
      var diffY = e.clientY

      // constant
      var _top = that.int_css_of_el(that.el, 'top')
      var _left = that.int_css_of_el(that.el, 'left')
      var _width = that.int_css_of_el(that.el, 'width')
      var _height = that.int_css_of_el(that.el, 'height')
      var _pwidth = that.int_css_of_el(that.parentEl, 'width')
      var _pheight = that.int_css_of_el(that.parentEl, 'height')

      function mousemove (e2) {
        let dx = e2.clientX - diffX
        let dy = e2.clientY - diffY
        let nx = _left + dx
        let ny = _top + dy

        if (nx < 0 || ny < 0 || nx + _width > _pwidth || ny + _height > _pheight) {
          // do nothing
        } else {
          that.el.css({'top': ny  + 'px', 'left': nx  + 'px'})
        }
      }

      function mouseup (e2) {
        $(document).unbind('mousemove', mousemove)
        $(document).unbind('mouseup', mouseup)
      }

      $(document).bind('mousemove', mousemove)
      $(document).bind('mouseup', mouseup)
    }

    this.el.bind('mousedown', onFrameMovable)
  }
  initDotEventListener () {
    var that = this
    // 点击事件绑定在dot上
    function dotMousedown (e) {
      e.stopPropagation()
      // 获得焦点
      that.get_focus()

      var dotId = e.currentTarget.id

      // frame对的宽高
      var _width = that.int_css_of_el(that.el, 'width')
      var _height = that.int_css_of_el(that.el, 'height')
      var _pwidth = that.int_css_of_el(that.parentEl, 'width')
      var _pheight = that.int_css_of_el(that.parentEl, 'height')

      // position
      var _top = that.int_css_of_el(that.el, 'top')
      var _left= that.int_css_of_el(that.el, 'left')
      var diffX = e.clientX
      var diffY = e.clientY

      function dmousemove (e2) {
        let dx = e2.clientX - diffX
        let dy = e2.clientY - diffY

        // new width
        switch (dotId) {
          case 'dot1':
            dx = 0 - dx
            dy = 0 - dy
            if (_top - dy < 0
              || _left - dx < 0) {
              // do nothiing
            } else {
              that.el.css({
                'top': _top - dy + 'px',
                'left': _left - dx + 'px',
                'width': _width + dx + 'px',
                'height': _height + dy + 'px'
              })
            }
            break;
          case 'dot2':
            dy = 0 - dy
            if (_top - dy < 0
              || _left + _width + dx > _pwidth) {
              // do nothing
            } else {
              that.el.css({
                'top': _top - dy + 'px',
                'width': _width + dx + 'px',
                'height': _height + dy + 'px'
              })
            }
            break;
          case 'dot3':
            dx = 0 - dx
            if (_left - dx < 0
              || _top + _height + dy > _pheight) {
              // do nothing
            } else {
              that.el.css({
                'left': _left - dx + 'px',
                'width': _width + dx + 'px',
                'height': _height + dy + 'px'
              })
            }
            break;
          case 'dot4':
            if (_left + _width + dx > _pwidth
              || _top + _height + dy > _pheight) {
              // do nothing
            } else {
              that.el.css({
                'width': _width + dx + 'px',
                'height': _height + dy + 'px'
              })
            }
            break;
          default:
            console.log('no more dots.')
        }
      }

      function dmouseup (e2) {
        $(document).unbind('mousemove', dmousemove)
        $(document).unbind('mouseup', dmouseup)
      }

      $(document).bind('mousemove', dmousemove)
      $(document).bind('mouseup', dmouseup)
    }
    // 移动事件绑定在parent中

    this.dot1.bind('mousedown', dotMousedown)
    this.dot2.bind('mousedown', dotMousedown)
    this.dot3.bind('mousedown', dotMousedown)
    this.dot4.bind('mousedown', dotMousedown)
  }
  setCSS (css) {
    if (css === undefined) {
      throw new Exception('CSS cannot be null')
    }

    this.el.css(css)
  }
  int_css_of_el (el, cssName) {
    return parseInt(el.css(cssName))
  }
  lost_focus () {
    this.el.children('.focus-dot').css({'visibility': 'hidden'})
  }
  get_focus () {
    this.el.children('.focus-dot').css({'visibility': 'visible'})
  }
  get_el () {
    return this.el
  }
}

// 建立DraggableFrame的管理池 manager
class FrameManager {
  constructor () {
    this.frames = []
    this.current_frame = undefined
  }
  createFrame (id, parentId, css) {
    var that = this
    if (this.current_frame !== undefined) {
        this.current_frame.lost_focus()
    }

    var instance = new DraggableFrame(id, parentId, css)
    instance.init()
    instance.setCSS(css)
    instance.get_focus()
    instance.get_el().bind('click', function () {
      that.current_frame.lost_focus()
      instance.get_focus()
      that.current_frame = instance
    })

    this.current_frame = instance
    this.frames.push({instance: instance, visibility: true, focus: false})
  }
}
