<template>
  <!-- 数据专区页面组件 -->
  <div class="data_page scrollbar" v-loading="loading">
    <el-container>
      <!-- 导航栏 -->
      <el-header height="50px">
        <!-- 筛选 -->
        <el-popover
          placement="bottom"
          trigger="click"
          v-model="visible"
          popper-class="data_mart_filter"
          width="360"
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
          <el-container style="height: 400px">
            <el-header height="40px">
              <el-input
                class="filter_input"
                placeholder="输入关键词，搜索相关数据资源"
                size="small"
                v-model.trim="filterTreeText"
                suffix-icon="el-icon-search"
              >
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
            <el-footer height="40px" style="padding-top: 10px">
              <el-button class="cancel" size="small" @click="resetTree">
                重 置
              </el-button>
              <el-button class="confirm" size="small" @click="searchPart">
                筛 选
              </el-button>
            </el-footer>
          </el-container>
        </el-popover>
        <!-- 搜索框 -->
        <el-input
          class="search_table"
          size="small"
          v-model.trim="filterPartText"
          placeholder="输入关键词进行搜索"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </el-header>
      <el-main class="main scrollbar">
        <!-- 自定义组件 -->
        <PageElement :pageName="pageData.name" style="margin-bottom: 10px" />
        <!-- 模块列表 -->
        <div class="part_list" v-if="partList && partList.length > 0">
          <div
            v-for="(part, i) in filterPart.filter(
              item => item.table && item.table.length > 0
            )"
            class="part_item"
            :key="i"
            :style="part.style"
            @click="showDetail(part)"
          >
            <div class="title over-hidden">
              {{ part.databaseName }}
            </div>
            <br />
            <div class="sub_title over-hidden">
              {{ part.b_database }}
              <i class="el-icon-arrow-right"></i>
              {{ part.part }}
            </div>
            <div class="table_list">
              <div
                v-for="(table, j) in part.table.filter((_, index) => index < 9)"
                class="table_item over-hidden"
                :key="j"
              >
                {{ table.name }}
              </div>
            </div>
            <div class="part_tags">
              <div
                class="part_tags_item"
                v-for="(tag, j) in part.tags.filter(item => item)"
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
        </div>
        <!-- 暂无数据 -->
        <el-empty description="暂无数据" v-else style="height: 80%" />
        <!-- 跳转顶部 -->
        <el-backtop
          target=".main"
          :visibility-height="100"
          :right="70"
          :bottom="30"
        >
          <i class="el-icon-caret-top"></i>
        </el-backtop>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "DataPage",
  props: {
    pageData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 页面加载
      loading: false,

      // 导航栏参数
      // 筛选弹出框
      visible: false,
      // 筛选树文本
      filterTreeText: "",
      // 树形控件配置选项
      treeProps: {
        label: "name",
        children: "children"
      },
      // 默认选中
      checkedKeys: [],
      allCheckedKeys: [],
      // 默认展开
      expandedKeys: [],
      // 数据库树
      databaseTree: [],
      // 筛选模块文本
      filterPartText: "",

      // 模块列表
      partList: []
    };
  },
  methods: {
    // 获取模块列表
    getDatabaseTree() {
      this.loading = true;
      this.$http
        .post(process.env.API_ROOT + "/data/tableAll", {
          id: this.pageData.id
        })
        .then(data => {
          let res = data.data;
          // 获取失败，根据 message 返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("页面加载失败，" + res.message);
          }
          // 获取成功，处理数据
          else if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              item.name = item.DATABASE_NAME;
              item.code = item.DATABASE_ENG;
            });
            this.databaseTree = res.data;
            this.defaultCheck();
            this.getPartList();
          }
        })
        .catch(() => {
          if (err.response && err.response.status === 503)
            this.$message.error("访问太过频繁，请稍后再试！");
          else {
            this.$message.error("页面加载失败，服务器错误，请稍后再试！");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 默认勾选
    defaultCheck() {
      const database = this.$route.params.database;
      const b_database = this.$route.params.b_database;
      // 筛选库
      if (database) {
        const arr = this.databaseTree.map(item => item.code);
        if (arr.includes(database)) {
          this.databaseTree.forEach(a => {
            a.status = a.code === database;
          });
        }
      }
      // 筛选子库
      else if (b_database) {
        this.databaseTree.forEach(a => {
          a.status = false;
          if (a.children && a.children.length > 0)
            a.children.forEach(b => {
              b.status = b.code === b_database;
            });
        });
      }
      // 不进行筛选
      else {
        this.databaseTree.forEach(a => {
          a.status = true;
        });
      }
      // 处理数据
      this.databaseTree.forEach(a => {
        a.status = a.status || false;
        this.expandedKeys.push(a.code);
        if (a.status) this.checkedKeys.push(a.code);
        if (a.children && a.children.length > 0)
          a.children.forEach(b => {
            b.status = a.status || b.status || false;
            if (b.status) this.checkedKeys.push(b.code);
            if (b.children && b.children.length > 0)
              b.children.forEach(c => {
                c.status = b.status || false;
                c.tags = Array.isArray(c.tags) ? c.tags : [];
                c.table = c.children;
                delete c.children;
                if (c.status) this.checkedKeys.push(c.code);
              });
          });
      });

      this.allCheckedKeys = JSON.parse(JSON.stringify(this.checkedKeys));
    },
    // 获取模块列表
    getPartList() {
      // 初始化数据
      this.partList = [];

      // 筛选模块
      if (this.databaseTree && this.databaseTree.length > 0)
        this.databaseTree.forEach(a => {
          if (a.children && a.children.length > 0)
            a.children.forEach(b => {
              if (b.children && b.children.length > 0)
                b.children.forEach(c => {
                  if (c.status)
                    this.partList.push({
                      database: a.name,
                      databaseName: a.DATABASE_NAME,
                      databaseEng: a.code,
                      b_database: b.name,
                      b_databaseEng: b.code,
                      part: c.name,
                      partEng: c.code,
                      tags: c.tags,
                      table: c.table
                    });
                });
            });
        });

      this.partList.sort((a, b) => b.tags.length - a.tags.length);
      // 根据标签数量默认排序
      if (this.partList && this.partList.length > 0)
        this.partList.forEach(item => {
          if (item.table && item.table.length > 0)
            item.table.sort((a, b) => {
              a.tags = Array.isArray(a.tags) ? a.tags : [];
              b.tags = Array.isArray(b.tags) ? b.tags : [];
              return b.tags.length - a.tags.length;
            });
        });
    },
    // 选择树节点
    handleCheckChange(checked, data) {
      this.checkedKeys = data.checkedKeys;
    },
    // 筛选树节点
    filterNode(val, data) {
      if (!val) return true;
      return data.name.toString().includes(val);
    },
    // 重置数据库树
    resetTree() {
      this.filterTreeText = "";
      this.checkedKeys = JSON.parse(JSON.stringify(this.allCheckedKeys));
      this.$refs.databaseTree.setCheckedKeys(this.checkedKeys);
      if (this.databaseTree && this.databaseTree.length > 0) {
        this.databaseTree.forEach(a => {
          this.$refs.databaseTree.store.nodesMap[a.code].expanded = true;
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              this.$refs.databaseTree.store.nodesMap[b.code].expanded = false;
            });
          }
        });
      }
    },
    // 查询模块
    searchPart() {
      // 关闭弹出框
      this.visible = false;

      this.allCheckedKeys = JSON.parse(JSON.stringify(this.checkedKeys));
      if (this.databaseTree && this.databaseTree.length > 0)
        this.databaseTree.forEach(a => {
          a.status = this.checkedKeys.includes(a.code);
          if (a.children && a.children.length > 0)
            a.children.forEach(b => {
              b.status = this.checkedKeys.includes(b.code);
              if (b.children && b.children.length > 0)
                b.children.forEach(c => {
                  c.status = this.checkedKeys.includes(c.code);
                });
            });
        });

      this.getPartList();
    },
    // 查看模块详情
    showDetail(part) {
      // 在新窗口打开路由
      const params = {
        type: this.pageData.id,
        typeName: this.pageData.name,
        database: part.database,
        databaseEng: part.databaseEng,
        b_database: part.b_database,
        b_databaseEng: part.b_databaseEng,
        part: part.part,
        partEng: part.partEng
      };
      sessionStorage.setItem("dataZone", JSON.stringify(params));
      let routeData = this.$router.resolve({
        path: "/data_zone"
      });
      window.open(routeData.href, "_blank");
    }
  },
  mounted() {
    this.getDatabaseTree();
  },
  // 计算属性
  computed: {
    // 筛选模块
    filterPart() {
      let text = this.filterPartText;
      if (!text) return this.partList;
      else {
        return this.partList.filter(item => {
          if (
            item.database.includes(text) ||
            item.b_database.includes(text) ||
            item.part.includes(text)
          )
            return true;
          for (let i = 0; i < item.table.length; i++) {
            if (item.table[i].name.includes(text)) return true;
          }
          return false;
        });
      }
    }
  },
  // 监听器
  watch: {
    // 筛选树
    filterTreeText(newVal) {
      this.$refs.databaseTree.filter(newVal);
    }
  }
};
</script>

