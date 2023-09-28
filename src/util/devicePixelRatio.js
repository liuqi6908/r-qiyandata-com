class DevicePixelRatio {
  constructor() {
    // this.flag = false;
  }

  // 获取系统类型
  _getSystem() {
    let agent = navigator.userAgent;
    // 现只针对windows处理，其它系统暂无该情况，如有，继续在此添加
    return !(/Android|webOS|iPhone|iPod|BlackBerry/i.test(agent));
  }

  // 监听方法兼容写法
  _addHandler(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  }

  // 校正浏览器缩放比例
  _correct() {
    // 页面devicePixelRatio（设备像素比例）变化后，计算页面body标签zoom修改其大小，来抵消devicePixelRatio带来的变化。
    let zoom = screen.availWidth / 1920;
    /* if (zoom !== 1)
      document.getElementsByTagName('body')[0].style.zoom = zoom; */
  }

  // 监听页面缩放
  _watch() {
    let t = this;
    // 注意这个方法是解决全局有两个window.resize
    t._addHandler(window, 'resize', function () {
      // 重新校正
      t._correct()
    })
  }

  // 初始化页面比例
  init() {
    let t = this;
    // 判断设备，目前只在windows系统下校正浏览器缩放比例
    if (t._getSystem()) {
      // 初始化页面校正浏览器缩放比例
      t._correct();
      /*// 开启监听页面缩放
      t._watch();*/
    }
  }
}

export default DevicePixelRatio;
