import Vue from 'vue';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://rap2api.taobao.org/app/mock/224',
  timeout: 10000
});

instance.defaults.headers.post['Content-Type'] = 'application/json';
//错误处理
instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return catchError(error)
});


/**
 * 请求错误处理
 * @param error[axios正常或异常返回数据] 所有服务器捕获的错误, 约定返回数据中用msg字段携带错误信息; 
 * @return 401状态码会触发登出操作, 其他异常状态码只做提醒
*/
const catchError = function (error) {
  //原生错误对象
  if (error.response) {
    // that falls out of the range of 2xx
    switch (error.response.status) {
      case 400:
        Vue.prototype.$message({
          message: getStringFromData(error.response.data, '请求参数异常'),
          type: 'error'
        });
        break;
      case 401:
        Vue.prototype.$message({
          message: getStringFromData(error.response.data, '未授权或授权已过期'),
          type: 'warning',
          onClose: function () {
            util.emit('logout')
          }
        });
        break;
      case 403:
        Vue.prototype.$message({
          message: getStringFromData(error.response.data, '无访问权限, 请联系企业管理员'),
          type: 'warning'
        });
        break;
      default:
        if (error.response.status > 200 && error.response.status < 300) {
          // 201 ~ 299 的情况
          Vue.prototype.$message({
            message: getStringFromData(error.response.data, '操作失败'),
            type: 'warning'
          });
        } else {
          Vue.prototype.$message({
            message: getStringFromData(error.response.data, '服务异常'),
            type: 'danger'
          });

        }
    }
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    let message = error.message;
    if (message.indexOf('timeout') > -1) {
      message = '请求超时, 请重试'
      Vue.prototype.$message({
        message,
        type: 'error'
      })
    } else if (message.indexOf('Network') > -1) {
      message = '网络异常'
      Vue.prototype.$message({
        message,
        type: 'error'
      })
    } else {
      Vue.prototype.$message({
        message: getStringFromData(error.response.data, '服务异常'),
        type: 'danger'
      });
    }
  }

  return Promise.reject(error)
}
// 获取错误信息
const getStringFromData = function (data, placeholder) {
  if (typeof data === 'object' && data.msg) {
    return data.msg
  }
  return data && data.split ? data : placeholder
}

export default instance;