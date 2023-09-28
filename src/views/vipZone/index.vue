<template>
  <!-- 会员专区 -->
  <div class="download" v-loading="loading">
    <router-view
      v-if="
        !userInfo.name ||
          userInfo.type === '机构用户' ||
          (userInfo.type === '个人用户' && userInfo.status !== '1')
      "
      style="height: 100%"
    />
    <template v-else>
      <el-tabs
        tab-position="left"
        type="border-card"
        v-model="activeName"
        class="tabs"
        :before-leave="beforeLeave"
        @tab-click="jump"
      >
        <el-tab-pane
          v-for="(item, i) in menuList"
          :key="i"
          :name="item.name"
          :myData="item"
        >
          <span slot="label" class="not-selected">
            <i :class="item.icon + ' icon'" v-if="item.icon"></i>
            <el-image :src="item.img" v-else-if="item.img"></el-image>
            {{ item.label }}
          </span>
          <div class="tabs_body">
            <router-view
              v-if="item.name === activeName"
              style="height: 100%"
              class="scrollbar"
              @changeActiveName="changeActiveName"
              @IPLogin="IPLogin"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="qr-code">
        <img :src="QRCode1" width="100">
        <div style="margin-bottom: 20px">
          联系客服<br />加入VIP专属社群
        </div>
        <img :src="QRCode2" width="100">
        <div>
          扫码填问卷<br />留下您的宝贵意见
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import QRCode1 from "@/assets/qrcode/小助理.png";
import QRCode2 from "@/assets/qrcode/调查问卷.png";
import wave from "@/assets/logo/wave.png";

export default {
  name: "VipZone",
  data() {
    return {
      // 页面加载
      loading: false,
      // 登入用户信息
      userInfo: {
        name: 1
      },
      activeName: null,
      menuList: [
        {
          label: "数据专区",
          name: "0",
          icon: "el-icon-data-line",
          path: "/vip_zone/data_zone"
        },
        {
          label: "高下制图",
          name: "1",
          img: wave,
          path: "/vip_zone/wave"
        },
        {
          label: "公共数据",
          name: "2",
          icon: "el-icon-link",
          path: "/vip_zone/data_resource"
        }
      ],
      // 禁用跳转
      disable_0: false,
      disable_1: false,
      QRCode1,
      QRCode2,
    };
  },
  methods: {
    // 初始化
    init() {
      this.userInfo = this.$store.getters.getUserInfo;
      if (
        !this.userInfo.token ||
        this.userInfo.type === "机构用户" ||
        (this.userInfo.type === "个人用户" && this.userInfo.status !== "1")
      )
        this.jumpRouter("/vip_zone/home");
      else {
        let path = this.$router.currentRoute.path;
        this.menuList.some(item => {
          if (item.path === path) {
            this.activeName = item.name;
          }
        });
      }
    },
    // 标签切换
    beforeLeave() {
      return !this.disable_0;
    },
    // 跳转
    jump(val) {
      if (this.disable_0) return;
      this.disable_0 = true;
      setTimeout(() => {
        this.disable_0 = false;
      }, 300);
      this.jumpRouter(val.$attrs.myData.path);
    },
    // 跳转路由
    jumpRouter(path) {
      if (path !== this.$route.path) this.$router.push(path);
    },
    // IP登录
    IPLogin() {
      this.$emit("IPLogin");
    },
    // 改变活动页面
    changeActiveName(val) {
      this.activeName = val;
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.download {
  width: 100%;
  height: 100%;
  position: relative;

  .tabs {
    height: 100%;
    border: none;
    background: transparent;
  }
  
  .qr-code {
    position: absolute;
    bottom: 50px;
    left: 65px;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>

<style lang="scss">
.download {
  .tabs {
    > .el-tabs__header {
      padding: 100px 20px;
      background: #fbfaff;
      box-sizing: border-box;
      margin: 0;

      .el-tabs__item {
        width: 200px;
        border: none;
        text-align: left;
        font-size: 16px;
        font-weight: 700;
        color: #576388;
        margin: 0 0 20px;
        border-radius: 10px;

        .icon {
          font-size: 20px;
          margin-right: 5px;
        }

        .el-image {
          width: 20px;
          height: 20px;
          margin-right: 5px;
          position: relative;
          top: 3px;
        }
      }

      .el-tabs__item:hover {
        color: #0168b7;
      }

      .el-tabs__item.is-active {
        background: #0168b7;
        color: white;
      }
    }

    > .el-tabs__content {
      padding: 8px 0 8px 8px;
      height: 100%;
      box-sizing: border-box;

      > .el-tab-pane {
        height: 100%;

        .tabs_body {
          height: 100%;
          background: white;
        }
      }
    }
  }
}
</style>
