<template>
  <!-- 会员及优惠券 -->
  <div class="vip-and-coupon">
    <el-tabs v-model="activeName" :before-leave="beforeLeave" @tab-click="jump">
      <el-tab-pane
        v-for="(item, index) in menuList"
        :key="index"
        :name="item.name"
        :myData="item.path"
      >
        <div slot="label" class="not-selected">
          <el-badge
            value="+1"
            :hidden="index !== 1 || !userInfo.newUser"
            class="vip-tab"
          >
            {{ item.name }}
            <span v-if="item.name === '优惠券'">({{ count || 0 }})</span>
          </el-badge>
        </div>
        <div>
          <router-view
            v-if="item.name === activeName"
            @init="init"
            @getCouponCount="getCouponCount"
            @updateCount="updateCount"
            @IPLogin="IPLogin"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "VipAndCoupon",
  data() {
    return {
      // 当前登入用户信息
      userInfo: {},
      // 当前活动页面
      activeName: "",
      // 导航列表
      menuList: [
        {
          name: "优惠券",
          path: "/user_center/coupon",
        },
        {
          name: "会员权益",
          path: "/user_center/vip",
        },
      ],
      // 禁用跳转
      disable: false,
      // 待使用优惠券数量
      count: null,
    };
  },
  methods: {
    // 初始化
    init() {
      let path = this.$route.path;
      this.menuList.forEach((item) => {
        if (item.path === path) this.activeName = item.name;
      });
      this.userInfo = this.$store.getters.getUserInfo;
    },
    // 标签切换
    beforeLeave() {
      return !this.disable;
    },
    // 跳转
    jump(val) {
      if (this.disable) return;
      this.disable = true;
      setTimeout(() => {
        this.disable = false;
      }, 300);
      this.jumpRouter(val.$attrs.myData);
    },
    // 跳转路由
    jumpRouter(path) {
      if (path !== this.$route.path) this.$router.push(path);
    },
    // 获取待使用优惠券数量
    getCouponCount() {
      if (this.count !== null) return;
      this.$http
        .get(process.env.API_ROOT + "/coupon/getCouponList", {
          params: {
            time: new Date().getTime(),
          },
          headers: {
            token: this.userInfo.token,
          },
        })
        .then((data) => {
          let res = data.data;
          // 获取成功，处理数据
          if (res.status === 0) {
            this.count = 0;
            if (res.data && res.data.length > 0)
              res.data.forEach((item) => {
                if (item.status === 0) this.count++;
              });
          }
        })
        .catch(() => {});
    },
    // 更新优惠券数量
    updateCount(count) {
      this.count = count;
    },
    // IP登录
    IPLogin() {
      this.$emit("IPLogin");
    },
  },
  mounted() {
    this.$emit("changeActiveName", "3");
    this.init();
  }
};
</script>

<style lang="scss">
.vip-and-coupon {
  width: 100%;
  height: 100%;
  overflow: hidden;

  > .el-tabs {
    height: 100%;
    position: relative;
    background: white;

    > .el-tabs__header {
      height: 60px;
      padding: 10px 30px;
      box-sizing: border-box;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
      margin: 0 0 10px;

      .el-tabs__item {
        font-size: 16px;
        font-weight: 700;
        color: black;

        .el-badge.vip-tab {
          .el-badge__content {
            top: 0;
            padding: 2px 4px;
            line-height: 18px;
          }
        }
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

    > .el-tabs__content {
      padding: 0;
      position: absolute;
      top: 70px;
      bottom: 0;
      width: 100%;
      overflow: visible;

      > .el-tab-pane {
        height: 100%;

        > div {
          height: 100%;
        }
      }
    }
  }
}
</style>
