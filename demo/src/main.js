import Vue from "vue";
import App from "./App.vue";
import * as THREE from "three";

Vue.prototype.$THREE = THREE;
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
