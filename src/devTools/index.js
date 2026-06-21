
import drawView from "./core/libs/drawView";
import logReport from "./core/libs/logReport";
import errorReport from "./core/libs/errorReport";
import devOptions from "./core/libs/devOptions";
import createH5Bubble from "./core/libs/createH5Bubble";
import vueMixin from "./core/proxy/vueMixin";
import devToolsProxyInstall from "./core/proxy/index";
import pageLinkList from "./core/libs/pageLinkList";


/**
 * @type {Vue}
 */
let that;

const devTools = {
  options: null,
  /**
   * 挂载安装APP页面
   */
  install(vm, options) {
    try {
      that = vm;
      let _this = this;

      if (vm && vm.config && vm.config.globalProperties) {
        vm.config.globalProperties.$logReport = logReport;
      } else {
        vm.prototype.$logReport = logReport;
      }

      //! 初始化配置项
      devOptions.setOptions(options)
      options = devOptions.getOptions()
      _this.options = options;

      if (!options || !options.status) {
        return console.log("%c devTools 调试工具未运行！", 'padding: 4px;background-color: red;color: #fff;font-size: 15px;');
      }

      //! 挂载dev工具
      if (vm && vm.config && vm.config.globalProperties) {
        vm.config.globalProperties.$devTools = devTools;
      } else {
        vm.prototype.$devTools = devTools;
      }

      if (options.error.status) {

        //! 挂载vue报错
        vm.config.errorHandler = (err, vm, trace) => {
          errorReport(err, trace, "ve")
        };

        //! 挂载vue警告
        vm.config.warnHandler = (err, vm, trace) => {
          errorReport(err, trace, "vw")
        }

      }

      //!混入生命周期监听器
      vm.mixin(vueMixin)
      let bubbleView
      //!绘制环境变量小标签
      // #ifdef APP-PLUS
      bubbleView = drawView(options, devTools)
      // #endif
      // #ifdef H5
      bubbleView = createH5Bubble(options, devTools)
      // #endif

      //!调试工具全局拦截器挂载
      devToolsProxyInstall(options)

      //! 注册dev弹窗打开事件
      uni.$on("devTools_showDialog", () => {
        _this.show()
      })

      //! 注册dev弹窗关闭事件
      uni.$on("devTools_closeDialog", (options) => {
        _this.hide(options)
      })

      //! 挂载uni对象
      uni.$dev = {
        show() {
          _this.show()
        },
        hide() {
          _this.hide()
        },
        showBubble(){
          // #ifdef APP-PLUS
          bubbleView?.show()
          // #endif
          // #ifdef H5
          bubbleView.style.display = "flex";
          // #endif
        },
        hideBubble(){
          // #ifdef APP-PLUS
          bubbleView?.hide()
          // #endif
          // #ifdef H5
          bubbleView.style.display = "none";
          // #endif
        },
        errorReport,
        logReport,
      }

      //! 注册jsRunner执行事件
      uni.$on("devTools_jsRunner", (code) => {
        let result = undefined;
        try {
          let fun = (("ev" + "__混淆__" + "al").replace("__混淆__", ""));
          result = globalThis[fun](code);
          // result = eval(code);
        } catch (error) {
          if (error && error.message) {
            result = error.message;
          }
        }

        uni.$emit("devTools_jsRunnerCallback", result)
      })

      // ! 页面路由列表
      pageLinkList.install()

    } catch (error) {
      console.log("devTools install error", error);
    }

  },
  /**
   * 打开调试弹窗
   */
  show() {
    let pages = getCurrentPages();

    //! 已经打开了调试工具，不要重复显示
    if (pages[pages.length - 1].route == this.options.devRoute) {
      this.hide()
      return false;
    }

    uni.navigateTo({
      url: this.options.route,
      animationType: 'none',
      animationDuration: 0,
    })
  },
  /**
   * 隐藏调试弹窗
   */
  hide(options) {
    // #ifdef APP-PLUS
    uni.$emit("devTools_closeDevToolsPanel")
    let isBack = false;
    uni.$once("devTools_panelHideSuccess", () => {
      if (!isBack) {
        isBack = true;
        uni.navigateBack();
      }
    })
    setTimeout(() => {
      if (!isBack) {
        isBack = true;
        uni.navigateBack();
      }
    }, 500);
    // #endif
    // #ifndef APP-PLUS
    uni.navigateBack()
    // #endif

    if (options && options.navigateToUrl) {
      let t = 600;
      // #ifndef APP-PLUS
      t = 200;
      // #endif
      setTimeout(() => {
        uni.navigateTo({
          url: options.navigateToUrl,
        })
      }, t);
    }

  },
  errorReport,
  logReport,
}


export default devTools;