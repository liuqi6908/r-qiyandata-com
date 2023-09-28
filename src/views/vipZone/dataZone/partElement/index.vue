<template>
  <!-- 数据专区表格页面组件 -->
  <div class="data_zone_part_page_element scrollbar" v-loading="loading">
    <!-- 表格列表 -->
    <div class="part_header">
      <!-- 导航 -->
      <span @click="jumpDatabase(0)">{{ params.typeName }}</span>
      <i class="el-icon-arrow-right"></i>
      <span @click="jumpDatabase(1)">{{ params.database }}</span>
      <i class="el-icon-arrow-right"></i>
      <span @click="jumpDatabase(2)">{{ params.b_database }}</span>
      <i class="el-icon-arrow-right"></i>
      <span style="cursor: default">{{ params.part }}</span>
    </div>
    <div class="part_main">
      <div v-for="table in partInfo.table" class="table_item" :key="table.code">
        <div class="title">
          <span class="name over-hidden">
            {{ table.name }}
            <span
              class="tag"
              v-for="(tag, j) in table.tags"
              :key="j"
              :style="'background:' + tag.tagColor"
            >
              {{ tag.tagName }}
            </span>
          </span>
        </div>
        <div class="button">
          <el-button class="white_button" @click="downloadData(table)">
            <i class="el-icon-download"></i>
            下载数据
          </el-button>
          <el-button class="blue_button" @click="previewData(table)">
            <i class="el-icon-view"></i>
            预览数据
          </el-button>
        </div>
      </div>
      <el-empty
        style="width: 100%"
        v-if="!partInfo.table || partInfo.table.length === 0"
      />
    </div>
    <!-- 模块信息 -->
    <div class="part_details">
      <!-- <h1 :class="{ active: pageNum === 0 }" @click="pageNum = 0">
        数据详情
        <div></div>
      </h1> -->
      <h1 :class="{ active: pageNum === 1 }" @click="pageNum = 1">
        引用规范
        <div></div>
      </h1>
      <h1 :class="{ active: pageNum === 2 }" @click="pageNum = 2">
        字段说明
        <div></div>
      </h1>
      <!-- 数据详情 -->
      <div
        v-if="pageNum === 0 && partInfo.details"
        v-html="partInfo.details"
      ></div>
      <!-- 引用规范 -->
      <div
        v-if="pageNum === 1 && partInfo.standard"
        v-html="partInfo.standard"
      ></div>
      <!-- 字段说明 -->
      <div
        v-if="pageNum === 2 && partInfo.field"
        v-html="partInfo.field"
        class="fieldDesc"
      ></div>
      <!-- 空数据 -->
      <el-empty
        v-if="
          (pageNum === 0 && !partInfo.details) ||
            (pageNum === 1 && !partInfo.standard) ||
            (pageNum === 2 && !partInfo.field)
        "
      ></el-empty>
    </div>
    <!-- 跳转顶部 -->
    <el-backtop
      target=".data_zone_part_page_element"
      :visibility-height="100"
      :right="70"
      :bottom="30"
    >
      <i class="el-icon-caret-top"></i>
    </el-backtop>
    <!-- 数据预览 -->
    <el-dialog
      :title="tableName + '（当前共显示' + tableList.length + '条数据）'"
      :visible.sync="dialog"
      width="1200px"
      top="0"
      custom-class="dataDialog"
      :destroy-on-close="true"
    >
      <el-table
        :data="tableList"
        v-loading="dialogLoading"
        height="100%"
        stripe
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in tableHeader"
          :key="index"
          :prop="index + ''"
          :label="item"
          :render-header="renderHeader"
          sortable
          show-overflow-tooltip
        >
        </el-table-column>
        <template slot="empty">
          <el-empty description="暂无数据"></el-empty>
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { isVip } from "@/util/verify";

