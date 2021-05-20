import Vue from 'vue'
import { Message } from 'element-ui'
Vue.component(Message.name, Message)

//sessionStorage
export const session = function (key, value) {
  if (value === void (0)) {
    var lsVal = sessionStorage.getItem(key);
    if (lsVal && lsVal.indexOf('autostringify-') === 0) {
      return JSON.parse(lsVal.split('autostringify-')[1]);
    } else {
      return lsVal;
    }
  } else {
    if (typeof (value) === "object" || Array.isArray(value)) {
      value = 'autostringify-' + JSON.stringify(value);
    }
    return sessionStorage.setItem(key, value);
  }
}

//生成随机数
export const getUUID = function (len) {
  len = len || 6;
  len = parseInt(len, 10);
  len = isNaN(len) ? 6 : len;
  var seed = "0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ";
  var seedLen = seed.length - 1;
  var uuid = "";
  while (len--) {
    uuid += seed[Math.round(Math.random() * seedLen)];
  }
  return uuid;
};
//深拷贝
export const deepcopy = function (source) {
  if (!source) {
    return source;
  }
  let sourceCopy = source instanceof Array ? [] : {};
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item];
  }
  return sourceCopy;
};
//菜单数据组织
export const buildMenu = function (array, ckey) {
  let menuData = [];
  let indexKeys = Array.isArray(array) ? array.map((e) => { return e.id }) : [];
  ckey = ckey || 'parent_id';
  array.forEach(function (e) {
    //一级菜单
    if (!e[ckey] || (e[ckey] === e.id)) {
      delete e[ckey];
      menuData.push(deepcopy(e)); //深拷贝
    } else if (Array.isArray(indexKeys)) {
      //检测ckey有效性
      let parentIndex = indexKeys.findIndex(function (id) {
        return id == e[ckey];
      });
      if (parentIndex === -1) {
        menuData.push(e);
      }
    }
  });
  let findChildren = function (parentArr) {
    if (Array.isArray(parentArr) && parentArr.length) {
      parentArr.forEach(function (parentNode) {
        array.forEach(function (node) {
          if (parentNode.id === node[ckey]) {
            if (parentNode.children) {
              parentNode.children.push(node);
            } else {
              parentNode.children = [node];
            }
          }
        });
        if (parentNode.children) {
          findChildren(parentNode.children);
        }
      });
    }
  };
  findChildren(menuData);
  return menuData;
}

/*
 * 日期格式化
 */
export const formatDate = (value, fmt) => {
  if (!value) {
      return "--"
  }
  switch (fmt) {
      case 'year':
          fmt = "yyyy"
          break;
      case 'month':
          fmt = "yyyy/MM"
          break;
      case 'day':
          fmt = "yyyy/MM/dd"
          break;
      case undefined:
          fmt = "yyyy/MM/dd hh:mm"
          break;
  }
  if (!isNaN(parseInt(value))) {
      value = parseInt(value)
  }

  let getDate = new Date(value);
  let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
  }
  return fmt
}

//ajax错误处理
export const catchError = function (error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        Vue.prototype.$message({
          message: error.response.data.message || '请求参数异常',
          type: 'error'
        });
        break;
      case 401:
        sessionStorage.removeItem('user');
        Vue.prototype.$message({
          message: error.response.data.message || '密码错误或账号不存在！',
          type: 'warning',
          onClose: function () {
            location.reload();
          }
        });
        break;
      case 403:
        Vue.prototype.$message({
          message: error.response.data.message || '无访问权限，请联系企业管理员',
          type: 'warning'
        });
        break;
      default:
        Vue.prototype.$message({
          message: error.response.data.message || '服务端异常，请联系技术支持',
          type: 'error'
        });
    }
  }
  return Promise.reject(error);
}