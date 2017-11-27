<style>
@import './assets/common.css';
</style>

<template>
  <router-view id="app" @login="loginDirect" @logout="logoutDirect"></router-view>
</template>

<script>
import Vue from 'vue';
import instance from './api';
import userPath from './router/fullpath';
import * as util from './assets/util.js';

//请求拦截句柄
let myInterceptor;

export default {
  data() {
    return {
      menuData: null,
      userData: null
    }
  },
  methods: {
    getPermission: function(userInfo) {
      let resourcePermission = {};
      if (Array.isArray(userInfo.resources)) {
        userInfo.resources.forEach(function(e, i) {
          let key = e.method.toLowerCase() + ',' + e.url;
          resourcePermission[key] = true;
        });
      }
      return resourcePermission;
    },
    setInterceptor: function(resourcePermission) {
      let vm = this;
      myInterceptor = instance.interceptors.request.use(function(config) {
        //得到类权限路径
        let perName = config.url.replace(config.baseURL, '').replace('/GET','').replace('/POST','').split('?')[0];
        //转成权限格式
        let reg1 = perName.match(/^(\/[^\/]+\/)[^\/]+$/);
        // /path/${param}
        if (reg1) {
          perName = reg1[1] + '**';
        }
        let reg2 = perName.match(/^\/[^\/]+\/([^\/]+)\/[^\/]+$/);
        // /path/${param}/path
        if (reg2) {
          perName = perName.replace(reg2[1], '*');
        }
        //匹配权限
        if (!resourcePermission[config.method + ',' + perName]) {
          console.warn(resourcePermission, config.method + ',' + perName);
          vm.$message({
            message: '无访问权限，请联系企业管理员',
            type: 'warning'
          });
          return Promise.reject({
            message: 'no permission'
          });
        }
        return config;
      });
    },
    getRoutes: function(userInfo) {
      if(!userInfo.menus){
        return console.warn(userInfo);
      }
      let vm = this;
      let allowedRouter = [];
      //转成多维数组
      let arrayMenus = util.buildMenu(userInfo.menus);
      //转成hash
      let hashMenus = {};
      let setMenu2Hash = function(array, base) {
        array.map(key => {
          if (key.route) {
            let hashKey = ((base ? base + '/' : '') + key.route).replace(/^\//, '');
            hashMenus['/' + hashKey] = true;
            if (Array.isArray(key.children)) {
              setMenu2Hash(key.children, key.route);
            }
          }
        });
      };
      setMenu2Hash(arrayMenus);
      //遍历本地路由
      let findLocalRoute = function(array, base) {
        let replyResult = [];
        array.forEach(function(route) {
          let pathKey = (base ? base + '/' : '') + route.path;
          if (hashMenus[pathKey]) {
            if (Array.isArray(route.children)) {
              route.children = findLocalRoute(route.children, route.path);
            }
            replyResult.push(route);
          }
        });
        if (base) {
          return replyResult;
        } else {
          allowedRouter = allowedRouter.concat(replyResult);
        }
      }
      let originPath = util.deepcopy(userPath[0].children);
      findLocalRoute(originPath);
      return allowedRouter;
    },
    extendRoutes: function(allowedRouter) {
      let originPath = util.deepcopy(userPath);
      originPath[0].children = allowedRouter;
      this.$router.addRoutes(originPath.concat([{
        path: '*',
        redirect: '/404'
      }]));
    },
    storageMenu: function(allowedRouter) {
      allowedRouter.forEach(route => {
        if (route.children) {
          if (!route.meta) route.meta = {};
          route.meta.children = route.children;
        }
      });
      this.menuData = allowedRouter;
    },
    signin: function(cb) {
      let vm = this;
      let localUser = util.session('token');
      if (!localUser || !localUser.token) {
        return vm.$router.push({ path: '/login', query: { from: vm.$router.currentRoute.path } });
      }
      instance.defaults.headers.common['Authorization'] = 'Bearer ' + localUser.token;
      //获取用户信息及权限
      instance.get(`/GET/signin`, {
        params: {
          Authorization: localUser.token
        }
      }).then((res) => {
        let userInfo = res.data;
        //取得资源权限
        let resourcePermission = vm.getPermission(userInfo);
        //请求拦截
        vm.setInterceptor(resourcePermission);
        //获得路由
        let allowedRouter = vm.getRoutes(userInfo);
        if (!allowedRouter || !allowedRouter.length) {
          util.session('token','');
          return document.body.innerHTML = ('<h1>账号访问受限，请联系系统管理员！</h1>');
        }
        //注入动态路由
        vm.extendRoutes(allowedRouter);
        //保存菜单数据
        vm.storageMenu(allowedRouter);
        //用户信息持久化
        //vm.storageUser(Object.assign(localUser || {}, userInfo));
        vm.userData = userInfo;
        //权限检查方法
        Vue.prototype.$_has = function(rArray) {
          let resources = [];
          let permission = true;
          if (Array.isArray(rArray)) {
            rArray.forEach(function(e) {
              resources = resources.concat(e.p);
            });
          } else {
            resources = resources.concat(rArray.p);
          }
          resources.forEach(function(p) {
            if (!resourcePermission[p]) {
              return permission = false;
            }
          });
          //console.log(resources, permission);
          return permission;
        }
        typeof cb === 'function' && cb();
      })
    },
    loginDirect: function(newPath){
      this.signin(() => {
        this.$router.replace({path: newPath || '/'});
      });
    },
    logoutDirect: function(){
      //清除路由权限控制
      instance.interceptors.request.eject(myInterceptor);
      this.$router.replace({path: '/login'});
    }
  },
  created: function(newPath) {
    this.signin();
  }
}
</script>