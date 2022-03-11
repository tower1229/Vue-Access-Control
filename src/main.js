import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 路由
import routeGenerator from '@/assets/router';
const routeInstance = routeGenerator({
    beforeEach: ((to, from, next) => {
        if (to.name) {
            document.title = to.meta.title || to.name;
        }
        next()
    })
})

// 登录鉴权
import Permission from "@/assets/permission";
Vue.use(Permission, {
    AccessControl: true,    // 权限控制
    routeInstance
});

// 应用启动
import App from './App.vue';

new Vue({
    router: routeInstance,
    render: h => h(App)
}).$mount('#app');

