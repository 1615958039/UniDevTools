<template>
  <view class="demoIndex">
    <view class="hello">Hello</view>

    <tm-card title="DevTools">
      <template #status>
        <view @click="goUrl('https://github.com/1615958039/UniDevTools')">
          <tm-text
            label="GitHub"
            :font-size="26"
            color="orange"
          ></tm-text>
        </view>
      </template>
      <template #content>
        <view class="vertical">
          <view @click="goUrl('https://dev.api0.cn')">
            <text class="row">在线文档：<text style="color: #ff2d55">https://dev.api0.cn</text></text>
          </view>
          <view>
            <tm-text
              label="这是一个开发给UniApp框架兼容Vue2、Vue3的调试工具库，支持在线上生产环境中使用！"
              :font-size="26"
              color="cyan"
            ></tm-text>
          </view>
          <view>
            <tm-text
              label="只需要简单几步即可在你的项目中引入本工具，详情请移步在线文档"
              :font-size="26"
              color="orange"
            ></tm-text>
          </view>
        </view>
      </template>
      <template #action>
        <view class="flex flex-row flex-row-center-end flex-1">
          <tm-button
            @click="goUrl('https://dev.api0.cn')"
            :round="24"
            color="red"
            label="在线文档"
            :font-size="24"
            :width="180"
            :height="64"
          ></tm-button>
          <tm-button
            @click="goQun"
            :round="24"
            :margin="[24, 0]"
            label="QQ群"
            :font-size="24"
            :width="120"
            :height="64"
          ></tm-button>
        </view>
      </template>
    </tm-card>

    <tm-card title="Start 开始">
      <template #content>
        <view class="btnList">
          <tm-button
            label="一键生成全部测数据"
            @click="rand()"
            :width="290"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="打开Dev弹窗"
            @click="open"
            :width="220"
            color="blue"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="打开Dev气泡"
            @click="openBubble"
            :width="220"
            color="blue"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="关闭Dev气泡"
            @click="closeBubble"
            :width="220"
            color="blue"
            size="small"
            :round="20"
          ></tm-button>
        </view>
      </template>
    </tm-card>

    <tm-card title="Error 错误拦截示例">
      <template #content>
        <view class="btnList">
          <tm-button
            label="常规js运行报错"
            @click="showError"
            :width="290"
            color="orange"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="vue渲染报错"
            @click="showTemplateError"
            :width="290"
            color="red"
            size="small"
            :round="20"
          ></tm-button>
          <template v-if="isShowTemplateError">
            <view :test="testModel" />
          </template>
          <tm-text
            label="打开调试页后可看到具体报错日志"
            :font-size="20"
            color="red"
          ></tm-text>
        </view>
      </template>
    </tm-card>

    <tm-card title="Console 打印示例">
      <template #content>
        <view class="btnList">
          <tm-button
            label="打印普通对象"
            @click="print('def')"
            :width="290"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="console.info()"
            @click="print('info')"
            :width="290"
            color="grey"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="console.warn()"
            @click="print('warn')"
            :width="290"
            color="orange"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="console.error()"
            @click="print('error')"
            :width="290"
            color="red"
            size="small"
            :round="20"
          ></tm-button>

          <tm-button
            label="打印数组"
            @click="print('array')"
            color="red"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="打印对象"
            @click="print('object')"
            color="pink"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="打印JSON字符串"
            @click="print('json')"
            color="orange"
            :width="220"
            size="small"
            :round="20"
          ></tm-button>
        </view>
      </template>
    </tm-card>

    <tm-card title="Storage 本地缓存">
      <template #content>
        <view class="btnList">
          <tm-button
            label="随机添加一个KEY"
            @click="storage('add')"
            :width="290"
            size="small"
            :round="20"
          ></tm-button>
        </view>
      </template>
    </tm-card>

    <tm-card title="Network 网络请求">
      <template #content>
        <view class="btnList">
          <tm-button
            label="发送GET请求"
            @click="sendReq('get')"
            :width="290"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="POST"
            @click="sendReq('post')"
            :width="290"
            color="red"
            size="small"
            :round="20"
          ></tm-button>

          <tm-button
            label="上传文件"
            @click="sendReq('upload')"
            :width="290"
            color="orange"
            size="small"
            :round="20"
          ></tm-button>
          <tm-button
            label="下载文件"
            @click="sendReq('download')"
            :width="290"
            color="green"
            size="small"
            :round="20"
          ></tm-button>
        </view>
      </template>
    </tm-card>

    <tm-card title="Pinia 全局变量">
      <template #content>
        <view class="vertical">
          <tm-text
            :label="'Pinia: test.model = ' + testStore.model"
            :font-size="24"
            color="red"
          ></tm-text>
          <tm-button
            label="更改model的值"
            @click="changeModel"
            :width="290"
            size="small"
            :round="20"
          ></tm-button>
        </view>
      </template>
    </tm-card>

    <tm-card title="EventBus 事件总线监听">
      <template #content>
        <view class="vertical">
          <tm-button
            label="生成测试数据"
            @click="eventBusTest"
            :width="290"
            size="small"
            :round="20"
          ></tm-button>
        </view>
      </template>
    </tm-card>

    <view class="divider">
      <tm-divider
        :border="8"
        label="分割线(下方为tm-ui示例项目)"
      ></tm-divider>
    </view>

    <tm-notification
      placement="top"
      ref="msg"
      label="消息提醒"
    ></tm-notification>
  </view>
