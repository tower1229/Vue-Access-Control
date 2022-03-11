import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import { BypassRoute } from '@/route.config'

// 路由实例
let routeInstance;

export default function (config) {
  if (!routeInstance) {
    console.log('[Core] Router Start.')

    routeInstance = new Router({
      scrollBehavior: () => ({ y: 0 }),
      routes: BypassRoute
    });

    if(config.beforeEach){
      routeInstance.beforeEach(config.beforeEach)
    }
  }

  return routeInstance
}
