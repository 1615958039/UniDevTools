<template>
  <view
    v-if="isMp && options && options.status && options.bubble.status"
    class="mpDevBubble"
    :style="{
      left: `${tagConfig.x}px`,
      top: `${tagConfig.y}px`,
      'background-color': options.bubble.bgColor,
      'box-shadow': `0px 0px 6px ${options.bubble.bgColor}`,
    }"
    @touchstart.stop="touchstart"
    @touchmove.stop="touchmove"
    @touchend.stop="touchend"
    @mousedown.stop="touchstart"
  >
    <text
      class="mpDevBubbleText"
      :style="{
        color: options.bubble.color,
        'font-size': '20rpx',
      }"
    >
      {{ options.bubble.text }}
    </text>
  </view>
</template>
<script>
import devOptions from "../libs/devOptions";
// #ifdef VUE3
import { reactive } from "vue";
// #endif

let options = devOptions.getOptions();
let sysInfo = uni.getSystemInfoSync();
let tagConfig = uni.getStorageSync("devTools_tagConfig");
if (!tagConfig) {
  tagConfig = {};
}

// #ifndef VUE3
tagConfig = Object.assign(
  {
    x: sysInfo.screenWidth - 150,
    y: sysInfo.screenHeight - 240,
  },
  tagConfig
);
// #endif

// #ifdef VUE3
tagConfig = reactive(
  Object.assign(
    {
      x: sysInfo.screenWidth - 150,
      y: sysInfo.screenHeight - 240,
    },
    tagConfig
  )
);
// #endif

let barHeight = sysInfo.statusBarHeight;
// 获取小程序顶部安全距离
// #ifdef MP
let { top, height } = uni.getMenuButtonBoundingClientRect()
if (height) {
  barHeight = top + height
}
// #endif
// 拖动范围限制
let dragLimit = {
  min: { x: 0, y: barHeight },
  max: {
    x: sysInfo.screenWidth - 70,
    y: sysInfo.screenHeight - 24 - sysInfo.statusBarHeight,
  },
};

tagConfig.x = Math.min(Math.max(tagConfig.x, dragLimit.min.x), dragLimit.max.x);
tagConfig.y = Math.min(Math.max(tagConfig.y, dragLimit.min.y), dragLimit.max.y);

let isTouch = false;
let touchStartPoint = {
  clientX: 0,
  clientY: 0,
  tagX: tagConfig.x,
  tagY: tagConfig.y,
  hasMove: false,
};

let isMp = false;
// #ifdef MP
isMp = true;
// #endif

export default {
  data() {
    return {
      isMp,
      /**
       * 标签参数
       */
      options,
      /**
       * 标签坐标信息配置
       */
      tagConfig,
    };
  },
  mounted() {
    // #ifdef H5
    document.addEventListener("mousemove", this.touchmove);
    document.addEventListener("mouseup", this.touchend);
    // #endif
  },
  beforeUnmount() {
    // #ifdef H5
    document.removeEventListener("mousemove", this.touchmove);
    document.addEventListener("mouseup", this.touchend);
    // #endif
  },
  methods: {
    touchstart(e) {
      if (isTouch) return;
      if (e.preventDefault) {
        e.preventDefault();
      }
      let clientX = e.clientX ? e.clientX : e.touches[0].clientX;
      let clientY = e.clientY ? e.clientY : e.touches[0].clientY;
      touchStartPoint.clientX = clientX;
      touchStartPoint.clientY = clientY;
      touchStartPoint.tagX = tagConfig.x;
      touchStartPoint.tagY = tagConfig.y;
      touchStartPoint.hasMove = false;
      isTouch = true;
    },
    touchmove(e) {
      if (!isTouch) return;
      if (e.preventDefault) {
        e.preventDefault();
      }
      let clientX = e.clientX ? e.clientX : e.touches[0].clientX;
      let clientY = e.clientY ? e.clientY : e.touches[0].clientY;
      touchStartPoint.hasMove = true;
      let offsetX = touchStartPoint.clientX - clientX;
      let offsetY = touchStartPoint.clientY - clientY;
      let tx = touchStartPoint.tagX - offsetX;
      let ty = touchStartPoint.tagY - offsetY;
      tx = Math.min(Math.max(tx, dragLimit.min.x), dragLimit.max.x);
      ty = Math.min(Math.max(ty, dragLimit.min.y), dragLimit.max.y);
      tagConfig.x = tx;
      tagConfig.y = ty;
      this.tagConfig.x = tx;
      this.tagConfig.y = ty;
    },
    touchend(e) {
      if (!isTouch) return;
      if (e.preventDefault) {
        e.preventDefault();
      }
      isTouch = false;
      uni.setStorageSync("devTools_tagConfig", tagConfig);
      if (!touchStartPoint.hasMove) {
        let pages = getCurrentPages();
        let route = options.route.substring(1, options.route.length - 2);
        if (pages[pages.length - 1].route == route) {
          // 已经处于debug页面，不响应点击事件
          return;
        }
        this.$devTools.show();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.mpDevBubble {
  box-sizing: border-box;
  position: fixed;
  z-index: 9999999;
  width: 70px;
  height: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  font-size: 10px;
  cursor: grab;
}
</style>
