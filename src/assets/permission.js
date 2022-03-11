import AccessControl from "./access-control";
import { on as util_on } from "@/assets/util";
import instance  from "@/api";
import { MainRoute, BypassRoute } from "@/route.config";
import { GetAccountToken, SetAccountToken, getTokenFromLogin } from "@/permission.config";

let routeAuthWhiteList;

export default {
    install: function (Vue, config) {
        // 路由访问免登录白名单
        routeAuthWhiteList = BypassRoute.map((e) => e.path);

        console.log("[Core] Permission Open. Whitelist:", routeAuthWhiteList);
        
        // 权限关闭 注册主路由
        if(!config.AccessControl){
            MainRoute.forEach(route => {
                config.routeInstance.addRoute(route)
            })
        }

        config.routeInstance.beforeEach((to, from, next) => {
            // console.log('路由守卫', to)
            if (!GetAccountToken()) {
                if (routeAuthWhiteList.indexOf('/' + to.path.split('/')[1]) !== -1) {
                    // console.log('未登录访问白名单')
                    return next();
                } else if (to.path !== "/login") {
                    // 未登录跳转登录页
                    let query = {
                        redirect: to.fullPath
                    };
                    return next({
                        path: "/login",
                        query
                    });
                }
            }
            next()
        })

        Vue.prototype.$Permission = function (loginCallback) {
            const checkAccount = (loginPayload) => {
                const userToken = GetAccountToken();

                if (userToken) {
                    // 设置请求头
                    instance.defaults.headers.common['Authorization'] = userToken;

                    new Promise(resolve => {
                        if (loginPayload && loginPayload.updateToken) {
                            // 与 request.js 约定自动续期标记：updateToken
                            console.log("Token 已自动续期");
                        }
                        if (config.AccessControl) {
                            resolve(AccessControl(Vue, config.routeInstance))
                        } else {
                            resolve()
                        }
                    }).then(() => {
                        if (loginPayload && loginPayload.redirect) {
                            this.$router.replace({ path: loginPayload.redirect });
                        }
                        typeof loginCallback === 'function' && loginCallback(userToken)
                    })
                }
            }

            util_on("login", (res) => {
                /*
                 * 监听 "login" 事件
                 */
                SetAccountToken(getTokenFromLogin(res))

                checkAccount(res)

            });

            util_on("logout", () => {
                /*
                 * 监听 "logout" 事件
                 */
                SetAccountToken("")

                if (
                    routeAuthWhiteList.indexOf(
                        "/" + this.$router.currentRoute.path.split("/")[1]
                    ) === -1
                ) {
                    // 非白名单路由刷新, 触发路由守卫的未登录逻辑
                    window.location.reload();
                }
            });

            return checkAccount()
        }
    }
}