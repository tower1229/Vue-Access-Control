<style>
@import './assets/common.css';
</style>

<template>
  <router-view id="app" @login="loginDirect" @logout="logoutDirect"></router-view>
</template>

<script>
import Vue from 'vue';
import instance from './api';
import AllRoutesData from './router/fullpath';
import * as util from './assets/util.js';

// axios Interceptor

let myInterceptor;

export default {
  data() {
    return {
      menuData: null,
      userData: null
    }
  },
  methods: {
    setInterceptor: function(resourcePermission) {
      myInterceptor = instance.interceptors.request.use(config => {
        // Get request path
        
        let perName = config.url.replace(config.baseURL, '').split('?')[0];
        //RESTful type 1 /path/**
        let reg1 = perName.match(/^(\/[^\/]+\/)[^\/]+$/);
        if (reg1) {
          perName = reg1[1] + '**';
        }
        //RESTful type 2 /path/*/path
        let reg2 = perName.match(/^\/[^\/]+\/([^\/]+)\/[^\/]+$/);
        if (reg2) {
          perName = perName.replace(reg2[1], '*');
        }

        // Check permissions
        
        if (!resourcePermission[config.method + ',' + perName]) {
          this.$message({
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
    getResources: function(userPermissions) {
      let resourceHash = {};
      if (Array.isArray(userPermissions.resources)) {
        /*
        * Input like this:
        * [{
        *   id: "2c9180895e172348015e1740805d000d"
            method: "GET"
            url: "/some-url"
        * }]
        */
        userPermissions.resources.forEach(e => {
          let key = e.method.toLowerCase() + ',' + e.url;
          resourceHash[key] = true;
        });
      }
      // Get hash structure
      return resourceHash;
    },
    getRoutes: function(userPermissions) {
      let routeHash = {};
      let setMenu2Hash = function(array, base) {
        array.map(key => {
          if (key.route) {
            let hashKey = ((base ? base + '/' : '') + key.route).replace(/^\//, '');
            routeHash['/' + hashKey] = true;
            if (Array.isArray(key.children)) {
              setMenu2Hash(key.children, key.route);
            }
          }
        });
      };
      if (Array.isArray(userPermissions.menus)) {
      /*
      * Input Like this: 
      * [{
      *   id: "2c9180895e13261e015e13469b7e0000",
      *   name: "账户管理",
      *   parent_id: "2c9180895e13261e015e13469b7e0000",
      *   route: "some-route"
      * }]
      */
        let arrayMenus = util.buildMenu(userPermissions.menus);
        setMenu2Hash(arrayMenus);
      }
      // Get hash structure
      return routeHash;
    },
    extendRoutes: function(routePermission) {

      // Filtering local routes, get actual routing
      
      let actualRouter = [];
      let findLocalRoute = function(array, base) {
        let replyResult = [];
        array.forEach(route => {
          let pathKey = (base ? base + '/' : '') + route.path;
          if (routePermission[pathKey]) {
            if (Array.isArray(route.children)) {
              route.children = findLocalRoute(route.children, route.path);
            }
            replyResult.push(route);
          }
        });
        if (base) {
          return replyResult;
        } else {
          actualRouter = actualRouter.concat(replyResult);
        }
      }
      findLocalRoute(AllRoutesData[0].children);
      
      // If the user does not have any routing authority

      if (!actualRouter || !actualRouter.length) {
        // clear token, refresh page will jump to login screen.
        util.session('token','');
        // Interface hints
        return document.body.innerHTML = ('<h1>账号访问受限，请联系系统管理员！</h1>');
      }
      
      actualRouter = actualRouter.map(e => {

        // Copy 'children' to 'meta' for rendering menu.(This step is optional.)

        if (e.children) {
          if (!e.meta) e.meta = {};
          e.meta.children = e.children;
        }

        return e
      });

      // Add actual routing to application

      let originPath = util.deepcopy(AllRoutesData);
      originPath[0].children = actualRouter;
      this.$router.addRoutes(originPath.concat([{
        path: '*',
        redirect: '/404'
      }]));

      // Save information for rendering menu.(This step is optional.)
      
      this.$root.menuData = actualRouter;

    },
    signin: function(callback) {
      let vm = this;
      /*
      * Step 1
      * Check whether the user has access
      */

      let localUser = util.session('token');
      if (!localUser || !localUser.token) {
        return vm.$router.push({ path: '/login', query: { from: vm.$router.currentRoute.path } });
      }

      /*
      * Step 2
      * Set Authorization
      */

      instance.defaults.headers.common['Authorization'] = 'Bearer ' + localUser.token;

      /*
      * Step 2-1(This step is optional.)
      * Get user`s permissions
      * You can also get permission information upon user login, it depends on the implementation of the backend interface
      */
      
      instance.get(`/signin`, {
        params: {
          Authorization: localUser.token
        }
      }).then((res) => {
        let userPermissions = res.data;
        // Save information, if it is used elsewhere.
        vm.$root.userData = userPermissions;

        /*
        * Step 3
        * Get resourcePermission form user permissions
        * Like this:
        * { "get,/url1": true, "post,/url2": true, ... }
        */
        
        let resourcePermission = vm.getResources(userPermissions);
        
        /*
        * Step 4
        * Get routePermission form user permissions
        * Like this:
        * { "/route1": true, "/route2": true, ... }
        */
        
        let routePermission = vm.getRoutes(userPermissions);
        
        /*
        * Step 5
        * Setting request permission control through resourcePermission
        */

        vm.setInterceptor(resourcePermission);
        
        /*
        * Step 6
        * Adding routing privileges to users
        */

        vm.extendRoutes(routePermission);

        /*
        * Step 7
        * Implementing $_has function, support for the directive "has" (in /main.js)
        * Input: Array, like this: ['get,/some-uri']
        * Output: Boolean
        */
        
        Vue.prototype.$_has = function(rArray) {
          let RequiredPermissions = [];
          let permission = true;
          
          if (Array.isArray(rArray)) {
            rArray.forEach(e => {
              if(e && e.p){
                RequiredPermissions = RequiredPermissions.concat(e.p);
              }
            });
          } else {
            if(rArray && rArray.p){
              RequiredPermissions = rArray.p;
            }
            
          }
          
          for(let i=0;i<RequiredPermissions.length;i++){
            let p = RequiredPermissions[i];
            if (!resourcePermission[p]) {
              permission = false;
              break;
            }
          }
          
          return permission;
        }

        typeof callback === 'function' && callback();
      })
    },
    loginDirect: function(newPath){
      /*
      * Monitor login events
      * Will trigger the events in views/login.vue
      */

      this.signin(() => {
        this.$router.replace({path: newPath || '/'});
      });
    },
    logoutDirect: function(){
      /*
      * Monitor logout events
      * Will trigger the events in views/index.vue
      */

      //Clear local user information
      util.session('token','');
      // reload app
      window.location.href = '/'
    }
  },
  created: function() {
    /*
    * Start from here!
    */
    this.signin();
  }
}
</script>