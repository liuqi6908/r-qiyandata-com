<template>
  <!-- 会员专区 - 数据专区 -->
  <div class="download_data relative" v-loading="loading">
    <el-tabs
      v-model="activeType.key"
      :before-leave="beforeLeave"
      @tab-click="changeTab"
    >
      <el-tab-pane v-for="item in typeList" :key="item.key" :name="item.key">
        <span slot="label" class="not-selected">
          <span class="icon" v-if="item.icon" v-html="item.icon"></span
          >{{ item.name }}
        </span>
        <DataPage v-if="activeType.key === item.key" :pageData="activeType" />
      </el-tab-pane>
    </el-tabs>
    <!-- 成为会员 -->
    <button
      v-if="!isVip"
      class="absolute t-2 r-4 flex-center text-xl font-700 gap-2 cursor-pointer"
      style="
        color: #d79260;
        background-color: #fceeda;
        border: none;
        border-radius: 5px;
        padding: 6px 12px;
        box-shadow: 0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f;
      "
      @click="buyVip"
    >
      <img src="@/assets/icon/vip-icon.webp" width="35" height="31" />
      成为会员
    </button>
  </div>
</template>

<script>
export default {
  name: "DownloadData",
  components: {
    DataPage: () => import("./dataPage"),
  },
  data() {
    return {
      // 页面加载
      loading: false,
      // 当前活动分类
      activeType: {},
      // 分类列表
      typeList: [],
      // 禁止切换标签
      disable: false,
    };
  },
  methods: {
    // 初始化
    init() {
      this.getTypeList();
    },
    // 获取分类列表
    getTypeList() {
      this.loading = true;
      this.$http
        .get(process.env.API_ROOT + "/data/getTypeList")
        .then((data) => {
          let res = data.data;
          // 获取失败，根据 message 返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("数据库获取失败，" + res.message);
          }
          // 获取成功，处理数据
          else if (res.data && res.data.length > 0) {
            res.data.forEach((item) => {
              item.key = item.id + item.name;
            });
            this.typeList = res.data;
            let name = sessionStorage.getItem("dataZoneActiveName");
            let index = this.typeList.map((item) => item.key).indexOf(name);
            index = index >= 0 ? index : 0;
            this.activeType = JSON.parse(JSON.stringify(this.typeList[index]));
          }
        })
        .catch(() => {
          this.$message.error("数据库获取失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 标签切换
    beforeLeave() {
      return !this.disable;
    },
    // 切换标签
    changeTab() {
      if (this.disable) return;
      this.disable = true;
      setTimeout(() => {
        this.disable = false;
      }, 300);
      let index = this.typeList
        .map((item) => item.key)
        .indexOf(this.activeType.key);
      index = index >= 0 ? index : 0;
      this.activeType = JSON.parse(JSON.stringify(this.typeList[index]));
      delete this.$route.params.database;
      delete this.$route.params.b_database;
    },
    /**
     * 购买会员
     */
    buyVip() {
      this.$router.push({
          name: "Vip",
          params: {
            buyVip: true,
          },
        });
    }
  },
  mounted() {
    this.$emit("changeActiveName", "0");
    this.init();
    // 页面刷新前保存当前活动分类
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("dataZoneActiveName", this.activeType.key);
    });
  },
  beforeDestroy() {
    sessionStorage.removeItem("dataZoneActiveName");
  },
  computed: {
    isVip() {
      const userInfo = this.$store.getters.getUserInfo;
      if (userInfo) return userInfo.isVip || false;
      return false;
    },
  },
};
</script>

<style lang="scss">
.download_data {
  background: #f5f5f5;

  > .el-tabs {
    height: 100%;
    position: relative;

    > .el-tabs__header {
      height: 60px;
      padding: 10px 30px;
      box-sizing: border-box;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
      margin: 0;
      background: white;

      .el-tabs__nav {
        display: flex;
      }

      .el-tabs__item {
        font-size: 16px;
        font-weight: 700;
        color: black;

        .not-selected {
          display: flex;
          align-items: center;

          .icon {
            line-height: 32px;
            display: flex;
            align-items: center;

            > svg {
              width: 30px;
              height: 30px;
            }
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
      padding: 0 10px;
      position: absolute;
      top: 70px;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;

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
