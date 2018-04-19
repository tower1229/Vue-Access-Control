import instance from './index';
const preUrlPath = '';
//查询药品
const request = {
  p: ['get,/medications'],
  r: params => {
    return instance.get(`${preUrlPath}/medications`, {params})
  }
};
//批量删除药品
const remove = {
  p: ['delete,/medication/**'],
  r: params => {
    return instance.delete(`${preUrlPath}/medication/${params.id}`)
  }
};
//越权请求
const notAllowed = {
  p: ['get,/roles/notAllowed'],
  r: params => {
    return instance.get(`${preUrlPath}/roles/notAllowed`, {params})
  }
}

export {
  request,
  remove,
  notAllowed
}
