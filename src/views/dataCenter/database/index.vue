<template>
  <!-- 数据中心页面展示组件 -->
  <div class="database-page scrollbar">
    <div style="max-width: 2000px; margin: auto">
      <MyElement
        v-for="(item, index) in elementList"
        :key="index"
        :elementData="item"
      >
      </MyElement>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          v-for="(b_database, i) in databaseTree"
          :key="i"
          :name="b_database.B_DATABASE_ENG"
          :id="'' + i"
        >
          <template slot="title">
            <i
              class="el-icon-caret-bottom icon"
              v-if="activeNames.indexOf(b_database.B_DATABASE_ENG) >= 0"
            ></i>
            <i class="el-icon-caret-right icon" v-else></i>
            {{ b_database.B_DATABASE }}
          </template>
          <div>
            <el-collapse
              v-model="b_database.activeNames"
              @change="handleChange"
              class="part_list"
            >
              <el-collapse-item
                v-for="(part, j) in b_database._sub"
                :key="j"
                :name="part.PART_ENG"
                :id="i + '&' + j"
              >
                <template slot="title">
                  <i
                    class="el-icon-caret-bottom icon"
                    v-if="b_database.activeNames.indexOf(part.PART_ENG) >= 0"
                  ></i>
                  <i class="el-icon-caret-right icon" v-else></i>
                  {{ part.PART }}
                </template>
                <div class="table_list">
                  <div
                    v-for="(table, k) in part._sub"
                    class="table over-hidden"
                    :key="k"
                    @click="jumpRouter(table)"
                  >
                    <span :title="table.TABLE">{{ table.TABLE }}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 提示对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="hintDialog"
      width="450px"
      top="0"
      custom-class="hint_dialog"
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

    <!-- 跳转顶部 -->
    <el-backtop
      target=".database-page"
      :visibility-height="100"
      :right="70"
      :bottom="30"
    >
      <i class="el-icon-caret-top"></i>
    </el-backtop>
  </div>
</template>

<script>
export default {
  name: "DatabasePage",
  props: {
    pageData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isShow: false,
      // 页面参数
      query: {},
      // 当前登入用户
      userInfo: {},
      // 组件列表
      elementList: [],
      // 当前打开的折叠面板
      activeNames: [],
      // 数据库树
      databaseTree: [],
      // 提示对话框
      hintDialog: false
    };
  },
  methods: {
    // 重载页面
    loadingPage() {
      this.userInfo = this.$store.getters.getUserInfo;
      // 获取页面参数
      this.query = this.$route.query;
      this.getElementList();
      this.getDatabaseTree();
    },
    // 获取组件列表
    async getElementList() {
      this.elementList = [];
      await this.$http
        .post(process.env.API_ROOT + "/index/module", {
          name: this.pageData.database
        })
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
          if (!this.isShow) {
            if (err.response.status === 503)
              this.$message.error("访问太过频繁，请稍后再试！");
            else {
              this.$message.error("页面加载失败，服务器错误，请稍后再试！");
              sessionStorage.setItem("maintain", "true");
              this.$router.push("/maintain");
            }
            this.isShow = true;
          }
        });
    },
    // 获取数据库树
    async getDatabaseTree() {
      this.databaseTree = [];
      await this.$http
        .post(process.env.API_ROOT + "/database/tree", this.pageData)
        .then(data => {
          let res = data.data;
          // 获取失败，根据 message 输出提示信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("页面加载失败，" + res.message);
          }
          // 获取成功，处理数据
          else {
            this.databaseTree = res.data.dataTree._sub;
            this.databaseTree.forEach(item => {
              item.activeNames = [];
            });
            if (this.query.b_database) {
              let jump = "";
              for (let i = 0; i < this.databaseTree.length; i++) {
                if (this.databaseTree[i].B_DATABASE === this.query.b_database) {
                  this.activeNames.push(this.databaseTree[i].B_DATABASE_ENG);
                  jump = "" + i;
                  if (
                    this.query.part &&
                    this.databaseTree[i]._sub &&
                    this.databaseTree[i]._sub.length > 0
                  ) {
                    for (let j = 0; j < this.databaseTree[i]._sub.length; j++) {
                      if (
                        this.databaseTree[i]._sub[j].PART === this.query.part
                      ) {
                        this.databaseTree[i].activeNames.push(
                          this.databaseTree[i]._sub[j].PART_ENG
                        );
                        jump = i + "&" + j;
                        break;
                      }
                    }
                  }
                  break;
                }
              }
              setTimeout(() => {
                let element = document.getElementById(jump);
                if (element) element.scrollIntoView();
                this.$forceUpdate();
              }, 100);
            }
          }
        })
        .catch(err => {
          if (!this.isShow) {
            if (err.response.status === 503)
              this.$message.error("访问太过频繁，请稍后再试！");
            else {
              this.$message.error("页面加载失败，服务器错误，请稍后再试！");
              sessionStorage.setItem("maintain", "true");
              this.$router.push("/maintain");
            }
            this.isShow = true;
          }
        });
    },
    // 打开、关闭折叠面板
    handleChange() {
      this.$forceUpdate();
    },
    // 跳转路由
    jumpRouter(val) {
      if (!this.userInfo.name) this.userInfo = this.$store.getters.getUserInfo;
      if (!this.userInfo.name) {
        this.hintDialog = true;
      } else {
        // 在新窗口打开路由
        const params = {
          database: this.pageData.databaseEng,
          code: val.TABLE_ENG
        };
        let routeData = this.$router.resolve({
          path: "/table",
          query: params
        });
        window.open(routeData.href, "_blank");
      }
    },
    // 跳转到登录页面
    jumpLogin() {
      this.hintDialog = false;
      this.$router.push("/login");
    },
    // IP登录
    IPLogin() {
      this.hintDialog = false;
      this.$emit("IPLogin");
    }
  },
  mounted() {
    this.loadingPage();
  }
};
</script>

<style lang="scss" scoped>
.database-page {
  width: 100%;
  height: 100%;
  overflow-x: hidden;

  .table_list {
    background: #efefef;
    padding: 10px 20px;
    display: grid;
    grid-template-columns: calc(100% / 3) calc(100% / 3) calc(100% / 3);

    .table {
      font-size: 18px;
      font-weight: 500;
      padding: 2px 15px;
      margin: 0 10px;
      color: #0168b7;
      cursor: pointer;
      border-radius: 15px;
    }

    .table:hover {
      background: #dddddd;
    }
  }
}
</style>

<style lang="scss">
.database-page {
  .el-collapse {
    padding: 0 30px;
    border: none;

    .el-collapse-item__header {
      font-size: 18px;
      font-weight: 700;
      color: black;
      padding: 5px 0;

      .icon {
        margin-right: 10px;
        color: #778399;
      }

      .el-collapse-item__arrow {
        display: none;
      }
    }
  }

  .part_list {
    .el-collapse-item {
      .el-collapse-item__wrap {
        .el-collapse-item__content {
          padding: 0;
        }
      }
    }
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
}
</style>
