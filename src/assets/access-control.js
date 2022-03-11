import instance from "@/api";
import { buildTree } from "@/assets/util"
import { MainRoute } from "@/route.config";
import { SetAccountToken, GetPermission, AfterGetActualRouter } from "@/permission.config";

/**
 * 从axios请求函数中提取请求信息
 * @param axiosRequest[Function] axios请求方法
 * @return 请求信息字符串, 例如 'get,/url1'
 * */
export const matchRequest = function (axiosRequest) {
    let result = null;
    if (typeof axiosRequest === 'function') {
        let regex = new RegExp(/\.([^(]+)\("([^"]+)"/); // 匹配请求函数：instance.post("/org", params)
        result = axiosRequest.toString().match(regex);
        if (result && result.length > 2) {
            result = [result[1], result[2]].join(",")
        }
    }
    return result
}

// 从用户权限数据中提取请求权限
const getResourcePermission = function (userPermissions) {
    let resourcePermission = {};
    if (Array.isArray(userPermissions.resources)) {
        userPermissions.resources.forEach((e) => {
            let key = e.method.toLowerCase() + "," + e.url;
            resourcePermission[key] = true;
        });
    }
    return resourcePermission;
}

// 从用户权限数据中提取路由权限
const getRoutePermission = function (userPermissions) {
    let routePermission = {};
    let setMenu2Hash = function (array, base) {
        array.forEach((router) => {
            if (router.route) {
                let hashKey = router.route.indexOf('/') === 0 ? router.route : [base, router.route].join(base === '/' ? '' : '/');
                routePermission[hashKey] = true;
                if (Array.isArray(router.children)) {
                    setMenu2Hash(router.children, hashKey);
                }
            }
        });
    };
    if (Array.isArray(userPermissions.menus)) {
        let arrayMenus = buildTree(userPermissions.menus, "parent_id");
        setMenu2Hash(arrayMenus);
    }
    return routePermission;
}

export default function (Vue, routeInstance) {
    console.log("[Core] AccessControl Open.")

    return new Promise((resolve, reject) => {
        /*
         * Step 1: 请求用户权限数据, 格式如下:
         {
            menus: [{
                name: (...)
                route: (...)
            }],
            resources: [{
                method: (...)
                name: (...)
                type: (...)
                url: (...)
            }]
         }
        */
        GetPermission().then((userPermissions) => {
            console.log('userPermissions', userPermissions)
            let resourcePermission = getResourcePermission(userPermissions);
            let routePermission = getRoutePermission(userPermissions);
            console.log('routePermission', routePermission)
            /*
             * 设置Axios请求拦截
             */
            instance.interceptors.request.use((config) => {
                // 支持 header 携带自定义请求权限
                let requestPermission = config.headers["X-Request-Permission"] || [config.method, config.url.replace(config.baseURL, "").split("?")[0]].join(",");

                if (!resourcePermission[requestPermission]) {
                    return Promise.reject({
                        response: {
                            status: 403,
                            data: `${requestPermission} 请求未授权`,
                        }
                    });
                }
                return config;
            });

            /*
             * 根据路由权限动态添加路由
             */

            let actualRouter = [];
            // 递归校验路由权限
            let checkRoutePermission = function (array, base) {
                let replyResult = [];
                array.forEach((route) => {
                    let pathKey = route.path.indexOf('/') === 0 ? route.path : [base, route.path].join(base === '/' ? '' : '/');
                    console.log('pathKey', pathKey)
                    // 扩展fullPath
                    route.fullPath = pathKey;
                    // 扩展meta
                    if (!route.meta) {
                        route.meta = {};
                    }

                    if (routePermission[pathKey]) {
                        if (Array.isArray(route.children)) {
                            route.children = checkRoutePermission(
                                route.children,
                                pathKey
                            );
                            // 检查 Redirect 并自动纠正
                            const currentRouteRedirect = route.redirect;
                            if (
                                currentRouteRedirect &&
                                currentRouteRedirect.split &&
                                route.children.length
                            ) {
                                const targetIndex = route.children.findIndex((e) => {
                                    return e.fullPath === currentRouteRedirect;
                                });
                                if (targetIndex === -1) {
                                    console.warn(
                                        `${route.redirect}不在路由权限内, 自动重置为${route.children[0].fullPath}`
                                    );
                                    route.redirect = route.children[0].fullPath;
                                }
                            }
                        }
                        replyResult.push(route);
                    }
                });
                if (base) {
                    return replyResult;
                } else {
                    actualRouter = actualRouter.concat(replyResult);
                }
            };
            checkRoutePermission(MainRoute);
            console.log('actualRouter', actualRouter)
            // 如果没有任何路由权限, 判断为非法用户, 登出并终止应用执行
            if (!actualRouter || !actualRouter.length) {
                SetAccountToken("");
                return reject(document.body.innerHTML =
                    "<h1>账号访问受限, 请联系系统管理员！</h1>");
            }

            actualRouter.forEach((route) => {
                routeInstance.addRoute(route);
            });

            routeInstance.addRoute({
                path: "*",
                redirect: "/404",
            });

            /*
             * 注册 this.$_auth 方法
             */

            Vue.prototype.$_auth = function (axiosRequest) {
                let RequiredPermissions = [];
                let permission = true;
                let collectPermission = function (fun) {
                    let res = matchRequest(fun);
                    if (res) {
                        RequiredPermissions.push(res);
                    }
                };
                if (Array.isArray(axiosRequest)) {
                    axiosRequest.forEach(collectPermission);
                } else if (typeof axiosRequest === "function") {
                    collectPermission(axiosRequest);
                }
                //console.log(RequiredPermissions, resourcePermission)
                for (let i = 0; i < RequiredPermissions.length; i++) {
                    let p = RequiredPermissions[i];
                    if (!resourcePermission[p]) {
                        permission = false;
                        break;
                    }
                }

                return permission;
            };

            // v-auth 指令
            Vue.directive('auth', {
                inserted: function (el, binding) {
                    if (Vue.prototype.$_auth && !Vue.prototype.$_auth(binding.value)) {
                        el.parentNode.removeChild(el);
                    }
                }
            });

            // 获取路由权限回调
            AfterGetActualRouter(actualRouter, userPermissions);

            resolve({ resourcePermission, routePermission, actualRouter });
        }).catch(reject)

    })
}