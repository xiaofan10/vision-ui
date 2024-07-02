import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
const obj = {};
if (obj?.name) {
  console.log(obj.name);
}

new Vue({
  render: (h) => h(App),
}).$mount("#app");
