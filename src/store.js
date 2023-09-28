import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  // 状态（类似于全局变量）
  state: {
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {},
    menuList: JSON.parse(sessionStorage.getItem('menuList')) || [],
    menuList_0: JSON.parse(sessionStorage.getItem('menuList_0')) || [],
    menuList_1: JSON.parse(sessionStorage.getItem('menuList_1')) || [],
    isAddRoutes: false,
    cityList: JSON.parse(sessionStorage.getItem('cityList')) || [],
  },
  // 提供修改仓库 store 中的状态 state 的方法
  mutations: {
    // 初始化用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = {};
      state.userInfo = userInfo;
      // 将用户信息存储到会话窗口
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    // 初始化菜单列表
    setMenuList(state, menuList) {
      state.menuList = {};
      state.menuList = menuList;
      // 将菜单列表存储到会话窗口
      sessionStorage.setItem('menuList', JSON.stringify(menuList));
    },
    setMenuList_0(state, menuList) {
      state.menuList_0 = {};
      state.menuList_0 = menuList;
      // 将菜单列表存储到会话窗口
      sessionStorage.setItem('menuList_0', JSON.stringify(menuList));
    },
    setMenuList_1(state, menuList) {
      state.menuList_1 = {};
      state.menuList_1 = menuList;
      // 将菜单列表存储到会话窗口
      sessionStorage.setItem('menuList_1', JSON.stringify(menuList));
    },
    // 是否添加路由
    setIsAddRoutes(state, isAddRoutes) {
      state.isAddRoutes = isAddRoutes;
    },
    // 初始化城市列表
    setCityList(state, cityList) {
      state.cityList = {};
      state.cityList = cityList;
      // 将菜单列表存储到会话窗口
      sessionStorage.setItem('cityList', JSON.stringify(cityList));
    },
  },
  // 计算属性，对 state 里的数据进行筛选
  getters: {
    // 获取用户信息
    getUserInfo(state) {
      return state.userInfo;
    },
    // 获取菜单列表
    getMenuList(state) {
      return state.menuList;
    },
    getMenuList_0(state) {
      return state.menuList_0;
    },
    getMenuList_1(state) {
      return state.menuList_1;
    },
    // 是否添加路由
    getIsAddRoutes(state) {
      return state.isAddRoutes;
    },
    // 获取城市列表
    getCityList(state) {
      return state.cityList;
    },
  }
})
