import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import router from './router';

Vue.use(ElementUI);

/*
* v-has
*/

Vue.directive('has', {
  inserted: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