</template>
<script lang="ts" setup>
import { useTestStore } from "@/stores/test";
import { ref } from "vue";
const msg = ref();

/**
 * 测试Pinia
 */
const testStore = useTestStore();

const isShowTemplateError = ref(false);

let isCanTips = true;
function tips(data = "") {
  if (!isCanTips) return;
  // @ts-ignore
  msg.value.show({
    label: data,
  });
}

/**
 * 打开调试弹窗
 */
function open() {
  // @ts-ignore
  uni.$dev.show();
}
/**
 * 打开调试气泡
 */
function openBubble() {
  // @ts-ignore
  uni.$dev.showBubble();
}
/**
 * 关闭调试气泡
 */
function closeBubble() {
  // @ts-ignore
  uni.$dev.hideBubble();
}

/**
 * 报错示例
 */
function showError(e = "") {
  const ee = () => {
    // @ts-ignore
    aaaa();
  };
  try {
    ee();
  } catch (error: any) {
    // @ts-ignore
    tips("运行成功：" + error?.message ?? "js运行出错");
  }
  ee();
}

function showTemplateError() {
  tips("操作成功！请进入调试工具Error中查看");
  isShowTemplateError.value = true;
  setTimeout(() => {
    isShowTemplateError.value = false;
  }, 1000);
}

/**
 * console 打印
 */
function print(type = "") {
  let obj = {
    a: 1,
    b: 2,
    c: 3,
    d: [{ e: 1, f: [{ s: "0" }] }],
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    [Math.random()]: Math.random(),
    testFun: (args: any) => {
      console.log("args", args);
    },
    other: null as any,
    set: new Set(),
    map: new Map(),
    Symbol: Symbol(),
  };
  try {
    if (Blob) {
      obj.other = new Blob();
    }
  } catch (error) {}

  switch (type) {
    case "def":
      console.log("示例打印:" + Math.random());
      break;
    case "info":
      console.info("这是一条info打印:" + new Date().getTime());
      break;
    case "warn":
      console.warn("这是一条warn打印:" + new Date().getTime());
      break;
    case "error":
      console.error("这是一条error打印:" + new Date().getTime());
      break;
    case "array":
      console.log(["array1", "array2", "array3", "array4", "array5"]);
      break;
    case "object":
      console.log(obj);
      break;
    case "json":
      console.log(JSON.stringify(["json字符串", "1", "2", obj]));
      break;
    default:
      break;
  }
  tips("操作成功！");
}

/**
 * 发送请求
 */
