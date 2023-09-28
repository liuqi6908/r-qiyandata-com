<template>
  <!-- 会员权益 -->
  <div class="vip" v-loading="loading">
    <!-- 主要内容 -->
    <div class="scrollbar">
      <!-- 用户信息 -->
      <div
        class="user_info"
        v-if="userVipInfo.name"
        :class="{
          vip_user: userVipInfo.isVip,
          common_user: !userVipInfo.isVip
        }"
      >
        <!-- 用户信息 -->
        <div>
          <el-avatar :size="67" :src="userVipInfo.avatarUrl" @error="true">
            <el-avatar :size="67">{{
              userVipInfo.name.substr(0, 1)
            }}</el-avatar>
          </el-avatar>
          <div class="info">
            <div class="name">
              {{ userVipInfo.name }}
              <img :src="userVipInfo.icon" />
            </div>
            <div class="hint">
              <span v-if="userVipInfo.isVip">您已是尊贵的会员用户！</span>
              <span v-else>普通用户</span>
            </div>
            <div class="validity" v-if="userVipInfo.isVip">
              {{ userVipInfo.validityDate }}到期
              <span v-if="userVipInfo.status === 1" class="tag">即将到期</span>
            </div>
            <div
              v-if="userVipInfo.isVip && userVipInfo.discount"
              class="discount"
            >
              <span @click="jumpRouter('/data_mart')">数据超市</span>采购立享
              <span>{{ userVipInfo.discount }}</span> 优惠
            </div>
          </div>
        </div>
        <!-- “购买会员”按钮 -->
        <el-button @click="showVipDialog">
          <span v-if="userVipInfo.isVip">立即续订</span>
          <span v-else>{{
            userInfo.newUser ? "获取7天会员权限" : "成为会员"
          }}</span>
        </el-button>
        <!-- 会员图标 -->
        <img :src="userVipInfo.img" />
      </div>

      <!-- 页面组件 -->
      <div id="page_element">
        <MyElement
          v-for="(item, index) in elementList"
          :key="index"
          :elementData="item"
          @showVipDialog="showVipDialog"
          @IPLogin="IPLogin"
        >
        </MyElement>
      </div>

      <el-empty
        v-if="!userVipInfo.name && (!elementList || elementList.length === 0)"
        description="暂无数据"
        style="height: 100%"
      >
      </el-empty>
    </div>

    <!-- 购买会员 -->
    <el-dialog
      :visible.sync="vipInfo.dialog"
      :width="`${vipInfo.data.length < 5 ? 850 : 990}px`"
      top="0"
      :destroy-on-close="true"
      :before-close="closeVipDialog"
      :close-on-click-modal="false"
      v-loading="vipInfo.loading"
    >
      <div slot="title">
        <div class="user_info">
          <el-avatar :size="68" :src="userVipInfo.avatarUrl" @error="true">
            <el-avatar :size="68">{{
              userVipInfo.name.substr(0, 1)
            }}</el-avatar>
          </el-avatar>
          <div class="info">
            <div class="name">
              {{ userVipInfo.name }}
              <img :src="userVipInfo.icon" />
            </div>
            <div class="validity" v-if="userVipInfo.isVip">
              {{ userVipInfo.validityDate }}到期
              <span v-if="userVipInfo.status === 1" class="tag">即将到期</span>
            </div>
            <div class="hint" v-else>普通用户</div>
          </div>
        </div>
        <div class="button_container">
          <el-button type="text" @click="redeemVip">会员兑换</el-button>
          <span>|</span>
          <el-button type="text" @click="jumpRouter('/service/question')"
            >常见问题</el-button
          >
        </div>
      </div>
      <el-container class="left-container">
        <el-header> 会员专属权益 </el-header>
        <el-main class="scrollbar">
          <ul>
            <li v-for="(item, index) in vipInfo.activeVip.desc" :key="index">
              {{ item }}
            </li>
          </ul>
        </el-main>
        <el-footer>
          <el-button @click="showVipVersion">
            查看会员版本对比
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </el-footer>
      </el-container>
      <div class="right-container">
        <div class="right-top-container">
          <div
            v-for="(item, index) in vipInfo.data"
            :key="index"
            class="vip_item"
            :class="{ active: vipInfo.activeVip.name === item.name }"
            @click="selectVipItem(item)"
          >
            <div class="name">{{ item.name }}</div>
            <div class="price" :style="item.name === '7天' ? 'color: red' : ''">
              ￥{{ item.price || item.originalPrice }}
              <span
                class="original-price"
                v-if="
                  item.price &&
                    item.originalPrice &&
                    item.originalPrice > item.price
                "
                >￥{{ item.originalPrice }}</span
              >
            </div>
            <div class="info">
              {{ item.info }}
              <div v-if="item.name === '7天'" style="color: #5051f9">
                {{ activityTime }}
              </div>
            </div>
          </div>
        </div>
        <el-container class="right-bottom-container">
          <el-header height="45px">
            <span class="icon">券</span>
            <span class="title">优惠券</span>
            <el-popover
              placement="bottom-end"
              trigger="click"
              popper-class="vip_coupon_dialog"
              width="420"
              v-model="vipInfo.couponDialog"
              :popper-options="{
                boundariesElement: 'body',
                removeOnDestroy: true
              }"
            >
              <div
                slot="reference"
                v-if="!vipInfo.activeVip.activeCoupon.id"
                class="vip_coupon"
              >
                共{{ vipInfo.activeVip.coupon.length }}张，{{
                  vipInfo.activeVip.count
                }}张可用
                <i class="el-icon-arrow-right"></i>
              </div>
              <div slot="reference" v-else class="vip_coupon">
                已选优惠
                <span class="discounts"
                  >-￥{{
                    vipInfo.activeVip.activeCoupon.showDiscount.toFixed(2)
                  }}</span
                >
                <i class="el-icon-arrow-right"></i>
              </div>
              <el-container>
                <el-header height="40px"> 请选择优惠券 </el-header>
                <el-main class="none-scrollbar">
                  <template
                    v-if="
                      vipInfo.activeVip.coupon &&
                        vipInfo.activeVip.coupon.length > 0
                    "
                  >
                    <div
                      v-for="(item, index) in vipInfo.activeVip.coupon"
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
                          v-if="vipInfo.activeVip.activeCoupon.id === item.id"
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
          </el-header>
          <el-main>
            <div class="pay_type">
              <div class="title">支付方式：</div>
              <div
                class="pay_item"
                :class="{ activate: vipInfo.activeVip.payType === 0 }"
                @click="selectPayType(0)"
              >
                <img src="@/assets/icon/支付宝.png" alt="支付宝" />
                <span class="choose"></span>
                <span class="hot">推荐</span>
              </div>
              <div
                class="pay_item"
                :class="{ activate: vipInfo.activeVip.payType === 1 }"
                @click="selectPayType(1)"
              >
                <img src="@/assets/icon/微信.png" alt="微信" />
                <span class="choose"></span>
              </div>
            </div>
          </el-main>
          <el-footer height="80px">
            <div class="container01">
              <el-checkbox
                v-model="vipInfo.activeVip.check"
                @change="changeCheckAgreement"
              >
                我已阅读并同意：
                <span
                  class="agreement"
                  @click.stop.prevent="agreementDialog(true)"
                >
                  《企研·社科大数据平台会员服务协议》
                </span>
              </el-checkbox>
            </div>
            <div class="container02">
              <div class="price">
                <div>
                  实付款：
                  <span style="color: red">
                    <template v-if="vipInfo.activeVip.activeCoupon.id">
                      ￥{{vipInfo.activeVip.activeCoupon.actualPayment.toFixed(2)}}
                    </template>
                    <template v-else>
                      ￥{{vipInfo.activeVip.price}}
                    </template>
                  </span>
                </div>
                <div style="font-size: 12px">
                  已优惠：
                  <span style="color: red">
                    ￥{{vipInfo.activeVip.activeCoupon.showDiscount.toFixed(2)}}
                  </span>
                </div>
              </div>
              <el-button
                :disabled="!vipInfo.activeVip.check"
                :class="{ disable: !vipInfo.activeVip.check }"
                @click="submitOrder"
              >
                成为会员
              </el-button>
            </div>
          </el-footer>
        </el-container>
      </div>
    </el-dialog>

    <!-- 会员兑换 -->
    <el-button type="text" class="redeem_vip" @click="redeemVip">
      会员兑换
    </el-button>

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
      <div class="none-scrollbar">
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
      </div>
    </el-dialog>

    <!-- 《企研·社科大数据平台会员服务协议》 -->
    <el-dialog
      :visible.sync="vipInfo.activeVip.agreementDialog"
      width="1200px"
      top="0"
      custom-class="agreementDialog"
      :before-close="agreementDialog"
      :destroy-on-close="true"
      append-to-body
    >
      <div class="scrollbar" v-html="agreementText"></div>
    </el-dialog>
  </div>
