<template>
  <!-- 主框架 -->
  <div class="home">
    <!-- 主页内容 -->
    <el-container>
      <!-- 顶部导航 -->
      <el-header height="66px">
        <div class="header_div not-selected row justify-between">
          <!-- logo和标题 -->
          <div class="logo_title" @click="jumpHome">
            <div style="width: 70px">
              <img src="@/assets/logo/logo.svg" />
            </div>
            <div style="width: 170px">
              <el-row class="title">社科大数据平台</el-row>
              <el-row class="sub_title">一站式数据下载</el-row>
            </div>
          </div>
          <!-- 导航菜单 -->
          <div class="menu">
            <el-menu
              :default-active="activeIndex"
              mode="horizontal"
              router
              active-text-color="#0062ff"
            >
              <el-menu-item
                v-for="item in menuList"
                :index="item.index"
                :key="item.index"
              >
                <el-tooltip
                  :content="item.desc"
                  placement="bottom"
                  effect="light"
                  :disabled="!item.desc"
                  :open-delay="600"
                >
                  <span v-text="item.title" />
                </el-tooltip>
              </el-menu-item>
            </el-menu>
          </div>
          <!-- 搜索框 -->
          <div class="search">
            <el-input
              v-model.trim="searchText"
              @keydown.enter.native="openSearchDialog"
              placeholder="搜索数据 例如专利、数字经济"
            >
              <i
                class="el-input__icon el-icon-search"
                @click="openSearchDialog"
                style="margin-right: 10px"
                slot="suffix"
              ></i>
            </el-input>
          </div>
          <!-- 副菜单 -->
          <div class="row gap-6">
            <span
              v-for="item in subMenuList"
              :key="item.index"
              :style="{
                fontWeight: activeIndex.includes(item.index) || item.title.includes('学习专区') ? 700 : 400,
                color: activeIndex.includes(item.index) ? '#0062ff' : ''
              }"
              style="display: inline-flex"
              class="items-center cursor-pointer"
              @click="jumpRouter(item.index)"
            >
              {{ item.title }}
              <div v-if="item.icon" class="items-center ml-1" style="display: inline-flex" v-html="item.icon" />
            </span>
          </div>
          <!-- 登入用户 -->
          <div class="user">
            <div v-if="userInfo.name">
              <div style="width: 48px">
                <el-popover
                  placement="bottom"
                  popper-class="not-selected"
                  width="250"
                  trigger="hover"
                  :popper-options="{
                    boundariesElement: 'body',
                    removeOnDestroy: true
                  }"
                  v-model="visible_0"
                >
                  <el-badge is-dot slot="reference" :hidden="!userInfo.newUser">
                    <el-avatar
                      style="cursor: pointer"
                      :size="48"
                      :src="userInfo.avatarUrl"
                      @error="true"
                    >
                      <el-avatar :size="48">{{
                        userInfo.name.substr(0, 1)
                      }}</el-avatar>
                    </el-avatar>
                  </el-badge>
                  <div class="popover_background">
                    <div>
                      <p style="font-size: 19px; font-weight: 700">
                        欢迎您！{{ userInfo.name }}
                      </p>
                      <p
                        style="font-size: 12px; color: #f9f9f9"
                        v-if="userInfo.ipAddress"
                      >
                        {{ userInfo.ipAddress }}
                      </p>
                      <p
                        style="font-size: 12px; color: #f9f9f9"
                        v-if="userInfo.phone"
                      >
                        {{ userInfo.showPhone }}
                      </p>
                      <span
                        v-if="userInfo.type === '个人用户'"
                        class="popover_type"
                        >个人用户</span
                      >
                      <span v-else class="popover_type">{{
                        userInfo.flag === "1" ? "正式用户" : "试用用户"
                      }}</span>
                    </div>
                  </div>
                  <div
                    v-if="
                      userInfo.type === '个人用户' && userInfo.status === '1'
                    "
                    class="popover_menu"
                  >
                    <div
                      v-for="(item, index) in userCenterMenuList"
                      :key="index"
                      @click="jumpRouter(item.index)"
                    >
                      <i :class="item.icon"></i>
                      <el-badge
                        value="+1"
                        :hidden="index !== 3 || !userInfo.newUser"
                        class="vip-tab"
                      >
                        {{ item.title }}
                      </el-badge>
                    </div>
                  </div>
                  <el-button
                    class="red_button"
                    @click="exitLogin"
                    style="width: 100%"
                  >
                    <svg
                      style="margin-bottom: -2px"
                      viewBox="0 0 1024 1024"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                    >
                      <path
                        d="M863.4 493.3L744.2 344.2c-5.8-7.2-14.4-11.2-23.3-11.2-3.3 0-6.6 0.5-9.9 1.7-11.9 4.2-19.9 15.5-19.9 28.1v89.5H452.5c-32.9 0-59.6 26.7-59.6 59.6 0 32.9 26.7 59.6 59.6 59.6H691V661c0 12.7 8 23.9 19.9 28.1 3.2 1.1 6.6 1.7 9.9 1.7 8.9 0 17.5-4 23.3-11.2l119.3-149.1c8.8-10.8 8.8-26.3 0-37.2zM571.8 750.5H332.7c-32.7 0-59.2-26.7-59.2-59.6V333v-0.5c0-32.7 26.7-59.2 59.7-59.2h238.5c32.9 0 59.6-26.7 59.6-59.6 0-32.9-26.7-59.6-59.6-59.6H273.6c-65.9 0-119.3 53.4-119.3 119.3v477.1c0 65.9 53.4 119.3 119.3 119.3h298.2c32.9 0 59.6-26.7 59.6-59.6 0-33-26.7-59.7-59.6-59.7z m0 0"
                        fill="#f44336"
                      ></path>
                    </svg>
                    退出登录
                  </el-button>
                </el-popover>
              </div>
              <div
                style="margin-left: 10px; cursor: pointer"
                @click="jumpUserCenter"
              >
                <el-row style="font-weight: 600">个人中心</el-row>
                <el-row style="font-size: 12px; font-weight: 400; color: #9a9aaf; max-width: 300px" class="ellipsis-lines-2">
                  {{ userInfo.name }}
                </el-row>
              </div>
            </div>
            <el-popover
              v-if="!userInfo.name"
              placement="bottom"
              popper-class="not-selected"
              width="200"
              trigger="hover"
              :popper-options="{
                boundariesElement: 'body',
                removeOnDestroy: true
              }"
            >
              <el-button slot="reference" class="popover_button">
                登录/注册
              </el-button>
              <div class="popover_title">未登录</div>
              <el-button
                class="white_button"
                @click="IPLogin"
                style="width: 100%; margin-bottom: 10px"
              >
                机构用户（IP）登录
              </el-button>
              <br />
              <el-button
                class="blue_button"
                @click="jumpLogin"
                style="width: 100%"
              >
                个人用户登录
              </el-button>
            </el-popover>
          </div>
        </div>
      </el-header>

      <!-- 主要内容 -->
      <el-main class="none-scrollbar" id="main">
        <!-- 主页内容 -->
        <router-view
          ref="child"
          style="width: 100%; max-width: 2000px; margin: auto"
          @getUserInfo="getUserInfo"
          @openQRCode="
            val => {
              visible = val;
            }
          "
          @IPLogin="IPLogin"
        />
      </el-main>

      <!-- 社群、客服按钮 -->
      <template v-if="!hintButton">
        <a href="https://support.qiyandata.com/">
          <el-button
            class="declaration_failure"
          >
            <svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
            >
              <path
                d="M487.462652 705.683211l0-10.453073c0-2.803859 0.212848-6.033413 0.679475-9.772574L321.970504 685.457564c-11.68411 0-21.669532-4.16281-29.954219-12.491499-8.284687-8.327666-12.44852-18.524912-12.44852-30.591739s4.163833-22.349007 12.44852-30.931476c8.28571-8.583492 18.270109-12.874215 29.954219-12.874215L517.714653 598.568634c17.036002-27.362184 39.59888-49.201585 67.598584-65.389266 28.042683-16.229636 58.888202-24.345478 92.539626-24.345478 3.569292 0 7.393387 0.12689 11.472286 0.382717 3.992941 0.169869 8.030907 0.551562 12.065803 1.019213L701.390953 337.734024l-98.231255 0c-12.535501 0-23.284309-2.888793-32.292474-8.668427-8.964162-5.820566-16.23066-13.001105-21.839401-21.584598-5.607718-8.497535-9.771551-17.929348-12.447497-28.126594-2.677992-10.197246-4.036943-19.715017-4.036943-28.551266l0-86.888929L220.67854 163.91421c-6.458085 0-12.916171 2.5071-17.844413 7.606235s-7.350408 11.812023-7.350408 18.482957l0 513.045819-0.042979 0 0 87.695295c0 6.713912 2.464121 13.383822 7.393387 18.524912 4.928243 5.056156 11.387351 7.563256 17.844413 7.563256l59.738569 0c0.594541 0.084934 1.190105 0.084934 1.826602 0.084934l238.826364 0c-10.706853-15.763009-19.035542-32.970926-24.855084-51.792597C490.351446 746.301304 487.462652 726.501352 487.462652 705.683211zM292.016285 437.241342c8.28571-8.413624 18.270109-12.491499 29.954219-12.491499l252.29512 0c11.642155 0 21.583574 4.077875 29.91124 12.491499 8.284687 8.327666 12.405541 18.524912 12.405541 30.54876 0 12.066827-4.120854 22.391986-12.405541 30.974455-8.328689 8.583492-18.270109 12.83226-29.91124 12.83226L321.970504 511.596817c-11.68411 0-21.669532-4.248767-29.954219-12.83226-8.284687-8.582469-12.44852-18.907629-12.44852-30.974455C279.567765 455.766254 283.731598 445.569008 292.016285 437.241342zM816.789193 647.218658c-7.819083-18.524912-18.525935-34.755572-31.952736-48.649-13.468756-13.893428-29.145807-24.940019-47.076178-33.05586s-37.220716-12.19474-57.868989-12.19474c-20.224624 0-39.259142 4.078899-57.189514 12.19474s-33.651424 19.162432-47.078225 33.05586c-13.468756 13.893428-24.133653 30.124088-31.992645 48.649-7.861038 18.525935-11.770068 38.238906-11.770068 59.144028 0 21.328771 3.90903 41.298592 11.770068 59.823504 7.858992 18.524912 18.523889 34.755572 31.992645 48.606021 13.426801 13.936407 29.147854 24.984021 47.078225 33.056883 17.929348 8.157797 36.96489 12.236696 57.189514 12.236696 20.648272 0 39.938618-4.078899 57.868989-12.236696 17.929348-8.072863 33.607422-19.120476 47.076178-33.056883 13.426801-13.850449 24.133653-30.081109 31.952736-48.606021 7.817036-18.524912 11.768021-38.494733 11.768021-59.823504C828.557214 685.457564 824.606229 665.74357 816.789193 647.218658zM705.045179 695.188182 705.045179 800.770869c0 12.831236-10.367115 23.198352-23.198352 23.198352-6.417153 0-12.237719-2.591011-16.400528-6.797823-4.248767-4.206812-6.79987-10.027377-6.79987-16.400528L658.64643 695.188182l-71.889307 0 95.76918-94.324272 95.725178 94.324272L705.045179 695.188182zM625.337813 293.291836l76.052117 0L701.38993 190.002378c0-6.670933-2.464121-13.383822-7.393387-18.482957s-11.386328-7.606235-17.844413-7.606235l-101.290941 0 0 77.20129c0 13.340843 4.928243 26.682709 14.785751 36.879955C599.503425 288.107767 612.420619 293.291836 625.337813 293.291836z"
                fill="#0e68b4"
              ></path>
            </svg>
            故障申报
          </el-button>
        </a>
        <el-popover
          placement="left-start"
          trigger="hover"
          class="contact_service"
          popper-class="popover_join"
          v-model="visible"
          :popper-options="{ boundariesElement: 'body', removeOnDestroy: true }"
        >
          <el-button slot="reference">
            <svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
            >
              <path
                d="M884.165 451.494c-2.494-203.504-168.046-367.753-372.161-367.753s-369.666 164.249-372.165 367.753c-34.163 27.314-56.096 69.25-56.096 116.37 0 82.254 66.697 148.969 148.96 148.969 35.899 0 68.818-12.726 94.534-33.857l-70.18-261.923c-7.949-1.294-16.045-2.155-24.353-2.155-5.474 0-10.855 0.339-16.183 0.926 17.954-147.35 143.268-261.601 295.488-261.601 152.199 0 277.532 114.25 295.481 261.601-5.306-0.583-10.705-0.926-16.18-0.926-8.305 0-16.421 0.863-24.375 2.155l-70.159 261.801c19.847 16.295 43.981 27.559 70.459 31.868-35.138 37.751-79.825 66.511-130.378 82.068l-6.164 6.156c-15.77-28.99-46.122-48.892-81.442-48.892-51.427 0-93.102 41.674-93.102 93.118 0 51.431 41.673 93.104 93.102 93.104 42.211 0 77.419-28.27 88.852-66.758 102.752-25.189 188.829-92.829 238.272-183.482 38.595-26.917 63.899-71.562 63.899-122.175-0.002-47.108-21.955-89.058-56.102-116.371z"
                fill="#ffffff"
              ></path>
            </svg>
            联系客服
          </el-button>
          <div style="float: right">
            <div class="popover_image">
              <el-image
                :src="require('@/assets/qrcode/社科大数据平台.png')"
                fit="fill"
              >
              </el-image>
            </div>
            <div class="popover_hint">请使用微信扫一扫</div>
          </div>
        </el-popover>
      </template>
    </el-container>

    <!-- 搜索对话框 -->
    <el-dialog
      :visible.sync="searchDialog"
      width="1200px"
      top="0"
      custom-class="searchDialog"
      :destroy-on-close="true"
    >
      <div slot="title" v-if="searchDialog">
        <el-tabs
          v-model="searchActiveName"
          class="search_tab"
          @tab-click="search"
        >
          <el-tab-pane
            v-for="(menu, i) in searchMenu"
            :key="i"
            :name="menu.type"
          >
            <span slot="label" class="not-selected">{{ menu.name }}</span>
          </el-tab-pane>
        </el-tabs>
        <el-row style="padding: 10px 30px 20px">
          <el-col :span="21" class="search_input">
            <el-input
              v-model.trim="searchText"
              prefix-icon="el-icon-search"
              clearable
              @keydown.enter.native="search"
              placeholder="搜索数据 例如专利、数字经济"
            >
            </el-input>
          </el-col>
          <el-col :offset="1" :span="2" class="search_button">
            <el-button @click="search"> 搜索 </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="search_header not-selected" v-if="searchDialog">
        <el-radio-group v-model="searchChannelName" @change="search">
          <el-radio-button
            v-for="(item, index) in searchChannel"
            :key="index"
            :label="item.type"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
        <p style="margin: 0" v-html="searchResult"></p>
      </div>
      <div
        class="search_body scrollbar"
        v-loading="searchLoading"
        element-loading-text="加载中"
        element-loading-background="#eeeeee"
      >
        <div
          v-for="(item, index) in searchList"
          class="search_item"
          @click="jumpTable(item)"
          :key="index"
        >
          <p v-html="item.name"></p>
        </div>
        <el-empty
          description="暂无数据"
          v-if="!searchList || searchList.length === 0"
        ></el-empty>
        <div style="text-align: center; margin: 20px 0">
          没找到想要的数据？
          <span style="color: #0e68b4; cursor: pointer" @click="jumpContactUs"
            >联系客服</span
          >
        </div>
      </div>

      <!-- 提示对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="hintDialog"
        width="450px"
        top="0"
        custom-class="hint_dialog"
        append-to-body
      >
        <span>
          <i class="el-icon-warning"></i>
          该功能需登录之后才可使用，请先登录！
        </span>
        <span slot="footer">
          <el-button @click="hintDialog = false">取 消</el-button>
          <el-button type="success" @click="IPLogin">机构 IP 登录</el-button>
          <el-button type="primary" @click="jumpLogin">个人用户登录</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 菜单列表
      menuList: [
        {
          title: "首页",
          index: "/welcome"
        },
        {
          title: "数据中心",
          index: "/data_center",
          desc: "IP用户可直接下载数据"
        },
        {
          title: "数据超市",
          index: "/data_mart",
          desc: "个人用户可采购单表数据"
        },
        {
          title: "会员专区",
          index: "/vip_zone",
          desc: "会员用户数据免费下载"
        }
      ],
      subMenuList: [
        {
          title: "Python学习专区",
          index: "/learning_zone",
          icon: '<svg t="1695353920603" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16647" width="22" height="22"><path d="M428.6976 107.3152c-6.5024 72.192-36.352 207.2576-160.256 337.408 3.6864-48.0256-7.1168-83.7632-19.0464-107.6736-6.6048-13.1584-26.0608-10.5984-28.8768 3.84-5.7344 29.44-20.5824 75.0592-57.6 137.7792-71.6288 121.3952-62.5664 459.8784 340.736 459.8784s430.4384-352.8192 373.1456-496.0256c-37.376-93.44-93.952-152.5248-128.8192-182.3232-11.4176-9.7792-29.1328-1.9456-29.5936 13.056-0.9216 30.464-7.3216 73.3696-33.0752 102.144-0.6656-52.7872-38.144-208.384-202.4448-296.8576-23.296-12.544-51.7632 2.4576-54.1696 28.7744z" fill="#FF5D50" p-id="16648"></path><path d="M702.2592 678.4c-4.1984-45.056-60.672-166.5536-212.6336-246.4256-10.5984-5.5808-23.0912 3.1232-21.504 15.0016 6.2464 46.848 12.9536 140.4928-24.064 184.7296 4.0448-40.3968-18.1248-73.8304-36.6592-94.3104-8.3968-9.216-23.552-4.6592-25.4976 7.68-3.5328 22.3232-12.8512 56.2688-36.5568 97.9456-42.0864 74.0352-86.9888 188.672 124.5696 294.656 10.9568 0.5632 22.1696 0.8704 33.7408 0.8704 11.2128 0 22.0672-0.3072 32.7168-0.8704 158.2592-59.4944 173.4656-177.9712 165.888-259.2768z" fill="#FFDF99" p-id="16649"></path></svg>'
        },
        {
          title: "服务与支持",
          index: "/service"
        },
        {
          title: "关于我们",
          index: "/about"
        }
      ],
      // 用户中心菜单列表
      userCenterMenuList: [
        {
          title: "账号设置",
          icon: "el-icon-user",
          index: "/user_center/account"
        },
        {
          title: "我的购物车",
          icon: "el-icon-shopping-cart-1",
          index: "/user_center/shopping"
        },
        {
          title: "订单与发票",
          icon: "el-icon-notebook-2",
          index: "/user_center/orders"
        },
        {
          title: "会员及优惠券",
          icon: "el-icon-s-ticket",
          index: "/user_center/vip_coupon"
        },
        {
          title: "我的收藏",
          icon: "el-icon-star-off",
          index: "/user_center/collect"
        }
      ],
      // 搜索字段
      searchText: "",
      // 禁用获取
      disableGet: false,
      // 搜索菜单
      searchMenu: [],
      // 搜索方式
      searchChannel: [],
      // 搜索对话框
      searchDialog: false,
      // 当前搜索活动页
      searchActiveName: "",
      // 当前搜索方式
      searchChannelName: "",
      // 搜索结果
      searchResult: "",
      // 搜索列表加载
      searchLoading: true,
      // 搜索列表
      searchList: [],
      // 右下角弹出框
      visible: false,
      visible_0: false,
      // 禁用ip登录
      disabled: false,
      // 提示对话框
      hintDialog: false,
    };
  },
  methods: {
    // 跳转到首页
    jumpHome() {
      this.$router.push("/");
    },
    // 跳转到登录页面
    jumpLogin() {
      this.hintDialog = false;
      this.$router.push("/login");
    },
    // 跳转到个人中心
    jumpUserCenter() {
      if (this.$route.path.indexOf("/user_center") < 0)
        this.$router.push("/user_center");
    },
    // 退出登录
    exitLogin() {
      this.visible_0 = false;
      sessionStorage.clear();
      this.$router.push("/");
      this.$store.commit("setUserInfo", {});
    },
    // IP登录
    IPLogin() {
      this.hintDialog = false;
      if (this.disabled) return;
      this.disabled = true;
      setTimeout(() => {
        this.disabled = false;
      }, 2000);
      this.$http
        .post(process.env.API_ROOT + "/user/loginOrganize")
        .then(data => {
          let res = data.data;
          // 登录失败，根据 message 返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("登录失败，" + res.message);
          }
          // 登录成功，处理数据
          else {
            res.data.token = res.token;
            this.$store.commit("setUserInfo", res.data);
            this.$message.success("登录成功！");
            let path = this.$route.path;
            if (path.includes("/data_mart")) this.$refs.child.init();
          }
        })
        .catch(err => {
          let message = err.response.data.message;
          if (!message) message = "服务器错误，请稍后再试！";
          this.$message.error("登录失败，" + message);
        });
    },
    // 获取登入用户信息
    async getUserInfo(callback, type) {
      if (this.disableGet) {
        if (callback) return callback();
      }
      this.disableGet = true;
      setTimeout(() => {
        this.disableGet = false;
      }, 1000);
      if (!this.userInfo.name || !this.userInfo.token) return;
      try {
        const { data: res } = await this.$http.get(
          process.env.API_ROOT + "/market/userInfo",
          {
            params: {
              time: new Date().getTime()
            },
            headers: {
              token: this.userInfo.token
            }
          }
        );
        // 获取成功，整理数据
        if (res.status === 0) {
          let token = this.userInfo.token;
          let rz_time = this.userInfo.rz_time;
          const userInfo = res.data;
          if (!Array.isArray(userInfo.validity))
            userInfo.validity = [];
          userInfo.name = userInfo.name || "未命名用户";
          userInfo.isVip = userInfo.isVip || false;
          userInfo.rz_time = userInfo.rz_time || rz_time;
          userInfo.newUser = false;
          if (userInfo.phone)
            userInfo.showPhone =
              userInfo.phone.substr(0, 3) +
              "****" +
              userInfo.phone.substr(7, 4);
          if (userInfo.email && userInfo.email.indexOf("@") > 1)
            userInfo.showEmail =
              userInfo.email.substr(0, 2) +
              "****" +
              userInfo.email.substring(
                userInfo.email.indexOf("@"),
                userInfo.email.length
              );
          else if (userInfo.email)
            userInfo.showEmail =
              userInfo.email.substr(0, 1) +
              "****" +
              userInfo.email.substring(
                userInfo.email.indexOf("@"),
                userInfo.email.length
              );
          userInfo.token = token;
          this.$store.commit("setUserInfo", userInfo);
        } else if (res.status === 401 && type === "account") {
          if (!res.message) res.message = "服务器错误，请稍后再试！";
          this.$message.error("用户信息获取失败，" + res.message);
        }
      } catch (e) {
      } finally {
        if (callback) callback();
      }
    },
    // 获取搜索菜单
    getSearchMenu() {
      this.searchMenu = [];
      this.searchChannel = [];

      this.$http.get(process.env.API_ROOT + "/search/module").then(data => {
        let res = data.data;
        // 获取成功，处理数据
        if (res.status === 0) {
          this.searchMenu = res.data.database_id;
          this.searchChannel = res.data.searchChannel;
          if (this.searchMenu && this.searchMenu.length > 0)
            this.searchActiveName = this.searchMenu[0].type;
          if (this.searchChannel && this.searchChannel.length > 0)
            this.searchChannelName = this.searchChannel[0].type;
        }
      });
    },
    // 打开搜索对话框
    openSearchDialog() {
      this.searchDialog = true;
      this.search();
    },
    // 搜索
    search() {
      this.searchList = [];
      this.searchLoading = true;
      this.searchResult = this.getSearchResult();
      if (!this.searchText) {
        this.searchLoading = false;
        return this.$message({
          message: "请输入关键词搜索！",
          type: "warning",
          customClass: "message"
        });
      }

      this.$http
        .post(process.env.API_ROOT + "/search", {
          database_id: this.searchActiveName,
          searchChannel: this.searchChannelName,
          keyword: this.searchText
        })
        .then(data => {
          let res = data.data;
          // 获取失败，根据message返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("数据查询失败，" + res.message);
          }
          // 获取成功，整理数据
          else {
            if (res.data && res.data.length > 0) {
              res.data.forEach(i => {
                let object = {
                  database: i.DATABASE_ENG,
                  code: i.TABLE_ENG
                };
                if (this.searchChannelName === "field") {
                  object.name =
                    i.DATABASE +
                    " > " +
                    i.B_DATABASE +
                    " > " +
                    i.PART +
                    " > " +
                    i.TABLE +
                    " > " +
                    this.highlight(i.VARIABLE);
                } else if (this.searchChannelName === "table") {
                  object.name =
                    i.DATABASE +
                    " > " +
                    i.B_DATABASE +
                    " > " +
                    i.PART +
                    " > " +
                    this.highlight(i.TABLE);
                } else if (this.searchChannelName === "part") {
                  object.name =
                    i.DATABASE +
                    " > " +
                    i.B_DATABASE +
                    " > " +
                    this.highlight(i.PART) +
                    " > " +
                    i.TABLE;
                } else if (this.searchChannelName === "database") {
                  object.name =
                    i.DATABASE +
                    " > " +
                    this.highlight(i.B_DATABASE) +
                    " > " +
                    i.PART +
                    " > " +
                    i.TABLE;
                }
                if (this.searchList && this.searchList.length > 0) {
                  let flag = false;
                  this.searchList.some(j => {
                    if (j.name === object.name) {
                      flag = true;
                      return true;
                    }
                  });
                  if (!flag) this.searchList.push(object);
                } else {
                  this.searchList.push(object);
                }
              });
            }
          }
        })
        .catch(() => {
          this.$message.error("数据查询失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.searchLoading = false;
          this.searchResult = this.getSearchResult();
        });
    },
    // 获取搜索结果
    getSearchResult() {
      let name = "";
      if (this.searchMenu && this.searchMenu.length > 0) {
        this.searchMenu.forEach(item => {
          if (item.type === this.searchActiveName) name = item.name;
        });
      }
      let searchText = "";
      if (this.searchText) searchText = " - " + this.searchText;
      return (
        "以下为关于<span style='color:red'> " +
        name +
        searchText +
        " </span>的结果，共计<span style='color:red'> " +
        this.searchList.length +
        " </span>个结果"
      );
    },
    // 关键词高亮显示
    highlight(text) {
      if (text) {
        const highlightStr = `<span style="background: #0e68b4; color: white">${this.searchText}</span>`;
        const reg = new RegExp(this.searchText, "gi");
        return text.replace(reg, highlightStr);
      }
    },
    // 跳转表格
    jumpTable(val) {
      if (!this.userInfo.token) {
        this.hintDialog = true;
      } else {
        // 在新窗口打开路由
        const params = {
          database: val.database,
          code: val.code
        };
        let routeData = this.$router.resolve({
          path: "/table",
          query: params
        });
        window.open(routeData.href, "_blank");
      }
    },
    // 跳转到“联系客服”
    jumpContactUs() {
      this.searchDialog = false;
      this.$router.push("/about/contact_us");
      this.$refs.child.init();
    },
    // 跳转路由
    jumpRouter(path) {
      this.visible_0 = false;

      if (path === "/user_center/vip_coupon") {
        let str = this.$router.currentRoute.path;
        if (str === "/user_center/coupon" || str === "/user_center/vip") return;
      }
      if (path === "/user_center/vip")
        this.$router.push({
          name: "Vip",
          params: {
            buyVip: true
          }
        });
      else this.$router.push(path);
    }
  },
  mounted() {
    this.getUserInfo();
    this.getSearchMenu();
  },
  computed: {
    /** 用户信息 */
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    /** 激活菜单 */
    activeIndex() {
      const path = this.$route.path
      const menu = this.menuList.find(v => path.includes(v.index))
      if (menu)
        return menu.index
      else
        return path
    },
    /** 隐藏右下角按钮 */
    hintButton() {
      return this.$route.path.includes('confirm_order')
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  position: relative;
  width: 100%;
  height: 100%;

  .el-container {
    height: 100%;

    .el-header {
      background: white;
      margin-bottom: 2px;
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.25);

      .header_div {
        width: 100%;
        height: 100%;
        max-width: 2000px;
        margin: auto;
        display: flex;
        align-items: center;

        .logo_title {
          height: 66px;
          display: flex;
          align-items: center;
          color: black;
          cursor: pointer;

          .title {
            font-size: 19px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .sub_title {
            font-size: 13px;
          }
        }

        .menu {
          .el-menu {
            display: flex;
            justify-content: center;
            border-bottom: none;

            .el-menu-item {
              font-size: 20px;
              font-weight: 700;
              color: black;
            }
          }

          .el-menu::after {
            clear: none;
          }
        }

        .search {
          width: 300px;
        }

        .user {
          height: 66px;
          color: black;
          padding: 7px 0;

          > span,
          > div {
            height: 52px;
            display: flex;
            align-items: center;
            float: right;
            margin-right: 30px;

            .popover_button {
              font-size: 17px;
              font-weight: 600;
              color: black;
              background: transparent;
              border: transparent;
            }
          }
        }
      }
    }

    .el-main {
      padding: 0;
      width: 100%;
    }

    .declaration_failure,
    .contact_service .el-button {
      border: 1px solid #0e68b4;
      border-radius: 20px;
      padding: 12px;
      width: 41px;
      z-index: 100;
    }

    .declaration_failure {
      position: absolute;
      right: 20px;
      bottom: 230px;
      color: #0e68b4;
      background: white;
    }

    .contact_service {
      height: 0;
      z-index: 100;
      position: absolute;
      right: 20px;
      bottom: 70px;

      .el-button {
        color: white;
        background: #0e68b4;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
  }
}

.el-popover {
  .popover_background {
    background-image: url(~@/assets/bg/login.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    color: #fff;
    overflow: hidden;
    border-radius: 10px;
    margin-bottom: 10px;

    > div {
      width: 100%;
      height: 100%;
      padding: 10px 10px 30px;
      box-sizing: border-box;
      background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.3));

      p {
        margin: 5px;
      }

      .popover_type {
        font-size: 12px;
        padding: 1px 6px;
        background: #0e68b4;
        margin: 5px;
        border-radius: 10px;
      }
    }
  }

  .popover_menu {
    font-size: 16px;
    color: black;

    > div {
      margin-bottom: 3px;
      padding: 5px 10px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;

      i {
        margin-right: 7px;
      }
    }

    > div:hover {
      background: #eeeeee;
    }
  }

  .popover_title {
    font-size: 18px;
    font-weight: 700;
    color: #9e9e9e;
    margin-bottom: 30px;
  }

  .red_button {
    color: #f44336;
    background: #feeceb;
    border: none;
    border-radius: 10px;
  }

  .red_button:hover {
    background: #fadedc;
  }

  .white_button {
    color: #0e68b4;
    border: 1px solid #0e68b4;
    border-radius: 10px;
  }

  .blue_button {
    color: white;
    background: #0e68b4;
    border: 1px solid #0e68b4;
    border-radius: 10px;
  }

  .blue_button:hover {
    background: #0e80cc;
  }

  .popover_image {
    width: 130px;
    height: 130px;
    padding: 7px;
    background: white;
    border-radius: 25px;
    margin-bottom: 5px;
  }

  .popover_hint {
    width: 124px;
    font-size: 12px;
    text-align: center;
    color: #0e68b4;
    padding: 10px;
    background: white;
    border-radius: 25px;
  }
}
</style>

<style lang="scss">
.home {
  .el-container {
    .el-header {
      .header_div {
        .search {
          .el-input__inner {
            background: #eeeeee;
            font-size: 14px;
            color: black;
            border-radius: 20px;
            padding: 0 20px;
          }
        }

        .el-badge {
          display: flex;

          .el-badge__content {
            height: 12px;
            width: 12px;
            right: 12px;
            top: 5px;
            background: red;
          }
        }
      }
    }

    .declaration_failure,
    .contact_service {
      span {
        writing-mode: vertical-lr;
        letter-spacing: 8px;
      }
    }
  }

  .el-dialog__wrapper {
    padding: 80px 0;

    .searchDialog {
      height: 100%;
      min-height: 600px;
      margin: 0 auto;
      border-radius: 10px;
      position: relative;
      overflow: hidden;

      .el-icon-close:before {
        font-size: 30px;
        font-weight: 700;
        color: #222222;
      }

      .el-dialog__header {
        height: 130px;
        padding: 0;
        background: white;

        .search_tab {
          position: relative;
          margin-right: 30px;

          > .el-tabs__header {
            height: 60px;
            padding: 10px 30px;
            margin: 0;
            box-sizing: border-box;

            .el-tabs__item {
              font-size: 16px;
              font-weight: 700;
              color: black;
            }

            .el-tabs__item.is-active {
              color: #0168b7;
            }

            .el-tabs__nav-wrap {
              margin: 0;
            }

            .el-tabs__nav-wrap::after {
              content: none;
            }

            .el-tabs__active-bar {
              background: #0168b7;
            }
          }
        }

        .search_input {
          .el-input__inner {
            background: #eeeeee;
            color: black;
            border-radius: 10px;
          }
        }

        .search_button .el-button {
          background: #0e68b4;
          color: white;
          width: 100%;
          border-radius: 10px;
        }
      }

      .el-dialog__body {
        padding: 0;
        position: absolute;
        top: 130px;
        bottom: 0;
        left: 0;
        right: 0;
        background: #eeeeee;

        .search_header {
          height: 80px;
          padding: 10px;
          text-align: center;

          .el-radio-group {
            border-radius: 15px;
            margin: 10px;

            .el-radio-button {
              .el-radio-button__inner {
                color: black;
              }
            }

            .el-radio-button.is-active,
            .el-radio-button.is-active:hover {
              .el-radio-button__inner {
                background: #0e68b4;
                color: white;
              }
            }

            .el-radio-button:hover {
              .el-radio-button__inner {
                color: #0e68b4;
              }
            }
          }
        }

        .search_body {
          position: absolute;
          top: 100px;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0 10px;
          box-sizing: border-box;

          .search_item {
            margin: 10px;
            padding: 10px 20px;
            background: white;
            border-radius: 10px;
            cursor: pointer;

            p {
              font-size: 16px;
              margin: 0;
            }
          }

          .search_item:hover {
            background: #dddddd;
          }
        }
      }
    }
  }
}

.popover_join {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.message {
  z-index: 3000 !important;
}

.hint_dialog {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .el-dialog__header {
    padding: 15px 15px 10px;
  }

  .el-dialog__body {
    padding: 10px 15px;

    i {
      font-size: 24px;
      color: #e6a23c;
      margin-right: 5px;
      position: relative;
      top: 3px;
    }
  }

  .el-dialog__footer {
    padding: 5px 15px 20px;

    .el-button {
      font-size: 12px;
      padding: 9px 12px;
    }
  }
}

.el-avatar {
  position: relative;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.el-badge.vip-tab {
  .el-badge__content {
    top: -6px;
    right: -16px;
    transform: scale(0.7);
    transform-origin: top right;
    padding: 2px 3px;
    line-height: normal;
    background: red;
    border-radius: 50%;
  }
}
</style>
