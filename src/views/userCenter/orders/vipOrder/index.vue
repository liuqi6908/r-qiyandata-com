<template>
  <!-- 会员订单 -->
  <div class="vip-order">
    <el-container v-loading="loading">
      <el-header height="50px">
        <el-input
          v-model="searchText"
          placeholder="输入订单关键词进行搜索"
          suffix-icon="el-icon-search"
        ></el-input>
        <el-button @click="resetFilter">重置</el-button>
        <div class="order_sort not-selected">
          排序：
          <span
            :class="{ active: [0, 1].includes(sortType) }"
            @click="sortOrderList(0)"
          >
            下单时间
            <i class="el-icon-top" v-if="sortType === 1"></i>
            <i class="el-icon-bottom" v-else></i>
          </span>
        </div>
      </el-header>
      <el-main class="scrollbar">
        <template v-if="filterOrderList && filterOrderList.length > 0">
          <el-card
            class="order_item"
            v-for="(order, index) in filterOrderList"
            :key="index"
          >
            <div class="type">
              <div class="title">会员类型</div>
              {{ order.vipType }}
            </div>
            <div class="time">
              <div class="title">下单时间</div>
              {{ order.tradeTime }}
            </div>
            <div class="id">
              <div class="title">订单编号</div>
              {{ order.orderId }}
            </div>
            <div class="price">
              <div class="title">订单金额</div>
              ￥{{ order.priceSale.toFixed(2) }}
            </div>
            <div class="discount">
              <template v-if="order.allDiscount">
                <div class="title">总优惠</div>
                ￥{{ order.allDiscount.toFixed(2) }}
              </template>
            </div>
            <div class="operate">
              <div>
                <div style="margin-bottom: 11px" @click="dialog = true">
                  ？如何开具发票
                </div>
                <div @click="showVipVersion">？可以享受哪些会员权益</div>
              </div>
            </div>
          </el-card>
        </template>
        <el-empty description="暂无数据" v-else style="height: 100%"></el-empty>
      </el-main>
    </el-container>

    <!-- 如何开具发票 -->
    <el-dialog
      title="？如何开具发票"
      :visible.sync="dialog"
      width="430px"
      top="0"
    >
      订阅会员如需开具发票，请扫码联系客户经理！
      <el-image
        :src="require('@/assets/qrcode/客服.png')"
      />
      <template slot="footer">
        <el-button @click="dialog = false">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "VipOrder",
  data() {
    return {
      // 页面加载
      loading: false,
      // 登入用户信息
      userInfo: {},
      // 订单列表
      orderList: [],
      // 搜索字段
      searchText: "",
      // 排序方法（0按下单时间降序，1按下单时间升序）
      sortType: 0,
      // 开具发票对话框
      dialog: false
    };
  },
  methods: {
    // 获取订单列表
    getOrderList() {
      this.loading = true;
      this.orderList = [];
      this.$http
        .get(process.env.API_ROOT + "/market/VipOrder", {
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
            this.$message.error("订单列表获取失败，" + res.message);
          }
          // 获取成功，处理数据
          else if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              if (item.priceSale <= item.sourcePrice)
                item.allDiscount = item.sourcePrice - item.priceSale;
            });
            res.data.sort((a, b) => b.tradeTime.localeCompare(a.tradeTime));
            this.sortType = 0;
            this.orderList = res.data;
          }
        })
        .catch(err => {
          if (err.response.status === 503)
            this.$message.error("访问太过频繁，请稍后再试！");
          else
            this.$message.error("订单列表获取失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 重置筛选
    resetFilter() {
      this.searchText = "";
      this.sortType = 0;
    },
    // 为订单列表排序
    sortOrderList(val) {
      if (val === 0) {
        if (this.sortType === 0) this.sortType = 1;
        else this.sortType = 0;
      }
      // 根据sortType为订单列表排序
      switch (this.sortType) {
        case 0:
          this.orderList.sort((a, b) => b.tradeTime.localeCompare(a.tradeTime));
          break;
        case 1:
          this.orderList.sort((a, b) => a.tradeTime.localeCompare(b.tradeTime));
          break;
      }
    },
    // 查看会员版本对比
    showVipVersion() {
      this.$router.push({
        path: "/user_center/vip",
        query: {
          id: "vip_version"
        }
      });
    }
  },
  mounted() {
    this.userInfo = this.$store.getters.getUserInfo;
    this.getOrderList();
  },
  computed: {
    // 筛选订单列表
    filterOrderList() {
      const val = this.searchText;
      return this.orderList.filter(item => {
        return (
          item.tradeTime.includes(val) ||
          item.orderId.includes(val) ||
          item.vipType.includes(val)
        );
      });
    }
  }
};
</script>

<style lang="scss">
.vip-order {
  width: 100%;
  height: 100%;

  .el-container {
    height: 100%;

    .el-header {
      padding: 0;

      .el-input {
        width: 600px;
        margin-right: 50px;

        .el-input__inner {
          border-radius: 10px;
        }
      }

      .el-button {
        background: #0e68b4;
        color: white;
        border-radius: 10px;
      }

      .order_sort {
        display: inline-flex;
        align-items: center;
        height: 40px;
        float: right;
        font-size: 18px;
        font-weight: 700;
        color: black;

        > span {
          cursor: pointer;
          margin-right: 50px;

          > i {
            font-weight: 700;
          }
        }

        > span.active {
          color: #0e68b4;
        }
      }
    }

    .el-main {
      padding: 0;

      .order_item {
        color: black;
        margin-bottom: 20px;
        box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
        font-size: 16px;

        .el-card__body {
          display: flex;
          align-items: center;
          padding: 18px 29px;
          line-height: 16px;
          gap: 100px;

          .title {
            font-size: 18px;
            font-weight: 700;
            color: #5051f9;
            margin-bottom: 11px;
          }

          .operate {
            flex: 1;
            padding-right: 200px;

            > div {
              float: right;

              > div {
                font-size: 14px;
                text-decoration: underline;
                cursor: pointer;
                color: #5f6388;
              }
            }
          }
        }
      }
    }
  }

  .el-dialog__wrapper {
    display: flex;
    align-items: center;

    .el-dialog {
      margin: 0 auto;

      .el-dialog__header {
        .el-dialog__title {
          font-size: 14px;
          color: #5f6388;
          text-decoration: underline;
        }
      }

      .el-dialog__body {
        padding: 10px 20px;
        font-size: 16px;
        color: black;

        .el-image {
          width: 200px;
          height: 200px;
          margin: 18px auto;
          display: block;
        }
      }

      .el-dialog__footer {
        .el-button {
          background: #5051f9;
          border-radius: 4px;
          color: white;
          padding: 10px 20px;
        }

        .el-button:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