<style lang="scss">
.data_page {
  height: 100%;

  > .el-container {
    height: 100%;

    > .el-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      padding: 5px 20px;
      box-sizing: border-box;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
      background: white;
      position: relative;

      .text_button {
        padding: 0;
        font-size: 16px;
        font-weight: 700;
        color: black;
        height: 100%;

        i {
          font-weight: 700;
          position: relative;
          top: 1px;
        }
      }

      .search_table {
        width: 300px;
        margin-left: 60px;

        .el-input__inner {
          background: #f5f5f5;
          color: black;
          border-radius: 15px;
        }
      }
    }

    > .el-main {
      padding: 0;

      .page_element {
        min-height: auto;
      }

      .part_list {
        display: grid;
        grid-template-columns: calc((100% - 30px) / 3) calc((100% - 30px) / 3) calc(
            (100% - 30px) / 3
          );
        grid-gap: 15px;

        .part_item {
          height: 330px;
          padding: 10px 20px;
          box-sizing: border-box;
          background: white;
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
          position: relative;
          border-radius: 5px;
          overflow: hidden;
          cursor: pointer;

          .title,
          .sub_title {
            font-weight: 700;
            margin-bottom: 10px;
            z-index: 2;
            display: inline-block;
            max-width: 80%;
            position: relative;
          }

          .title {
            font-size: 18px;
            color: #5051f9;
          }

          .sub_title {
            font-size: 16px;

            i {
              font-weight: 700;
            }
          }

          .table_list {
            font-size: 14px;
            line-height: 25px;
            height: 230px;
            position: relative;
            z-index: 2;
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
      }
    }
  }
}

.data_mart_filter {
  .el-footer {
    text-align: right;

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
</style>
