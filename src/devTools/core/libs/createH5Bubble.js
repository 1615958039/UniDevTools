/**
 *! 创建h5页面上拖动的气泡标签
 */
function createH5Bubble(options, devTools) {

  let tagConfig = localStorage.getItem("devTools_tagConfig");
  if (!tagConfig) {
    tagConfig = {}
  } else {
    tagConfig = JSON.parse(tagConfig)
  }

  tagConfig = Object.assign({
    show: options.bubble.status,
    x: window.innerWidth - 90,
    y: window.innerHeight - 90,
  }, tagConfig);

  tagConfig.show = options.bubble.status;

  // 拖动范围限制
  let dragLimit = {
    min: { x: 0, y: 0, },
    max: {
      x: window.innerWidth - 70,
      y: window.innerHeight - 24,
    }
  }


  tagConfig.x = Math.min(Math.max(tagConfig.x, dragLimit.min.x), dragLimit.max.x)
  tagConfig.y = Math.min(Math.max(tagConfig.y, dragLimit.min.y), dragLimit.max.y)

  let tag = document.createElement("div");
  tag.style = `
    box-sizing: border-box;
    position: fixed;
    z-index: 9999999;
    left: ${tagConfig.x}px;
    top: ${tagConfig.y}px;
    width: 70px;
    height: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 6px;
    background-color: ${options.bubble.bgColor};
    color: ${options.bubble.color};
    font-size: 10px;
    cursor: grab;
    box-shadow: 0px 0px 6px ${options.bubble.bgColor};
    backdrop-filter: blur(1px);
  `;
  tag.innerHTML = options.bubble.text;
  tag.setAttribute("id", "debugTag")

  if (tagConfig.show) {
    document.body.appendChild(tag)
  }

  /**
    * 标签单击事件
    */
  function tagClick() {
    let pages = getCurrentPages()
    let route = options.route.substring(1, options.route.length - 2);
    if (pages[pages.length - 1].route == route) {
      // 已经处于debug页面，不响应点击事件
      return;
    }
    devTools.show()
  }

  let isTouch = false;
  let touchStartPoint = {
    clientX: 0,
    clientY: 0,
    tagX: tagConfig.x,
    tagY: tagConfig.y,
    hasMove: false,
  }

  function touchStart(e) {
    if (isTouch) return;
    if (e.preventDefault) {
      e.preventDefault()
    }
    let clientX = e.clientX ? e.clientX : e.targetTouches[0].clientX;
    let clientY = e.clientX ? e.clientY : e.targetTouches[0].clientY;
    touchStartPoint.clientX = clientX;
    touchStartPoint.clientY = clientY;
    touchStartPoint.tagX = tagConfig.x;
    touchStartPoint.tagY = tagConfig.y;
    touchStartPoint.hasMove = false;
    isTouch = true;
  }
  function touchMove(e) {
    if (!isTouch) return;
    if (e.preventDefault) {
      e.preventDefault()
    }
    let clientX = e.clientX ? e.clientX : e.targetTouches[0].clientX;
    let clientY = e.clientX ? e.clientY : e.targetTouches[0].clientY;
    touchStartPoint.hasMove = true;

    let offsetX = touchStartPoint.clientX - clientX;
    let offsetY = touchStartPoint.clientY - clientY;
    let tx = touchStartPoint.tagX - offsetX;
    let ty = touchStartPoint.tagY - offsetY;
    tx = Math.min(Math.max(tx, dragLimit.min.x), dragLimit.max.x)
    ty = Math.min(Math.max(ty, dragLimit.min.y), dragLimit.max.y)
    tag.style.left = `${tx}px`;
    tag.style.top = `${ty}px`;
    tagConfig.x = tx;
    tagConfig.y = ty;
  }
  function touchEnd(e) {
    if (!isTouch) return;
    if (e.preventDefault) {
      e.preventDefault()
    }
    isTouch = false;
    localStorage.setItem("devTools_tagConfig", JSON.stringify(tagConfig))
    if (!touchStartPoint.hasMove) {
      tagClick()
    }
  }
  tag.addEventListener("touchstart", touchStart)
  tag.addEventListener("touchmove", touchMove)
  tag.addEventListener("touchend", touchEnd)

  tag.addEventListener("mousedown", touchStart)
  document.addEventListener("mousemove", touchMove)
  document.addEventListener("mouseup", touchEnd)

  localStorage.setItem("devTools_tagConfig", JSON.stringify(tagConfig))
  return tag
}


export default createH5Bubble;