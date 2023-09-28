<template>
  <!-- 支付结果 -->
  <div class="trade_result" v-loading="loading">
    <el-result
      class="success"
      icon="success"
      title="您已成功支付！"
      subTitle="可前往邮箱查收数据文件！"
      v-if="name === '数据超市'"
    >
      <template slot="extra">
        <div>没有收到邮件？看看邮箱垃圾桶里有没有……</div>
        <div style="margin: 10px">
          或者可
          <span class="text_button" @click="resendData">点此</span>
          选择再次发送
        </div>
        <div style="margin: 30px">
          如需开具发票，可
          <span class="text_button" @click="jumpRouter('/user_center/orders')"
            >前往</span
          >
          个人中心-订单与发票页面申请！
        </div>
        <div class="back_button">
          <el-button type="text" @click="jumpRouter('/user_center/shopping')">
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
            返回购物车
          </el-button>
        </div>
      </template>
    </el-result>
    <el-result
      class="success"
      icon="success"
      title="您已成功支付！"
      subTitle="成为尊贵的会员用户！"
      v-else-if="name === '会员权益'"
    >
      <template slot="extra">
        <div style="margin: 30px">
          如需开具发票，请
          <span class="text_button" @click="jumpRouter('/about/contact_us')"
            >联系客服</span
          >
          ！
        </div>
        <div class="back_button">
          <el-button type="text" @click="jumpRouter('/data_mart/home')">
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
            前往数据超市，采购数据
          </el-button>
        </div>
      </template>
    </el-result>
  </div>
</template>

<script>
import Base64 from "base-64";

export default {
  name: "TradeResult",
  data() {
    return {
      name: null,
      // 页面来源
      referrer: null,
      referrerList: [
        "https://unitradeprod.alipaydev.com/",
        "https://unitradeprod.alipay.com/",
        "OrderPayWx",
      ],
      // 订单号
      out_trade_no: null,
      // 用户信息
      userInfo: {},
      // 页面加载
      loading: false,
      // 禁用重新发送
      disableResend_0: false,
      disableResend_1: false,
      interval: null,
      countDown: 0,
    };
  },
  methods: {
    // 初始化
    init() {
      if (this.$route.query.referrer && this.$route.query.out_trade_no) {
        if (sessionStorage.getItem("TradeResult") !== "true")
          this.$router.push("/");
        this.referrer = this.$route.query.referrer;
        this.out_trade_no = this.$route.query.out_trade_no;
        if (this.$route.query.key && this.$route.query.encryptKey) {
          let key = this.$route.query.key;
          let encryptKey = this.$route.query.encryptKey;
          if (key !== Base64.decode(encryptKey)) this.$router.push("/");
        } else this.$router.push("/");
      } else {
        this.referrer = document.referrer;
        this.out_trade_no = this.$route.query.out_trade_no;
      }
      this.userInfo = this.$store.getters.getUserInfo;
      if (!this.referrerList.includes(this.referrer) || !this.out_trade_no)
        this.$router.push("/");

      this.name =
        this.$route.query.name === "%BB%E1%D4%B1%C8%A8%D2%E6" ||
        this.$route.query.name === "会员权益"
          ? "会员权益"
          : "数据超市";
      if (this.name === "数据超市") this.$emit("changeActiveName", "1");
      else if (this.name === "会员权益") this.$emit("changeActiveName", "3");
    },
    // 重新发送数据
    async resendData() {
      if (this.disableResend_0) return;
      this.disableResend_0 = true;
      setTimeout(() => {
        this.disableResend_0 = false;
      }, 1000);
      if (this.disableResend_1)
        return this.$message.warning(
          "操作过于频繁，请 " + this.countDown + " 秒后再试！"
        );
      this.loading = true;
      await this.$http
        .post(
          process.env.API_ROOT + "/market/tableOut",
          {
            time: new Date().getTime(),
            orderId: this.out_trade_no,
          },
          {
            headers: {
              token: this.userInfo.token,
            },
          }
        )
        .then((data) => {
          let res = data.data;
          // 发送失败，根据 status 输出提示信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("发送失败，" + res.message);
          }
          // 发送成功
          else {
            this.$message.success("发送成功");
            this.disableResend_1 = true;
            this.countDown = 60;
            this.interval = setInterval(() => {
              this.countDown--;
              if (this.countDown <= 0) {
                this.disableResend_1 = false;
                clearInterval(this.interval);
              }
            }, 1000);
          }
        })
        .catch(() => {
          this.$message.error("发送失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 跳转路由
    jumpRouter(path) {
      this.$router.push(path);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
.trade_result {
  height: 100%;
  width: 100%;

  .el-result {
    height: 90%;

    .el-result__icon {
      > svg {
        width: 100px;
        height: 100px;
      }
    }

    .el-result__title {
      > p {
        font-size: 36px;
        font-weight: 700;
      }
    }

    .el-result__subtitle {
      > p {
        font-size: 30px;
        font-weight: 700;
      }
    }

    .el-result__extra {
      font-size: 18px;

      .text_button {
        color: #0e68b4;
        font-weight: 700;
        cursor: pointer;
        text-decoration: underline;
      }

      .back_button {
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
  }

  .el-result.success {
    .el-result__title > p,
    .el-result__subtitle > p {
      color: #67c23a;
    }
  }
}
</style>
