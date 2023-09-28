import $store from '@/store'
import $router from '@/router'
import $http from '@/api'
import { Message } from 'element-ui'

/**
 * 退出登录
 * @param {undefined | string} path 登出后的跳转页面
 */
export function logout(path) {
  sessionStorage.clear();
  $store.commit("setUserInfo", {});
  if (path)
    $router.push(path);
}

/**
 * 跳转登录页面
 */
export function jumpLogin() {
  logout('/login')
}

/**
 * 机构IP登录
 */
export async function IPLogin() {
  logout()
  try {
    const res = await $http.post('/api/user/loginOrganize')
    const { status, message, data, token } = res.data
    if (status !== 0) {
      Message.error(`登录失败，${message || '服务器错误，请稍后再试！'}`)
    }
    else {
      data.token = token
      $store.commit("setUserInfo", data)
      Message.success("登录成功！")
    }
  }
  catch (_) {
    Message.error('登录失败，服务器错误，请稍后再试！')
  }
}

/**
 * 是否登录
 * @returns {boolean}
 */
export function isLogin() {
  const { token } = $store.getters.getUserInfo
  return !!token
}

/**
 * 是否为已认证个人用户
 */
export function isVerify() {
  const { type, status } = $store.getters.getUserInfo
  return isLogin() && type === '个人用户' && status === '1'
}

/**
 * 是否为正式用户（机构用户 | 已认证个人用户）
 */
export function isRegularUser() {
  const { type } = $store.getters.getUserInfo
  return isLogin() && (type === '机构用户' || isVerify())
}
