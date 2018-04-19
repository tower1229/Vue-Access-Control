import instance from './index';
const preUrlPath = '';
//获取账户列表
const request = {
  p: ['get,/accounts'],
  r: params => {
    return instance.get(`${preUrlPath}/accounts`, {params})
  }
}
//删除账户
const remove = {
  p: ['delete,/account/**'],
  r: params => {
    return instance.delete(`${preUrlPath}/account/${params.id}`)
  }
};

//修改账户
const edit = {
  p: ['put,/account/**'],
  r: params => {
    let words = CryptoJS.enc.Utf8.parse(params.password);
    let base64 = CryptoJS.enc.Base64.stringify(words);
    params.password = base64;
    return instance.put(`${preUrlPath}/account/${params.id}`, params)
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
  edit,
  notAllowed
}
