<template>
  <!-- 服务与支持 -->
  <div class="service">
    <el-tabs
      tab-position="left"
      type="border-card"
      v-model="activeName"
      class="tabs"
      :before-leave="beforeLeave_0"
      @tab-click="jump"
    >
      <el-tab-pane
        v-for="(items, i) in menuList"
        :key="i"
        :name="items.name"
        :myData="items"
      >
        <span slot="label" class="not-selected"
          ><i :class="items.icon + ' icon'"></i> {{ items.label }}</span
        >
        <div class="tabs_body">
          <el-tabs
            v-if="items.name === '0' && activeName === '0'"
            v-model="items.activeName"
            class="tab"
            :before-leave="beforeLeave_1"
            @tab-click="jump_2"
          >
            <el-tab-pane
              v-for="(item, j) in items.children"
              :key="j"
              :name="item.router"
              :myData="item.router"
            >
              <span slot="label" class="not-selected">{{ item.name }}</span>
              <div class="tab_body scrollbar">
                <router-view
                  v-if="item.router === items.activeName"
                  style="height: 100%"
                  :pageName="item.name"
                  @IPLogin="IPLogin"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
          <router-view
            v-if="items.name === '1' && activeName === '1'"
            style="height: 100%"
            class="scrollbar"
            @IPLogin="IPLogin"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "Service",
  data() {
    return {
      activeName: "0",
      menuList: [
        {
          label: "定制服务",
          name: "0",
          icon: "el-icon-s-claim",
          activeName: "",
          children: [],
        },
        {
          label: "常见问题",
          name: "1",
          icon: "el-icon-s-comment",
          path: "/service/question",
        },
      ],
      // 禁用跳转
      disable_0: false,
      disable_1: false,
    };
  },
  methods: {
    // 初始化
    init() {
      this.getMenuList();
      let path = this.$router.currentRoute.path;
      if (this.menuList[1].path === path) this.activeName = "1";
      else {
        this.activeName = "0";
        this.menuList[0].activeName = path;
      }
    },
    // 获取菜单路由
    getMenuList() {
      this.menuList[0].children = this.$store.getters.getMenuList_0;
      if (this.menuList[0].children && this.menuList[0].children.length > 0)
        this.menuList[0].activeName = this.menuList[0].children[0].router;
    },
    // 标签切换
    beforeLeave_0() {
      return !this.disable_0;
    },
    beforeLeave_1() {
      return !this.disable_1;
    },
    // 跳转
    jump(val) {
      if (this.disable_0) return;
      this.disable_0 = true;
      setTimeout(() => {
        this.disable_0 = false;
      }, 300);
      if (val.name === "0") {
        let menuData = val.$attrs.myData;
        this.jumpRouter(menuData.activeName);
      } else {
        this.jumpRouter(val.$attrs.myData.path);
      }
    },
    jump_2(val) {
      if (this.disable_1) return;
      this.disable_1 = true;
      setTimeout(() => {
        this.disable_1 = false;
      }, 300);
      this.jumpRouter(val.$attrs.myData);
    },
    // 跳转路由
    jumpRouter(path) {
      this.$router.push(path);
    },
    // IP登录
    IPLogin() {
      this.$emit("IPLogin");
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.service {
  width: 100%;
  height: 100%;

  .tabs {
    height: 100%;
    border: none;
    background: transparent;
  }
}
</style>

<style lang="scss">
.service {
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

          .tab {
            height: 100%;
            position: relative;

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

              > .el-tab-pane {
                height: 100%;

                .tab_body {
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
