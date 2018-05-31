// 弹出框类
const _DIALOG_STR = {
  dialog: '<div class="dialog"></div>',
  i: '<i class="fa fa-close"></i>',
  h2: function (text) {
    return '<h2>' + text + '</h2>'
  },
  p: function (text) {
    return '<p>' + text + '</p>'
  }
}

class Dialog {
  constructor () {
    if (arguments.length < 2) {
      throw '参数至少为2个：title, tips, [timeout]'
    }

    this.title = arguments[0]
    this.tips = arguments[1]
    this.timeout = arguments.length === 3 ? arguments[2] : 2000
  }

  create () {
    var dialog = $(_DIALOG_STR.dialog)
    // var i = $(_DIALOG_STR.i)
    var h2 =$(_DIALOG_STR.h2(this.title))
    var p = $(_DIALOG_STR.p(this.tips))

    dialog.append(h2).append(p)
    $(document.body).append(dialog)

    // set timeout
    setTimeout(function () {
      $('.dialog').remove()
    }, this.timeout);
  }
}
