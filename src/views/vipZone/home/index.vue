<template>
  <!-- 会员专区 - 首页 -->
  <div class="download_home">
    <!-- 用户未登录 或 机构用户 -->
    <div
      v-if="!userInfo.name || userInfo.type === '机构用户'"
      class="not_login"
    >
      <div>
        <el-image
          class="py-5"
          :src="login_hint"
          style="width: 400px; height: 300px"
        ></el-image>
        <div class="title">该模块仅限已认证个人用户访问</div>
        <div class="hint">请点击下方按钮，您可以通过个人账户登入系统</div>
        <div class="button">
          <el-button class="blue_button" @click="jumpRouter('/login')">
            个人用户登录
          </el-button>
        </div>
      </div>
    </div>
    <!-- 用户未通过认证 -->
    <div
      v-else-if="userInfo.type === '个人用户' && userInfo.status !== '1'"
      class="not_approve"
    >
      <div>
        <el-image
          class="py-5"
          :src="login_hint"
          style="width: 400px; height: 300px"
        ></el-image>
        <div class="title">您必须通过认证以访问该内容</div>
        <div class="hint">请前往个人中心或点击下方按钮提交认证申请</div>
        <div class="button">
          <el-button class="blue_button" @click="jumpRouter('/user_center')">
            前往认证
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import login_hint from "@/assets/icon/not-log-in.webp";

export default {
  name: "DownloadHome",
  data() {
    return {
      // 用户信息
      userInfo: {},
      login_hint,
    };
  },
  methods: {
    // 初始化
    init() {
      this.userInfo = this.$store.getters.getUserInfo;
      if (
        this.userInfo.token &&
        this.userInfo.type === "个人用户" &&
        this.userInfo.status === "1"
      )
        this.jumpRouter("/vip_zone/data_resource");
    },
    // 跳转路由
    jumpRouter(path) {
      // 先退出登录
      if (path === "/login") {
        sessionStorage.clear();
        this.userInfo = {};
        this.$store.commit("setUserInfo", this.userInfo);
      }
      this.$router.push(path);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.download_home {
  width: 100%;
  height: 100%;

  .not_login,
  .not_approve {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    > div {
      width: 100%;
      text-align: center;

      .title {
        font-size: 20px;
        font-weight: 700;
        color: #0e68b4;
      }

      .hint {
        font-size: 13px;
        color: #9e9e9e;
        margin: 10px 0 30px;
      }

      .button {
        margin-bottom: 80px;

        .el-button {
          border-radius: 10px;
          border: 1px solid #0e68b4;
        }

        .blue_button {
          color: white;
          background: #0e68b4;
        }

        .blue_button:hover {
          background: #0e80cc;
        }
      }
    }
  }
}
</style>
