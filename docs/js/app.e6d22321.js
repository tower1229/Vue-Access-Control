(function(e){function t(t){for(var r,a,u=t[0],i=t[1],s=t[2],f=0,d=[];f<u.length;f++)a=u[f],o[a]&&d.push(o[a][0]),o[a]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);l&&l(t);while(d.length)d.shift()();return c.push.apply(c,s||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],r=!0,a=1;a<n.length;a++){var u=n[a];0!==o[u]&&(r=!1)}r&&(c.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},a={app:0},o={app:0},c=[];function u(e){return i.p+"js/"+({}[e]||e)+"."+{"chunk-12b2c32c":"aa4002ae","chunk-2d0df1ba":"ff272ff9","chunk-2d0f1570":"8e910fc4","chunk-2d21ab96":"f13eddad","chunk-3e8290dc":"b68bd46a","chunk-61d55d54":"6b4d1611","chunk-6d844c85":"9ee3868d","chunk-01da9fec":"3f429ebc","chunk-2d0bd407":"452c543e"}[e]+".js"}function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(e){var t=[],n={"chunk-12b2c32c":1,"chunk-3e8290dc":1,"chunk-61d55d54":1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise(function(t,n){for(var r="css/"+({}[e]||e)+"."+{"chunk-12b2c32c":"efcbb07b","chunk-2d0df1ba":"31d6cfe0","chunk-2d0f1570":"31d6cfe0","chunk-2d21ab96":"31d6cfe0","chunk-3e8290dc":"230cd061","chunk-61d55d54":"dfbaa3a7","chunk-6d844c85":"31d6cfe0","chunk-01da9fec":"31d6cfe0","chunk-2d0bd407":"31d6cfe0"}[e]+".css",o=i.p+r,c=document.getElementsByTagName("link"),u=0;u<c.length;u++){var s=c[u],f=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(f===r||f===o))return t()}var d=document.getElementsByTagName("style");for(u=0;u<d.length;u++){s=d[u],f=s.getAttribute("data-href");if(f===r||f===o)return t()}var l=document.createElement("link");l.rel="stylesheet",l.type="text/css",l.onload=t,l.onerror=function(t){var r=t&&t.target&&t.target.src||o,c=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=r,delete a[e],l.parentNode.removeChild(l),n(c)},l.href=o;var h=document.getElementsByTagName("head")[0];h.appendChild(l)}).then(function(){a[e]=0}));var r=o[e];if(0!==r)if(r)t.push(r[2]);else{var c=new Promise(function(t,n){r=o[e]=[t,n]});t.push(r[2]=c);var s,f=document.createElement("script");f.charset="utf-8",f.timeout=120,i.nc&&f.setAttribute("nonce",i.nc),f.src=u(e),s=function(t){f.onerror=f.onload=null,clearTimeout(d);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src,c=new Error("Loading chunk "+e+" failed.\n("+r+": "+a+")");c.type=r,c.request=a,n[1](c)}o[e]=void 0}};var d=setTimeout(function(){s({type:"timeout",target:f})},12e4);f.onerror=f.onload=s,document.head.appendChild(f)}return Promise.all(t)},i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/Vue-Access-Control/",i.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],f=s.push.bind(s);s.push=t,s=s.slice();for(var d=0;d<s.length;d++)t(s[d]);var l=f;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var r=n("64a9"),a=n.n(r);a.a},"365c":function(e,t,n){"use strict";var r=n("bc3a"),a=n.n(r),o=n("3da7"),c=a.a.create({baseURL:"http://rap2api.taobao.org/app/mock/224",timeout:1e4});c.defaults.headers.post["Content-Type"]="application/json",c.interceptors.response.use(function(e){return e},o["b"]),t["a"]=c},"3da7":function(e,t,n){"use strict";n.d(t,"d",function(){return c}),n.d(t,"c",function(){return u}),n.d(t,"a",function(){return i}),n.d(t,"b",function(){return s});n("6b54"),n("a481"),n("20d6"),n("ac6a");var r=n("7618"),a=(n("28a5"),n("7f7f"),n("2b0e")),o=n("5c96");a["default"].component(o["Message"].name,o["Message"]);var c=function(e,t){if(void 0===t){var n=sessionStorage.getItem(e);return n&&0===n.indexOf("autostringify-")?JSON.parse(n.split("autostringify-")[1]):n}return("object"===Object(r["a"])(t)||Array.isArray(t))&&(t="autostringify-"+JSON.stringify(t)),sessionStorage.setItem(e,t)},u=function e(t){if(!t)return t;var n=t instanceof Array?[]:{};for(var a in t)n[a]="object"===Object(r["a"])(t[a])?e(t[a]):t[a];return n},i=function(e,t){var n=[],r=Array.isArray(e)?e.map(function(e){return e.id}):[];t=t||"parent_id",e.forEach(function(e){if(e[t]&&e[t]!==e.id){if(Array.isArray(r)){var a=r.findIndex(function(n){return n==e[t]});-1===a&&n.push(e)}}else delete e[t],n.push(u(e))});var a=function n(r){Array.isArray(r)&&r.length&&r.forEach(function(r){e.forEach(function(e){r.id===e[t]&&(r.children?r.children.push(e):r.children=[e])}),r.children&&n(r.children)})};return a(n),n},s=function(e){if(e.response)switch(e.response.status){case 400:a["default"].prototype.$message({message:e.response.data.message||"请求参数异常",type:"error"});break;case 401:sessionStorage.removeItem("user"),a["default"].prototype.$message({message:e.response.data.message||"密码错误或账号不存在！",type:"warning",onClose:function(){location.reload()}});break;case 403:a["default"].prototype.$message({message:e.response.data.message||"无访问权限，请联系企业管理员",type:"warning"});break;default:a["default"].prototype.$message({message:e.response.data.message||"服务端异常，请联系技术支持",type:"error"})}return Promise.reject(e)}},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var r,a=n("2b0e"),o=n("5c96"),c=n.n(o),u=(n("0fae"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("router-view",{attrs:{id:"app"},on:{login:e.loginDirect,logout:e.logoutDirect}})}),i=[],s=(n("ac6a"),n("4917"),n("a481"),n("28a5"),n("365c")),f=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.children?n("el-row",{attrs:{gutter:20}},e._l(e.children,function(t,r){return n("el-col",{key:r,attrs:{span:4}},[n("el-card",[n("div",{staticClass:"text"},[n("p",[e._v(e._s(t.name))]),n("router-link",{attrs:{to:{name:t.name}}},[e._v("查看")])],1)])],1)}),1):e._e(),n("router-view")],1)},d=[],l={data:function(){return{}},computed:{children:function(){return this.$route.meta.children||null}}},h=l,p=n("2877"),m=Object(p["a"])(h,f,d,!1,null,null,null),v=m.exports,g=[{path:"/",name:"首页",component:function(e){return n.e("chunk-12b2c32c").then(function(){var t=[n("1e4b")];e.apply(null,t)}.bind(this)).catch(n.oe)},children:[{path:"/roles",name:"平台-角色管理",meta:{name:"角色管理"},component:function(e){return n.e("chunk-61d55d54").then(function(){var t=[n("a76d")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/accounts",name:"平台-账号管理",meta:{name:"账号管理"},component:function(e){return n.e("chunk-2d21ab96").then(function(){var t=[n("bd75")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/goods",name:"商品管理",meta:{icon:"&#xe62e;"},component:v,children:[{path:"list",name:"商品信息",meta:{},component:function(e){return n.e("chunk-6d844c85").then(function(){var t=[n("3b61")];e.apply(null,t)}.bind(this)).catch(n.oe)}}]}]}],b=n("3da7"),y={data:function(){return{menuData:null,userData:null}},methods:{setInterceptor:function(e){var t=this;r=s["a"].interceptors.request.use(function(n){var r=n.url.replace(n.baseURL,"").split("?")[0],a=r.match(/^(\/[^\/]+\/)[^\/]+$/);a&&(r=a[1]+"**");var o=r.match(/^\/[^\/]+\/([^\/]+)\/[^\/]+$/);return o&&(r=r.replace(o[1],"*")),e[n.method+","+r]?n:(t.$message({message:"无访问权限，请联系企业管理员",type:"warning"}),Promise.reject({message:"no permission"}))})},getResources:function(e){var t={};return Array.isArray(e.resources)&&e.resources.forEach(function(e){var n=e.method.toLowerCase()+","+e.url;t[n]=!0}),t},getRoutes:function(e){var t={},n=function e(n,r){n.map(function(n){if(n.route){var a=((r?r+"/":"")+n.route).replace(/^\//,"");t["/"+a]=!0,Array.isArray(n.children)&&e(n.children,n.route)}})};if(Array.isArray(e.menus)){var r=b["a"](e.menus);n(r)}return t},extendRoutes:function(e){var t=[],n=function n(r,a){var o=[];if(r.forEach(function(t){var r=(a?a+"/":"")+t.path;e[r]&&(Array.isArray(t.children)&&(t.children=n(t.children,t.path)),o.push(t))}),a)return o;t=t.concat(o)};if(n(g[0].children),!t||!t.length)return b["d"]("token",""),document.body.innerHTML="<h1>账号访问受限，请联系系统管理员！</h1>";t.map(function(t){return t.children&&(t.meta||(t.meta={}),t.meta.children=t.children),t.beforeEnter=function(t,n,r){e[t.path]?r():r("/401")}});var r=b["c"](g);r[0].children=t,this.$router.addRoutes(r.concat([{path:"*",redirect:"/404"}])),this.$root.menuData=t},signin:function(e){var t=this,n=b["d"]("token");if(!n||!n.token)return t.$router.push({path:"/login",query:{from:t.$router.currentRoute.path}});s["a"].defaults.headers.common["Authorization"]="Bearer "+n.token,s["a"].get("/signin",{params:{Authorization:n.token}}).then(function(n){var r=n.data;t.$root.userData=r;var o=t.getResources(r),c=t.getRoutes(r);t.setInterceptor(o),t.extendRoutes(c),a["default"].prototype.$_has=function(e){var t=[],n=!0;Array.isArray(e)?e.forEach(function(e){e&&e.p&&(t=t.concat(e.p))}):e&&e.p&&(t=e.p);for(var r=0;r<t.length;r++){var a=t[r];if(!o[a]){n=!1;break}}return n},"function"===typeof e&&e()})},loginDirect:function(e){var t=this;this.signin(function(){t.$router.replace({path:e||"/"})})},logoutDirect:function(){b["d"]("token",""),s["a"].interceptors.request.eject(r),s["a"].defaults.headers.common["Authorization"]="",this.$router.replace({path:"/login"})}},created:function(){this.signin()}},k=y,A=(n("034f"),Object(p["a"])(k,u,i,!1,null,null,null)),w=A.exports,_=(n("7f7f"),n("8c4f"));a["default"].use(_["a"]);var j=[{path:"/login",name:"登录",component:function(e){return n.e("chunk-3e8290dc").then(function(){var t=[n("dd7b")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/401",name:"无权访问",component:function(e){return n.e("chunk-2d0df1ba").then(function(){var t=[n("8903")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/404",name:"找不到页面",component:function(e){return n.e("chunk-2d0f1570").then(function(){var t=[n("9fe2")];e.apply(null,t)}.bind(this)).catch(n.oe)}}],$=new _["a"]({routes:j});$.beforeEach(function(e,t,n){var r=e.meta.name||e.name;window.document.title=(r?r+" - ":"")+"Vue-Access-Control",n()});var E=$;a["default"].use(c.a),a["default"].directive("has",{inserted:function(e,t){a["default"].prototype.$_has(t.value)||e.parentNode.removeChild(e)}}),new a["default"]({el:"#app",router:E,render:function(e){return e(w)}})},"64a9":function(e,t,n){}});
//# sourceMappingURL=app.e6d22321.js.map