import Vue from 'vue'

/**
 * 本地存储
 * @param key[String] 要存/取的键
 * @param value[any] 要存的值, 若缺省则返回key的值
 * @return 只传key会返回该key的值
 * */
const STORAGE_SPACE = '';           // 指定命名空间, 防止同域子项目间存储混淆
export const storage = function (key, value) {
    const storageFun = localStorage;
    key = `${STORAGE_SPACE || process.env.BASE_URL}_${key}`;           
    if (value === void (0)) {
        let lsVal = storageFun.getItem(key);
        if (lsVal && lsVal.indexOf('autostringify-') === 0) {
            return JSON.parse(lsVal.split('autostringify-')[1]);
        } else {
            return lsVal;
        }
    } else {
        if ((Object.prototype.toString.call(value) === '[object Object]') || Array.isArray(value)) {
            value = 'autostringify-' + JSON.stringify(value);
        }
        return storageFun.setItem(key, value);
    }
}

/**
 * 对象/数组深拷贝
 * @param source[Object|Array] 要拷贝的对象
 * @return 深拷贝后的对象/数组
 * */
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

/**
 * 一维对象数组转树形结构
 * @param array[对象数组] 对象数组中的对象必须包含id和[parentKey]键, 如{id: 1, pid: 0}。pid值为假或等于自身id, 则判定为一级节点
 * @param parentKey[String] 指向上级id的key, 默认"pid"
 * @param sortFunction[Function] 用于arrayObject.sort(sortFunction)的排序方法, 默认不排序
 * @return 由children键建立层级的对象数组
 * */
export const buildTree = function (flatArray, parentKey, sortFunction) {
    // 存储id map
    let IdMap = {};
    // 数组浅拷贝
    let items = flatArray.map(item => {
        // 生成id map
        IdMap[item.id] = true;
        return Object.assign({}, item)
    });
    parentKey = parentKey || 'pid';
    // 存放结果集
    const result = [];
    // 存放中转map
    const itemMap = {};
    // 一次遍历
    for (const item of items) {
        const id = item.id;
        const pid = item[parentKey];

        if (!itemMap[id]) {
            itemMap[id] = {}
        }

        itemMap[id] = {
            ...item,
            children: Array.isArray(itemMap[id]['children']) ? itemMap[id]['children'] : null
        }

        const treeItem = itemMap[id];

        if (!pid || pid === id || !IdMap[pid]) {
            // 无可用pid视为根节点
            result.push(treeItem);
        } else {
            if (!itemMap[pid]) {
                itemMap[pid] = {
                    children: []
                }
            }
            if (!Array.isArray(itemMap[pid].children)) {
                itemMap[pid].children = []
            }
            itemMap[pid].children.push(treeItem)
        }

    }
    // 排序
    if (typeof sortFunction === 'function') {
        let sortByFun = function (objectArray) {
            objectArray.sort(sortFunction);
            objectArray.forEach(item => {
                if (Array.isArray(item.children) && item.children.length) {
                    sortByFun(item.children)
                }
            })
        }
        sortByFun(result);
    }
    return result;
}

/**
 * 日期格式化
 * @param value[milliseconds/dateString] 可以通过new Date()方法创建日期对象的毫秒数或日期字符串
 * @param fmt[String/undefined] 日期格式化模板字符串, 内置四种快捷方式："year","month","day","day-time" 
 * @return 格式化后的日期字符串
 * */
export const formatDate = (value, fmt) => {
    if (!value) {
        return null
    }
    if (fmt === void (0)) {
        fmt = 'day-time'
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
        case 'day-time':
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

/**
 * 全局事件
 * 特性：
 * 1. 重复注册同一个事件, 只保留最后一次。使单页面应用反复进入页面不会重复注册事件
 * 2. 可以通过别名方式将一个事件多次注册。在1的前提下允许同一个事件多次注册
*/
const bus = new Vue();
let busQueue = {};
/**
 * 全局事件监听
 * @param eventName[String] 自定义事件名称, 支持用双下划线添加别名, 如 eventName__ANYSTRING
 * @param eventHandle[Function] 事件回调方法, 参数接收触发事件方法发送的参数; 如果不传将关闭该事件监听
*/
export const on = function (eventName, eventHandle) {
    if (eventName && eventName.split) {
        if (busQueue[eventName]) {
            bus.$off(eventName, busQueue[eventName])
        }
        if (typeof eventHandle === 'function') {
            busQueue[eventName] = eventHandle;
            return bus.$on(eventName, eventHandle)
        } else {
            bus.$off(eventName)
        }
    }
};
/**
 * 全局事件触发
 * @param eventName[String] 要触发的事件名称, 不需要包含别名部分, 如 myEvent__alias1, 只需要传入 myEvent
 * @param msg[any] 触发事件时携带的参数
*/
export const emit = function (eventName, msg) {
    const busQueueKeys = Object.keys(busQueue);
    busQueueKeys.forEach(key => {
        if (eventName === key.split('__')[0]) {
            return bus.$emit(key, msg)
        }
    })
};

/**
 * 提取文件名中的扩展名
 * @param filename[String] 要提取扩展名的字符串
 * @return 转小写后的扩展名字符串
*/
export const getSuffix = (filename) => {
    let pos = filename.lastIndexOf('.')
    let suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos + 1)
    }
    return suffix.toLowerCase();
}

/**
 * 函数节流
 * @param method[Function] 要节流的函数方法
 * @param delay[Number] 过滤执行的间隔毫秒数, 默认128
 * @param duration 至少执行一次的间隔毫秒数, 默认1000
 * @return 具有节流特性的新函数
*/

export const throttle = function throttle(method, delay, duration) {
    let timer = null,
        begin = new Date();
    delay = delay ? delay : 128;
    duration = duration ? duration : 1000;
    return function () {
        let context = this,
            args = arguments,
            current = new Date();
        clearTimeout(timer);
        if (current - begin >= duration) {
            method.apply(context, args);
            begin = current;
        } else {
            timer = setTimeout(function () {
                method.apply(context, args);
            }, delay);
        }
    };
};

/**
 * 获取url中的query值
 * @param keyName[String] 要获取的参数名
 * @param url[String] 目标url, 默认当前窗口url
 * @return keyName参数的值
*/
export const getUrlParam = function (keyName, url) {
    if (keyName && keyName.split) {
        var urlParamReg = new RegExp("(^|&)" + keyName + "=([^&#/]*)", "i");
        var s = (url ? url : window.location.href).split('?')[1] || '';
        var r = s.match(urlParamReg);
        if (r !== null) {
            return decodeURI(r[2]);
        }
    }

    return null;
};

