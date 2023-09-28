<template>
  <!-- 我的购物车 -->
  <div class="shopping" v-loading="loading">
    <el-container>
      <el-main class="scrollbar">
        <div v-for="(part, i) in goodsList" :key="i" class="table_list">
          <div class="table_header">
            <el-checkbox
              v-model="part.status"
              :indeterminate="part.isIndeterminate"
              @change="checkPart(part)"
            ></el-checkbox>
            <span>
              {{ part.database }}
              <i class="el-icon-arrow-right"></i>
              {{ part.b_database }}
              <i class="el-icon-arrow-right"></i>
              {{ part.part }}
            </span>
            <div class="table_button">
              <el-button @click="viewIntroduction(part)">查看介绍</el-button>
            </div>
          </div>
          <div v-for="(table, j) in part.table" :key="j" class="table_item">
            <div style="display: inline-block; width: 65%; margin-right: 30px">
              <el-checkbox
                v-model="table.status"
                @change="checkTable(part)"
              ></el-checkbox>
              <span class="table">{{ table.name }}</span>
              <span
                class="tag"
                v-for="(tag, k) in table.tags"
                :key="k"
                :style="'background:' + tag.tagColor"
              >
                {{ tag.tagName }}
              </span>
            </div>
            <div style="display: inline-block; width: calc(35% - 30px)">
              <div v-if="table.usePriceNow === 0" class="table_price">
                <span class="price">￥{{ table.tablePrice.toFixed(2) }}</span>
              </div>
              <div v-else class="table_price_now">
                <span class="price">￥{{ table.tablePrice.toFixed(2) }}</span>
                <span class="price_now"
                  >￥{{ table.tablePriceNow.toFixed(2) }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <el-empty
          description="暂无数据"
          v-if="!goodsList || goodsList.length === 0"
        ></el-empty>
      </el-main>
      <el-footer>
        <el-checkbox
          v-model="checked"
          :indeterminate="isIndeterminate"
          @change="checkAll"
        >
          <div>全选</div>
          <div style="font-size: 16px; font-weight: 400; color: red">
            采购全模块，可享9折优惠
          </div>
        </el-checkbox>
        <el-button
          type="text"
          class="text_button"
          :class="{ disable_button: total === 0 }"
          :disabled="total === 0"
          @click="outOfTheShoppingCart"
        >
          删除
        </el-button>
        <div>
          <span>
            已选产品：<span style="color: red">{{ total }}</span> 项
          </span>
          <div style="width: 350px">
            <div style="margin-bottom: 3px">
              金额：<span style="color: red">￥{{ amount.toFixed(2) }}</span>
            </div>
            <div style="font-size: 18px">
              已优惠：<span style="color: red"
                >￥{{ discounts.toFixed(2) }}</span
              >
              <span v-if="flag" style="font-weight: 400; color: #666666"
                >（部分9折优惠）</span
              >
            </div>
          </div>
          <el-button
            :class="{ disable_button: total === 0 }"
            :disabled="total === 0"
            @click="purchaseTable"
          >
            立即结算
          </el-button>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { Decimal } from "decimal.js";

export default {
  name: "Shopping",
  data() {
    return {
      // 页面加载
      loading: false,
      // 登入用户信息
      userInfo: {},
      // 商品列表
      goodsList: [],
      // 全选
      checked: false,
      isIndeterminate: false,
      // 总数
      total: 0,
      // 总金额
      amount: 0,
      // 优惠
      discounts: 0,
      flag: false,
    };
  },
  methods: {
    // 获取登入用户信息
    getUserInfo() {
      this.userInfo = this.$store.getters.getUserInfo;
      this.getGoodsList();
    },
    // 获取购物车列表
    getGoodsList() {
      this.loading = true;
      this.goodsList = [];
      this.checked = this.isIndeterminate = false;
      this.total = this.amount = this.discounts = 0;
      this.$http
        .get(process.env.API_ROOT + "/market/shopCartInfo", {
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
            this.$message.error("购物车列表获取失败，" + res.message);
          }
          // 获取成功，处理数据
          else {
            if (res.data && res.data.length > 0)
              res.data.forEach((a) => {
                a.status = false;
                a.isIndeterminate = false;
                a.selectedCount = 0;
                a.amount = 0;
                a.discounts = 0;
                if (a.table && a.table.length > 0)
                  a.table.forEach((b) => {
                    b.status = false;
                  });
              });
            this.goodsList = res.data;
          }
        })
        .catch((err) => {
          if (err.response.status === 503)
            this.$message.error("访问太过频繁，请稍后再试！");
          else
            this.$message.error("购物车列表获取失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 查看介绍
    viewIntroduction(part) {
      this.$router.push({
        name: "DataMartModule",
        params: {
          partInfo: {
            database: part.database,
            databaseEng: part.database_eng,
            b_database: part.b_database,
            part: part.part,
            partEng: part.part_eng,
          },
        },
      });
    },
    // 选择模块
    checkPart(part) {
      part.isIndeterminate = false;
      if (part.table && part.table.length > 0)
        part.table.forEach((table) => {
          table.status = part.status;
        });
      this.isCheckAll();
    },
    // 选择表格
    checkTable(part) {
      part.status = true;
      part.isIndeterminate = false;
      if (part.table && part.table.length > 0)
        part.table.forEach((table) => {
          if (!table.status) part.status = false;
          else part.isIndeterminate = true;
        });
      if (part.status) part.isIndeterminate = false;
      this.isCheckAll();
    },
    // 全选
    checkAll() {
      this.isIndeterminate = false;
      this.total = this.amount = this.discounts = 0;
      if (this.goodsList && this.goodsList.length > 0)
        this.goodsList.forEach((part) => {
          part.status = this.checked;
          part.isIndeterminate = false;
          if (part.table && part.table.length > 0)
            part.table.forEach((table) => {
              table.status = part.status;
            });
        });
      this.calculatePrice();
    },
    // 是否全选
    isCheckAll() {
      this.checked = true;
      this.isIndeterminate = false;
      if (this.goodsList && this.goodsList.length > 0)
        this.goodsList.forEach((part) => {
          if (!part.status) this.checked = false;
          else this.isIndeterminate = true;
          if (part.table && part.table.length > 0)
            part.table.forEach((table) => {
              if (!table.status) this.checked = false;
              else this.isIndeterminate = true;
            });
        });
      if (this.checked) this.isIndeterminate = false;
      this.calculatePrice();
    },
    // 计算价格
    calculatePrice() {
      this.total = this.amount = this.discounts = 0;
      this.flag = false;
      if (this.goodsList && this.goodsList.length > 0)
        this.goodsList.forEach((part) => {
          part.selectedCount = part.amount = part.discounts = 0;
          if (part.table && part.table.length > 0)
            part.table.forEach((table) => {
              if (table.status) {
                part.selectedCount++;
                if (table.usePriceNow === 1) {
                  part.amount = new Decimal(part.amount)
                    .add(new Decimal(table.tablePriceNow))
                    .toNumber();
                  part.discounts = new Decimal(part.discounts)
                    .add(
                      new Decimal(table.tablePrice).sub(
                        new Decimal(table.tablePriceNow)
                      )
                    )
                    .toNumber();
                } else
                  part.amount = new Decimal(part.amount)
                    .add(new Decimal(table.tablePrice))
                    .toNumber();
              }
            });
          // 9折优惠
          if (part.allCount <= part.selectedCount && part.selectedCount > 1) {
            part.discounts = new Decimal(part.discounts)
              .add(new Decimal(part.amount).mul(new Decimal(0.1)))
              .toNumber();
            part.amount = new Decimal(part.amount)
              .mul(new Decimal(0.9))
              .toNumber();
            this.flag = true;
          }

          // 合计
          this.total += part.selectedCount;
          this.amount = new Decimal(this.amount)
            .add(new Decimal(part.amount))
            .toNumber();
          this.discounts = new Decimal(this.discounts)
            .add(new Decimal(part.discounts))
            .toNumber();
        });
      this.$forceUpdate();
    },
    // 移出购物车
    outOfTheShoppingCart() {
      if (this.total === 0) return;
      // 整理数据
      let list = [];
      if (this.goodsList && this.goodsList.length > 0)
        this.goodsList.forEach((a) => {
          let database = {
            databaseEng: a.database_eng,
            tableEng: [],
          };
          if (a.table && a.table.length > 0)
            a.table.forEach((b) => {
              if (b.status) database.tableEng.push(b.code);
            });
          if (database.tableEng && database.tableEng.length > 0) {
            let flag = true;
            for (let i = 0; i < list.length; i++) {
              if (list[i].databaseEng === database.databaseEng) {
                list[i].tableEng = list[i].tableEng.concat(database.tableEng);
                flag = false;
                break;
              }
            }
            if (flag) list.push(database);
          }
        });
      if (!list || list.length === 0) return;
      this.$confirm("此操作会将已选表格移出购物车，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          // 调用接口，将以选表格移出购物车
          this.$http
            .post(
              process.env.API_ROOT + "/market/shopCart",
              {
                time: new Date().getTime(),
                list: list,
                flag: false,
              },
              {
                headers: {
                  token: this.userInfo.token,
                },
              }
            )
            .then((data) => {
              let res = data.data;
              // 移出购物车失败，根据message返回错误信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("移出购物车失败，" + res.message);
              }
              // 移出成功，处理数据
              else {
                this.$message.success("已从购物车中移出！");
                this.getGoodsList();
              }
            })
            .catch(() => {
              this.$message.error("移出购物车失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    // 立即结算（采购表格）
    purchaseTable() {
      if (this.total === 0) return;
      if (!this.userInfo.email) {
        this.$confirm("请先前往个人中心绑定邮箱，用于接收订单信息！", "提示", {
          customClass: "data_mart_hint_dialog",
          confirmButtonText: "绑定邮箱",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$emit("changeActiveName", "0");
            this.$router.push("/user_center/account");
          })
          .catch(() => {});
        return;
      }
      // 整理数据
      let list = [];
      if (this.goodsList && this.goodsList.length > 0)
        this.goodsList.forEach((a) => {
          if (a.selectedCount > 0) {
            let part = {
              database: a.database,
              databaseEng: a.database_eng,
              b_database: a.b_database,
              part: a.part,
              partEng: a.part_eng,
              table: [],
            };
            if (a.table && a.table.length > 0)
              a.table.forEach((b) => {
                if (b.status) part.table.push(b);
              });
            if (part.table && part.table.length > 0) list.push(part);
          }
        });
      if (!list || list.length === 0) return;
      this.$router.push({
        name: "ConfirmOrder",
        params: {
          list: list,
        },
      });
    },
  },
  mounted() {
    this.$emit("changeActiveName", "1");
    this.getUserInfo();
  },
};
</script>

<style lang="scss">
.shopping {
  width: 100%;
  height: 100%;

  .el-container {
    height: 100%;

    .el-main {
      padding: 8px 12px;

      .table_list {
        margin-bottom: 20px;

        .table_header {
          margin-bottom: 10px;
          padding: 20px 34px;
          box-sizing: border-box;
          box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
          background: white;
          font-size: 20px;
          font-weight: 700;
          font-family: "黑体", "Microsoft YaHei", "serif";
          color: black;
          position: relative;

          .el-checkbox {
            transform: scale(1.5);
            position: relative;
            top: -3px;
            margin-right: 10px;

            .el-checkbox__inner {
              border-color: #333333;
            }

            .el-checkbox__input.is-checked .el-checkbox__inner,
            .el-checkbox__input.is-indeterminate .el-checkbox__inner {
              border-color: #409eff;
            }
          }

          .table_button {
            position: absolute;
            top: 50%;
            right: 465px;
            transform: translate(0, -50%);

            .el-button {
              font-size: 14px;
              padding: 8px 20px;
              border-radius: 20px;
              color: white;
              border: none;
              background: #0e68b4;
            }
          }
        }

        .table_item {
          min-height: 40px;
          width: calc(100% - 10px);
          background: white;
          padding: 5px 30px;
          margin: 8px auto;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          line-height: 1.5;
          box-sizing: border-box;

          .el-checkbox {
            transform: scale(1.1);
            position: relative;
            top: -1px;
            margin-right: 6px;

            .el-checkbox__inner {
              border-color: #333333;
            }

            .el-checkbox__input.is-checked .el-checkbox__inner,
            .el-checkbox__input.is-indeterminate .el-checkbox__inner {
              border-color: #409eff;
            }
          }

          .tag {
            margin: 0 5px;
            padding: 3px 7px;
            font-size: 12px;
            color: white;
            border-radius: 15px;
          }

          .table_price,
          .table_price_now {
            display: inline-block;
            width: 275px;

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
              color: #666666;
              text-decoration: line-through;
            }
          }
        }

        .table_item:hover {
          background: #eeeeee;
        }
      }

      .el-empty {
        height: 100%;
      }
    }

    .el-footer {
      margin: 8px 12px 0;
      background: rgba(30, 167, 255, 0.22);
      display: flex;
      align-items: center;
      position: relative;

      .el-checkbox {
        display: flex;
        align-items: center;
        margin-left: 10px;

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

      .text_button {
        color: black;
        font-weight: 700;
        font-size: 20px;
        margin-left: 60px;
      }

      .text_button.disable_button {
        color: #999999;
        cursor: not-allowed;
      }

      > div {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 60%;
        right: 0;
        color: black;
        font-weight: 700;
        font-size: 20px;
        display: flex;
        align-items: center;

        > span {
          width: 250px;
        }

        .el-button {
          height: 90%;
          font-size: 18px;
          font-weight: 700;
          background: #0e68b4;
          color: white;
          border-radius: 8px;
        }

        .el-button.disable_button {
          background: #5097cb;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