</template>

<script>
import vip_img from "@/assets/icon/vip-0.svg";
import vip_icon from "@/assets/icon/vip.webp";
import common_img from "@/assets/icon/common-0.svg";
import common_icon from "@/assets/icon/common.webp";
import Base64 from "base-64";
import { formatTime } from "@/util/format";

export default {
  name: "Vip",
  data() {
    return {
      // 当前登入用户信息
      userInfo: {},
      // 加载页面
      loading: false,
      // 用户vip信息
      userVipInfo: {
        name: ""
      },
      // 组件列表
      elementList: [],
      // vip信息
      vipInfo: {
        dialog: false,
        loading: false,
        couponDialog: false,
        data: [],
        activeVip: {
          name: null,
          price: null,
          info: null,
          desc: [],
          coupon: [],
          count: 0,
          activeCoupon: {
            id: null,
            actualPayment: 0,
            showDiscount: 0
          },
          payType: 0,
          check: false,
          disableSubmit: false,
          agreementDialog: false
        }
      },
      // 标签列表
      tagList: [
        {
          name: "即将到期",
          color: "#FF0000"
        },
        {
          name: "待使用",
          color: "#EFBB55"
        },
        {
          name: "待生效",
          color: "#979797"
        },
        {
          name: "未达使用门槛",
          color: "#979797"
        },
        {
          name: "不可使用",
          color: "#979797"
        }
      ],
      // 优惠券详情
      couponInfo: {
        dialog: false,
        name: null,
        data: [],
        desc: null
      },
      // 会员协议
      agreementText: "",
      // 新用户活动倒计时
      activityTime: "6天23:59:59",
      activityInterval: null
    };
  },
  methods: {
    // 获取会员协议
    getAgreementText() {
      this.$http
        .get("/static/企研·社科大数据平台会员服务协议.txt")
        .then(data => {
          this.agreementText = data.data;
        });
    },
    // 获取用户会员信息
    getUserVipInfo() {
      this.loading = true;

      // 调用接口，获取数据
      this.$http
        .get(process.env.API_ROOT + "/vip/getUserVipInfo", {
          params: {
            time: new Date().getTime()
          },
          headers: {
            token: this.userInfo.token
          }
        })
        .then(data => {
          let res = data.data;
          // 获取失败，根据 message 返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("会员权益获取失败，" + res.message);
          }
          // 获取成功，处理数据
          else {
            this.userVipInfo = res.data.userInfo;
            this.userVipInfo.name =
              this.userVipInfo.name || this.userInfo.name || "未命名用户";
            this.userVipInfo.avatarUrl =
              this.userVipInfo.avatarUrl || this.userInfo.avatarUrl;
            this.userVipInfo.discount =
              this.userVipInfo.discount > 0 && this.userVipInfo.discount < 1
                ? this.userVipInfo.discount * 10 + "折"
                : null;
            if (this.userVipInfo.isVip) {
              this.userVipInfo.icon = vip_icon;
              this.userVipInfo.img = vip_img;
            } else {
              this.userVipInfo.icon = common_icon;
              this.userVipInfo.img = common_img;
            }
            if (res.data.elementList)
              this.elementList = JSON.parse(res.data.elementList);

            this.vipInfo.data = res.data.vipInfo;
            if (this.vipInfo.data && this.vipInfo.data.length > 0) {
              this.vipInfo.data.forEach(item => {
                item.price = item.price || item.originalPrice;
                // 7天
                if (item.name === "7天") {
                  item.info = "活动有效期仅剩";
                  item.coupon = this.vipInfo.data[1].coupon;
                  if (item.coupon && item.coupon.length > 0) {
                    item.coupon.forEach(coupon => {
                      coupon.status = 1;
                    });
                  }
                }
                // 当前可用优惠券
                item.count = 0;
                if (item.coupon && item.coupon.length > 0) {
                  item.coupon.forEach(coupon => {
                    if (coupon.status === 0) {
                      item.count++;
                      // 实付款
                      coupon.actualPayment =
                        coupon.discountsType === 0
                        ? item.price - coupon.discounts
                        : Math.floor(
                            item.price * coupon.discounts * 100
                          ) / 100
                      coupon.showDiscount = item.price - coupon.actualPayment
                    }
                    coupon.data = [];
                    if (coupon.discountsType === 0)
                      coupon.data[0] = "￥" + coupon.discounts;
                    else if (coupon.discountsType === 1)
                      coupon.data[0] = coupon.discounts * 10 + "折";
                    if (!coupon.amountThreshold) coupon.data[1] = "无门槛";
                    else
                      coupon.data[1] = "满" + coupon.amountThreshold + "可用";
                    if (
                      !coupon.orderThreshold ||
                      coupon.orderThreshold.length === 0
                    )
                      coupon.data[2] = "无门槛";
                    else {
                      let str = null;
                      if (coupon.orderThreshold[0] === coupon.orderThreshold[1])
                        str = coupon.orderThreshold[0];
                      else
                        str =
                          Math.min(...coupon.orderThreshold) +
                          "-" +
                          Math.max(...coupon.orderThreshold);
                      coupon.data[2] = "单笔订单满" + str + "张表可用";
                    }
                    if (!coupon.validityDate[0]) coupon.data[3] = "即日起 - ";
                    else coupon.data[3] = coupon.validityDate[0] + " - ";
                    if (!coupon.validityDate[1]) coupon.data[3] += "永久";
                    else coupon.data[3] += coupon.validityDate[1];
                  });
                  item.coupon
                    .sort((a, b) => a.tagStatus - b.tagStatus)
                    .sort((a, b) => a.status - b.status)
                    .sort((a, b) => b.showDiscount - a.showDiscount);
                }
              });
            }
            if (
              this.$route.params.buyVip === true ||
              this.$route.query.buyVip === "true"
            )
              this.showVipDialog();
            // 查看会员版本对比
            if (this.$route.query.id === "vip_version") {
              this.$nextTick(() => {
                this.showVipVersion();
              });
            }
          }
        })
        .catch(() => {
          this.$message.error("会员权益获取失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
          this.$router.push({
            path: "/user_center/vip",
            query: {}
          });
          this.$forceUpdate();
        });
    },
    // 兑换会员
    redeemVip() {
      this.$prompt("请输入兑换券码", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        inputValidator: val => {
          if (!val) return false;
          else return Boolean(val.trim());
        },
        inputErrorMessage: "请输入正确的兑换券码"
      })
        .then(({ value }) => {
          this.loading = true;
          // 调用接口，兑换优惠券
          this.$http
            .post(
              process.env.API_ROOT + "/vip/redeemVip",
              {
                cdk: value.trim(),
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
              // 兑换失败，根据 message 返回错误信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("兑换失败，" + res.message);
              }
              // 获取成功，处理数据
              else {
                this.$message.success("兑换成功！");
                this.vipInfo.dialog = false;
                this.getUserVipInfo();
              }
            })
            .catch(err => {
              if (err.response.status === 503)
                this.$message.error("访问太过频繁，请稍后再试！");
              else this.$message.error("兑换失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    // 打开购买会员对话框
    showVipDialog() {
      // 判断该用户是否为新用户
      if (this.userInfo.newUser && !this.isNewUser()) {
        // 不是新用户，删除7天会员
        this.vipInfo.data = this.vipInfo.data.filter(item => {
          if (item.name !== "7天") return item;
        });
      }
      this.vipInfo.dialog = true;
      this.vipInfo.activeVip = {
        name: null,
        price: null,
        info: null,
        desc: [],
        coupon: [],
        count: 0,
        activeCoupon: {}
      };
      // 默认选中第一个会员
      if (this.vipInfo.data && this.vipInfo.data.length > 0)
        this.selectVipItem(this.vipInfo.data[0]);
    },
    // IP登录
    IPLogin() {
      this.$emit("IPLogin");
    },
    // 关闭购买会员对话框
    closeVipDialog() {
      this.vipInfo.dialog = false;
    },
    // 跳转路由
    jumpRouter(path) {
      this.$router.push(path);
    },
    // 查看会员版本对比
    showVipVersion() {
      this.vipInfo.dialog = false;
      const version = document.getElementsByClassName("vip_version");
      if (version && version.length > 0) version[0].scrollIntoView();
      else document.getElementById("page_element").scrollIntoView();
    },
    // 选择vip选项
    selectVipItem(val) {
      if (this.vipInfo.activeVip.name === val.name) return;
      this.vipInfo.activeVip = JSON.parse(JSON.stringify(val));
      this.vipInfo.activeVip.activeCoupon = {
        id: null,
        actualPayment: 0,
        showDiscount: 0
      };
      this.vipInfo.activeVip.payType = 0;
      this.vipInfo.activeVip.check = false;
      this.vipInfo.activeVip.disableSubmit = false;
      this.vipInfo.activeVip.agreementDialog = false;
      // 默认选中第一个可用优惠券
      if (
        this.vipInfo.activeVip.coupon &&
        this.vipInfo.activeVip.coupon.length > 0
      )
        this.selectCoupon(this.vipInfo.activeVip.coupon[0]);
    },
    // 取消选择优惠券
    unselectCoupon() {
      this.vipInfo.activeVip.activeCoupon = {
        id: null,
        actualPayment: 0,
        showDiscount: 0
      };
      this.vipInfo.couponDialog = false;
      this.$forceUpdate();
    },
    // 选择优惠券
    selectCoupon(val) {
      if (val.status !== 0) return;
      this.vipInfo.activeVip.activeCoupon = {
        id: val.id,
        actualPayment: val.actualPayment,
        showDiscount: val.showDiscount
      };
      this.vipInfo.couponDialog = false;
      this.$forceUpdate();
    },
    // 查看优惠券详情信息
    showCouponInfo(val) {
      this.couponInfo = {
        dialog: true,
        name: val.name,
        data: val.data,
        desc: val.desc
      };
    },
    // 关闭优惠券对话框
    closeCouponDialog() {
      this.couponInfo = {
        dialog: false,
        name: null,
        data: [],
        desc: null
      };
      setTimeout(() => {
        this.vipInfo.couponDialog = true;
      }, 1);
    },
    // 选择支付方式
    selectPayType(val) {
      this.vipInfo.activeVip.payType = val;
      this.$forceUpdate();
    },
    // 更改选择协议
    changeCheckAgreement() {
      this.$forceUpdate();
    },
    // 会员协议对话框
    agreementDialog(val) {
      if (val === true) this.vipInfo.activeVip.agreementDialog = val;
      else val();
      this.$forceUpdate();
    },
    // 提交订单
    submitOrder() {
      if (!this.vipInfo.activeVip.check || this.vipInfo.activeVip.disableSubmit)
        return;
      this.vipInfo.activeVip.disableSubmit = true;
      setTimeout(() => {
        this.vipInfo.activeVip.disableSubmit = false;
      }, 1000);
      // 整理数据
      let data = {
        name: this.vipInfo.activeVip.name,
        couponId: this.vipInfo.activeVip.activeCoupon.id
      };
      this.vipInfo.loading = true;
      // 支付宝
      if (this.vipInfo.activeVip.payType === 0) {
        this.$http
          .post(process.env.API_ROOT + "/vip/orderPayZfb", data, {
            headers: {
              token: this.userInfo.token
            }
          })
          .then(data => {
            let res = data.data;
            // 提交订单失败，根据 status 输出提示信息
            if (res.status !== 0) {
              if (!res.message) res.message = "服务器错误，请稍后再试！";
              this.$message.error("提交订单失败，" + res.message);
            }
            // 提交订单成功
            else {
              if (res.data.pay_url) window.location.href = res.data.pay_url;
              else
                this.$message.error("提交订单失败，服务器错误，请稍后再试！");
            }
          })
          .catch(() => {
            this.$message.error("提交订单失败，服务器错误，请稍后再试！");
          })
          .finally(() => {
            this.vipInfo.loading = false;
          });
      }
      // 微信
      else {
        this.$http
          .post(process.env.API_ROOT + "/vip/orderPayWx", data, {
            headers: {
              token: this.userInfo.token
            }
          })
          .then(data => {
            let res = data.data;
            // 提交订单失败，根据 status 输出提示信息
            if (res.status !== 0) {
              if (!res.message) res.message = "服务器错误，请稍后再试！";
              this.$message.error("提交订单失败，" + res.message);
            }
            // 提交订单成功
            else {
              let key = new Date().getTime();
              this.$router.push({
                name: "OrderPayWx",
                params: {
                  name: "会员权益",
                  orderId: res.data.orderId,
                  qrcodeB64: res.data.qrcodeB64,
                  payPrice: res.data.payPrice,
                  key: key.toString(),
                  encryptKey: Base64.encode(key)
                }
              });
            }
          })
          .catch(() => {
            this.$message.error("提交订单失败，服务器错误，请稍后再试！");
          })
          .finally(() => {
            this.vipInfo.loading = false;
          });
      }
    },
    // 判断用户是否为新用户
    isNewUser() {
      if (this.userInfo.newUser) {
        return (
          !this.userVipInfo.isVip &&
          (this.userInfo.rz_time
            ? 7 * 24 * 60 * 60 * 1000 -
                (new Date().getTime() -
                  new Date(this.userInfo.rz_time).getTime()) >
              0
            : false)
        );
      }
      return false;
    }
  },
  mounted() {
    this.$emit("getCouponCount");
    this.userInfo = this.$store.getters.getUserInfo;
    this.getAgreementText();
    this.getUserVipInfo();
  },
  watch: {
    "vipInfo.dialog"(newVal) {
      if (newVal && this.isNewUser())
        this.activityInterval = setInterval(() => {
          const start =
            new Date(this.userInfo.rz_time).getTime() + 7 * 24 * 60 * 60 * 1000;
          const now = new Date().getTime();
          if (now > start) this.vipInfo.dialog = false;
          else this.activityTime = formatTime(start - now);
        }, 1000);
      else if (this.activityInterval) {
        clearInterval(this.activityInterval);
        this.activityInterval = null;
      }
    }
  }
};
</script>

<style lang="scss">
.vip {
  width: 100%;
  height: 100%;
  position: relative;

  > div {
    width: 100%;
    height: 100%;
    padding: 10px 20px;
    box-sizing: border-box;

    > .user_info {
      height: 260px;
      background-size: 100% 100%;
      border-radius: 18px;
      position: relative;

      > div:first-child {
        position: absolute;
        top: 45px;
        left: 25px;
        font-size: 16px;
        display: flex;
        align-items: center;

        .el-avatar {
          margin-right: 15px;
          font-size: 25px;
        }

        .info {
          .name {
            font-size: 24px;
            font-weight: 700;
            display: flex;
            align-items: center;
            line-height: 1.6;

            > img {
              margin-left: 10px;
            }
          }

          .hint {
            margin-bottom: 3px;
          }

          .validity {
            .tag {
              margin-left: 10px;
              background: #ff0000;
              border-radius: 3px;
              padding: 2px 5px;
              color: white;
              font-size: 12px;
            }
          }

          .discount {
            > span:first-child {
              cursor: pointer;
              text-decoration: underline;
            }

            > span:last-child {
              font-weight: 700;
            }
          }
        }
      }

      > .el-button {
        position: absolute;
        bottom: 26px;
        left: 25px;
        padding: 12px 25px;
        background: linear-gradient(102.01deg, #db985a 8.55%, #aa5200 58.77%);
        border-radius: 45px;
        border: none;
        color: white;
        font-size: 18px;
      }

      > img {
        position: absolute;
        top: 0;
        right: 10px;
      }
    }

    .user_info.vip_user {
      background: linear-gradient(
        108.69deg,
        #ffd25e 1.63%,
        #fff4cd 47.63%,
        #ffd540 98.4%
      );
      color: #aa5200;
    }

    .user_info.common_user {
      background: linear-gradient(
        108.69deg,
        #c9c9c9 1.63%,
        #d9d9d9 47.63%,
        #a7a7a7 98.4%
      );
      color: black;
    }

    > .page_element {
      padding: 20px 0;
    }
  }

  .el-dialog__wrapper {
    padding: 160px 0;
    box-sizing: border-box;

    .el-dialog {
      margin: 0 auto;
      height: 500px;
      border-radius: 5px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #232360;
      border: 1px solid #232360;

      .el-dialog__header {
        height: 118px;
        color: white;
        position: relative;
        padding: 0;

        .user_info {
          position: absolute;
          top: 25px;
          left: 25px;
          display: flex;
          align-items: center;

          .el-avatar {
            margin-right: 15px;
            font-size: 25px;
          }

          .info {
            .name {
              font-size: 18px;
              font-weight: 700;
              display: flex;
              align-items: center;
              line-height: 2;

              > img {
                margin-left: 10px;
              }
            }

            .validity {
              .tag {
                margin-left: 10px;
                background: #ff0000;
                border-radius: 3px;
                padding: 2px 5px;
                color: white;
                font-size: 12px;
              }
            }
          }
        }

        .el-dialog__close:before {
          font-size: 18px;
          font-weight: 700;
          color: #232360;
          padding: 2px;
          background: white;
          border-radius: 50%;
        }

        .button_container {
          position: absolute;
          bottom: 10px;
          right: 15px;
          font-size: 12px;

          .el-button {
            font-size: 12px;
            color: white;
            padding: 0;
          }
        }
      }

      .el-dialog__body {
        color: black;
        position: absolute;
        top: 118px;
        left: 0;
        right: 0;
        bottom: 0;
        background: #f2f3f7;
        border-radius: 5px;
        padding: 0;
        display: flex;

        .left-container {
          flex: 1;
          font-size: 16px;
          background: white;
          border-radius: 5px;

          .el-header {
            padding: 20px 23px 10px;
            font-weight: 700;
          }

          .el-main {
            padding: 0 5px;
            line-height: 1.8;

            > ul {
              margin: 0;
            }
          }

          .el-main.scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .el-footer {
            padding: 10px 20px;

            .el-button {
              border: 1px solid #778399;
              border-radius: 1px;
              font-size: 12px;
              color: #778399;
              padding: 6px;
            }
          }
        }

        .right-container {
          flex: 2.7;
          padding: 21px 14px 13px 26px;
          display: flex;
          flex-direction: column;

          .right-top-container {
            height: 118px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            gap: 12px;

            .vip_item {
              background: #ffffff;
              border: 1px solid #c4c4c4;
              border-radius: 3px;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 10px 0;
              text-align: center;
              cursor: pointer;
              flex: 1;

              > div {
                flex: 1;
                height: 0;
              }

              .name {
                font-size: 12px;
                font-weight: 700;
                display: flex;
                align-items: center;
              }

              .price {
                font-size: 19px;
                font-weight: 700;
                width: 100%;
                display: flex;
                align-items: end;
                justify-content: center;
                flex: 0.8;

                .original-price {
                  font-size: 12px;
                  font-weight: 400;
                  color: #999999;
                  transform: scale(0.8);
                  text-decoration: line-through;
                }
              }

              .info {
                font-size: 12px;
                color: #778399;
                transform: scale(0.8);
                width: 120%;
                justify-content: center;
                overflow: hidden;
                flex: 1.4;
                display: flex;
                flex-direction: column;
              }
            }

            .vip_item.active {
              border-color: #5051f9;
            }
          }

          .right-bottom-container {
            flex: 1;
            background: white;
            border: 1px solid #c4c4c4;
            border-radius: 3px;
            position: relative;

            .el-header {
              height: 45px;
              border-bottom: 1px dashed #979797;
              display: flex;
              align-items: center;
              margin: 0 27px;
              padding: 12px 0;
              position: relative;

              .icon {
                font-size: 12px;
                color: #e5701b;
                background: #efbb55;
                padding: 4px 5px;
                margin-right: 10px;
              }

              .title {
                font-weight: 700;
              }

              .vip_coupon {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translate(0, -50%);
                cursor: pointer;
                font-size: 12px;
                color: #778399;

                .discounts {
                  font-size: 12px;
                  font-weight: 700;
                  color: red;
                  background: #efbb55;
                  padding: 4px 5px;
                  margin: 0 2px;
                }
              }
            }

            .el-main {
              padding: 20px 27px 0;

              .pay_type {
                display: flex;
                align-items: center;

                .title {
                  font-size: 14px;
                  font-weight: 700;
                  color: #0e80cc;
                }

                .pay_item {
                  width: 112px;
                  height: 32px;
                  margin: 0 20px 0 10px;
                  border: 1px solid #eaeaea;
                  position: relative;
                  cursor: pointer;
                  box-sizing: content-box;

                  > img {
                    width: 112px;
                    height: 32px;
                  }

                  .hot {
                    background: url(~@/assets/bg/hot.png) 0 0
                      no-repeat;
                    text-align: center;
                    color: #ffffff;
                    line-height: 17px;
                    font-size: 12px;
                    transform: scale(0.8);
                    height: 16px;
                    width: 34px;
                    position: absolute;
                    left: -15px;
                    top: -8px;
                    font-family: Simsun, serif;
                  }
                }

                .pay_item.activate {
                  border: 1px solid #ff6565;

                  .choose {
                    width: 18px;
                    height: 18px;
                    background: url(~@/assets/icon/choose.png) 0 0
                      no-repeat;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    z-index: 2;
                  }
                }
              }
            }

            .el-footer {
              position: absolute;
              right: 27px;
              bottom: 15px;
              padding: 0;
              height: auto !important;
              width: 280px;

              .container01 {
                .el-checkbox {
                  transform: scale(0.7);
                  transform-origin: bottom left;
                  margin-bottom: 10px;

                  .agreement {
                    color: #5051f9;
                    text-decoration: underline;
                  }
                }
              }

              .container02 {
                display: flex;
                align-items: center;

                .price {
                  flex: 1;
                  font-weight: 700;
                }

                .el-button {
                  width: 80px;
                  height: 30px;
                  padding: 0;
                  background: red;
                  border-radius: 3px;
                  color: white;
                  font-weight: 700;
                  border: none;
                }

                .el-button.disable {
                  background: #f56c6c;
                  cursor: not-allowed;
                }
              }
            }
          }
        }
      }
    }

    .el-loading-mask {
      width: 850px;
      height: 500px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 5px;
      background-color: rgba(210, 210, 210, 0.6);
    }
  }

  .redeem_vip {
    position: absolute;
    top: -60px;
    right: 40px;
    color: #5051f9;
    font-size: 16px;
  }
}

.vip_coupon_dialog {
  height: 360px;
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
      font-size: 18px;
      font-weight: 700;
      color: black;
    }

    .el-main {
      padding: 0 10px;

      .item {
        display: flex;
        margin: 8px 0;

        .coupon_item {
          flex: 1;
          margin-right: 9px;
          height: 55px;
          border: 1px solid #979797;
          border-radius: 2px;
          position: relative;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          font-size: 14px;
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
          width: 60px;

          .el-button {
            font-size: 12px;
            border: 1px solid;
            border-radius: 0;
            padding: 3px 5px;
            width: 60px;
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

    > div {
      height: 100%;

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
}

.agreementDialog {
  height: 80%;
  min-height: 600px;
  margin: 0;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .el-dialog__header {
    height: 0;
    padding: 0;

    .el-icon-close:before {
      font-size: 30px;
      font-weight: 700;
      color: #222222;
    }
  }

  .el-dialog__body {
    height: 100%;
    padding: 0;
    color: black;

    > div {
      height: 100%;
      padding: 50px 100px;
      box-sizing: border-box;
      font-size: 16px;
    }

    h1 {
      font-size: 40px;
    }

    h2 {
      font-size: 32px;
    }

    p {
      text-indent: 30px;
      margin: 8px 0;
      line-height: 1.6;
    }

    .bold {
      font-weight: bold;
    }

    .line {
      text-decoration: underline;
    }
  }
}
</style>
