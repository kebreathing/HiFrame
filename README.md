# HiFrame!
Draggable-frame是一款以JS+Jquery编写的可拖拽式多功能的“截屏框”，提供一下功能：
1. 可拖拽-Movable：具有边界性，通过绑定父元素实现限制框的移动；
2. 可伸缩-Resizable：放大缩小可以在框的四个角中实现；
3. 可插件化-Pluginable：通过类插件方式，可实现在现有样式的框上自定义添加组件；
4. 易修改-Easy-changable：暴露对应接口，用户可实现直接修改框样式；
5. 高度可管理性-Highly-Managable：通过Manager对所有实例化的框进行管理，以满足多种业务场景；

## 使用说明
* 初始化
    // 全局引入HiFrame管理器，参数为绑定的父元素id
    var manager = new FrameManager("paren")
    // 初始化事件监听：鼠标点击、移动、松开
    manager.initEventListener()
    // 如果需要截屏或放大镜功能，需要初始化canvas
    var canvas = document.getElementById('pcanvas')
    var ctx = canvas.getContext('2d')
* 添加新的框
    manager.addFrame()    // 默认出现在被绑定元素的左上角
* 删除当前框
    manager.deleteFrame() // 删除当前处于活跃状态的框
* 固定当前框的位置
    manager.fixFrame()    // 固定当前处于活跃状态的框的位置
* 固定当前框的大小
    manager.lockFrame()   // 固定当前处于活跃状态的框的大小
* 调整框的层级
    manager.modifyFrameLayer(1)   // 上移
    manager.modifyFrameLayer(-1)  // 下移
* 获得当前框的位置信息
    manager.posFrame()    // 返回对象 {left: '', top: '', width: '', height: ''}
* 清空管理前当前的所有框
    manager.clear()
* 截屏、放大镜是当前功能的额外扩展，详细内容请直接阅读源码

## 功能描述
| Single Frame 单体框功能说明
描述框具备的功能：
1. 初始大小可调节，框的宽高可以自由调节，最高抽象为宽高都为0。
2. 初始位置可调节，框的初始位置可以出现在任何地方，距离：被绑定的父节点左上角、被绑定的父节点中间。
3. 初始样式可修改，框初始样式可通过setCSS输入一个存放css属性的对象事项。
4. 框可自由拖拽，受父节点位置限制。
5. 框大小可由框上四角拖拽实现，以框的左上角作为判断大小的参照点。
6. 框位置、大小可实时获取。
7. 框实例可实时获取。
8. 框实例化方式：固定宽高实例化、自由框（手动框选）选实例化。
9. 框删除或隐藏
10. 框的层级设置
11. 框位置锁定
12. 框大小锁定

| Frame Manager 框管理器功能说明
描述管理器具备的功能：
1. 管理当前实例化的框；
2. 记录当前处于焦点的框；

| Extendsion 扩展功能
1. 截屏（首先需要完成上传功能）
2. 放大镜

| Implementation
实现原理：
1. 设计模式。
2. 放大镜部分使用canvas + setInterval定时器实现，canvas会实时刷新。
