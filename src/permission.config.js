import Vue from 'vue';

import { storage } from "@/assets/util";
import instance from "@/api"

// 获取用户登录凭据方法
export const GetAccountToken = () => storage("auth")

// 设置用户登录凭据方法
export const SetAccountToken = token => storage("auth", token)

// 登录返回数据获取凭据方法
export const getTokenFromLogin = res => res.data.token

// 获取用户权限数据方法
export const GetPermission = () => instance.get(`/signin`, {
    params: {
      Authorization: GetAccountToken()
    }
  }).then(res => res.data);

// 获取路由权限后回调
export const AfterGetActualRouter = (actualRouter, userPermissions) => {
    Vue.prototype.$menuData = actualRouter; 
    Vue.prototype.$userData = userPermissions;
};

