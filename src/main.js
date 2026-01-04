/**
 * main.js - 应用入口文件
 * 初始化Vue应用并挂载到DOM
 */

import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 引入全局SCSS样式
import "./assets/scss/global.scss";

// 创建Vue应用实例并挂载
createApp(App)
  .use(ElementPlus) // 使用Element Plus组件库
  .mount("#app"); // 挂载到DOM中的#app元素