export default {
  name: "DataZonePartPageElement",
  data() {
    return {
      // 页面参数
      params: {},
      // 用户信息
      userInfo: {},
      // 模块信息（details、standard、filed）
      partInfo: {},
      // 下载次数
      downloadCount: 0,
      // 页面加载
      loading: false,
      // 当前页面（0数据详情、1引用规范、2字段说明）
      pageNum: 1,
      // 下载数据
      disable_0: false,
      // 预览数据对话框
      dialog: false,
      dialogLoading: false,
      disable_1: false,
      tableName: "",
      tableHeader: [],
      tableList: []
    };
  },
  methods: {
    // 初始化
    init() {
      // 获取页面参数
      if (sessionStorage.getItem("dataZone"))
        this.params = JSON.parse(sessionStorage.getItem("dataZone"));
      if (
        !this.params.type ||
        !this.params.typeName ||
        !this.params.database ||
        !this.params.databaseEng ||
        !this.params.b_database ||
        !this.params.b_databaseEng ||
        !this.params.part ||
        !this.params.partEng
      )
        return this.$router.push("/vip_zone/data_zone");

      // 非认证个人用户跳转会员专区首页
      this.userInfo = this.$store.getters.getUserInfo;
      if (
        !this.userInfo.token ||
        this.userInfo.type === "机构用户" ||
        (this.userInfo.type === "个人用户" && this.userInfo.status !== "1")
      )
        return this.$router.push("/vip_zone/home");

      // 获取数据
      this.loading = true;
      // 获取模块表格
      this.getPartTable();
    },
    // 跳转数据库页面
    jumpDatabase(val) {
      sessionStorage.setItem(
        "dataZoneActiveName",
        this.params.type + this.params.typeName
      );
      if (val === 0) {
        this.$router.push({
          name: "DataZone"
        });
      } else if (val === 1) {
        this.$router.push({
          name: "DataZone",
          params: {
            database: this.params.databaseEng
          }
        });
      } else if (val === 2) {
        this.$router.push({
          name: "DataZone",
          params: {
            b_database: this.params.b_databaseEng
          }
        });
      }
    },
    // 获取模块表格
    getPartTable() {
      // 初始化数据
      this.partInfo.table = [];

      this.$http
        .post(process.env.API_ROOT + "/data/getPartTable", {
          databaseEng: this.params.databaseEng,
          partEng: this.params.partEng,
          time: new Date().getTime()
        })
        .then(data => {
          let res = data.data;
          // 获取失败，根据 message 输出错误信息
          if (res.status !== 0) {
            return this.$router.push("/vip_zone/data_zone");
          }
          // 获取成功，整理数据
          else {
            this.partInfo.table = res.data;
          }
        })
        .catch(() => {
          return this.$router.push("/vip_zone/data_zone");
        })
        .finally(() => {
          this.getPartDetails();
        });
    },
    // 获取模块数据详情
    getPartDetails() {
      this.$http
        .post(
          process.env.API_ROOT + "/data/getPartDetails",
          {
            databaseEng: this.params.databaseEng,
            partEng: this.params.partEng
          },
          {
            headers: {
              token: this.userInfo.token
            }
          }
        )
        .then(data => {
          let res = data.data;
          // 获取成功，处理数据
          if (res.status === 0) {
            this.partInfo.details = res.data.details;
            this.partInfo.standard = res.data.standard;
            this.downloadCount = res.data.downloadNum || 0;
            if (res.data.children.data && res.data.children.data.length > 0) {
              let html =
                '<table style="border-collapse: collapse; width: 100%;" border="1">' +
                "<tbody>" +
                "<tr>" +
                '<th style="width: 20%">表格</th>' +
                '<th style="width: 20%">字段</th>' +
                '<th style="width: 30%">字段说明</th>' +
                '<th style="width: 10%">区间范围</th>' +
                '<th style="width: 10%">数据量</th>' +
                //'<th style="width: 10%">更新频率</th>' +
                "</tr>";
              res.data.children.data.forEach(table => {
                if (
                  !this.partInfo.table
                    .map(item => item.code)
                    .includes(table.code)
                )
                  return;
                if (!table.children || table.children.length === 0)
                  table.children = [{ name: "-", desc: "-" }];
                html += "<tr>";
                if (table.children.length === 1)
                  html +=
                    '<td rowspan="' +
                    table.children.length +
                    '" style="height: 35px; position: relative">';
                else
                  html +=
                    '<td rowspan="' +
                    table.children.length +
                    '" style="position: relative">';
                html +=
                  '<div style="position: absolute; top: 10px; bottom: 10px">' +
                  '<span style="position: sticky; top: 0">' +
                  table.name +
                  "</span>" +
                  "</div>" +
                  "</td>";
                for (let i = 0; i < table.children.length; i++) {
                  if (i !== 0) html += "<tr>";
                  html +=
                    "<td>" +
                    table.children[i].name +
                    "</td>" +
                    "<td>" +
                    (table.children[i].desc ? table.children[i].desc : "-") +
                    "</td>";
                  if (i === 0)
                    html +=
                      '<td rowspan="' +
                      table.children.length +
                      '" style="position: relative">' +
                      '<div style="position: absolute; top: 10px; bottom: 10px">' +
                      '<span style="position: sticky; top: 0">' +
                      (table.range ? table.range : "-") +
                      "</span>" +
                      "</div>" +
                      "</td>" +
                      '<td rowspan="' +
                      table.children.length +
                      '" style="position: relative">' +
                      '<div style="position: absolute; top: 10px; bottom: 10px">' +
                      '<span style="position: sticky; top: 0">' +
                      (table.number ? table.number : "-") +
                      "</span>" +
                      "</div>" +
                      /* "</td>" +
                      '<td rowspan="' +
                      table.children.length +
                      '" style="position: relative">' +
                      '<div style="position: absolute; top: 10px; bottom: 10px">' +
                      '<span style="position: sticky; top: 0">' +
                      (table.update ? table.update : "-") +
                      "</span>" +
                      "</div>" + */
                      "</td>";
                  if (i !== 0) html += "</tr>";
                }
                html += "</tr>";
              });
              html += "</tbody></table>";
              this.partInfo.field = html;
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
          this.$forceUpdate();
        });
    },
    // 预览数据
    previewData(table) {
      if (this.disable_1) return;
      this.disable_1 = true;
      setTimeout(() => {
        this.disable_1 = false;
      }, 1000);

      this.dialog = true;
      this.dialogLoading = true;
      this.tableName = table.name;
      this.tableHeader = [];
      this.tableList = [];

      this.$http
        .post(process.env.API_ROOT + "/data/preview", {
          databaseEng: this.params.databaseEng,
          tableEng: table.code
        })
        .then(data => {
          let res = data.data;
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("预览数据失败，" + res.message);
          } else {
            this.tableHeader = res.data.header;
            this.tableList = res.data.list;
          }
        })
        .catch(err => {
          if (err.response.status === 503)
            this.$message.error("访问太过频繁，请稍后再试！");
          else if (!err.response.data.message)
            this.$message.error("预览数据失败，服务器错误，请稍后再试！");
          else
            this.$message.error("预览数据失败，" + err.response.data.message);
        })
        .finally(() => {
          this.dialogLoading = false;
        });
    },
    // 表头部重新渲染
    renderHeader(h, { column, $index }) {
      let span = document.createElement("span");
      span.innerText = column.label;
      document.body.appendChild(span);
      column.minWidth = span.getBoundingClientRect().width + 60;
      document.body.removeChild(span);
      return h("span", column.label);
    },
    // 下载数据
    downloadData(table) {
      if (isVip(this)) {
        this.$confirm(
          `当前数据专区您的下载次数为：<b>${
            this.downloadCount > 10000 ? "不限次数" : this.downloadCount + "次"
          }</b>，是否继续下载数据？<br/>注：重复下载不计算次数！`,
          "下载提示",
          {
            confirmButtonText: "立即下载",
            cancelButtonText: "取消",
            dangerouslyUseHTMLString: true,
            type: "warning"
          }
        )
          .then(() => {
            this.loading = true;
            this.$http
              .post(
                process.env.API_ROOT + "/data/download",
                {
                  databaseEng: this.params.databaseEng,
                  tableEng: table.code,
                  time: new Date().getTime()
                },
                {
                  headers: {
                    token: this.userInfo.token
                  }
                }
              )
              .then(data => {
                let res = data.data;
                if (res.status !== 0) {
                  if (!res.message) res.message = "服务器错误，请稍后再试！";
                  this.$message.error("下载失败，" + res.message);
                } else {
                  this.downloadCount = res.data.downloadNum || 0;
                  if (res.data.url) {
                    this.$message.success("下载成功");
                    window.open(res.data.url);
                  } else this.$message.error("下载失败，未获取到下载链接！");
                }
              })
              .catch(err => {
                if (err.response && err.response.status === 503)
                  this.$message.error("访问太过频繁，请稍后再试！");
                else this.$message.error("下载失败，服务器错误，请稍后再试！");
              })
              .finally(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.data_zone_part_page_element {
  height: 100%;
  padding: 15px 30px;
  box-sizing: border-box;

  .part_header {
    padding: 10px 30px;
    box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
    background: white;
    color: #5051f9;
    font-weight: 700;
    font-size: 18px;
    line-height: 40px;
    margin-bottom: 10px;

    > span {
      cursor: pointer;
    }

    > i {
      font-weight: 700;
    }
  }

  .part_main {
    padding: 0 7px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;

    .table_item {
      width: 49%;
      height: 43px;
      margin: 6px 0;
      padding: 10px 20px;
      box-sizing: border-box;
      background: white;
      box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 5px;
      display: flex;
      cursor: default;

      .title {
        display: flex;
        width: 0;
        flex: 1;
        padding-right: 10px;
        box-sizing: border-box;

        .name {
          .tag {
            margin: 0 5px;
            padding: 3px 7px;
            font-size: 12px;
            color: white;
            border-radius: 15px;
          }
        }
      }

      .button {
        .el-button {
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 12px;
          border-color: #0e68b4;
        }

        .white_button {
          color: #0e68b4;
          background: white;
        }

        .blue_button {
          color: white;
          background: #0e68b4;
        }

        .white_button:hover {
          background: #ecf5ff;
        }

        .blue_button:hover {
          background: #0e80cc;
        }
      }
    }

    .table_item:hover {
      background: #eeeeee;
    }
  }

  .part_details {
    padding: 10px;

    > h1 {
      display: inline-block;
      margin: 10px 25px 10px 0;
      cursor: pointer;
      font-size: 18px;

      > div {
        width: 100%;
        height: 3px;
        margin-top: 5px;
        border-radius: 3px;
        background: #0e68b4;
        visibility: hidden;
      }
    }

    > h1.active {
      color: #0e68b4;

      > div {
        visibility: visible;
      }
    }

    > div {
      min-height: 400px;
    }

    .fieldDesc {
      table {
        border: 1px solid #999999;

        tr:nth-child(2n + 1) {
          background: #f5f5f5;
        }

        tr:nth-child(2n) {
          background: white;
        }

        tr:nth-child(2n + 1):hover {
          background: white;
        }

        tr {
          border: 1px solid #999999;
        }

        th,
        td {
          border: 1px solid #999999;
          padding: 2px 5px;
        }
      }
    }
  }

  .el-dialog__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    .dataDialog {
      height: 650px;
      margin: 0;
      border-radius: 10px;
      position: relative;

      .el-icon-close:before {
        font-size: 30px;
        font-weight: 700;
        color: #222222;
      }

      .el-dialog__header {
        padding: 20px;

        .el-dialog__title {
          font-size: 20px;
          font-weight: 700;
          color: black;
        }
      }

      .el-dialog__body {
        position: absolute;
        top: 65px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        box-sizing: border-box;

        .el-table__body-wrapper::-webkit-scrollbar {
          /* 高宽分别对应横竖滚动条的尺寸 */
          width: 12px;
          height: 7px;
        }

        .el-table__body-wrapper::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: #b4b4b4;
        }

        .el-table__body-wrapper::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          background: #ededed;
        }
      }
    }
  }
}

.el-tooltip__popper {
  max-width: 700px;
}
</style>
