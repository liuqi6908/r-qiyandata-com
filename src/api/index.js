import axios from "axios";
import $router from "@/router";
import $store from "@/store";

const ErrorCode = {
  TOKEN_FAILED: 401
};

const $http = axios.create();

/** 响应拦截器 */
$http.interceptors.response.use(
  response => {
    // 登录失效，退出登录并返回首页
    if (Object.values(ErrorCode).includes(response.data.status)) {
      sessionStorage.clear();
      $router.push("/");
      $store.commit("setUserInfo", {});
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default $http;
