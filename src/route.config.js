import Abstract from '@/views/common/abstract.vue';

// 主路由
export const MainRoute = [{
    path: '/',
    name: '首页',
    component: (resolve) => require(['@/views/index.vue'], resolve),
    children: [{
        path: '/roles',
        name: '平台-角色管理',
        meta: {
            name: '角色管理'
        },
        component: (resolve) => require(['@/views/roles.vue'], resolve)
    }, {
        path: '/accounts',
        name: '平台-账号管理',
        meta: {
            name: '账号管理'
        },
        component: (resolve) => require(['@/views/accounts.vue'], resolve)
    }, {
        path: '/goods',
        name: '商品管理',
        meta: {
            icon: '&#xe62e;'
        },
        component: Abstract,
        redirect: '/goods/list',
        children: [{
            path: 'list',
            name: '商品信息',
            meta: {

            },
            component: (resolve) => require(['@/views/goods-list.vue'], resolve)
        }]
    }]
}];


// 旁路路由
export const BypassRoute = [{
    path: '/login',
    name: '登录',
    component: (resolve) => require(['@/views/login.vue'], resolve)
}, {
    path: '/401',
    name: '无权访问',
    component: (resolve) => require(['@/views/common/401.vue'], resolve)
}, {
    path: '/404',
    name: '找不到页面',
    component: (resolve) => require(['@/views/common/404.vue'], resolve)
}]
