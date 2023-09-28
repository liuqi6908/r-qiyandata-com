import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import axios from "axios";

import PageElement from "@/components/element/PageElement";
import OrderPayWx from "@/components/element/OrderPayWx";

Vue.use(Router);
const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import('@/views'),
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          name: "Welcome",
          component: PageElement
        },
        {
          path: "/user_center",
          name: "UserCenter",
          component: () => import('@/views/userCenter'),
          redirect: "/user_center/account",
          children: [
            {
              path: "/user_center/account",
              name: "Account",
              component: () => import('@/views/userCenter/account')
            },
            {
              path: "/user_center/shopping",
              name: "Shopping",
              component: () => import('@/views/userCenter/shopping')
            },
            {
              path: "/user_center/orders",
              name: "Orders",
              component: () => import('@/views/userCenter/orders')
            },
            {
              path: "/user_center/vip_coupon",
              name: "VipAndCoupon",
              component: () => import('@/views/userCenter/vipAndCoupon'),
              redirect: "/user_center/coupon",
              children: [
                {
                  path: "/user_center/coupon",
                  name: "Coupon",
                  component: () => import('@/views/userCenter/vipAndCoupon/coupon')
                },
                {
                  path: "/user_center/vip",
                  name: "Vip",
                  component: () => import('@/views/userCenter/vipAndCoupon/vip')
                }
              ]
            },
            {
              path: "/user_center/collect",
              name: "Collect",
              component: () => import('@/views/userCenter/collect')
            },
            {
              path: "/user_center/confirm_order",
              name: "ConfirmOrder",
              component: () => import('@/views/userCenter/shopping/confirmOrder')
            },
            {
              path: "/user_center/trade_result",
              name: "TradeResult",
              component: () => import('@/views/userCenter/tradeResult.vue')
            }
          ]
        },
        {
          path: "/table",
          name: "DatabaseTable",
          component: () => import('@/views/dataCenter/table')
        },
        {
          path: "/data_mart",
          name: "DataMart",
          component: () => import('@/views/dataMart'),
          redirect: "/data_mart/home",
          children: [
            {
              path: "/data_mart/home",
              name: "DataMartHome",
              component: () => import('@/views/dataMart/home')
            },
            {
              path: "/data_mart/database",
              name: "DataMartDatabase",
              component: () => import('@/views/dataMart/database')
            },
            {
              path: "/data_mart/module",
              name: "DataMartModule",
              component: () => import('@/views/dataMart/module')
            }
          ]
        },
        {
          path: "/vip_zone",
          name: "VipZone",
          component: () => import('@/views/vipZone'),
          redirect: "/vip_zone/data_zone",
          children: [
            {
              path: "/vip_zone/home",
              name: "VipZoneHome",
              component: () => import('@/views/vipZone/home')
            },
            {
              path: "/vip_zone/data_zone",
              name: "DataZone",
              component: () => import('@/views/vipZone/dataZone')
            },
            {
              path: "/vip_zone/data_resource",
              name: "DataResource",
              component: PageElement
            },
            {
              path: "/vip_zone/wave",
              name: "Wave",
              component: () => import('@/views/vipZone/wave')
            }
          ]
        },
        {
          path: "/data_zone",
          name: "DataZonePartPageElement",
          component: () => import('@/views/vipZone/dataZone/partElement')
        },
        {
          path: "/learning_zone",
          name: "LearningZone",
          component: () => import('@/views/learningZone')
        },
        {
          path: "/maintain",
          name: "Maintain",
          component: () => import('@/views/home/maintain')
        }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: () => import('@/views/home/login')
    },
    {
      path: "/order_pay_wx",
      name: "OrderPayWx",
      component: OrderPayWx
    }
  ]
});

