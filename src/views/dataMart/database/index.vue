<template>
  <!-- 数据超市-数据库页面 -->
  <div class="data_mart_database" v-loading="loading">
    <el-container>
      <el-header height="60px">
        <!-- 返回数据超市首页 -->
        <el-button
          class="text_button"
          style="color: #5051f9; margin-left: 0"
          type="text"
          @click="jumpRouter('/data_mart/home')"
        >
          <i class="el-icon-arrow-left"></i>
          返回数据超市首页
        </el-button>
        <!-- 筛选 -->
        <el-popover
          placement="bottom"
          trigger="click"
          v-model="visible"
          popper-class="data_mart_filter"
          width="500"
          :popper-options="{ boundariesElement: 'body', removeOnDestroy: true }"
        >
          <el-button
            class="text_button"
            type="text"
            slot="reference"
            @click="resetTree"
          >
            筛选专题库
            <i class="el-icon-caret-bottom"></i>
          </el-button>
          <el-container style="height: 500px">
            <el-header height="50px">
              <el-input
                class="filter_input"
                placeholder="输入关键词，搜索相关数据资源"
                v-model.trim="filterText"
                @keydown.enter.native="filterTree"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="filterTree"
                ></el-button>
              </el-input>
            </el-header>
            <el-main class="scrollbar" style="padding: 10px">
              <el-tree
                class="database_tree"
                :indent="25"
                :data="databaseTree"
                :props="treeProps"
                show-checkbox
                node-key="code"
                :default-checked-keys="checkedKeys"
                :default-expanded-keys="expandedKeys"
                @check="handleCheckChange"
                ref="databaseTree"
                :filter-node-method="filterNode"
              >
              </el-tree>
            </el-main>
            <el-footer height="50px" style="padding: 10px 20px 0">
              <span class="filter_footer">
                <el-button class="cancel" @click="resetTree">重 置</el-button>
                <el-button class="confirm" @click="filterPart">筛 选</el-button>
              </span>
            </el-footer>
          </el-container>
        </el-popover>
        <!-- 搜索框 -->
        <el-input
          class="search_table"
          v-model.trim="searchText"
          @keydown.enter.native="searchTable"
          placeholder="输入关键词进行搜索"
        >
          <i
            class="el-input__icon el-icon-search"
            @click="searchTable"
            style="margin-right: 10px"
            slot="suffix"
          ></i>
        </el-input>
        <!-- 相关推荐 -->
        <div class="key_list" v-if="allKeyList && allKeyList.length > 0">
          <span class="key_title"> 相关推荐： </span>
          <i
            v-if="totalPage > 1"
            class="el-icon-caret-left"
            :class="{ disable: pageNum <= 1 }"
            @click="keyPageTurning(0)"
          ></i>
          <span
            class="key_item not-selected"
            v-for="(key, index) in keyList"
            :class="{ activate: activateKeyList.includes(key) }"
            :key="index"
            @click="filterPartByKey(key)"
          >
            {{ key }}
          </span>
          <i
            v-if="totalPage > 1"
            class="el-icon-caret-right"
            :class="{ disable: pageNum >= totalPage }"
            @click="keyPageTurning(1)"
          ></i>
        </div>
        <!-- 前往购物车 -->
        <el-button
          v-if="userInfo.type === '个人用户'"
          class="text_button"
          style="color: #5051f9; margin: 0 20px 0 0; float: right"
          type="text"
          @click="jumpRouter('/user_center/shopping')"
        >
          前往我的购物车
        </el-button>
      </el-header>
      <el-main class="scrollbar" id="data-mart">
        <!-- 模块列表 -->
        <div
          v-for="(part, i) in partList.filter(
            (item) => item.table && item.table.length > 0
          )"
          class="part_item"
          :key="i"
          :style="part.style"
        >
          <div class="title over-hidden">
            {{ part.database }}
          </div>
          <div class="sub_title over-hidden">
            {{ part.b_database }}
            <i class="el-icon-arrow-right"></i>
            {{ part.part }}
          </div>
          <div class="table_list">
            <div
              v-for="(table, j) in part.table.filter(
                (item, index) => index < 8
              )"
              class="table_item over-hidden"
              :key="j"
            >
              {{ table.name }}
            </div>
          </div>
          <div class="part_info">
            <div>
              单表金额：
              <span style="color: red">￥{{ part.minPrice }}</span>
              <span style="color: black; font-size: 12px">起</span>
            </div>
            <div
              :style="
                part.table && part.table.length > 1 ? '' : 'visibility: hidden'
              "
            >
              立享优惠：
              <span style="color: red">采购全模块，可享9折优惠</span>
            </div>
          </div>
          <div class="part_button">
            <el-button class="button_0" @click="viewIntroduction(part)"
              >查看介绍</el-button
            >
            <el-button
              class="button_1"
              @click="purchasePart(part)"
              v-if="!part.isBuy"
              >立即采购</el-button
            >
            <el-button class="button_3" v-else>已采购</el-button>
            <el-button
              class="button_2"
              @click="addToShoppingCat(part)"
              v-if="!part.flag"
              >加入购物车</el-button
            >
            <el-button class="button_3" v-else style="width: 92px"
              >已加入购物车</el-button
            >
          </div>
          <div class="part_tags">
            <div
              class="part_tags_item"
              v-for="(tag, j) in part.tags.filter((item) => item)"
              :key="j"
            >
              <span>{{ tag }}</span>
            </div>
          </div>
          <img
            class="background"
            src="@/assets/logo/logo-white.png"
            alt="logo"
          />
        </div>
        <!-- 空数据 -->
        <el-empty
          description="暂无数据"
          v-if="!partList || partList.length === 0"
        ></el-empty>
      </el-main>
    </el-container>

    <!-- 跳转顶部 -->
    <el-backtop
      target="#data-mart"
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
  name: "DataMartDatabase",
  data() {
    return {
      // 页面参数
      params: {},
      // 登入用户信息
      userInfo: {},
      // 页面加载
      loading: false,
      // 加载失败，显示错误信息
      isShow: false,
      // 禁用按钮
      disable: false,

      // 搜索文本
      searchText: "",
      // 关键词列表
      keyList: [],
      allKeyList: [],
      pageNum: 0,
      totalPage: 0,
      // 激活关键词
      activateKeyList: [],

      // 数据库树
      databaseTree: [],
      tempDatabaseTree: [],
      allDatabaseTree: [],
      // 默认选中
      checkedKeys: [],
      allCheckedKeys: [],
      // 默认展开
      expandedKeys: [],
      // 树形控件配置选项
      treeProps: {
        label: "name",
        children: "children",
      },
      // 筛选弹出框
      visible: false,
      // 筛选字段
      filterText: "",

      // 模块列表
      partList: [],
      allPartList: [],
    };
  },
  methods: {
    // 初始化数据
    init() {
      // 获取登入用户信息
      this.userInfo = this.$store.getters.getUserInfo;
      if (
        this.userInfo.type !== "机构用户" &&
        !(this.userInfo.type === "个人用户" && this.userInfo.status === "1")
      )
        this.$router.push("/data_mart/home");

      // 获取页面参数
      this.params = this.$route.params;
      if (this.params.id)
        sessionStorage.setItem("dataMartDatabase", JSON.stringify(this.params));
      else {
        if (JSON.parse(sessionStorage.getItem("dataMartDatabase")))
          this.params = JSON.parse(sessionStorage.getItem("dataMartDatabase"));
      }

      // 获取关键词列表和数据库树
      this.loading = true;
      this.getKeyList();
      this.getDatabaseTree();
    },
    // 跳转路由
    jumpRouter(path) {
      this.$router.push(path);
    },
    // 获取关键词列表
    getKeyList() {
      // 初始化数据
      this.keyList = [];
      this.allKeyList = [];
      this.activateKeyList = [];
      this.pageNum = this.totalPage = 0;

      // 调用接口
      this.$http
        .get(process.env.API_ROOT + "/market/hotKeySearch")
        .then((data) => {
          let res = data.data;
          // 获取失败，根据 message 返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("页面加载失败，" + res.message);
          }
          // 获取成功，处理数据
          else {
            if (res.data && res.data.length > 0) {
              res.data.forEach((item) => {
                this.allKeyList.push(item.hot_key);
              });
              this.totalPage =
                Number.parseInt((this.allKeyList.length - 1) / 5) + 1;
              for (let i = 0; i < 5; i++)
                if (this.allKeyList[i]) this.keyList.push(this.allKeyList[i]);
              this.pageNum = 1;
            }
          }
        })
        .catch((err) => {
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
    // 获取数据库-表树
    getDatabaseTree() {
      // 初始化数据
      this.databaseTree = [];
      this.tempDatabaseTree = [];
      this.allDatabaseTree = [];
      this.checkedKeys = [];
      this.allCheckedKeys = [];
      this.expandedKeys = [];
      this.$http
        .get(process.env.API_ROOT + "/market/tableAll", {
          params: {
            time: new Date().getTime(),
          },
          headers: {
            token: this.userInfo.token,
          },
        })
        .then((data) => {
          let res = data.data;
          // 获取失败，根据 message 返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("页面加载失败，" + res.message);
          }
          // 获取成功，处理数据
          else {
            this.allDatabaseTree = res.data;
            this.tempDatabaseTree.push({
              name: "全部",
              code: "all",
              status: false,
              children: [],
            });
            this.expandedKeys.push(this.tempDatabaseTree[0].code);
            if (this.allDatabaseTree && this.allDatabaseTree.length > 0)
              this.allDatabaseTree.forEach((a) => {
                let database = {
                  name: a.name,
                  code: a.code,
                  status: false,
                  children: [],
                };
                if (a.children && a.children.length > 0)
                  a.children.forEach((b) => {
                    let b_database = {
                      name: b.name,
                      code: b.code,
                      status: false,
                    };
                    database.children.push(b_database);
                  });
                this.tempDatabaseTree[0].children.push(database);
              });
            this.databaseTree = JSON.parse(
              JSON.stringify(this.tempDatabaseTree)
            );
            this.defaultCheck();
            this.getPartList();
            if (this.params.id === 4) {
              this.searchText = this.params.searchText;
              this.searchTable();
            } else if (this.params.id === 5) {
              this.filterPartByKey(this.params.key);
            } else if (!this.params.id) {
              this.visible = true;
            }
          }
        })
        .catch((err) => {
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
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 默认勾选
    defaultCheck() {
      // 筛选库
      if (this.params.id === 1) {
        if (
          this.databaseTree[0].children &&
          this.databaseTree[0].children.length > 0
        )
          this.databaseTree[0].children.forEach((a) => {
            if (a.name === this.params.database) {
              a.status = true;
              this.allCheckedKeys.push(a.code);
              if (a.children && a.children.length > 0)
                a.children.forEach((b) => {
                  b.status = true;
                  this.allCheckedKeys.push(b.code);
                });
            }
          });
      }
      // 筛选库-子库
      else if (this.params.id === 2) {
        if (
          this.databaseTree[0].children &&
          this.databaseTree[0].children.length > 0
        )
          this.databaseTree[0].children.forEach((a) => {
            if (
              a.name === this.params.database &&
              a.children &&
              a.children.length > 0
            )
              a.children.forEach((b) => {
                if (b.name === this.params.b_database) {
                  b.status = true;
                  this.allCheckedKeys.push(b.code);
                }
              });
          });
      }
      // 根据导航栏筛选
      else if (this.params.id === 3) {
        this.allCheckedKeys = this.params.checkedKeys;
        this.databaseTree[0].status = this.allCheckedKeys.includes(
          this.databaseTree[0].code
        );
        if (
          this.databaseTree[0].children &&
          this.databaseTree[0].children.length > 0
        )
          this.databaseTree[0].children.forEach((a) => {
            a.status = this.allCheckedKeys.includes(a.code);
            if (a.children && a.children.length > 0)
              a.children.forEach((b) => {
                b.status = this.allCheckedKeys.includes(b.code);
              });
          });
      }
      // 不进行筛选
      else {
        this.databaseTree[0].status = true;
        this.allCheckedKeys.push(this.databaseTree[0].code);
        if (
          this.databaseTree[0].children &&
          this.databaseTree[0].children.length > 0
        )
          this.databaseTree[0].children.forEach((a) => {
            a.status = true;
            this.allCheckedKeys.push(a.code);
            if (a.children && a.children.length > 0)
              a.children.forEach((b) => {
                b.status = true;
                this.allCheckedKeys.push(b.code);
              });
          });
      }

      this.checkedKeys = JSON.parse(JSON.stringify(this.allCheckedKeys));
    },
    // 获取模块列表
    getPartList() {
      // 初始化数据
      this.partList = [];
      this.allPartList = [];

      // 同步选中状态
      for (let i = 0; i < this.databaseTree[0].children.length; i++) {
        if (this.allDatabaseTree[i])
          this.allDatabaseTree[i].status =
            this.databaseTree[0].children[i].status;
        for (
          let j = 0;
          j < this.databaseTree[0].children[i].children.length;
          j++
        ) {
          if (this.allDatabaseTree[i].children[j])
            this.allDatabaseTree[i].children[j].status =
              this.databaseTree[0].children[i].children[j].status;
        }
      }

      // 筛选模块
      if (this.allDatabaseTree && this.allDatabaseTree.length > 0)
        this.allDatabaseTree.forEach((a) => {
          if (a.children && a.children.length > 0)
            a.children.forEach((b) => {
              if (b.status && b.children && b.children.length > 0)
                b.children.forEach((c) => {
                  let tags = Array.isArray(c.tags)
                    ? JSON.parse(JSON.stringify(c.tags))
                    : [];
                  for (let i = 0; i < c.children.length; i++)
                    if (c.children[i].tags && c.children[i].tags.length > 0) {
                      tags.push(c.children[i].tags[0].tagName);
                      break;
                    }
                  for (let i = tags.length - 1; i >= 0; i--)
                    if (!tags[i]) tags.splice(i, 1);
                  this.allPartList.push({
                    database: a.name,
                    databaseName: a.databaseName,
                    databaseEng: a.code,
                    b_database: b.name,
                    part: c.name,
                    partEng: c.code,
                    minPrice: c.minPrice,
                    tags: tags,
                    key: c.key,
                    flag: c.flag,
                    isBuy: c.isBuy,
                    table: c.children,
                  });
                });
            });
        });

      this.allPartList.sort((a, b) => b.tags.length - a.tags.length);
      // 根据标签数量默认排序
      if (this.allPartList && this.allPartList.length > 0)
        this.allPartList.forEach((item) => {
          if (item.table && item.table.length > 0)
            item.table.sort((a, b) => b.tags.length - a.tags.length);
        });

      this.partList = JSON.parse(JSON.stringify(this.allPartList));
    },
    // 筛选数据库树
    filterTree() {
      this.$refs.databaseTree.filter(this.filterText);
    },
    // 选择树节点
    handleCheckChange(checked, data) {
      this.checkedKeys = data.checkedKeys;
    },
    // 筛选树节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.toString().includes(value);
    },
    // 重置数据库树
    resetTree() {
      this.filterText = "";
      this.checkedKeys = JSON.parse(JSON.stringify(this.allCheckedKeys));
      this.databaseTree = JSON.parse(JSON.stringify(this.tempDatabaseTree));
      this.$refs.databaseTree.setCheckedKeys(this.checkedKeys);
      if (this.databaseTree && this.databaseTree.length > 0) {
        this.databaseTree.forEach((a) => {
          this.$refs.databaseTree.store.nodesMap[a.code].expanded = true;
          if (a.children && a.children.length > 0) {
            a.children.forEach((b) => {
              this.$refs.databaseTree.store.nodesMap[b.code].expanded = false;
            });
          }
        });
      }
    },
    // 筛选模块
    filterPart() {
      // 关闭弹出框
      this.visible = false;

      this.allCheckedKeys = JSON.parse(JSON.stringify(this.checkedKeys));
      this.databaseTree[0].status = this.checkedKeys.includes(
        this.databaseTree[0].code
      );
      if (
        this.databaseTree[0].children &&
        this.databaseTree[0].children.length > 0
      )
        this.databaseTree[0].children.forEach((a) => {
          a.status = this.checkedKeys.includes(a.code);
          if (a.children && a.children.length > 0)
            a.children.forEach((b) => {
              b.status = this.checkedKeys.includes(b.code);
            });
        });

      this.activateKeyList = [];
      this.getPartList();
    },
    // 搜索表格
    searchTable() {
      this.activateKeyList = [];
      this.getPartList();
      let text = this.searchText;
      if (text) {
        this.allPartList = this.allPartList.filter((data) => {
          if (
            data.database.includes(text) ||
            data.databaseName.includes(text) ||
            data.b_database.includes(text) ||
            data.part.includes(text)
          )
            return true;
          for (let i = 0; i < data.table.length; i++) {
            if (data.table[i].name.includes(text)) return true;
          }
          return false;
        });
      }
      this.partList = JSON.parse(JSON.stringify(this.allPartList));
    },
    // 关键词翻页
    keyPageTurning(val) {
      if (val === 0) {
        if (this.pageNum > 1) this.pageNum--;
      } else {
        if (this.pageNum < this.totalPage) this.pageNum++;
      }
      this.keyList = [];
      for (let i = (this.pageNum - 1) * 5; i < this.pageNum * 5; i++) {
        if (!this.allKeyList[i]) break;
        this.keyList.push(this.allKeyList[i]);
      }
    },
    // 根据关键词筛选模块
    filterPartByKey(key) {
      if (this.activateKeyList.includes(key))
        this.activateKeyList.splice(this.activateKeyList.indexOf(key), 1);
      else this.activateKeyList.push(key);

      if (this.activateKeyList && this.activateKeyList.length > 0) {
        this.partList = this.allPartList.filter((data) => {
          if (!data.key || data.key.length === 0) return false;
          else {
            for (let i = 0; i < data.key.length; i++)
              if (this.activateKeyList.includes(data.key[i])) return true;
            return false;
          }
        });
      } else this.partList = JSON.parse(JSON.stringify(this.allPartList));

      if (this.partList.length % 3 === 2)
        this.partList.push({
          style: "visibility: hidden",
        });
    },
    // 查看介绍
    viewIntroduction(part) {
      this.$router.push({
        name: "DataMartModule",
        params: {
          partInfo: {
            database: part.database,
            databaseEng: part.databaseEng,
            b_database: part.b_database,
            part: part.part,
            partEng: part.partEng,
          },
        },
      });
    },
    // 立即采购
    purchasePart(val) {
      if (this.determiningUserType(val)) {
        if (!this.userInfo.email) {
          this.$confirm(
            "请先前往个人中心绑定邮箱，用于接收订单信息！",
            "提示",
            {
              customClass: "data_mart_hint_dialog",
              confirmButtonText: "绑定邮箱",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.$router.push("/user_center/account");
            })
            .catch(() => {});
        } else {
          let part = {
            database: val.database,
            databaseEng: val.databaseEng,
            b_database: val.b_database,
            part: val.part,
            partEng: val.partEng,
            table: [],
          };
          if (val.table && val.table.length > 0)
            val.table.forEach((item) => {
              if (!item.isBuy) {
                part.table.push({
                  name: item.name,
                  code: item.code,
                });
              }
            });
          this.$router.push({
            name: "ConfirmOrder",
            params: {
              list: [part],
            },
          });
        }
      }
    },
    // 加入购物车
    async addToShoppingCat(part) {
      if (this.determiningUserType(part)) {
        this.loading = true;
        let list = [
          {
            databaseEng: part.databaseEng,
            tableEng: [],
          },
        ];
        part.table.forEach((item) => {
          list[0].tableEng.push(item.code);
        });
        await this.$http
          .post(
            process.env.API_ROOT + "/market/shopCart",
            {
              time: new Date().getTime(),
              list: list,
              flag: true,
            },
            {
              headers: {
                token: this.userInfo.token,
              },
            }
          )
          .then((data) => {
            let res = data.data;
            // 加入购物车失败，根据message返回错误信息
            if (res.status !== 0) {
              if (!res.message) res.message = "服务器错误，请稍后再试！";
              this.$message.error("加入购物车失败，" + res.message);
            }
            // 获取成功，处理数据
            else {
              this.$message.success("已添加至购物车！");
              part.flag = true;
            }
          })
          .catch(() => {
            this.$message.error("加入购物车失败，服务器错误，请稍后再试！");
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    // 判断用户类型
    determiningUserType(part) {
      if (this.disable) return false;
      this.disable = true;
      setTimeout(() => {
        this.disable = false;
      }, 1000);
      if (this.userInfo.type === "机构用户") {
        this.$confirm(
          "该功能仅限已认证的个人用户使用，请切换至个人账号！",
          "提示",
          {
            customClass: "data_mart_hint_dialog",
            confirmButtonText: "切换账号",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            sessionStorage.clear();
            this.userInfo = {};
            this.$store.commit("setUserInfo", this.userInfo);
            this.$router.push("/login");
          })
          .catch(() => {});
        return false;
      } else if (part.isBuy) {
        this.$confirm("该模块已采购，请前往订单与发票页面查看！", "提示", {
          customClass: "data_mart_hint_dialog",
          confirmButtonText: "前往订单与发票",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/user_center/orders");
          })
          .catch(() => {});
        return false;
      } else return true;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
</script>

<style lang="scss">
.data_mart_database {
  width: 100%;
  height: 100%;
  padding: 15px 0;
  box-sizing: border-box;

  .el-container {
    height: 100%;

    .el-header {
      margin: 0 30px 10px;
      padding: 10px 30px;
      box-sizing: border-box;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
      background: white;
      position: relative;

      .text_button {
        padding: 0;
        font-size: 18px;
        font-weight: 700;
        color: black;
        height: 100%;
        margin: 0 25px;

        i {
          font-weight: 700;
          position: relative;
          top: 1px;
        }
      }

      .search_table {
        width: 350px;
        margin-left: 60px;

        .el-input__inner {
          background: #eeeeee;
          font-size: 14px;
          color: black;
          border-radius: 20px;
          padding: 0 20px;
        }
      }

      .key_list {
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        right: 200px;
        transform: translate(0, -50%);

        > i {
          cursor: pointer;
          margin-right: 10px;
          color: black;
        }

        > i.disable {
          color: #999999;
          cursor: not-allowed;
        }

        .key_title {
          font-weight: 700;
          font-family: "黑体", "Microsoft YaHei", "serif";
        }

        .key_item {
          margin-right: 10px;
          cursor: pointer;
        }

        .key_item.activate {
          color: #0062ff;
        }
      }
    }

    .el-main {
      padding: 0 38px 0 42px;
      display: grid;
      grid-template-columns: calc((100% - 30px) / 3) calc((100% - 30px) / 3) calc(
          (100% - 30px) / 3
        );
      grid-gap: 15px;

      .part_item {
        height: 330px;
        margin: 8px 0;
        padding: 10px 20px;
        box-sizing: border-box;
        background: white;
        box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
        position: relative;
        border-radius: 5px;
        overflow: hidden;

        .title {
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 10px;
          color: #5051f9;
          position: relative;
          z-index: 2;
        }

        .sub_title {
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 10px;
          position: relative;
          z-index: 2;

          i {
            font-weight: 700;
          }
        }

        .table_list {
          font-size: 14px;
          line-height: 20px;
          height: 160px;
          position: relative;
          z-index: 2;
        }

        .part_info {
          font-size: 14px;
          color: #5051f9;
          font-weight: 700;
          line-height: 22px;
          position: absolute;
          bottom: 45px;
          right: 80px;
        }

        .part_button {
          position: absolute;
          bottom: 10px;
          right: 70px;

          .el-button {
            font-size: 12px;
            padding: 6px 10px;
            border-radius: 12px;
            border: none;
            color: white;
            width: 80px;
          }

          .button_0 {
            background: #0e73bf;
          }

          .button_0:hover {
            background: #0e80ce;
          }

          .button_1 {
            background: #40c874;
          }

          .button_1:hover {
            background: #41d37e;
          }

          .button_2 {
            background: #1d9cf1;
            width: 92px;
          }

          .button_2:hover {
            background: #1ea7ff;
          }

          .button_3 {
            background: #999999;
          }

          .button_3:hover {
            background: #a6a6a6;
          }
        }

        .part_tags {
          position: absolute;
          top: 0;
          right: 15px;
          z-index: 2;
          display: flex;

          .part_tags_item {
            width: 37px;
            height: 61px;
            margin-left: 15px;
            background-image: url(~@/assets/icon/hot-tag.png);
            background-size: 100% 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            > span {
              writing-mode: vertical-lr;
              font-size: 14px;
              color: white;
              font-weight: 700;
              position: relative;
              top: -6px;
              cursor: default;
            }
          }
        }

        .background {
          width: 280px;
          position: absolute;
          top: -70px;
          right: -40px;
          opacity: 0.45;
        }
      }

      .el-empty {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.data_mart_filter {
  .el-footer {
    text-align: right;

    .filter_footer {
      .cancel {
        border-radius: 10px;
        background: #979797;
        color: white;
      }

      .confirm {
        border-radius: 10px;
        background: #5051f9;
        color: white;
      }
    }
  }
}

.data_mart_hint_dialog {
  width: 430px;
}
</style>
