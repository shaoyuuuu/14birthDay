/**
 * main.js - 应用入口文件
 * 初始化Vue应用并挂载到DOM
 */

import { createApp } from "vue";
import App from "./App.vue";

// 按需引入Element Plus组件，减少打包体积
import { ElButton, ElDialog, ElMessage } from "element-plus";
import "element-plus/theme-chalk/index.css";

// 引入全局SCSS样式
import "./assets/scss/global.scss";

// 引入错误处理器
import errorHandler from "./utils/errorHandler";

// 注册全局错误处理器
if (errorHandler && typeof errorHandler.setGlobalErrorCallback === 'function') {
  errorHandler.setGlobalErrorCallback((error, context) => {
    console.error("[全局错误]", error, context);
    if (typeof ElMessage !== 'undefined') {
      ElMessage.error(errorHandler.getUserFriendlyMessage(error));
    }
  });
}

// 捕获未处理的Promise错误
window.addEventListener("unhandledrejection", (event) => {
  if (errorHandler && typeof errorHandler.handleError === 'function') {
    errorHandler.handleError(event.reason, { unhandledRejection: true });
  }
  event.preventDefault();
});

// 捕获全局错误
window.addEventListener("error", (event) => {
  if (errorHandler && typeof errorHandler.handleError === 'function') {
    errorHandler.handleError(event.error, { globalError: true });
  }
});

// 创建Vue应用实例并挂载
const app = createApp(App);

// 按需注册Element Plus组件
app.use(ElButton);
app.use(ElDialog);
app.use(ElMessage);

// 挂载到DOM中的#app元素
app.mount("#app");
