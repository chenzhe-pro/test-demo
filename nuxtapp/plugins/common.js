/**
 * Created by chenzhe on 17/8/31.
 * 公共文件
 */
import * as axios from 'axios'
// 全局配置,对每个请求都会生效
var op={};
console.log('全局配置');
op.baseURL = 'http://www.fz-ark.com/facade-web';
op.transformRequest=[function (data, headers) {
  // Do whatever you want to transform the data
  return data;
}];
op.params={
  _timesnap:new Date().getTime()
};
var instance = axios.create(op);
// Add a request interceptor 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 针对get请求拦截
  if(config.method=='get')
  {

  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
// Add a response interceptor 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // Do something with response data
  console.log('添加响应拦截器');
  // console.log(response);
  response=response.data;
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});
// var s=process.env.HOST;
export default {
  axios:instance
};
