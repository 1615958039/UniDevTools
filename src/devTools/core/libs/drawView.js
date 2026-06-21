/**
 * 绘制调试工具
 */

/**
 * 入口文件
 */
function init(options, devTools) {

  let sysInfo = uni.getSystemInfoSync()

  let tagConfig = uni.getStorageSync("devTools_tagConfig");
  if (!tagConfig) {
    tagConfig = {}
  }

  tagConfig = Object.assign({
    show: options.bubble.status,
    x: sysInfo.screenWidth - 90,
    y: sysInfo.screenHeight - 90,
  }, tagConfig)
  tagConfig.show = options.bubble.status;

  // 拖动范围限制
  let dragLimit = {
    min: { x: 0, y: sysInfo.statusBarHeight, },
    max: {
      x: sysInfo.screenWidth - 70,
      y: sysInfo.screenHeight - 24 - sysInfo.statusBarHeight,
    }
  }

  let view = new plus.nativeObj.View('debugTag', {
    top: tagConfig.y + 'px',
    left: tagConfig.x + 'px',
    height: '24px',
    width: '70px',
    // backgroundColor: options.bubble.bgColor,
  });

  view.drawRect({
    color: options.bubble.bgColor,
    // borderColor: "#222222",
    // borderWidth: '1px',
    radius: '6px',
  }, {
    top: '0px',
    left: '0px',
    height: '24px',
    width: '70px',
  })

  view.drawText(options.bubble.text, {}, {
    size: '12px',
    color: options.bubble.color,
    weight: 'bold'
  });

  if (tagConfig.show) {
    view.show();
  }

  let isTouch = false;


  let touchStart = {
    l: 0,
    t: 0,
    x: 0,
    y: 0,
    time: 0,
    hasMove: false,
  }

  view.addEventListener("touchstart", (e) => {
    isTouch = true;
    touchStart.l = e.clientX;
    touchStart.t = e.clientY;
    touchStart.time = new Date().getTime();
    touchStart.hasMove = false;
  })

  view.addEventListener("touchmove", (e) => {
    if (!isTouch) return;
    if (!touchStart.hasMove) {
      touchStart.hasMove = true;
    }
    let x = e.screenX - touchStart.l;
    let y = e.screenY - touchStart.t;
    x = Math.min(Math.max(x, dragLimit.min.x), dragLimit.max.x)
    y = Math.min(Math.max(y, dragLimit.min.y), dragLimit.max.y)

    view.setStyle({
      top: y + 'px',
      left: x + 'px',
    })
    touchStart.x = x;
    touchStart.y = y;
  })

  view.addEventListener("touchend", (e) => {
    isTouch = false;
    if (
      !touchStart.hasMove
      || touchStart.time > (new Date().getTime() - 300)
    ) {// 单击事件

      let pages = getCurrentPages()
      let route = options.route.substring(1, options.route.length - 2);
      if (pages[pages.length - 1].route == route) {
        // 已经处于debug页面，不响应点击事件
        return;
      }
      devTools.show()

    } else { //拖拽结束事件

      tagConfig.x = touchStart.x;
      tagConfig.y = touchStart.y;

      uni.setStorageSync("devTools_tagConfig", tagConfig)

    }
  })

  uni.setStorageSync("devTools_tagConfig", tagConfig)

}

export default init;