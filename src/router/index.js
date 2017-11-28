import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

let baseRoute = [{
  path: '/login',
  name: 'login',
  component: (resolve) => require(['../views/login.vue'], resolve)
}, {
  path: '/404',
  name: '404',
  component: (resolve) => require(['../views/common/404.vue'], resolve)
}]

let router = new Router({
  routes: baseRoute
});

router.beforeEach((to, from, next) => {
  let routeName = to.meta.name || to.name;
  window.document.title = (routeName ? routeName + ' - ' : '') + 'Vue-Access-Control';
  next();
});

export default router;
