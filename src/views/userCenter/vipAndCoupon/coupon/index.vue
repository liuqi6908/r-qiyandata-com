<template>
  <!-- 优惠券 -->
  <div class="coupon" v-loading="loading">
    <!-- 主要内容 -->
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(menu, i) in menuList" :key="i" :name="menu.name">
        <span slot="label" class="not-selected"
          >{{ menu.name }}({{ menu.count }})</span
        >
        <div class="scrollbar">
          <div class="coupon-list" v-if="menu.count !== 0">
            <div
              class="coupon_item"
              :class="{ disable: item.status !== 0 }"
              v-for="(item, j) in menu.infoList"
              :style="item.style"
              :key="j"
            >
              <div class="coupon_title">
                <div style="font-weight: 700">{{ item.data[0] }}</div>
                <div style="font-size: 14px">{{ item.data[1] }}</div>
              </div>
              <div class="coupon_line"></div>
              <div class="coupon_content">
                <div>
                  <div style="display: flex">
                    <span class="coupon_name">{{ item.name }}</span>
                    <span
                      class="show_info"
                      v-if="item.status === 0"
                      @click="showCouponInfo(item)"
                      >查看详情</span
                    >
                  </div>
                  <div style="font-size: 14px">有效期：{{ item.data[3] }}</div>
                </div>
                <el-button
                  v-if="item.status === 0"
                  @click="jumpRouter(item.type)"
                >
                  立即使用
                </el-button>
              </div>
              <div
                class="coupon_tag"
                v-if="item.tagStatus !== 3"
                :style="'background:' + tagList[item.tagStatus].color"
              >
                {{ tagList[item.tagStatus].name }}
              </div>
            </div>
          </div>
          <el-empty
            v-else
            :description="'暂无' + menu.name + '优惠券'"
            style="height: 100%; flex: 1"
          ></el-empty>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 优惠券详情 -->
    <el-dialog
      :visible.sync="couponInfo.dialog"
      width="450px"
      top="0"
      :destroy-on-close="true"
      :before-close="closeCouponDialog"
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

    <!-- 兑换优惠券 -->
    <el-button type="text" class="redeem_coupon" @click="redeemCoupon">
      兑换优惠券
    </el-button>
  </div>
</template>

