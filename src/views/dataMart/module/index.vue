<template>
  <!-- 数据超市 -->
  <div class="data_mart_module scrollbar" v-loading="loading">
    <!-- 表格列表 -->
    <div class="part_header">
      <!-- 导航 -->
      <span @click="jumpDatabase(0)">{{ partInfo.database }}</span>
      <i class="el-icon-arrow-right"></i>
      <span @click="jumpDatabase(1)">{{ partInfo.b_database }}</span>
      <i class="el-icon-arrow-right"></i>
      <span>{{ partInfo.part }}</span>
      <!-- 前往购物车 -->
      <el-button
        v-if="userInfo.type === '个人用户'"
        class="text_button"
        type="text"
        @click="jumpRouter('/user_center/shopping')"
      >
        前往我的购物车
      </el-button>
    </div>
    <div class="part_main">
      <div v-for="(table, i) in partInfo.table" class="table_item" :key="i">
        <div
          style="
            width: 60%;
            padding-right: 10px;
            box-sizing: border-box;
          "
        >
          <el-checkbox
            v-model="table.status"
            :disabled="table.isBuy"
            @change="chooseTable"
          ></el-checkbox>
          <span class="name">
            {{ table.name }}
            <span
              class="tag"
              v-for="(tag, j) in table.tags"
              :key="j"
              :style="'background:' + tag.tagColor"
              >{{ tag.tagName }}</span
            >
          </span>
        </div>
        <div style="width: 40%; position: relative">
          <div v-if="table.isBuy" class="table_procurement">已采购</div>
          <div
            v-else-if="!table.isBuy && table.usePriceNow !== 1"
            class="table_price"
          >
            <span class="price">￥{{ table.tablePrice.toFixed(2) }}</span>
          </div>
          <div
            v-else-if="!table.isBuy && table.usePriceNow === 1"
            class="table_price_now"
          >
            <span class="price">￥{{ table.tablePrice.toFixed(2) }}</span>
            <span class="price_now"
              >￥{{ table.tablePriceNow.toFixed(2) }}</span
            >
          </div>
          <el-button @click="previewData(table)">
            <i class="el-icon-view"></i>
            预览数据
          </el-button>
        </div>
      </div>
      <el-empty
        style="width: 100%"
        description="暂无数据"
        v-if="!partInfo.table || partInfo.table.length === 0"
      ></el-empty>
    </div>
    <div class="part_footer">
      <div>
        <el-checkbox
          v-model="checked"
          :indeterminate="isIndeterminate"
          @change="checkAll"
        >
          <div>全选</div>
          <div
            v-if="allCount > 1"
            style="font-size: 16px; font-weight: 400; color: red"
          >
            采购全模块，可享9折优惠
          </div>
          <span
            v-else-if="allCount === 1"
            style="font-weight: 400; color: #666666"
          >
            单表模块无优惠折扣
          </span>
        </el-checkbox>
      </div>
      <div>
        <div
          style="margin-right: 50px; line-height: 1.5; min-width: 280px"
          v-if="discounts > 0"
        >
          <div style="font-weight: 400; font-size: 14px; color: #333333">
            原价：<span style="color: #666666; text-decoration: line-through"
              >￥{{ (amount + discounts).toFixed(2) }}</span
            >
          </div>
          <div>
            优惠价：<span style="color: red">￥{{ amount.toFixed(2) }}</span>
            <span
              v-if="allCount === selectedCount && selectedCount > 1"
              style="font-weight: 400; color: #666666"
            >
              （9折优惠）
            </span>
          </div>
        </div>
        <div
          style="margin-right: 50px; line-height: 1.5; min-width: 280px"
          v-else
        >
          <div>
            原价：<span style="color: red">￥{{ amount.toFixed(2) }}</span>
          </div>
        </div>
        <div>
          <el-button class="button_0" @click="purchasePart">
            立即采购
          </el-button>
          <el-button class="button_1" @click="addToShoppingCat">
            加入购物车
          </el-button>
        </div>
      </div>
    </div>
    <!-- 模块信息 -->
    <div class="part_details">
      <h1 :class="{ active: pageNum === 0 }" @click="pageNum = 0">
        数据详情
        <div></div>
      </h1>
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
      target=".data_mart_module"
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
import { Decimal } from "decimal.js";

