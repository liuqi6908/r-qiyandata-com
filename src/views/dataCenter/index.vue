<template>
  <!-- 数据中心 -->
  <div class="data_center">
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
        <span slot="label" class="not-selected" :class="{ trial: i === 0 }">
          <i :class="items.icon + ' icon'"></i>{{ items.name }}
        </span>
        <div class="tabs_body" v-if="i !== 0">
          <el-tabs
            v-if="items.name === activeName"
            v-model="items.activeName"
            class="tab"
            :before-leave="beforeLeave_1"
            @tab-click="jump_2"
          >
            <el-tab-pane
              v-for="(item, j) in items.children"
              :key="j"
              :name="item.DATABASE_ENG"
              :myData="item.path"
            >
              <span slot="label" class="not-selected">
                <span class="icon" v-if="item.icon" v-html="item.icon"></span
                >{{ item.DATABASE }}
              </span>
              <div class="tab_body scrollbar">
                <router-view
                  v-if="item.DATABASE_ENG === items.activeName"
                  :pageData="{
                    database: item.DATABASE,
                    databaseEng: item.DATABASE_ENG
                  }"
                  style="height: 100%"
                  @IPLogin="IPLogin"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "DataCenter",
  data() {
    return {
      // 登入用户信息
      userInfo: {},
      // 活动页面name
      activeName: "",
      // 菜单列表
      menuList: [],
      // 禁用跳转
      disable_0: false,
      disable_1: false
    };
  },
  methods: {
    // 获取登入用户信息
    getUserInfo() {
      this.userInfo = this.$store.getters.getUserInfo;
    },
    // 获取菜单导航
    getMenuList() {
      this.menuList = [];
      this.menuList = JSON.parse(
        JSON.stringify(this.$store.getters.getMenuList)
      );
      this.menuList.unshift({
        name: "？如何参与数据试用"
      });
      this.init();
    },
    // 初始化
    init() {
      let path = this.$route.path;
      if (this.menuList && this.menuList.length !== 0) {
        if (path === "/data_center") {
          this.activeName = this.menuList[1].name;
          if (
            this.menuList[1].children &&
            this.menuList[1].children.length !== 0
          )
            this.menuList[1].activeName = this.menuList[1].children[0].DATABASE_ENG;
        } else {
          this.menuList.forEach(menu => {
            if (menu.children && menu.children.length !== 0) {
              menu.children.forEach(child => {
                if (child.path === path) {
                  this.activeName = menu.name;
                  menu.activeName = child.DATABASE_ENG;
                }
              });
            }
          });
        }
      }
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
      let menuData = val.$attrs.myData;
      if (menuData.name === "？如何参与数据试用")
        this.jumpRouter("/about/Participate_in_trial");
      else
        menuData.children.forEach(item => {
          if (item.DATABASE_ENG === menuData.activeName)
            this.jumpRouter(item.path);
        });
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
    }
  },
  mounted() {
    this.getUserInfo();
    this.getMenuList();
  }
};
</script>

<style lang="scss" scoped>
.data_center {
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
.data_center {
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

        .trial {
          font-size: 14px;
          text-decoration: underline;
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