function sendReq(type = "") {
  switch (type) {
    case "get":
      uni.request({
        method: "GET",
        url: "https://api.oioweb.cn/api/SimpWords",
        success(res) {
          console.log("GET 请求成功！ res=>", res);
          // @ts-ignore
          tips(res.data.result.content);
        },
        fail() {
          tips("请求失败");
        },
      });
      break;
    case "post":
      uni.request({
        method: "POST",
        url: "https://api.oioweb.cn/api/qq/getQQLevelInfo",
        data: {
          qq: Number((Math.random() * 1000000000).toString().replace("0.", "")).toFixed(0),
        },
        header: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        success(res) {
          console.log("POST 请求成功！ res=>", res);
          // @ts-ignore
          tips(res.data.msg);
        },
        fail() {
          tips("请求失败");
        },
      });
      break;
    case "upload":
      uni.chooseImage({
        count: 1,
        success(res) {
          uni.uploadFile({
            url: "https://api.oioweb.cn/api/upload",
            filePath: res.tempFilePaths[0],
            name: "file",
            success(uploadRes) {
              console.log("上传成功！ res=>", uploadRes);
              tips("上传成功！");
            },
            fail() {
              tips("上传失败");
            },
          });
        },
        fail() {
          tips("选择图片失败");
        },
      });
      break;
    case "download":
      uni.downloadFile({
        url: "https://api.oioweb.cn/api/qq/getQQLevelInfo",
        success(res) {
          if (res.statusCode === 200) {
            console.log("下载成功！ res=>", res);
            tips("下载成功！");
          } else {
            tips("下载失败，状态码：" + res.statusCode);
          }
        },
        fail() {
          tips("下载失败");
        },
      });
      break;
    default:
      break;
  }
}

/**
 * 缓存管理
 */
function storage(type = "") {
  switch (type) {
    case "add":
      uni.setStorageSync("test_" + Math.random(), Math.random());
      break;

    default:
      break;
  }
  tips("操作成功！");
}

function changeModel() {
  testStore.model = Math.random().toString();
  tips("操作成功！");
}

function eventBusTest() {
  let eventName = "test_" + Math.random();
  uni.$on(eventName, (opts) => {});
  uni.$emit(eventName, Math.random());
  uni.$emit(eventName, { t: new Date().toString() });
  uni.$emit(eventName, { s: [new Date().getTime()] });
  uni.$off(eventName);
  uni.$once(eventName, () => {});
  uni.$emit(eventName, Math.random());
  tips("操作成功！");
}

function rand() {
  isCanTips = false;
  uni.showLoading({
    title: "模拟数据生成中",
  });
  try {
    print("def");
    print("info");
    print("warn");
    print("error");
    print("array");
    print("object");
    print("json");
    print("def");
    print("info");
    print("warn");
    print("error");
    print("array");
    print("object");
    print("json");
    storage("add");
    storage("add");
    sendReq("get");
    sendReq("post");
    sendReq("get");
    sendReq("post");
    changeModel();
    changeModel();
    eventBusTest();
    eventBusTest();
  } catch (error) {}
  setTimeout(() => {
    isCanTips = true;
    uni.hideLoading();
    uni.showToast({
      icon: "success",
      title: "随机数据生成成功！",
    });
  }, 1500);
  showTemplateError();
  showError();
}

/**
 * 跳转指定URL
 */
function goUrl(url = "") {
  // #ifdef H5
  window.open(url);
  // #endif
  // #ifdef MP
  uni.setClipboardData({
    data: url,
  });
  // #endif
  // #ifdef APP-PLUS
  plus.runtime.openURL(url);
  // #endif
}

/**
 * 跳转QQ群
 */
function goQun() {
  // #ifdef H5 || APP-PLUS
  goUrl("https://qm.qq.com/q/2mf5R4Ar7q");
  // #endif
  // #ifdef MP
  uni.setClipboardData({
    data: "894584115",
    success() {
      uni.showToast({
        icon: "success",
        title: "已复制QQ群号！",
      });
    },
  });
  // #endif
}

if (uni.getStorageSync("hasTestData") != "1") {
  setTimeout(() => {
    uni.setStorageSync("hasTestData", "1");
    rand();
  }, 200);
}
</script>
<style lang="scss">
.demoIndex {
  margin-top: 100rpx;
}
.divider {
  margin-top: 100rpx;
  padding: 100rpx 0;
}
.btnList {
  width: 650rpx;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 10rpx;
}
.vertical {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.hello {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 120rpx;
  padding-bottom: 50rpx;
}
</style>