export default {
  name: "DataMartModule",
  data() {
    return {
      // 模块信息（details、standard、filed）
      partInfo: {},
      // 登入用户信息
      userInfo: {},
      // 页面加载
      loading: false,
      loadingCount: 0,
      // 当前页面（0数据详情、1引用规范、2字段说明）
      pageNum: 0,
      // 未购表格数量
      allCount: 0,
      // 已选表格数量
      selectedCount: 0,
      // 全选
      checked: true,
      isIndeterminate: false,
      // 总金额
      amount: 0,
      // 优惠
      discounts: 0,
      // 禁用加入购物车按钮
      disable: false,
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
    // 初始化数据
    init() {
      // 获取登入用户信息
      this.userInfo = this.$store.getters.getUserInfo;
      if (
        this.userInfo.type !== "机构用户" &&
        !(this.userInfo.type === "个人用户" && this.userInfo.status === "1")
      )
        return this.$router.push("/data_mart/home");

      // 获取页面参数
      this.partInfo = this.$route.params.partInfo;
      if (this.partInfo)
        sessionStorage.setItem("dataMartModule", JSON.stringify(this.partInfo));
      else {
        if (JSON.parse(sessionStorage.getItem("dataMartModule")))
          this.partInfo = JSON.parse(sessionStorage.getItem("dataMartModule"));
      }
      if (!this.partInfo || !this.partInfo.partEng)
        return this.$router.push("/data_mart/home");

      this.loading = true;
      this.loadingCount = 0;
      // 获取模块表格
      this.getPartTable();
      // 获取数据详情
      this.getPartDetails();
    },
    // 跳转数据库页面
    jumpDatabase(val) {
      if (val === 0) {
        this.$router.push({
          name: "DataMartDatabase",
          params: {
            id: 1,
            database: this.partInfo.database
          }
        });
      } else if (val === 1) {
        this.$router.push({
          name: "DataMartDatabase",
          params: {
            id: 2,
            database: this.partInfo.database,
            b_database: this.partInfo.b_database
          }
        });
      }
    },
    // 跳转路由
    jumpRouter(path) {
      this.$router.push(path);
    },
    // 获取模块表格
    getPartTable() {
      // 初始化数据
      this.partInfo.table = [];
      this.allCount = 0;
      this.checked = true;

      // 调用接口
      this.$http
        .post(
          process.env.API_ROOT + "/market/getPartTable",
          {
            databaseEng: this.partInfo.databaseEng,
            partEng: this.partInfo.partEng,
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
          // 获取失败，根据 message 输出错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("获取模块表格失败，" + res.message);
          }
          // 获取成功，整理数据
          else {
            if (res.data && res.data.length > 0) {
              this.partInfo.table = res.data;
              this.partInfo.table.forEach(item => {
                item.status = false;
                if (!item.isBuy) this.allCount++;
              });
              this.checkAll();
            }
          }
        })
        .catch(() => {
          this.$message.error("获取模块表格失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loadingCount++;
          if (this.loadingCount === 2) this.loading = false;
        });
    },
    // 获取模块数据详情
    getPartDetails() {
      // 调用接口
      this.$http
        .get(process.env.API_ROOT + "/market/getPartDetails", {
          params: {
            databaseEng: this.partInfo.databaseEng,
            partEng: this.partInfo.partEng
          }
        })
        .then(data => {
          let res = data.data;
          // 获取成功，处理数据
          if (res.status === 0) {
            this.partInfo.details = res.data.details;
            this.partInfo.standard = res.data.standard;
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
                '<th style="width: 10%">更新频率</th>' +
                "</tr>";
              res.data.children.data.forEach(table => {
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
                      "</td>" +
                      '<td rowspan="' +
                      table.children.length +
                      '" style="position: relative">' +
                      '<div style="position: absolute; top: 10px; bottom: 10px">' +
                      '<span style="position: sticky; top: 0">' +
                      (table.update ? table.update : "-") +
                      "</span>" +
                      "</div>" +
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
          this.loadingCount++;
          if (this.loadingCount === 2) this.loading = false;
        });
    },
    // 选择表格
    chooseTable() {
      this.selectedCount = 0;
      if (this.partInfo.table && this.partInfo.table.length > 0)
        this.partInfo.table.forEach(item => {
          if (item.status) this.selectedCount++;
        });
      if (this.selectedCount === 0) this.checked = this.isIndeterminate = false;
      else if (this.selectedCount === this.allCount) {
        this.checked = true;
        this.isIndeterminate = false;
      } else {
        this.checked = false;
        this.isIndeterminate = true;
      }
      this.calculatePrice();
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
        .post(
          process.env.API_ROOT + "/market/preview",
          {
            dbId: this.partInfo.databaseEng,
            tableName: table.code
          },
          {
            headers: {
              token: this.userInfo.token,
              sign: window.crypt_tool.encrypt(
                table.code + "@@" + parseInt(new Date().getTime() / 1000)
              )
            }
          }
        )
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
    // 全选
    checkAll() {
      this.isIndeterminate = false;
      if (this.partInfo.table && this.partInfo.table.length > 0)
        this.partInfo.table.forEach(item => {
          if (!item.isBuy) item.status = this.checked;
        });
      this.selectedCount = this.checked ? this.allCount : 0;
      this.calculatePrice();
    },
    // 计算价格
    calculatePrice() {
      this.amount = this.discounts = 0;
      if (this.partInfo.table && this.partInfo.table.length > 0)
        this.partInfo.table.forEach(item => {
          if (item.status) {
            if (item.usePriceNow === 1) {
              this.amount = new Decimal(this.amount)
                .add(new Decimal(item.tablePriceNow))
                .toNumber();
              this.discounts = new Decimal(this.discounts)
                .add(
                  new Decimal(item.tablePrice).sub(
                    new Decimal(item.tablePriceNow)
                  )
                )
                .toNumber();
            } else
              this.amount = new Decimal(this.amount)
                .add(new Decimal(item.tablePrice))
                .toNumber();
          }
        });
      // 9折优惠
      if (this.allCount === this.selectedCount && this.selectedCount > 1) {
        this.discounts = new Decimal(this.discounts)
          .add(new Decimal(this.amount).mul(new Decimal(0.1)))
          .toNumber();
        this.amount = new Decimal(this.amount).mul(new Decimal(0.9)).toNumber();
      }
      this.$forceUpdate();
    },
    // 立即采购
    purchasePart() {
      if (this.determiningUserType()) {
        if (!this.userInfo.email) {
          this.$confirm(
            "请先前往个人中心绑定邮箱，用于接收订单信息！",
            "提示",
            {
              customClass: "data_mart_hint_dialog",
              confirmButtonText: "绑定邮箱",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.$router.push("/user_center/account");
            })
            .catch(() => {});
        } else {
          let val = this.partInfo;
          let part = {
            database: val.database,
            databaseEng: val.databaseEng,
            b_database: val.b_database,
            part: val.part,
            partEng: val.partEng,
            table: []
          };
          if (val.table && val.table.length > 0)
            val.table.forEach(item => {
              if (item.status)
                part.table.push({
                  name: item.name,
                  code: item.code
                });
            });
          this.$router.push({
            name: "ConfirmOrder",
            params: {
              list: [part]
            }
          });
        }
      }
    },
    // 加入购物车
    addToShoppingCat() {
      if (this.determiningUserType()) {
        this.loading = true;
        let list = [
          {
            databaseEng: this.partInfo.databaseEng,
            tableEng: []
          }
        ];
        if (this.partInfo.table && this.partInfo.table.length > 0)
          this.partInfo.table.forEach(item => {
            if (item.status) list[0].tableEng.push(item.code);
          });
        this.$http
          .post(
            process.env.API_ROOT + "/market/shopCart",
            {
              time: new Date().getTime(),
              list: list,
              flag: true
            },
            {
              headers: {
                token: this.userInfo.token
              }
            }
          )
          .then(data => {
            let res = data.data;
            // 加入购物车失败，根据message返回错误信息
            if (res.status !== 0) {
              if (!res.message) res.message = "服务器错误，请稍后再试！";
              this.$message.error("加入购物车失败，" + res.message);
            }
            // 获取成功，处理数据
            else this.$message.success("已添加至购物车！");
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
    determiningUserType() {
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
            type: "warning"
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
      } else if (this.selectedCount === 0) {
        this.$message.warning("您还未选择数据表！");
        return false;
      } else return true;
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.data_mart_module {
  width: 100%;
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

    .text_button {
      padding: 0;
      font-size: 18px;
      font-weight: 700;
      line-height: 40px;
      color: #5051f9;
      margin-right: 20px;
      float: right;
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
      padding: 10px 10px 10px 15px;
      box-sizing: border-box;
      background: white;
      box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
      position: relative;
      border-radius: 5px;
      display: flex;
      cursor: default;

      > div {
        display: flex;
        align-items: center;
      }

      .el-checkbox {
        transform: scale(1.1);
        position: relative;
        top: 1px;
        margin-right: 8px;

        .el-checkbox__inner {
          border-color: #333333;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          border-color: #409eff;
        }
      }

      .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        .tag {
          margin: 0 5px;
          padding: 3px 7px;
          font-size: 12px;
          color: white;
          border-radius: 15px;
        }
      }

      .table_procurement {
        display: inline-block;
        width: 220px;
        color: #666666;
      }

      .table_price,
      .table_price_now {
        display: inline-block;

        .price,
        .price_now {
          display: inline-block;
          font-weight: 700;
          width: 120px;
          margin-right: 15px;
        }

        .price {
          color: #e5701b;
        }

        .price_now {
          color: red;
        }
      }

      .table_price_now {
        .price {
          font-weight: 400;
          font-size: 14px;
          width: 100px;
          color: #666666;
          text-decoration: line-through;
        }
      }

      .el-button {
        font-size: 12px;
        padding: 6px 10px;
        border-radius: 12px;
        color: white;
        border: none;
        background: #0e68b4;
        position: absolute;
        top: -1px;
        right: 0;
      }

      .el-button:hover {
        background: #0e80cc;
      }
    }

    .table_item:hover {
      background: #eeeeee;
    }
  }

  .part_footer {
    height: 60px;
    padding: 0 10px;
    margin: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(30, 167, 255, 0.22);
    box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);

    > div {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 700;

      .el-checkbox {
        display: flex;
        align-items: center;
        margin: 0 15px 0 10px;

        .el-checkbox__input {
          transform: scale(1.5);
          margin-right: 5px;
        }

        .el-checkbox__inner {
          border-color: #333333;
          background: transparent;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #409eff;
          border-color: #409eff;
        }

        .el-checkbox__label {
          color: black;
          font-weight: 700;
          font-size: 18px;
        }
      }

      .el-button {
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        color: white;
        margin-right: 10px;
      }

      .button_0 {
        background: #40c874;
      }

      .button_0:hover {
        background: #41d37e;
      }

      .button_1 {
        background: #1d9cf1;
      }

      .button_1:hover {
        background: #1ea7ff;
      }
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
    padding: 80px 0;
  }

  .dataDialog {
    height: 100%;
    min-height: 600px;
    margin: 0 auto;
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

.el-tooltip__popper {
  max-width: 700px;
}
</style>
