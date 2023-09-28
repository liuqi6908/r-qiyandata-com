<template>
  <!-- 页面展示组件 -->
  <div class="page_element">
    <div style="max-width: 2000px; margin: auto">
      <MyElement
        v-for="(item, index) in elementList"
        :key="index"
        :elementData="item"
        @IPLogin="IPLogin"
      >
      </MyElement>
    </div>
    <div v-if="isShowFooter" style="height: 260px; width: 1px"></div>
    <FooterElement v-if="isShowFooter" class="footer"></FooterElement>
  </div>
</template>

<script>
export default {
  name: "PageElement",
  props: {
    pageName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 页面名称
      name: null,
      // 组件列表
      elementList: [],
      // 是否显示页脚
      isShowFooter: false
    };
  },
  methods: {
    // 重载页面
    loadingPage() {
      let path = this.$route.fullPath;
      if (
        path === "/vip_zone/data_resource" ||
        path === "/vip_zone/data_zone"
      ) {
        let userInfo = this.$store.getters.getUserInfo;
        if (
          !userInfo.token ||
          userInfo.type === "机构用户" ||
          (userInfo.type === "个人用户" && userInfo.status !== "1")
        )
          return this.$router.push("/vip_zone/home");
      }

      this.elementList = [];
      if (document.getElementById("main"))
        document.getElementById("main").scrollTop = 0;
      this.init(path);
      this.getElementList();
    },
    // 初始化
    init(path) {
      switch (path) {
        case "/welcome":
          this.name = "首页";
          this.isShowFooter = true;
          break;
        case "/data_mart/home":
          this.name = "数据超市";
          break;
        case "/vip_zone/data_resource":
          this.name = "公共数据资源";
          break;
        case "/vip_zone/wave":
          this.name = "高下制图";
          break;
        case "/service/question":
          this.name = "常见问题";
          break;
        case "/about/qiyan_cloud":
          this.name = "研盾云桌面";
          break;
        case "/about/data_visual":
          this.name = "数据可视化系统";
          break;
      }
    },
    // 获取组件列表
    async getElementList() {
      if (!this.name) this.name = this.pageName;
      await this.$http
        .post(process.env.API_ROOT + "/index/module", { name: this.name })
        .then(data => {
          let res = data.data;
          // 获取失败，根据 message 输出提示信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("页面加载失败，" + res.message);
          }
          // 获取成功，处理数据
          else {
            if (res.data.items) this.elementList = JSON.parse(res.data.items);
            sessionStorage.setItem("maintain", "false");
          }
        })
        .catch(err => {
          if (err.response.status === 503)
            this.$message.error("访问太过频繁，请稍后再试！");
          else {
            this.$message.error("页面加载失败，服务器错误，请稍后再试！");
            sessionStorage.setItem("maintain", "true");
            this.$router.push("/maintain");
          }
        })
        .finally(() => {
          if (this.name === "数据超市")
            this.$nextTick(() => {
              this.$emit("relayout");
            });
        });
    },
    // IP登录
    IPLogin() {
      this.$emit("IPLogin");
    }
  },
  mounted() {
    this.loadingPage();
  },
  watch: {
    $route: function(to, from) {
      switch (to.path) {
        case "/welcome":
          this.loadingPage();
          break;
      }
    }
  }
};
</script>

<style scoped>
.page_element {
  width: 100%;
  height: auto;
  min-height: 100%;
  position: relative;
}

.footer {
  position: absolute;
  bottom: 0;
}
</style>
