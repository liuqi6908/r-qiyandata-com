<template>
  <!-- 数据订单 -->
  <div class="data-order">
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
            :class="{ active_sort: sortType === 0 || sortType === 1 }"
            @click="sortOrderList(0)"
          >
            下单时间
            <i class="el-icon-top" v-if="sortType === 1"></i>
            <i class="el-icon-bottom" v-else></i>
          </span>
          <span
            :class="{ active_sort: sortType === 2 || sortType === 3 }"
            @click="sortOrderList(1)"
          >
            开票状态
            <i class="el-icon-top" v-if="sortType === 3"></i>
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
            <div slot="header">
              <span>{{ order.tradeTime }}</span>
              <span>（使用期限：{{ order.residualMaturity }}）</span>
              <span style="margin: 0 80px">订单号：{{ order.orderId }}</span>
              <span style="margin-right: 80px"
                >实付款：<span style="color: red"
                  >￥{{ order.payment.toFixed(2) }}</span
                ></span
              >
              <span v-if="order.allDiscount"
                >总优惠：<span style="color: red"
                  >￥{{ order.allDiscount.toFixed(2) }}</span
                ></span
              >
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
              <div v-for="(item, i) in order.list" class="database" :key="i">
                <el-row>
                  <el-col :span="3" class="database_name">
                    {{ item.database }}
                  </el-col>
                  <el-col :span="4" class="table_name">
                    {{ item.b_database }}
                  </el-col>
                  <el-col :span="4" class="table_name">
                    {{ item.part }}
                  </el-col>
                  <el-col :span="8" class="table_name">
                    <div
                      v-for="(table, j) in item.table"
                      style="margin-bottom: 8px"
                      :key="j"
                    >
                      {{ table.name }}
                    </div>
                  </el-col>
                  <el-col :span="5" class="table_price">
                    <div
                      v-for="(table, j) in item.table"
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
                  <el-col :span="5" style="float: right; font-weight: 700">
                    合计：
                    <span
                      style="color: #e5701b"
                      v-if="item.currentPrice === item.originalPrice"
                      >￥{{ item.currentPrice.toFixed(2) }}</span
                    >
                    <span v-else style="color: red">
                      <span
                        style="
                        font-weight: 400;
                        font-size: 14px;
                        color: #666666;
                        text-decoration: line-through;
                        margin-right: 20px;
                      "
                        >￥{{ item.originalPrice.toFixed(2) }}</span
                      >
                      ￥{{ item.currentPrice.toFixed(2) }}
                    </span>
                  </el-col>
                </el-row>
              </div>
              <el-row v-if="order.coupDiscount" style="margin-bottom: 8px">
                <el-col :span="5" style="float: right; font-weight: 700">
                  优惠券：
                  <span style="color: red">
                    -￥{{ order.coupDiscount.toFixed(2) }}
                  </span>
                </el-col>
              </el-row>
              <el-row v-if="order.vipDiscount">
                <el-col :span="5" style="float: right; font-weight: 700">
                  会员折扣：
                  <span style="color: red">
                    -￥{{ order.vipDiscount.toFixed(2) }}
                  </span>
                </el-col>
              </el-row>
              <div class="table_button">
                <el-button
                  class="green_button"
                  @click="issueAnList(order)"
                  v-if="order.listStatus === 2"
                >
                  查看数据清单
                </el-button>
                <el-button
                  class="white_button"
                  @click="issueAnList(order)"
                  v-else
                >
                  申请数据清单
                </el-button>
                <el-button
                  class="green_button"
                  @click="issueAnInvoice(order)"
                  v-if="order.invoiceStatus === 3 || order.invoiceStatus === 4"
                >
                  查看发票
                </el-button>
                <el-button
                  class="white_button"
                  @click="issueAnInvoice(order)"
                  v-else
                >
                  开具发票
                </el-button>
                <el-button
                  class="blue_button"
                  :class="{ disable_button: order.disableResend }"
                  @click="resendData(order)"
                >
                  <span v-if="!order.disableResend || order.flag">
                    <i class="el-icon-download"></i>
                    重新发送
                  </span>
                  <span v-else> {{ order.countDown }}秒后再试 </span>
                </el-button>
              </div>
            </div>
          </el-card>
        </template>
        <el-empty description="暂无数据" v-else style="height: 100%"></el-empty>
      </el-main>
    </el-container>

    <!-- 开具发票 -->
    <el-dialog
      title="开具发票"
      :visible.sync="invoiceInfo.dialog"
      width="1000px"
      top="0"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      custom-class="issue_an_invoice"
    >
      <div
        style="height: 100%"
        class="none-scrollbar"
        v-loading="invoiceInfo.loading"
      >
        <div class="invoice_info">
          订单号：
          <span>{{ invoiceInfo.orderId }}</span>
        </div>
        <div class="invoice_info">
          支付时间：
          <span>{{ invoiceInfo.tradeTime }}</span>
        </div>
        <div class="invoice_hint">
          注：申请增值税普通发票（电子版），将在三个工作日内发送到您的<span>认证邮箱</span>，申请增值税专用发票（纸质版），请联系客服！
        </div>
        <el-row :gutter="25">
          <el-col :span="12">
            <el-card class="invoice_card_0">
              <div slot="header">
                <span>请选择需要开票的类型</span>
              </div>
              <div>
                <el-radio
                  v-model="invoiceInfo.type"
                  :label="0"
                  @change="isDisabledSubmit"
                >
                  增值税普通发票（电子版）
                </el-radio>
              </div>
              <!--<div>
                <el-radio v-model="invoiceInfo.type" :label="1" @change="isDisabledSubmit">
                  增值税专用发票（纸质版）
                </el-radio>
              </div>-->
            </el-card>
            <el-card class="invoice_card_2">
              <div slot="header">
                <span>请选择需要开票的抬头</span>
              </div>
              <div
                v-for="(invoice, index) in userInfo.invoices"
                :key="index"
                style="margin-bottom: 10px"
              >
                <el-radio
                  v-model="invoiceInfo.info.id"
                  :label="invoice.id"
                  @change="
                    invoiceInfo.info = JSON.parse(JSON.stringify(invoice))
                  "
                >
                  {{ invoice.department }}
                </el-radio>
                <el-button
                  type="text"
                  class="text_button"
                  style="float: right"
                  @click="deleteInvoices(invoice.id, index)"
                >
                  删除
                </el-button>
              </div>
              <el-empty
                v-if="!userInfo.invoices || userInfo.invoices.length === 0"
                :image-size="100"
                description="暂无数据"
              ></el-empty>
              <el-button
                type="text"
                class="text_button"
                style="margin-left: 23px"
                @click="openAddInvoices"
              >
                新增
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="invoice_card_1">
              <div slot="header">
                <span>请选择需要开票的内容</span>
              </div>
              <div style="margin-bottom: 10px">
                <el-radio v-model="invoiceInfo.content" :label="0">
                  数据服务费
                </el-radio>
              </div>
              <div style="margin-bottom: 10px">
                <el-radio v-model="invoiceInfo.content" :label="1">
                  数据采集费
                </el-radio>
              </div>
              <div style="margin-bottom: 10px">
                <el-radio v-model="invoiceInfo.content" :label="2">
                  信息技术服务费
                </el-radio>
              </div>
              <div>
                <el-radio v-model="invoiceInfo.content" :label="3">
                  数据清理服务费
                </el-radio>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="invoice_form">
          <el-form :model="invoiceInfo.info" label-width="120px">
            <el-form-item prop="creditCode" label="开票税号：">
              <el-input
                v-model="invoiceInfo.info.credit_code"
                size="small"
                readonly
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="addr" label="单位地址：">
              <el-input v-model="invoiceInfo.info.addr" size="small" readonly>
              </el-input>
            </el-form-item>
            <el-form-item prop="phone" label="单位电话：">
              <el-input v-model="invoiceInfo.info.phone" size="small" readonly>
              </el-input>
            </el-form-item>
            <el-form-item prop="accountBank" label="开户银行：">
              <el-input
                v-model="invoiceInfo.info.account_bank"
                size="small"
                readonly
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="cardNum" label="银行账号：">
              <el-input
                v-model="invoiceInfo.info.card_num"
                size="small"
                readonly
              >
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="invoiceInfo.type === 1"
              prop="recipientName"
              label="收件人姓名："
            >
              <el-input
                v-model.trim="invoiceInfo.recipient.name"
                @input="isDisabledSubmit"
                size="small"
                :maxlength="10"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="invoiceInfo.type === 1"
              prop="recipientAddress"
              label="收件人地址："
            >
              <el-input
                v-model.trim="invoiceInfo.recipient.address"
                @input="isDisabledSubmit"
                size="small"
                :maxlength="100"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="invoiceInfo.type === 1"
              prop="recipientPhone"
              label="收件人电话："
            >
              <el-input
                v-model.trim="invoiceInfo.recipient.phone"
                size="small"
                :maxlength="20"
                @input="limitInput(3)"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="desc" label="发票备注：">
              <el-input
                type="textarea"
                v-model="invoiceInfo.desc"
                size="small"
                :maxlength="20"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer">
        <el-button class="white_button" @click="invoiceInfo.dialog = false"
          >取 消</el-button
        >
        <el-button
          class="blue_button"
          :class="{ disable_button: disableSubmit }"
          :disabled="disableSubmit"
          @click="submitInvoice"
          >确认提交</el-button
        >
      </span>
    </el-dialog>

    <!-- 新增开票信息 -->
    <el-dialog
      title="新增开票信息"
      :visible.sync="addInvoicesForm.dialog"
      width="700px"
      top="0"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      custom-class="order_add_invoices"
      append-to-body
    >
      <div class="body none-scrollbar" v-loading="addInvoicesForm.loading">
        <div class="add_invoices">
          <el-form
            ref="addInvoices"
            :model="addInvoicesForm"
            :rules="addInvoicesRules"
            :hide-required-asterisk="true"
            label-width="85px"
          >
            <el-form-item prop="department">
              <span slot="label">
                <span style="color: #f56c6c">*</span>
                单位名称：
              </span>
              <el-autocomplete
                placeholder="请输入单位名称"
                v-model.trim="addInvoicesForm.department"
                :maxlength="100"
                @input="isDisable"
                :fetch-suggestions="queryDepartmentList"
                @select="handleSelect"
                :trigger-on-focus="false"
                value-key="entname"
              >
              </el-autocomplete>
            </el-form-item>
            <el-form-item prop="creditCode">
              <span slot="label">
                <span style="color: #f56c6c">*</span>
                开票税号：
              </span>
              <el-input
                placeholder="请输入开票税号"
                v-model.trim="addInvoicesForm.creditCode"
                :maxlength="20"
                @input="limitInput(0)"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="addr" label="单位地址：">
              <el-input
                placeholder="请输入单位地址"
                v-model.trim="addInvoicesForm.addr"
                :maxlength="100"
                @input="isDisable"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="phone" label="单位电话：">
              <el-input
                placeholder="请输入单位电话"
                v-model.trim="addInvoicesForm.phone"
                :maxlength="20"
                @input="limitInput(1)"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="accountBank" label="开户银行：">
              <el-input
                placeholder="请输入开户银行"
                v-model.trim="addInvoicesForm.accountBank"
                :maxlength="100"
                @input="isDisable"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="cardNum" label="银行账号：">
              <el-input
                placeholder="请输入银行账号"
                v-model.trim="addInvoicesForm.cardNum"
                :maxlength="25"
                @input="limitInput(2)"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <div class="next_button">
            <el-button
              :disabled="addInvoicesForm.disabledNext"
              :class="{ disabled: addInvoicesForm.disabledNext }"
              @click="addInvoices"
              >完成
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DataOrder",
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
      // 禁用“重新发送”按钮
      disableResend: false,
      // 发票信息
      invoiceInfo: {
        dialog: false,
        loading: false,
        tradeTime: "",
        orderId: "",
        type: 0,
        content: 0,
        info: {
          id: null
        },
        recipient: {
          name: "",
          address: "",
          phone: ""
        },
        desc: ""
      },
      // 新增开票信息
      addInvoicesForm: {
        dialog: false,
        loading: false,
        department: "",
        creditCode: "",
        addr: "",
        phone: "",
        accountBank: "",
        cardNum: "",
        disabledNext: true
      },
      // 新增开票信息校验规则
      addInvoicesRules: {
        department: [
          { required: true, message: "请输入单位名称", trigger: "change" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "change"
          }
        ],
        creditCode: [
          { required: true, message: "请输入开票税号", trigger: "change" },
          {
            min: 15,
            max: 20,
            message: "长度在 15 到 20 个字符",
            trigger: "change"
          }
        ],
        addr: [
          { required: false, message: "请输入单位地址", trigger: "change" },
          {
            min: 5,
            max: 100,
            message: "长度在 5 到 100 个字符",
            trigger: "change"
          }
        ],
        phone: [
          { required: false, message: "请输入单位电话", trigger: "change" },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "change"
          }
        ],
        accountBank: [
          { required: false, message: "请输入开户银行", trigger: "change" },
          {
            min: 5,
            max: 100,
            message: "长度在 5 到 100 个字符",
            trigger: "change"
          }
        ],
        cardNum: [
          { required: false, message: "请输入银行账号", trigger: "change" },
          {
            min: 15,
            max: 25,
            message: "长度在 15 到 25 个字符",
            trigger: "change"
          }
        ]
      },
      timeout: null,
      // 禁用“提交”按钮
      disableSubmit: true,
      // 排序方法（0按下单时间降序，1按下单时间升序，2按开票状态降序，3按开票状态升序）
      sortType: 0
    };
  },
  methods: {
    // 获取开票信息
    getUserInfo() {
      this.invoiceInfo.loading = true;
      this.$http
        .get(process.env.API_ROOT + "/market/userInfo", {
          params: {
            time: new Date().getTime()
          },
          headers: {
            token: this.userInfo.token
          }
        })
        .then(data => {
          let res = data.data;
          // 获取失败，根据message返回信息
          if (res.status === 0) {
            this.userInfo.invoices = res.data.invoices;
            if (this.userInfo.invoices && this.userInfo.invoices.length > 0)
              this.invoiceInfo.info = JSON.parse(
                JSON.stringify(this.userInfo.invoices[0])
              );
            else
              this.invoiceInfo.info = {
                id: null
              };
            this.isDisabledSubmit();
            this.$store.commit("setUserInfo", this.userInfo);
          }
        })
        .catch(() => {
          this.$message.error("页面加载失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.invoiceInfo.loading = false;
        });
    },
    // 获取订单列表
    getOrderList() {
      this.loading = true;
      this.orderList = [];
      this.$http
        .post(
          process.env.API_ROOT + "/market/orderQuery",
          {
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
          // 获取失败，根据 message 返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("订单列表获取失败，" + res.message);
          }
          // 获取成功，处理数据
          else {
            if (res.data && res.data.length > 0)
              res.data.forEach(a => {
                let end =
                  new Date(a.tradeTime).getTime() + 30 * 24 * 60 * 60 * 1000;
                let now = new Date().getTime();
                if (now >= end) {
                  a.residualMaturity = "0天";
                  a.disableResend = true;
                  a.flag = true;
                } else {
                  let day = Math.floor((end - now) / (24 * 60 * 60 * 1000));
                  let hour = Math.floor(
                    ((end - now) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
                  );
                  a.residualMaturity = day + "天" + hour + "小时";
                  a.disableResend = false;
                  a.flag = false;
                }
                a.interval = null;
                a.countDown = 0;
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
    // 申请数据清单
    issueAnList(order) {
      if (order.listStatus === 0) {
        this.$confirm("该操作将提交数据清单申请，是否继续？", "申请数据清单", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.loading = true;
            this.$http
              .post(
                process.env.API_ROOT + "/market/listOut",
                {
                  orderId: order.orderId,
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
                // 提交失败，根据 status 输出提示信息
                if (res.status !== 0) {
                  if (!res.message) res.message = "服务器错误，请稍后再试！";
                  this.$message.error("申请提交失败，" + res.message);
                }
                // 提交成功
                else {
                  this.$message.success("提交成功，请耐心等待客服处理！");
                  this.orderList.some(item => {
                    if (item.orderId === order.orderId) {
                      item.listStatus = 1;
                      return true;
                    }
                  });
                }
              })
              .catch(() => {
                this.$message.error("申请提交失败，服务器错误，请稍后再试！");
              })
              .finally(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      } else if (order.listStatus === 1) {
        this.$confirm(
          "预计将在三个工作日内完成，请耐心等待。",
          "数据清单正在审核中！",
          {
            confirmButtonText: "确定",
            showCancelButton: false
          }
        )
          .then(() => {})
          .catch(() => {});
      } else if (order.listStatus === 2) {
        const h = this.$createElement;
        this.$msgbox({
          title: "数据清单已开具！",
          message: h(
            "div",
            {
              style: "color: #0e68b4; text-decoration: underline"
            },
            [
              h(
                "span",
                {
                  style: "cursor: pointer",
                  class: "not-selected",
                  on: {
                    click: () => {
                      window.open(order.listUrl);
                      this.$msgbox.close();
                    }
                  }
                },
                "下载数据清单"
              )
            ]
          ),
          confirmButtonText: "确定"
        })
          .then(() => {})
          .catch(() => {});
      }
    },
    // 开具发票
    issueAnInvoice(order) {
      if (order.invoiceStatus === 0) {
        this.invoiceInfo = {
          dialog: true,
          loading: false,
          tradeTime: order.tradeTime,
          orderId: order.orderId,
          type: 0,
          content: 0,
          info: {
            id: null
          },
          recipient: {
            name: "",
            address: "",
            phone: ""
          },
          desc: ""
        };
        if (this.userInfo.invoices && this.userInfo.invoices.length > 0)
          this.invoiceInfo.info = JSON.parse(
            JSON.stringify(this.userInfo.invoices[0])
          );
        this.isDisabledSubmit();
      } else if (order.invoiceStatus === 1) {
        this.$confirm(
          "预计将在三个工作日内完成，请耐心等待。",
          "增值税普通发票（电子版）正在开具中！",
          {
            confirmButtonText: "确定",
            showCancelButton: false
          }
        )
          .then(() => {})
          .catch(() => {});
      } else if (order.invoiceStatus === 2) {
        this.$confirm(
          "预计将在三个工作日内完成，请耐心等待。",
          "增值税专用发票（纸质版）正在开具中！",
          {
            confirmButtonText: "确定",
            showCancelButton: false
          }
        )
          .then(() => {})
          .catch(() => {});
      } else if (order.invoiceStatus === 3) {
        const h = this.$createElement;
        this.$msgbox({
          title: "增值税普通发票（电子版）已开具！",
          message: h(
            "div",
            {
              style: "color: #0e68b4; text-decoration: underline"
            },
            [
              h(
                "span",
                {
                  style: "cursor: pointer; margin-right: 30px",
                  class: "not-selected",
                  on: {
                    click: () => {
                      window.open(order.invoiceUrl);
                      this.$msgbox.close();
                    }
                  }
                },
                "下载发票文件"
              ),
              h(
                "span",
                {
                  style: "cursor: pointer",
                  class: "not-selected",
                  on: {
                    click: () => {
                      this.$msgbox.close();
                      this.loading = true;
                      this.$http
                        .post(
                          process.env.API_ROOT + "/market/invoiceSend",
                          {
                            time: new Date().getTime(),
                            orderId: order.orderId
                          },
                          {
                            headers: {
                              token: this.userInfo.token
                            }
                          }
                        )
                        .then(data => {
                          let res = data.data;
                          // 发送失败，根据 status 输出提示信息
                          if (res.status !== 0) {
                            if (!res.message)
                              res.message = "服务器错误，请稍后再试！";
                            this.$message.error("发送失败，" + res.message);
                          }
                          // 发送成功
                          else {
                            this.$message.success("发送成功");
                          }
                        })
                        .catch(() => {
                          this.$message.error(
                            "发送失败，服务器错误，请稍后再试！"
                          );
                        })
                        .finally(() => {
                          this.loading = false;
                        });
                    }
                  }
                },
                "发送到我的邮箱"
              )
            ]
          ),
          confirmButtonText: "确定"
        })
          .then(() => {})
          .catch(() => {});
      } else if (order.invoiceStatus === 4) {
        this.$confirm(
          "物流单号为：" + order.invoiceExpress + "。",
          "增值税专用发票（纸质版）已寄出！",
          {
            confirmButtonText: "确定",
            showCancelButton: false
          }
        )
          .then(() => {})
          .catch(() => {});
      }
    },
    // 重新发送数据
    resendData(order) {
      if (this.disableResend || order.disableResend) return;
      this.disableResend = true;
      setTimeout(() => {
        this.disableResend = false;
      }, 1000);
      this.loading = true;
      this.$http
        .post(
          process.env.API_ROOT + "/market/tableOut",
          {
            time: new Date().getTime(),
            orderId: order.orderId
          },
          {
            headers: {
              token: this.userInfo.token
            }
          }
        )
        .then(data => {
          let res = data.data;
          // 发送失败，根据 status 输出提示信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("发送失败，" + res.message);
          }
          // 发送成功
          else {
            this.$message.success("发送成功");
            order.disableResend = true;
            order.countDown = 60;
            order.interval = setInterval(() => {
              order.countDown--;
              if (order.countDown <= 0) {
                order.disableResend = false;
                clearInterval(order.interval);
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
    // 是否禁用“提交按钮”
    isDisabledSubmit() {
      let data = this.invoiceInfo;
      if (data.type === 0) this.disableSubmit = data.info.id === null;
      else
        this.disableSubmit = !(
          data.info.id !== null &&
          data.recipient.name &&
          data.recipient.address &&
          data.recipient.phone
        );
    },
    // 删除开票信息
    deleteInvoices(id) {
      this.$confirm("此操作将永久删除该开票信息, 是否继续?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.invoiceInfo.loading = true;
          this.$http
            .post(
              process.env.API_ROOT + "/market/invoiceDelete",
              {
                id: id,
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
              // 删除失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("删除失败，" + res.message);
              }
              // 删除成功
              else {
                this.$message.success("删除成功");
                this.getUserInfo();
              }
            })
            .catch(() => {
              this.$message.error("删除失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.invoiceInfo.loading = true;
            });
        })
        .catch(() => {});
    },
    // 限制输入
    limitInput(val) {
      if (val === 0) {
        let value = this.addInvoicesForm.creditCode;
        // 将非数字和字母的字符替换成空
        value = value.replace(/[^\da-zA-Z]/g, "");
        // 将小写字母替换为大写字母
        value = value.toLocaleUpperCase();
        this.$set(this.addInvoicesForm, "creditCode", value.toString());
        this.isDisable();
      } else if (val === 1) {
        let value = this.addInvoicesForm.phone;
        // 将非数字和"-"的字符替换成空
        value = value.replace(/[^\d\-]/g, "");
        this.$set(this.addInvoicesForm, "phone", value.toString());
        this.isDisable();
      } else if (val === 2) {
        let value = this.addInvoicesForm.cardNum;
        // 将非数字的字符替换成空
        value = value.replace(/[^\d]/g, "");
        this.$set(this.addInvoicesForm, "cardNum", value.toString());
        this.isDisable();
      } else if (val === 3) {
        let value = this.invoiceInfo.recipient.phone;
        // 将非数字和"-"的字符替换成空
        value = value.replace(/[^\d\-]/g, "");
        this.$set(this.invoiceInfo.recipient, "phone", value.toString());
        this.isDisabledSubmit();
      }
    },
    // 打开新增开票信息对话框
    openAddInvoices() {
      if (this.userInfo.invoices && this.userInfo.invoices.length === 5) {
        this.$message.warning("最多可设置 5 个开票信息！");
        return;
      }
      this.addInvoicesForm = {
        dialog: true,
        loading: false,
        department: "",
        creditCode: "",
        addr: "",
        phone: "",
        accountBank: "",
        cardNum: "",
        disabledNext: true
      };
      const ref = this.$refs.addInvoices;
      if (ref) ref.resetFields();
    },
    // 根据输入查询企业单位列表
    queryDepartmentList(keyword, callback) {
      return callback([]);
      clearTimeout(this.timeout);
      this.$http
        .get("/yongyou/apis/dst/enterpriseTicketQuery/enterpriseSearchByName", {
          params: {
            keyword,
            pageNum: 1,
            size: 1000
          },
          headers: {
            authoration: "apicode",
            apicode: "675d7b1be3ae4fd5836ace0baf7dc73a"
          }
        })
        .then(data => {
          const res = data.data;
          if (!res.success || !res.data.items || res.data.items.length === 0)
            throw new Error();
          let time = 500 - res.data.searchtime * 1000;
          time = time > 0 ? time : 0;
          this.timeout = setTimeout(() => {
            callback(res.data.items);
          }, time);
        })
        .catch(() => {
          callback([]);
        });
    },
    // 选中企业名称
    handleSelect(item) {
      // 根据企业id查询信息
      this.$http
        .get("/yongyou/apis/dst/enterpriseTicketQuery/enterpriseTicketInfo", {
          params: {
            id: item.companyid
          },
          headers: {
            authoration: "apicode",
            apicode: "675d7b1be3ae4fd5836ace0baf7dc73a"
          }
        })
        .then(data => {
          const res = data.data;
          if (res.code === "200") {
            this.addInvoicesForm.creditCode = res.TAXNUMBER;
            this.addInvoicesForm.addr = res.OPLOC;
          }
        })
        .catch(() => {});
    },
    // 是否禁用“新增”按钮
    isDisable() {
      let data = this.addInvoicesForm;
      data.disabledNext = !(
        data.department.length > 1 &&
        data.creditCode.length > 14 &&
        (!data.addr || data.addr.length > 4) &&
        (!data.phone || data.phone.length > 4) &&
        (!data.accountBank || data.accountBank.length > 4) &&
        (!data.cardNum || data.cardNum.length > 14)
      );
    },
    // 新增开票信息
    addInvoices() {
      if (this.addInvoicesForm.disabledNext) return;
      this.addInvoicesForm.loading = true;
      this.addInvoicesForm.time = new Date().getTime();
      this.$http
        .post(
          process.env.API_ROOT + "/market/invoiceAdd",
          this.addInvoicesForm,
          {
            headers: {
              token: this.userInfo.token
            }
          }
        )
        .then(data => {
          let res = data.data;
          // 新增失败，根据 status 输出提示信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("新增失败，" + res.message);
          }
          // 新增成功
          else {
            this.addInvoicesForm.dialog = false;
            this.$message.success("新增成功");
            this.getUserInfo();
          }
        })
        .catch(() => {
          this.$message.error("新增失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.addInvoicesForm.loading = false;
        });
    },
    // 提交开票申请
    submitInvoice() {
      if (this.disableSubmit) return;
      let data = {
        time: new Date().getTime(),
        orderId: this.invoiceInfo.orderId,
        invoiceType: this.invoiceInfo.type,
        invoiceContent: this.invoiceInfo.content,
        department: this.invoiceInfo.info.department,
        creditCode: this.invoiceInfo.info.credit_code,
        addr: this.invoiceInfo.info.addr,
        phone: this.invoiceInfo.info.phone,
        accountBank: this.invoiceInfo.info.account_bank,
        cardNum: this.invoiceInfo.info.card_num,
        desc: this.invoiceInfo.desc
      };
      if (data.invoiceType === 1) {
        data.recipientName = this.invoiceInfo.recipient.name;
        data.recipientAddress = this.invoiceInfo.recipient.address;
        data.recipientPhone = this.invoiceInfo.recipient.phone;
      }
      // 调用接口
      this.invoiceInfo.loading = true;
      this.$http
        .post(process.env.API_ROOT + "/market/invoiceOut", data, {
          headers: {
            token: this.userInfo.token
          }
        })
        .then(response => {
          let res = response.data;
          // 提交失败，根据 status 输出提示信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("申请提交失败，" + res.message);
          }
          // 新增成功
          else {
            this.invoiceInfo.dialog = false;
            this.$message.success("提交成功，请耐心等待客服处理！");
            this.orderList.some(item => {
              if (item.orderId === data.orderId) {
                item.invoiceStatus = data.invoiceType + 1;
                return true;
              }
            });
          }
        })
        .catch(() => {
          this.$message.error("申请提交失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.invoiceInfo.loading = false;
        });
    },
    // 为订单列表排序
    sortOrderList(val) {
      if (val === 0) {
        if (this.sortType === 0) this.sortType = 1;
        else this.sortType = 0;
      } else {
        if (this.sortType === 2) this.sortType = 3;
        else this.sortType = 2;
      }
      // 根据sortType为订单列表排序
      switch (this.sortType) {
        case 0:
          this.orderList.sort((a, b) => b.tradeTime.localeCompare(a.tradeTime));
          break;
        case 1:
          this.orderList.sort((a, b) => a.tradeTime.localeCompare(b.tradeTime));
          break;
        case 2:
          this.orderList.sort((a, b) => b.invoiceStatus - a.invoiceStatus);
          break;
        case 3:
          this.orderList.sort((a, b) => a.invoiceStatus - b.invoiceStatus);
          break;
      }
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
        if (item.tradeTime.includes(val) || item.orderId.includes(val))
          return true;
        else if (item.list && item.list.length > 0) {
          let flag = false;
          flag = item.list.some(a => {
            if (
              a.database.includes(val) ||
              a.b_database.includes(val) ||
              a.part.includes(val)
            )
              return true;
            else if (a.table && a.table.length > 0)
              return a.table.some(b => {
                if (b.name.includes(val)) return true;
              });
          });
          return flag;
        } else return false;
      });
    }
  }
};
</script>

<style lang="scss">
.data-order {
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

        > span.active_sort {
          color: #0e68b4;
        }
      }
    }

    .el-main {
      padding: 0;

      .order_item {
        color: black;
        margin-bottom: 20px;

        .el-card__header {
          box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
          font-size: 20px;
          font-weight: 700;
        }

        .card_body {
          padding: 0 10px;

          .table_header {
            font-weight: 700;
            color: #5f6388;
            font-family: "黑体", "Microsoft YaHei", "serif";
          }

          .database {
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
                  font-weight: 400;
                  font-size: 14px;
                  color: #666666;
                  text-decoration: line-through;
                }
              }
            }
          }

          .table_button {
            margin: 20px 120px 10px;
            text-align: right;

            .el-button {
              border-radius: 15px;
              margin-right: 30px;
              padding: 10px 20px;
              border: 1px solid #0e68b4;
            }

            .green_button {
              color: #69c242;
              background: white;
              border-color: #69c242;
            }

            .white_button {
              color: #0e68b4;
              background: white;
            }

            .blue_button {
              color: white;
              background: #0e68b4;
              width: 120px;
            }

            .green_button:hover {
              background: #f0f9eb;
            }

            .white_button:hover {
              background: #ecf5ff;
            }

            .blue_button:hover {
              background: #0e80cc;
            }

            .blue_button.disable_button,
            .blue_button.disable_button:hover {
              background: #5097cb;
              border-color: #5097cb;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
}

.issue_an_invoice {
  height: 100%;
  min-height: 600px;
  margin: 0 auto;
  border-radius: 10px;
  position: relative;

  .el-dialog__header {
    .el-dialog__title {
      font-size: 22px;
      color: black;
    }

    .el-dialog__close:before {
      font-size: 30px;
      font-weight: 700;
      color: #222222;
    }
  }

  .el-dialog__body {
    position: absolute;
    top: 54px;
    left: 0;
    right: 0;
    bottom: 70px;
    padding: 15px 30px;
    font-size: 16px;
    color: black;

    .invoice_info {
      font-weight: 700;
      margin: 10px;

      > span {
        font-weight: 400;
      }
    }

    .invoice_hint {
      color: #979797;
      margin: 20px 10px;
      line-height: 1.6;

      > span {
        font-weight: bold;
      }
    }

    .invoice_card_0,
    .invoice_card_1,
    .invoice_card_2 {
      margin-bottom: 15px;
      border-color: #d9d9d9;

      .el-card__header {
        background: #e7ebec;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        font-weight: 400;
        font-size: 14px;
        color: #979797;
        padding: 8px 10px;
      }

      .el-card__body {
        padding: 10px 20px;

        .el-radio {
          .el-radio__input {
            position: relative;
            top: -3px;

            .el-radio__inner {
              border-color: black;
            }
          }

          .el-radio__label {
            color: black;
            font-size: 16px;
            display: inline-block;
            max-width: 310px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .el-radio.is-checked {
          .el-radio__input {
            .el-radio__inner {
              border-color: #409eff;
              background: #409eff;
            }
          }
        }

        .text_button {
          color: #5051f9;
          font-size: 16px;
          padding: 2px 0 0 0;
        }

        .el-empty {
          padding: 0;

          .el-empty__description {
            margin: 10px;
          }
        }
      }
    }

    .invoice_form {
      clear: both;
      margin-left: 10px;

      .el-form {
        .el-form-item {
          margin-bottom: 8px;

          .el-form-item__label {
            font-size: 16px;
            color: black;
            text-align: left;
          }

          .el-form-item__content {
            width: 50%;

            textarea {
              min-height: 51px !important;
              max-height: 100px;
            }
          }
        }
      }
    }
  }

  .el-dialog__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .el-button {
      border-radius: 10px;
      margin-right: 20px;
      border: 1px solid #0e68b4;
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

    .blue_button.disable_button,
    .blue_button.disable_button:hover {
      background: #5097cb;
      border-color: #5097cb;
      cursor: not-allowed;
    }
  }
}

.order_add_invoices {
  margin: 0 auto;
  height: 550px;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .el-dialog__header {
    .el-dialog__title {
      font-size: 22px;
      color: black;
    }

    .el-dialog__close:before {
      font-size: 30px;
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

    .body {
      height: 100%;
      text-align: center;

      .add_invoices {
        display: inline-block;
        text-align: left;

        > div {
          margin: 15px 0;
        }

        .next_button {
          text-align: center;

          .el-button {
            background: #0e68b4;
            color: white;
            border-radius: 12px;
            border: 2px solid #0e68b4;
          }

          /* 被禁用按钮 */
          .el-button.disabled,
          .el-button.disabled:focus {
            background: #5097cb;
            color: white;
            border: 2px solid #5097cb;
            cursor: not-allowed;
          }
        }

        .el-form {
          .el-form-item {
            .el-form-item__label {
              text-align: right;
              padding: 0;
            }
          }
        }

        .el-input {
          width: 300px;
        }
      }
    }
  }
}
</style>
