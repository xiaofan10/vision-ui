import BG1Component from "@/components/BG1.vue";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("BG1", BG1Component);
}

const plugin = {
  install,
};

// Auto-install
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export const BG1 = BG1Component;
export default plugin;
