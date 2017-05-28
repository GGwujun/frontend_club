import Vue from 'vue';
import App from './App.vue';
import element from "element-ui";
import "element-ui/lib/theme-default/index.css";
import * as filters from './filters'
import router from "./router";
import store from "./store";
import $ from 'jquery'

Vue.use(element);

Vue.config.devtools = true;


Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