router.beforeEach(async (to, _, next) => {
  // 跳转其他页面（除“数据超市-模块页面”），清除dataMartModule
  if (to.name !== "DataMartModule") sessionStorage.removeItem("dataMartModule");
  // 跳转其他页面（除“数据超市-数据库页面”），清除dataMartDatabase
  if (to.name !== "DataMartDatabase")
    sessionStorage.removeItem("dataMartDatabase");
  // 跳转其他页面（除“确认订单信息”和“微信订单支付”），清除orderInfo
  if (to.name !== "ConfirmOrder" && to.name !== "OrderPayWx")
    sessionStorage.removeItem("tableList");
  // 跳转其他页面（除“微信订单支付”），清除OrderPayWxParams
  if (to.name !== "OrderPayWx") sessionStorage.removeItem("OrderPayWxParams");
  // 跳转其他页面（除“支付结果”），清除TradeResult
  if (to.name !== "TradeResult") sessionStorage.removeItem("TradeResult");
  // 跳转其他页面（除“数据专区”），清除dataZoneActiveName
  if (to.name !== "DataZone") sessionStorage.removeItem("dataZoneActiveName");
  // 跳转其他页面（除“数据专区”），清除dataZone
  if (to.name !== "DataZone" && to.name !== "DataZonePartPageElement")
    sessionStorage.removeItem("dataZone");
  // 没有添加路由
  if (!store.getters.getIsAddRoutes) {
    // 初始化数据中心菜单
    let menuList = store.getters.getMenuList;
    if (!menuList || menuList.length === 0) {
      await axios
        .get(process.env.API_ROOT + "/database/module")
        .then(data => {
          let res = data.data;
          // 获取成功，整理数据
          if (res.status === 0) {
            res.data = JSON.parse(res.data);
            for (let key in res.data) {
              let menu = {};
              menu.name = key;
              menu.children = [];
              if (res.data[key] && res.data[key].length !== 0) {
                res.data[key].forEach(item => {
                  item.path = "/data_center/" + item.DATABASE_ENG;
                  menu.children.push(item);
                });
              }
              menuList.push(menu);
            }
            if (menuList && menuList.length !== 0) {
              menuList.forEach(menu => {
                menu.icon = "el-icon-folder-opened";
                if (menu.children && menu.children.length !== 0) {
                  menu.activeName = menu.children[0].DATABASE_ENG;
                }
              });
            }
            store.commit("setMenuList", menuList);
          }
        })
        .catch(err => {});
    }

    // 动态添加路由
    let children = [];
    menuList.forEach(menu => {
      if (menu.children && menu.children.length !== 0) {
        menu.children.forEach(child => {
          let item = {
            path: child.path,
            name: child.DATABASE_ENG,
            component: () => import('@/views/dataCenter/database')
          };
          children.push(item);
        });
      }
    });
    const addRoutes = {
      path: "/data_center",
      name: "DataCenter",
      component: () => import('@/views/dataCenter'),
      children: children
    };
    if (children && children.length !== 0)
      addRoutes.redirect = children[0].path;
    router.addRoute("Home", addRoutes);
    router.options.routes.forEach(i => {
      if (i.name === "Home") i.children.push(addRoutes);
    });

    // 初始化定制服务菜单
    let menuList_0 = store.getters.getMenuList_0;
    if (!menuList_0 || menuList_0.length === 0) {
      await axios
        .post(process.env.API_ROOT + "/page/routeSearch", {
          pageName: "定制服务"
        })
        .then(data => {
          let res = data.data;
          // 获取成功，整理数据
          if (res.status === 0) {
            if (res.data && res.data.length > 0) {
              res.data.forEach(item => {
                let menu = {};
                menu.name = item.name;
                menu.path = item.path;
                menu.router = "/service/" + item.path;
                menuList_0.push(menu);
              });
            }
            store.commit("setMenuList_0", menuList_0);
          }
        })
        .catch(err => {});
    }

    // 动态添加路由
    let children_0 = [];
    menuList_0.forEach(menu => {
      let item = {
        name: menu.path,
        path: menu.router,
        component: PageElement
      };
      children_0.push(item);
    });
    children_0.push({
      name: "question",
      path: "/service/question",
      component: PageElement
    });
    const addRoutes_0 = {
      path: "/service",
      name: "Service",
      component: () => import('@/views/service'),
      children: children_0
    };
    if (children_0 && children_0.length !== 0)
      addRoutes_0.redirect = children_0[0].path;
    router.addRoute("Home", addRoutes_0);
    router.options.routes.forEach(i => {
      if (i.name === "Home") i.children.push(addRoutes_0);
    });

    // 初始化关于我们菜单
    let menuList_1 = store.getters.getMenuList_1;
    if (!menuList_1 || menuList_1.length === 0) {
      await axios
        .post(process.env.API_ROOT + "/page/routeSearch", {
          pageName: "关于我们"
        })
        .then(data => {
          let res = data.data;
          // 获取成功，整理数据
          if (res.status === 0) {
            if (res.data && res.data.length > 0) {
              res.data.forEach(item => {
                let menu = {};
                menu.name = item.name;
                menu.path = item.path;
                menu.router = "/about/" + item.path;
                menuList_1.push(menu);
              });
            }
            store.commit("setMenuList_1", menuList_1);
          }
        })
        .catch(err => {});
    }

    // 动态添加路由
    let children_1 = [];
    menuList_1.forEach(menu => {
      let item = {
        name: menu.path,
        path: menu.router,
        component: PageElement
      };
      children_1.push(item);
    });
    children_1.push({
      name: "qiyan_cloud",
      path: "/about/qiyan_cloud",
      component: PageElement
    });
    children_1.push({
      name: "data_visual",
      path: "/about/data_visual",
      component: PageElement
    });
    const addRoutes_1 = {
      path: "/about",
      name: "About",
      component: () => import('@/views/about'),
      children: children_1
    };
    if (children_1 && children_1.length !== 0)
      addRoutes_1.redirect = children_1[0].path;
    router.addRoute("Home", addRoutes_1);
    router.options.routes.forEach(i => {
      if (i.name === "Home") i.children.push(addRoutes_1);
    });

    store.commit("setIsAddRoutes", true);
    let flag = false;
    router.options.routes.forEach(i => {
      if (i.path === to.path) flag = true;
      else if (i.children && i.children.length > 0) {
        i.children.forEach(j => {
          if (j.path === to.path) flag = true;
          else if (j.children && j.children.length > 0) {
            j.children.forEach(k => {
              if (k.path === to.path) flag = true;
              else if (k.children && k.children.length > 0) {
                k.children.forEach(l => {
                  if (l.path === to.path) flag = true;
                });
              }
            });
          }
        });
      }
    });
    if (flag) next({ ...to, replace: true });
    else next({ path: "/", name: "Home" });
  } else {
    let flag = false;
    router.options.routes.forEach(i => {
      if (i.path === to.path) flag = true;
      else if (i.children && i.children.length > 0) {
        i.children.forEach(j => {
          if (j.path === to.path) flag = true;
          else if (j.children && j.children.length > 0) {
            j.children.forEach(k => {
              if (k.path === to.path) flag = true;
              else if (k.children && k.children.length > 0) {
                k.children.forEach(l => {
                  if (l.path === to.path) flag = true;
                });
              }
            });
          }
        });
      }
    });
    if (flag) next();
    else next({ path: "/", name: "Home" });
  }
});

export default router;

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