<script>
export default {
  name: "Coupon",
  data() {
    return {
      // 当前登入用户信息
      userInfo: {},
      // 加载页面
      loading: false,
      // 当前活动页面
      activeName: "待使用",
      // 导航列表
      menuList: [
        {
          name: "待使用",
          count: 0,
          infoList: [],
        },
        {
          name: "已使用",
          count: 0,
          infoList: [],
        },
        {
          name: "已失效",
          count: 0,
          infoList: [],
        },
      ],
      // 标签列表
      tagList: [
        {
          name: "待生效",
          color: "#41D37E",
        },
        {
          name: "新到账",
          color: "#EFBB55",
        },
        {
          name: "即将到期",
          color: "#FF0000",
        },
        {
          name: "待使用",
          color: "#EFBB55",
        },
        {
          name: "已使用",
          color: "#979797",
        },
        {
          name: "已失效",
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
    };
  },
  methods: {
    // 获取优惠券列表
    getCouponList() {
      // 初始化数据
      this.menuList.forEach((item) => {
        item.count = 0;
        item.infoList = [];
      });
      this.loading = true;

      // 调用接口，获取数据
      this.$http
        .get(process.env.API_ROOT + "/coupon/getCouponList", {
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
            this.$message.error("优惠券获取失败，" + res.message);
          }
          // 获取成功，处理数据
          else if (res.data && res.data.length > 0) {
            res.data.forEach((item) => {
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

              this.menuList[item.status].infoList.push(item);
              this.menuList[item.status].count++;
            });
          }
        })
        .catch(() => {
          this.$message.error("优惠券获取失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
          this.$emit("updateCount", this.menuList[0].count);
        });
    },
    // 兑换优惠券
    redeemCoupon() {
      this.$prompt("请输入兑换券码", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        inputValidator: (val) => {
          if (!val.trim()) return false;
        },
        inputErrorMessage: "请输入正确的兑换券码",
      })
        .then(({ value }) => {
          this.loading = true;
          // 调用接口，兑换优惠券
          this.$http
            .post(
              process.env.API_ROOT + "/coupon/redeemCoupon",
              {
                cdk: value,
                time: new Date().getTime(),
              },
              {
                headers: {
                  token: this.userInfo.token,
                },
              }
            )
            .then((data) => {
              let res = data.data;
              // 兑换失败，根据 message 返回错误信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("兑换失败，" + res.message);
              }
              // 获取成功，处理数据
              else {
                this.$message.success("兑换成功！");
                this.getCouponList();
              }
            })
            .catch(() => {
              this.$message.error("兑换失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
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
    },
    // 立即使用，跳转路由
    jumpRouter(val) {
      if (val !== 2) this.$router.push("/data_mart");
      else {
        this.$router.push({
          name: "Vip",
          params: {
            buyVip: true,
          },
        });
        this.$emit("init");
      }
    },
  },
  mounted() {
    this.userInfo = this.$store.getters.getUserInfo;
    this.getCouponList();
  },
};
</script>

<style lang="scss">
.coupon {
  width: 100%;
  height: 100%;
  position: relative;

  > .el-tabs {
    height: 100%;
    position: relative;
    margin: 0 10px;

    > .el-tabs__header {
      height: 40px;
      padding: 0 5px;
      margin: 0 15px 10px;
      border-bottom: 1px solid #979797;

      .el-tabs__item {
        font-size: 14px;
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
        display: none;
      }
    }

    > .el-tabs__content {
      padding: 0;
      position: absolute;
      top: 60px;
      bottom: 10px;
      left: 0;
      right: 0;

      > .el-tab-pane {
        height: 100%;

        > div {
          width: 100%;
          height: 100%;
          padding: 0 20px;
          box-sizing: border-box;

          > .coupon-list {
            display: grid;
            grid-template-columns:
              calc((100% - 30px) / 3) calc((100% - 30px) / 3)
              calc((100% - 30px) / 3);
            grid-gap: 15px;

            .coupon_item {
              height: 80px;
              border: 1px solid #979797;
              position: relative;
              border-radius: 3px;
              padding: 15px 20px;
              box-sizing: border-box;
              display: flex;
              font-size: 18px;
              line-height: 1.6;

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
                width: 20px;
                border-left: 1px dashed #979797;
              }

              .coupon_content {
                flex: 4;
                display: flex;

                > div {
                  flex: 5;

                  .coupon_name {
                    font-weight: 700;
                    display: inline-block;
                    max-width: 220px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }

                  .show_info {
                    font-size: 12px;
                    cursor: pointer;
                    color: #5051f9;
                    position: relative;
                    left: 10px;
                    padding: 4px 8px;
                    border-radius: 8px;
                  }

                  .show_info:hover {
                    background: rgba(226, 227, 255, 0.5);
                  }
                }

                .el-button {
                  flex: 1;
                  color: #5051f9;
                  border: 1px solid #5051f9;
                  border-radius: 5px;
                  font-size: 14px;
                  padding: 5px 10px;
                  height: 30px;
                  margin: 10px 0;
                }

                .el-button:hover {
                  background: rgba(226, 227, 255, 0.5);
                }
              }

              .coupon_tag {
                position: absolute;
                top: 0;
                right: 0;
                border-radius: 3px;
                padding: 2px 10px;
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
          }
        }
      }
    }
  }

  .el-dialog__wrapper {
    padding: 160px 0;
    box-sizing: border-box;

    .el-dialog {
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
  }

  .redeem_coupon {
    position: absolute;
    top: -60px;
    right: 40px;
    color: #5051f9;
    font-size: 16px;
  }
}
</style>
