import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import $http from "./api";
import store from "./store";
import scroll from "vue-seamless-scroll";
import index from "./components/element";
import VueCoreVideoPlayer from "vue-core-video-player";
/** 虚拟滚动 */
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import '@/util/addTextToCopy.js';

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/main.css';
import '@/styles/common.scss';
import '@/styles/element-ui.scss';
import '@/styles/atom.sass';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$http = $http;
Vue.prototype.$store = store;
Vue.use(scroll);
Vue.use(index);
Vue.use(VueCoreVideoPlayer, {
  lang: "zh-CN"
});
Vue.use(VueVirtualScroller);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
