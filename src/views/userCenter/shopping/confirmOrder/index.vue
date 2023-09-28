<template>
  <!-- 确认订单信息 -->
  <div class="confirm_order">
    <!-- 主要内容 -->
    <el-container v-loading="loading">
      <!-- 订单详情 -->
      <el-main class="scrollbar">
        <!-- 确认订单信息 -->
        <el-card class="card_0">
          <div slot="header">
            <span>确认订单信息</span>
            <span class="hint"
              >待订单完成后，可前往个人中心-订单与发票中申请开具发票</span
            >
          </div>
          <div class="card_body">
            <el-row style="margin-bottom: 10px">
              <span class="title">收件邮箱地址：</span>
              <span class="content">{{ userInfo.email }}</span>
            </el-row>
            <el-row style="margin-bottom: 20px">
              <span class="hint"
                >注：如需修改，请前往个人中心-账号设置-基础信息中修改</span
              >
            </el-row>
            <el-row style="margin-bottom: 20px">
              <el-col style="display: flex; align-items: center">
                <span class="title">支付方式：</span>
                <span
                  class="pay_type"
                  :class="{ activate: payType === 0 }"
                  @click="payType = 0"
                >
                  <img src="@/assets/icon/支付宝.png" alt="支付宝" />
                  <span class="choose"></span>
                  <span class="hot">推荐</span>
                </span>
                <span
                  class="pay_type"
                  :class="{ activate: payType === 1 }"
                  @click="payType = 1"
                >
                  <img src="@/assets/icon/微信.png" alt="微信" />
                  <span class="choose"></span>
                </span>
              </el-col>
            </el-row>
            <div>
              <span class="title" style="float: left">备注信息（选填）：</span>
              <el-input
                v-model="desc"
                type="textarea"
                class="desc_textarea"
                placeholder="注：此备注信息将被一同发送至邮箱"
                :maxlength="1000"
              >
              </el-input>
            </div>
          </div>
        </el-card>
        <!-- 确认采购内容 -->
        <el-card class="card_1">
          <div slot="header">
            <span>确认采购内容</span>
          </div>
          <div class="card_body">
            <el-row class="table_header">
              <el-col :span="3"> 专题库 </el-col>
              <el-col :span="4"> 子库 </el-col>
              <el-col :span="4"> 模块 </el-col>
              <el-col :span="8"> 数据表 </el-col>
              <el-col :span="5"> 小计 </el-col>
            </el-row>
            <el-divider></el-divider>
            <div v-for="(part, i) in tableList" class="part" :key="i">
              <el-row>
                <el-col :span="3" class="database_name">
                  {{ part.database }}
                </el-col>
                <el-col :span="4" class="table_name">
                  {{ part.b_database }}
                </el-col>
                <el-col :span="4" class="table_name">
                  {{ part.part }}
                </el-col>
                <el-col :span="8" class="table_name">
                  <div
                    v-for="(table, j) in part.table"
                    style="margin-bottom: 8px"
                    :key="j"
                  >
                    {{ table.name }}
                  </div>
                </el-col>
                <el-col :span="5" class="table_price">
                  <div
                    v-for="(table, j) in part.table"
                    style="margin-bottom: 8px"
                    :key="j"
                  >
                    <div
                      v-if="table.usePriceNow !== 1"
                      class="table_price_original"
                    >
                      <span class="price"
                        >￥{{ table.tablePrice.toFixed(2) }}</span
                      >
                    </div>
                    <div v-else class="table_price_now">
                      <span class="price"
                        >￥{{ table.tablePrice.toFixed(2) }}</span
                      >
                      <span class="price_now"
                        >￥{{ table.tablePriceNow.toFixed(2) }}</span
                      >
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="table_count">
                  合计：
                  <span v-if="part.discount === 0"
                    >￥{{ part.amount.toFixed(2) }}</span
                  >
                  <span v-else style="color: red">
                    <span class="table_discounts"
                      >￥{{ (part.amount + part.discount).toFixed(2) }}</span
                    >
                    ￥{{ part.amount.toFixed(2) }}
                  </span>
                  <span v-if="part.flag" class="table_hint">（9折优惠）</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-main>
      <!-- 提交订单 -->
      <el-footer height="200px">
        <!-- 阅读并同意 -->
        <div class="top">
          <el-checkbox v-model="checked"></el-checkbox>
          <div class="checked not-selected" @click="checked = !checked">
            我已阅读并同意：本商品为虚拟内容服务，购买后不支持退换，并严禁以任何商业目的转让、出售、赠予其他第三方。
          </div>
        </div>
        <!-- 优惠券 -->
        <div class="coupon">
          <div class="icon">券</div>
          <div class="title">优惠券</div>
          <el-popover
            placement="top-end"
            trigger="click"
            popper-class="data_mart_coupon_dialog"
            width="550"
            v-model="coupon.dialog"
            :popper-options="{
              boundariesElement: 'body',
              removeOnDestroy: true,
            }"
          >
            <div slot="reference" v-if="!coupon.active" class="popover">
              共{{ coupon.list.length }}张，{{ coupon.count }}张可用
              <i class="el-icon-arrow-right"></i>
            </div>
            <div slot="reference" v-else class="popover">
              已选优惠
              <span class="discounts"
                >-￥{{ coupon.couponDiscount.toFixed(2) }}</span
              >
              <i class="el-icon-arrow-right"></i>
            </div>
            <el-container>
              <el-header height="40px"> 请选择优惠券 </el-header>
              <el-main class="none-scrollbar">
                <template v-if="coupon.list && coupon.list.length > 0">
                  <div
                    v-for="(item, index) in coupon.list"
                    class="item"
                    :key="index"
                  >
                    <div
                      class="coupon_item"
                      :class="{ disable: item.status !== 0 }"
                    >
                      <div class="coupon_title">
                        <div style="font-weight: 700">{{ item.data[0] }}</div>
                        <div
                          style="
                            transform: scale(0.8);
                            transform-origin: 0 0;
                            width: 125%;
                          "
                        >
                          {{ item.data[1] }}
                        </div>
                      </div>
                      <div class="coupon_line"></div>
                      <div class="coupon_content">
                        <div class="coupon_name">{{ item.name }}</div>
                        <div
                          style="
                            transform: scale(0.8);
                            transform-origin: 0 0;
                            width: 125%;
                          "
                        >
                          有效期：{{ item.data[3] }}
                        </div>
                      </div>
                      <div
                        class="coupon_tag"
                        v-if="
                          item.tagStatus !== 1 &&
                          item.tagStatus >= 0 &&
                          item.tagStatus <= 4
                        "
                        :style="'background:' + tagList[item.tagStatus].color"
                      >
                        {{ tagList[item.tagStatus].name }}
                      </div>
                    </div>
                    <div class="item_button">
                      <el-button
                        v-if="coupon.active === item.id"
                        class="gray_button"
                        @click="unselectCoupon()"
                      >
                        取消选择
                      </el-button>
                      <el-button
                        v-else-if="item.status === 0"
                        class="blue_button"
                        @click="selectCoupon(item)"
                      >
                        立即使用
                      </el-button>
                      <el-button
                        v-else
                        class="blue_button"
                        @click="showCouponInfo(item)"
                      >
                        查看详情
                      </el-button>
                    </div>
                  </div>
                </template>

                <el-empty
                  v-else
                  description="暂无可用优惠券"
                  :image-size="120"
                  style="height: 100%"
                >
                </el-empty>
              </el-main>
            </el-container>
          </el-popover>
        </div>
        <!-- 会员 -->
        <div class="coupon">
          <div class="icon">VIP</div>
          <div class="title" v-if="vip.isVip && vip.discount > 0">
            会员VIP专享{{ vip.discount * 10 }}折优惠
          </div>
          <div class="title" v-else>开通会员享专属折扣</div>
          <div class="discounts" v-if="vipDiscount > 0">
            -￥{{ vipDiscount.toFixed(2) }}
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="bottom">
          <div class="actual_payment">
            <div style="margin-bottom: 3px">
              实付款：<span style="color: red"
                >￥{{ allPrice.toFixed(2) }}</span
              >
            </div>
            <div style="font-size: 18px">
              已优惠：<span style="color: red"
                >￥{{ allDiscount.toFixed(2) }}</span
              >
            </div>
          </div>
          <el-button
            @click="submitOrder"
            :disabled="!checked || !tableList || tableList.length === 0"
            :class="{
              disable: !checked || !tableList || tableList.length === 0,
            }"
          >
            提交订单
          </el-button>
        </div>
      </el-footer>
    </el-container>

    <!-- 优惠券详情 -->
    <el-dialog
      :visible.sync="couponInfo.dialog"
      width="450px"
      top="0"
      :destroy-on-close="true"
      :before-close="closeCouponDialog"
      custom-class="couponInfo"
      append-to-body
    >
      <span slot="title">
        <span style="margin-right: 10px">{{ couponInfo.name }}</span>
        <span style="font-size: 26px">{{ couponInfo.data[0] }}</span>
      </span>
      <el-descriptions :column="1">
        <el-descriptions-item label="有效期">{{
          couponInfo.data[3]
        }}</el-descriptions-item>
        <el-descriptions-item label="金额门槛">{{
          couponInfo.data[1]
        }}</el-descriptions-item>
        <el-descriptions-item label="订单门槛">{{
          couponInfo.data[2]
        }}</el-descriptions-item>
        <el-descriptions-item label="备注/描述">{{
          couponInfo.desc
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import Base64 from "base-64";

export default {
  name: "ConfirmOrder",
  data() {
    return {
      // 页面加载
      loading: false,
      // 用户信息
      userInfo: {},
      // 采购列表
      list: [],
      tableList: [],
      // 支付方式（0支付宝，1微信）
      payType: 0,
      // 备注信息
      desc: "",
      // 优惠券
      coupon: {
        dialog: false,
        active: null,
        couponDiscount: 0,
        count: 0,
        list: [],
      },
      // 标签列表
      tagList: [
        {
          name: "即将到期",
          color: "#FF0000",
        },
        {
          name: "待使用",
          color: "#EFBB55",
        },
        {
          name: "待生效",
          color: "#979797",
        },
        {
          name: "未达使用门槛",
          color: "#979797",
        },
        {
          name: "不可使用",
          color: "#979797",
        },
      ],
      // 优惠券详情
      couponInfo: {
        dialog: false,
        name: null,
        data: [],
        desc: null,
      },
      // 会员
      vip: {
        isVip: false,
        discount: null,
        vipDiscount: 0,
      },
      // 阅读并同意
      checked: false,
      // 会员优惠
      vipDiscount: 0,
      // 实付款
      allPrice: 0,
      // 优惠
      allDiscount: 0,
      // 禁用“提交”按钮
      disableSubmit: false,
    };
  },
  methods: {
    // 页面初始化
    init() {
      // 获取用户信息
      this.userInfo = this.$store.getters.getUserInfo;
      if (!this.userInfo.email) return this.$router.push("/");

      // 确认订单
      this.confirmAnOrder();
    },
    // 确认订单
    confirmAnOrder() {
      this.loading = true;
      this.tableList = [];
      this.$http
        .post(
          process.env.API_ROOT + "/market/confirmAnOrder",
          {
            list: this.list,
          },
          {
            headers: {
              token: this.userInfo.token,
            },
          }
        )
        .then((data) => {
          let res = data.data;
          // 确认订单失败，根据message返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("确认订单失败，" + res.message);
          }
          // 确认订单成功，整理数据
          else {
            if (res.data.list && res.data.list.length > 0) {
              res.data.list.forEach((item) => {
                if (!(item.discount > 0)) item.discount = 0;
              });
              this.tableList = res.data.list;
            }
            this.vip = res.data.userInfo;
            this.vipDiscount = this.vip.vipDiscount;
            this.allPrice = this.vip.allPrice;
            this.allDiscount = this.vip.allDiscount;
            this.coupon.count = 0;
            if (res.data.coupon && res.data.coupon.length > 0) {
              res.data.coupon.forEach((item) => {
                if (item.status === 0) this.coupon.count++;
                item.couponDiscount = item.couponDiscount || 0;
                item.data = [];
                if (item.discountsType === 0)
                  item.data[0] = "￥" + item.discounts;
                else if (item.discountsType === 1)
                  item.data[0] = item.discounts * 10 + "折";
                if (!item.amountThreshold) item.data[1] = "无门槛";
                else item.data[1] = "满" + item.amountThreshold + "可用";
                if (!item.orderThreshold || item.orderThreshold.length === 0)
                  item.data[2] = "无门槛";
                else {
                  let str = null;
                  if (item.orderThreshold[0] === item.orderThreshold[1])
                    str = item.orderThreshold[0];
                  else
                    str =
                      Math.min(...item.orderThreshold) +
                      "-" +
                      Math.max(...item.orderThreshold);
                  item.data[2] = "单笔订单满" + str + "张表可用";
                }
                if (!item.validityDate[0]) item.data[3] = "即日起 - ";
                else item.data[3] = item.validityDate[0] + " - ";
                if (!item.validityDate[1]) item.data[3] += "永久";
                else item.data[3] += item.validityDate[1];
              });
              res.data.coupon.sort((a, b) => a.tagStatus - b.tagStatus);
              res.data.coupon.sort(
                (a, b) => b.couponDiscount - a.couponDiscount
              );
              res.data.coupon.sort((a, b) => a.status - b.status);
              this.coupon.list = res.data.coupon;
            }
          }
        })
        .catch(() => {
          this.$message.error("确认订单失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          // 默认选中第一张优惠券
          if (this.coupon.list && this.coupon.list.length > 0)
            this.selectCoupon(this.coupon.list[0]);
          this.loading = false;
        });
    },
    // 取消选择优惠券
    unselectCoupon() {
      this.coupon.active = null;
      this.coupon.couponDiscount = 0;
      this.vipDiscount = this.vip.vipDiscount;
      this.allPrice = this.vip.allPrice;
      this.allDiscount = this.vip.allDiscount;
      this.coupon.dialog = false;
      this.$forceUpdate();
    },
    // 选择优惠券
    selectCoupon(val) {
      if (val.status !== 0) return;
      this.coupon.active = val.id;
      this.coupon.couponDiscount = val.couponDiscount;
      this.vipDiscount = val.vipDiscount;
      this.allPrice = val.allPrice;
      this.allDiscount = val.allDiscount;
      this.coupon.dialog = false;
      this.$forceUpdate();
    },
    // 查看优惠券详情信息
    showCouponInfo(val) {
      this.couponInfo = {
        dialog: true,
        name: val.name,
        data: val.data,
        desc: val.desc,
      };
    },
    // 关闭优惠券对话框
    closeCouponDialog() {
      this.couponInfo = {
        dialog: false,
        name: null,
        data: [],
        desc: null,
      };
      setTimeout(() => {
        this.coupon.dialog = true;
      }, 1);
    },
    // 提交订单
    submitOrder() {
      if (
        !this.checked ||
        this.disableSubmit ||
        !this.tableList ||
        this.tableList.length === 0
      )
        return;
      this.disableSubmit = true;
      setTimeout(() => {
        this.disableSubmit = false;
      }, 2000);
      // 整理数据
      let data = {
        desc: this.desc,
        list: this.list,
        coupon: this.coupon.active,
        time: new Date().getTime(),
      };
      this.loading = true;
      // 支付宝
      if (this.payType === 0) {
        this.$http
          .post(process.env.API_ROOT + "/market/orderPayZfb", data, {
            headers: {
              token: this.userInfo.token,
            },
          })
          .then((data) => {
            let res = data.data;
            // 提交订单失败，根据 status 输出提示信息
            if (res.status !== 0) {
              if (!res.message) res.message = "服务器错误，请稍后再试！";
              this.$message.error("提交订单失败，" + res.message);
              this.loading = false;
            }
            // 提交订单成功
            else {
              if (res.data.pay_url) {
                window.location.href = res.data.pay_url;
              }
            }
          })
          .catch(() => {
            this.$message.error("提交订单失败，服务器错误，请稍后再试！");
            this.loading = false;
          });
      }
      // 微信
      else {
        this.$http
          .post(process.env.API_ROOT + "/market/orderPayWx", data, {
            headers: {
              token: this.userInfo.token,
            },
          })
          .then((data) => {
            let res = data.data;
            // 提交订单失败，根据 status 输出提示信息
            if (res.status !== 0) {
              if (!res.message) res.message = "服务器错误，请稍后再试！";
              this.$message.error("提交订单失败，" + res.message);
              this.loading = false;
            }
            // 提交订单成功
            else {
              let key = new Date().getTime();
              this.$router.push({
                name: "OrderPayWx",
                params: {
                  name: "数据超市",
                  orderId: res.data.orderId,
                  qrcodeB64: res.data.qrcodeB64,
                  payPrice: res.data.payPrice,
                  key: key.toString(),
                  encryptKey: Base64.encode(key),
                },
              });
            }
          })
          .catch(() => {
            this.$message.error("提交订单失败，服务器错误，请稍后再试！");
            this.loading = false;
          });
      }
    },
  },
  mounted() {
    this.$emit("changeActiveName", "1");
    // 获取参数
    this.list = this.$route.params.list;
    if (this.list && this.list.length > 0)
      sessionStorage.setItem("tableList", JSON.stringify(this.list));
    else {
      if (JSON.parse(sessionStorage.getItem("tableList")))
        this.list = JSON.parse(sessionStorage.getItem("tableList"));
      if (!this.list || this.list.length === 0) return this.$router.push("/");
    }
    this.init();
  },
};
</script>

<style lang="scss">
.confirm_order {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;

  .el-container {
    height: 100%;
    position: relative;

    .el-main {
      padding: 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 190px;

      .card_0,
      .card_1 {
        color: black;
        margin-bottom: 20px;

        .el-card__header {
          box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
          font-size: 20px;
          font-weight: 700;

          .hint {
            margin-left: 50px;
            font-size: 16px;
            font-weight: 400;
            color: #888888;
          }
        }

        .card_body {
          padding: 0 10px;
        }
      }

      .card_0 {
        .card_body {
          .title {
            font-size: 18px;
            font-weight: 700;
            color: #0e68b4;
          }

          .content {
            font-size: 18px;
            font-weight: 700;
          }

          .hint {
            font-size: 15px;
            color: #979797;
          }

          .pay_type {
            width: 140px;
            height: 40px;
            margin: 1px 41px 1px 21px;
            border: 1px solid #eaeaea;
            position: relative;
            cursor: pointer;
            box-sizing: content-box;

            > img {
              width: 140px;
              height: 40px;
            }

            .hot {
              background: url(~@/assets/bg/hot.png) 0 0 no-repeat;
              text-align: center;
              color: #ffffff;
              line-height: 16px;
              font-size: 12px;
              height: 16px;
              width: 34px;
              position: absolute;
              right: auto;
              bottom: auto;
              left: -15px;
              top: -8px;
              display: block;
              font-family: Simsun, serif;
            }
          }

          .pay_type.activate {
            border: 2px solid #ff6565;
            margin: 0 40px 0 20px;

            .choose {
              width: 18px;
              height: 18px;
              background: url(~@/assets/icon/choose.png) 0 0 no-repeat;
              position: absolute;
              right: 0;
              bottom: 0;
              z-index: 2;
              display: block;
            }
          }

          .desc_textarea {
            width: calc(100% - 700px);

            .el-textarea__inner {
              color: black;
              background: #f6f6f6;
              font-size: 16px;
              min-height: 60px !important;
              max-height: 100px;
            }

            textarea::-webkit-input-placeholder {
              color: #777777;
            }
          }
        }
      }

      .card_1 {
        .card_body {
          .table_header {
            font-weight: 700;
            color: #5f6388;
            font-family: "黑体", "Microsoft YaHei", "serif";
          }

          .part {
            margin-bottom: 35px;

            > .el-row {
              margin-bottom: 5px;
            }

            .database_name {
              font-size: 18px;
              font-weight: 700;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              position: relative;
              top: -2px;
            }

            .table_name {
              color: #666666;

              > div {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }

            .table_price {
              .table_price_original,
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
                  width: auto;
                  font-weight: 400;
                  font-size: 14px;
                  color: #666666;
                  text-decoration: line-through;
                }
              }
            }

            .table_count {
              font-size: 16px;
              float: right;
              font-weight: 700;

              > span {
                color: #e5701b;

                .table_discounts {
                  font-weight: 400;
                  font-size: 14px;
                  color: #666666;
                  text-decoration: line-through;
                }
              }

              .table_hint {
                font-size: 14px;
                font-weight: 400;
                color: #666666;
              }
            }
          }
        }
      }
    }

    .el-footer {
      margin: 0;
      position: absolute;
      bottom: -10px;
      right: 30px;
      width: 460px;

      > div {
        display: flex;
        align-items: center;
      }

      .top {
        margin: 6px 0;

        .el-checkbox {
          transform: scale(1.3);
        }

        .checked {
          width: 370px;
          font-size: 14px;
          color: #666666;
          margin: 0 20px 0 10px;
          cursor: pointer;
        }
      }

      .bottom {
        border-top: 1px dashed #979797;
        padding-top: 6px;

        .actual_payment {
          display: inline-block;
          font-weight: 700;
          font-size: 20px;
          flex: 1;
        }

        .el-button {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-right: 20px;
          background: red;
          border-color: red;
          width: 114px;
        }

        .el-button.disable {
          background: #f56c6c;
          border-color: #f56c6c;
          cursor: not-allowed;
        }
      }

      .coupon {
        height: 38px;
        border-top: 1px dashed #979797;
        position: relative;

        .icon {
          width: 25px;
          height: 25px;
          background: #efbb55;
          color: #e5701b;
          font-weight: 700;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }

        .title {
          font-size: 14px;
        }

        .popover {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(0, -50%);
          cursor: pointer;
          font-size: 14px;
          color: #778399;

          > .discounts {
            font-size: 12px;
            background: #efbb55;
            position: initial;
          }
        }

        .discounts {
          font-size: 14px;
          font-weight: 700;
          color: red;
          padding: 4px 5px;
          margin: 0 2px;
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }
  }
}

.data_mart_coupon_dialog {
  height: 500px;
  border: 1px solid #c4c4c4;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  padding: 0;

  .popper__arrow {
    border-bottom-color: #c4c4c4 !important;
  }

  .el-container {
    height: 100%;

    .el-header {
      padding: 5px 8px;
      font-size: 20px;
      font-weight: 700;
      color: black;
    }

    .el-main {
      padding: 0 12px;

      .item {
        display: flex;
        margin: 10px 0;

        .coupon_item {
          flex: 1;
          margin-right: 9px;
          height: 65px;
          border: 1px solid #979797;
          border-radius: 2px;
          position: relative;
          padding: 8px 15px;
          display: flex;
          align-items: center;
          font-size: 16px;
          line-height: 1.8;
          color: black;

          .coupon_title {
            flex: 1;
            color: #5051f9;
            width: 0;

            > div {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .coupon_line {
            width: 10px;
            height: 100%;
            border-left: 1px dashed #979797;
          }

          .coupon_content {
            flex: 3;
            width: 0;

            .coupon_name {
              font-weight: 700;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .coupon_tag {
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 1px;
            padding: 2px 5px;
            font-size: 12px;
            transform: scale(0.8);
            transform-origin: top right;
            color: white;
          }
        }

        .coupon_item.disable {
          filter: grayscale(100%);
          color: #979797;
        }

        .item_button {
          display: flex;
          align-items: center;
          width: 70px;

          .el-button {
            font-size: 14px;
            border: 1px solid;
            border-radius: 3px;
            padding: 3px 5px;
            width: 70px;
          }

          .gray_button {
            color: #979797;
            border-color: #979797;
          }

          .blue_button {
            color: #5051f9;
            border-color: #5051f9;
          }
        }
      }
    }
  }
}

.couponInfo {
  margin: 0 auto;
  height: 280px;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .el-dialog__header {
    font-size: 24px;
    color: #5051f9;
    font-weight: 700;

    .el-dialog__close:before {
      font-size: 24px;
      font-weight: 700;
      color: #222222;
    }
  }

  .el-dialog__body {
    color: #4d4d4d;
    position: absolute;
    top: 54px;
    left: 0;
    right: 0;
    bottom: 0;

    .el-descriptions {
      .el-descriptions-item__label {
        font-weight: 700;
        color: black;
        width: 70px;
        text-align-last: justify;
        display: block;
      }
    }
  }
}
</style>
