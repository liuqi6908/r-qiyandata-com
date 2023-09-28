<template>
  <!-- 微信支付订单 -->
  <div class="order_pay_wx">
    <div class="header">
      <h2 class="title">企研·社科大数据平台 - {{ params.name }}</h2>
      <div class="weixin">
        <svg
          viewBox="0 0 1228 1024"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
        >
          <path
            d="M530.8928 703.1296a41.472 41.472 0 0 1-35.7376-19.8144l-2.7136-5.5808L278.272 394.752a18.7392 18.7392 0 0 1-2.048-8.1408 19.968 19.968 0 0 1 20.48-19.3536c4.608 0 8.8576 1.4336 12.288 3.84l234.3936 139.9296a64.4096 64.4096 0 0 0 54.528 5.9392L1116.2624 204.8C1004.9536 80.896 821.76 0 614.4 0 275.0464 0 0 216.576 0 483.6352c0 145.7152 82.7392 276.8896 212.2752 365.5168a38.1952 38.1952 0 0 1 17.2032 31.488 44.4928 44.4928 0 0 1-2.1504 12.3904l-27.6992 97.4848c-1.3312 4.608-3.328 9.3696-3.328 14.1312 0 10.752 9.216 19.3536 20.48 19.3536 4.4032 0 8.0384-1.536 11.776-3.584l134.5536-73.3184c10.1376-5.5296 20.7872-8.96 32.6144-8.96 6.2976 0 12.288 0.9216 18.0736 2.5088 62.72 17.0496 130.4576 26.5728 200.5504 26.5728C953.7024 967.168 1228.8 750.592 1228.8 483.6352c0-80.9472-25.4464-157.1328-70.0416-224.1024l-604.9792 436.992-4.4544 2.4064a42.1376 42.1376 0 0 1-18.432 4.1984z"
            fill="#51ad1d"
          ></path>
        </svg>
        微信支付
      </div>
    </div>
    <div class="main_0" v-if="payStatus === 0">
      <span class="arrows"></span>
      <img class="pay_qr_code" :src="params.qrcodeB64" />
      <div class="pay_info">
        <div class="important_text">￥{{ params.payPrice }}</div>
        <div class="hint_text" style="margin: 15px 0">
          订单号：{{ params.orderId }}
        </div>
        <div class="important_text">订单将在{{ countDown }}后关闭</div>
        <div class="important_text">请尽快支付！</div>
        <div class="hint_text" style="margin-top: 20px">
          请使用微信，扫描二维码支付！
        </div>
      </div>
    </div>
    <div class="main_1" v-else-if="payStatus === 1">
      <div class="pay_success">
        <div class="title">
          <i class="el-icon-circle-check"></i>
          交易付款成功，即将跳转支付结果页面
        </div>
        <div class="hint">
          您的货款已经打到卖家微信账户中，请您积极与卖家联系，确保交易顺利完成。
        </div>
      </div>
    </div>
    <div class="main_2" v-else>
      <div class="timeout_info">
        <div class="title">
          <i class="el-icon-circle-close"></i>
          抱歉，您的交易因超时已失效。
          <el-popover
            placement="top"
            title="扫码联系客服"
            trigger="hover"
            popper-class="wechat_qr_code"
            :popper-options="{
              boundariesElement: 'body',
              removeOnDestroy: true,
            }"
          >
            <span slot="reference" class="contact_service not-selected"
              >付款遇到问题？</span
            >
            <img
              style="width: 150px; height: 150px"
              :src="require('@/assets/qrcode/社科大数据平台.png')"
              alt="客服二维码"
            />
          </el-popover>
        </div>
        <div class="hint">
          您订单的最晚付款时间为：{{
            new Date(parseInt(params.key) + 3 * 60 * 1000).toLocaleString()
          }}，目前已过期，交易关闭。
        </div>
      </div>
    </div>
    <div v-if="payStatus !== 1" class="jump_router">
      <el-button type="text" @click="jumpRouter(0)">
        <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
        >
          <path
            d="M462.266 167.466l-328.098 284.381 328.098 284.359v-191.379s454.799-147.683 362.705 311.707c0 0 293.586-557.828-368.422-519.544l5.719-169.527z"
            fill="#0e68b4"
          ></path>
        </svg>
        返回订单页面
      </el-button>
    </div>
    <div v-if="payStatus === 1" class="jump_router">
      <el-button type="text" @click="jumpRouter(1)"> 立即前往 </el-button>
    </div>
  </div>
</template>

<script>
import Base64 from "base-64";

export default {
  name: "OrderPayWx",
  data() {
    return {
      // 用户信息
      userInfo: {},
      // 接收的参数
      params: {},
      // 支付状态（0待支付、1已支付、2已超时）
      payStatus: 0,
      // 倒计时
      interval: null,
      timeout: null,
      countDown: null,
    };
  },
  methods: {
    // 初始化
    init() {
      // 获取用户信息
      this.userInfo = this.$store.getters.getUserInfo;
      if (!this.userInfo.name || !this.userInfo.token)
        return this.$router.push("/");
      try {
        if (
          !this.params.orderId ||
          !this.params.qrcodeB64 ||
          !this.params.key ||
          !this.params.encryptKey ||
          this.params.key !== Base64.decode(this.params.encryptKey)
        )
          return this.$router.push("/");
        this.getCountDown();
        this.interval = setInterval(() => {
          this.getCountDown();
        }, 1000);
      } catch (e) {
        return this.$router.push("/");
      }
      this.checkPayStatus();
    },
    // 获取倒计时
    getCountDown() {
      let time = parseInt(
        (
          (3 * 60 * 1000 - new Date().getTime() + parseInt(this.params.key)) /
          1000
        ).toString()
      );
      let time_0 = parseInt(
        (
          (4 * 60 * 1000 - new Date().getTime() + parseInt(this.params.key)) /
          1000
        ).toString()
      );
      if (this.payStatus === 0) {
        if (time <= 0) {
          this.payStatus = 2;
        } else {
          let m = parseInt((time / 60).toString());
          let s = time % 60;
          if (m > 0 && s > 0) this.countDown = m + "分钟" + s + "秒";
          else if (m > 0 && s <= 0) this.countDown = m + "分钟";
          else this.countDown = s + "秒";
        }
      }
      if (time_0 <= 0) {
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
      }
    },
    // 检查支付状态
    checkPayStatus() {
      this.$http
        .post(
          process.env.API_ROOT + "/market/orderSearchWx",
          {
            orderId: this.params.orderId,
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
          if (res.status === 0 && res.data.status === 1) {
            this.payStatus = 1;
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
              }
              this.jumpRouter(1);
            }, 3000);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (
            this.payStatus !== 1 &&
            sessionStorage.getItem("OrderPayWxParams") &&
            sessionStorage.getItem("OrderPayWxParams") !== "null"
          )
            this.timeout = setTimeout(() => {
              this.checkPayStatus();
            }, 5000);
        });
    },
    // 跳转路由
    jumpRouter(val) {
      if (val === 0) {
        if (this.params.name === "数据超市")
          this.$router.push("/user_center/confirm_order");
        else if (this.params.name === "会员权益")
          this.$router.push({
            name: "Vip",
            params: {
              buyVip: true,
            },
          });
      } else {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = null;
        sessionStorage.setItem("TradeResult", "true");
        let key = new Date().getTime();
        this.$router.push({
          path: "/user_center/trade_result",
          query: {
            name: this.params.name,
            out_trade_no: this.params.orderId,
            key: key.toString(),
            encryptKey: Base64.encode(key),
            referrer: "OrderPayWx",
          },
        });
      }
    },
  },
  mounted() {
    this.params = this.$route.params;
    if (this.params.key && this.params.encryptKey) {
      if (this.params.key === Base64.decode(this.params.encryptKey)) {
        sessionStorage.setItem("OrderPayWxParams", JSON.stringify(this.params));
      }
    } else {
      if (sessionStorage.getItem("OrderPayWxParams"))
        this.params = JSON.parse(sessionStorage.getItem("OrderPayWxParams"));
      else this.$router.push("/");
    }
    this.init();
  },
  beforeDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  },
};
</script>

<style lang="scss">
.order_pay_wx {
  width: 620px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .header {
    display: flex;
    align-items: center;

    .title {
      margin: 10px 150px 10px 0;
      display: inline-block;
    }

    .weixin {
      font-size: 20px;
      color: #666666;
      display: inline-flex;

      > svg {
        margin-right: 10px;
      }
    }
  }

  .main_0 {
    width: 620px;
    background: #51af1a;
    margin-top: 20px;
    padding: 30px 70px;
    border-radius: 20px;
    box-sizing: border-box;
    position: relative;
    display: flex;

    .arrows {
      border: 15px solid;
      border-color: transparent transparent #51af1a transparent;
      position: absolute;
      top: -29px;
    }

    .pay_qr_code {
      width: 160px;
      height: 160px;
      margin-right: 30px;
    }

    .pay_info {
      color: white;

      .important_text {
        font-size: 18px;
        font-weight: 700;
      }

      .hint_text {
        font-size: 14px;
      }
    }
  }

  .main_1 {
    width: 620px;
    margin-top: 20px;
    box-sizing: border-box;

    .pay_success {
      padding: 20px 0 20px 30px;
      background: #f0f9eb;
      border-radius: 20px;

      .title {
        color: #69c242;
        font-size: 18px;
        font-weight: 700;

        > i {
          font-weight: 700;
          margin-right: 15px;
        }
      }

      .hint {
        margin: 15px 0 0 37px;
        font-size: 15px;
      }
    }
  }

  .main_2 {
    width: 620px;
    margin-top: 20px;
    box-sizing: border-box;

    .timeout_info {
      padding: 20px 30px;
      background: #fcefe9;
      border-radius: 20px;

      .title {
        color: #ed5657;
        font-size: 18px;
        font-weight: 700;

        > i {
          font-weight: 700;
          margin-right: 15px;
        }

        .contact_service {
          font-size: 15px;
          font-weight: 400;
          color: #0e68b4;
          text-decoration: underline;
          cursor: pointer;
          float: right;
        }
      }

      .hint {
        margin: 15px 0 0 37px;
        font-size: 15px;
      }
    }
  }

  .jump_router {
    margin-top: 15px;
    text-align: right;

    .el-button {
      padding: 0;
      font-size: 20px;
      font-weight: 700;
      color: #0e68b4;

      svg {
        margin-right: 5px;
        position: relative;
        top: 2px;
      }
    }
  }
}

.wechat_qr_code {
  border-radius: 10px;
  padding: 15px 20px;

  .el-popover__title {
    text-align: center;
    font-size: 18px;
  }
}
</style>
