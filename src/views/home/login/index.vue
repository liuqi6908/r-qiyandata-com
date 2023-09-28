<template>
  <!-- 登录页面 -->
  <div class="login not-selected">
    <!-- 页头 -->
    <el-page-header
      @back="goBack"
      class="go_back"
      content="个人用户登录"
    ></el-page-header>
    <!-- 主要内容 -->
    <el-card class="card_container">
      <!-- 左侧图片和标题 -->
      <div class="image_title">
        <div>
          <span>企研·社科大数据平台</span>
        </div>
      </div>
      <!-- 登录表单 -->
      <div class="login_form" v-loading="loading">
        <el-tabs v-model="activeName" @tab-click="changeRegister">
          <!-- 登录 -->
          <el-tab-pane label="登录" name="login">
            <!-- 密码、验证码登录 -->
            <div v-if="loginType !== 2">
              <!-- 密码登录 -->
              <div v-if="loginType === 0">
                <span class="change_type" @click="changeLoginType(1)"
                  ><i class="el-icon-sort" />点击切换手机验证码登录</span
                >
                <br />
                <el-form
                  ref="loginForm"
                  class="password_login"
                  :model="loginForm"
                  :rules="loginRules"
                  :hide-required-asterisk="true"
                  label-position="top"
                >
                  <el-form-item prop="phone" label="手机号">
                    <el-input
                      type="text"
                      autofocus
                      placeholder="请输入您的手机号"
                      v-model.number.trim="loginForm.phone"
                      maxlength="11"
                      show-word-limit
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password" label="密码">
                    <el-input
                      type="password"
                      placeholder="请输入密码"
                      show-password
                      @keydown.enter.native="login"
                      v-model.trim="loginForm.password"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="authCode" label="验证码">
                    <div style="display: flex; align-items: center">
                      <el-input
                        style="width: 290px; margin-right: 20px"
                        placeholder="请输入验证码"
                        @keydown.enter.native="login"
                        v-model.trim="loginForm.authCode"
                        maxlength="4"
                        show-word-limit
                        onkeyup="value=value.replace(/[^\d\w]/g,'')"
                      >
                      </el-input>
                      <el-image
                        style="width: 130px; height: 40px"
                        :src="authCodeImg"
                        @click="getAuthCode"
                      ></el-image>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <!-- 验证码登录 -->
              <div v-if="loginType === 1">
                <span class="change_type" @click="changeLoginType(0)"
                  ><i class="el-icon-sort" />点击切换密码登录</span
                >
                <br />
                <el-form
                  ref="loginForm"
                  :model="loginForm"
                  :rules="loginRules"
                  :hide-required-asterisk="true"
                >
                  <el-form-item prop="phone" label="手机号">
                    <div class="w-full row gap-2">
                      <el-input
                        type="text"
                        autofocus
                        placeholder="请输入您的手机号"
                        v-model.number.trim="loginForm.phone"
                        maxlength="11"
                        show-word-limit
                      />
                      <el-button
                        style="width: 112px"
                        :disabled="loginForm.disabled"
                        @click="sendVerificationCode"
                        :class="{
                          disabled_button: loginForm.disabled,
                          no_disabled_button: !loginForm.disabled
                        }"
                      >
                        {{ loginForm.sendVerification }}
                      </el-button>
                    </div>
                  </el-form-item>
                </el-form>
                <div
                  v-if="loginForm.show"
                  style="position: relative; top: 8px; margin-bottom: 20px"
                >
                  <span style="font-size: 14px; color: #606266">验证码：</span>
                  <span class="send_verify"
                    >已发送至<span>{{ loginForm.tempPhone }}</span></span
                  >
                  <div class="code_vessel" align="center">
                    <div class="code_frame">
                      <input
                        class="code_input char1"
                        data-index="0"
                        maxlength="1"
                        @blur="inputVerificationCode"
                      />
                    </div>
                    <div class="code_frame">
                      <input
                        class="code_input char2"
                        data-index="1"
                        maxlength="1"
                        @blur="inputVerificationCode"
                      />
                    </div>
                    <div class="code_frame">
                      <input
                        class="code_input char3"
                        data-index="2"
                        maxlength="1"
                        @blur="inputVerificationCode"
                      />
                    </div>
                    <div class="code_frame">
                      <input
                        class="code_input char4"
                        data-index="3"
                        maxlength="1"
                        @blur="inputVerificationCode"
                      />
                    </div>
                    <div class="code_frame">
                      <input
                        class="code_input char5"
                        data-index="4"
                        maxlength="1"
                        @blur="inputVerificationCode"
                      />
                    </div>
                    <div class="code_frame">
                      <input
                        class="code_input char6"
                        data-index="5"
                        maxlength="1"
                        @blur="inputVerificationCode"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 登录按钮 -->
              <el-button
                class="blue_button"
                :disabled="disabledLogin"
                :class="{ 'is-disabled': disabledLogin }"
                @click="login"
              >
                登录
              </el-button>
            </div>
            <!-- 验证码登录 -->
            <div v-else v-loading="loadingImg" style="height: 100%">
              <span class="change_type" @click="changeLoginType(0)"
                ><i class="el-icon-sort" />点击切换密码登录</span
              >
              <!-- 验证码登录 -->
              <div class="wechat_login">
                <div style="margin: auto; position: relative; top: -50px">
                  该功能正在紧急开发中，敬请期待！
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 注册 -->
          <el-tab-pane label="注册" name="register">
            <br />
            <el-form
              ref="registerForm"
              :model="registerForm"
              :rules="registerRules"
              :hide-required-asterisk="true"
            >
              <el-form-item prop="userName" label="用户名">
                <el-input
                  type="text"
                  placeholder="请输入用户名"
                  v-model.trim="registerForm.userName"
                  :maxlength="20"
                >
                </el-input>
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <el-input
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  v-model.trim="registerForm.password"
                  :maxlength="20"
                  onkeyup="value=value.replace(/[\s]/g,'')"
                >
                </el-input>
              </el-form-item>
              <el-form-item prop="repeatPassword" label="确认密码">
                <el-input
                  type="password"
                  placeholder="请确认密码"
                  show-password
                  v-model.trim="registerForm.repeatPassword"
                  :maxlength="20"
                  onkeyup="value=value.replace(/[\s]/g,'')"
                >
                </el-input>
              </el-form-item>
              <el-form-item prop="phone" label="手机号">
                <div class="w-full row gap-2">
                  <el-input
                    type="text"
                    placeholder="请输入手机号"
                    v-model.number.trim="registerForm.phone"
                    maxlength="11"
                    show-word-limit
                  />
                   <el-button
                    style="width: 112px"
                    :disabled="registerForm.disabled"
                    @click="sendVerificationCode"
                    :class="{
                      disabled_button: registerForm.disabled,
                      no_disabled_button: !registerForm.disabled
                    }"
                  >
                    {{ registerForm.sendVerification }}
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
            <div
              v-if="registerForm.show"
              style="position: relative; top: 8px; margin-bottom: 20px"
            >
              <span style="font-size: 14px; color: #606266">验证码：</span>
              <span class="send_verify"
                >已发送至<span>{{ registerForm.tempPhone }}</span></span
              >
              <div class="code_vessel" align="center">
                <div class="code_frame">
                  <input
                    class="code_input char1"
                    data-index="0"
                    maxlength="1"
                    @blur="inputVerificationCode"
                  />
                </div>
                <div class="code_frame">
                  <input
                    class="code_input char2"
                    data-index="1"
                    maxlength="1"
                    @blur="inputVerificationCode"
                  />
                </div>
                <div class="code_frame">
                  <input
                    class="code_input char3"
                    data-index="2"
                    maxlength="1"
                    @blur="inputVerificationCode"
                  />
                </div>
                <div class="code_frame">
                  <input
                    class="code_input char4"
                    data-index="3"
                    maxlength="1"
                    @blur="inputVerificationCode"
                  />
                </div>
                <div class="code_frame">
                  <input
                    class="code_input char5"
                    data-index="4"
                    maxlength="1"
                    @blur="inputVerificationCode"
                  />
                </div>
                <div class="code_frame">
                  <input
                    class="code_input char6"
                    data-index="5"
                    maxlength="1"
                    @blur="inputVerificationCode"
                  />
                </div>
              </div>
            </div>
            <!-- 注册按钮 -->
            <el-button
              class="blue_button"
              :disabled="disabledRegister"
              :class="{ 'is-disabled': disabledRegister }"
              @click="register"
            >
              注册
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import { code_input } from "../../../../static/verification.js";
import Base64 from "base-64";

export default {
  name: "Login",
  data() {
    // 校验手机号
    let checkPhone = (rule, value, callback) => {
      let flag = false;
      if (!value) {
        callback(new Error("请输入手机号"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字"));
      } else if (value.toString().length < 11) {
        callback(new Error("请输入11位手机号"));
      } else {
        flag = true;
        callback();
      }
      if (this.activeName === "login") {
        if (flag) {
          this.loginForm.isPhone = true;
          this.loginForm.disabled = this.loginForm.interval !== null;
          if (this.loginType) this.disabledLogin = !this.checkCode();
          else
            this.disabledLogin = !(
              this.loginForm.password && this.loginForm.isCode
            );
        } else {
          this.loginForm.isPhone = false;
          this.loginForm.disabled = true;
          this.disabledLogin = true;
        }
      } else {
        if (flag) {
          this.registerForm.isPhone = true;
          this.registerForm.disabled = this.registerForm.interval !== null;
          this.disabledRegister = !(
            this.checkCode() &&
            this.registerForm.userName &&
            this.registerForm.password.length >= 8 &&
            this.registerForm.isPassword &&
            this.registerForm.password === this.registerForm.repeatPassword
          );
        } else {
          this.registerForm.isPhone = false;
          this.registerForm.disabled = true;
          this.disabledRegister = true;
        }
      }
    };
    // 校验验证码
    let checkCode = (rule, value, callback) => {
      let flag = false;
      if (!value) {
        callback(new Error("请输入验证码"));
      } else if (value.toString().length < 4) {
        callback(new Error("请输入4位验证码"));
      } else {
        flag = true;
        callback();
      }
      if (flag) {
        this.loginForm.isCode = true;
        this.disabledLogin = !(
          this.loginForm.isPhone && this.loginForm.password
        );
      } else {
        this.loginForm.isCode = false;
        this.disabledLogin = true;
      }
    };
    // 校验用户名
    let checkUserName = (rule, value, callback) => {
      if (!value) {
        this.disabledRegister = true;
        return callback(new Error("请输入用户名"));
      } else {
        this.disabledRegister = !(
          this.checkCode() &&
          this.registerForm.isPhone &&
          this.registerForm.password.length >= 8 &&
          this.registerForm.isPassword &&
          this.registerForm.password === this.registerForm.repeatPassword
        );
        callback();
      }
    };
    // 校验密码
    let checkPwd = (rule, value, callback) => {
      if (!value) {
        if (this.activeName === "login") this.disabledLogin = true;
        else {
          this.registerForm.isPassword = false;
          this.disabledRegister = true;
        }
        callback(new Error("请输入密码"));
      } else {
        if (this.activeName === "login")
          this.disabledLogin = !(
            this.loginForm.isPhone && this.loginForm.isCode
          );
        else {
          let isLetter = false;
          let isNumber = false;
          let isChar = false;
          for (let i = 0; i < value.length; i++) {
            if (
              (value[i] >= "a" && value[i] <= "z") ||
              (value[i] >= "A" && value[i] <= "Z")
            )
              isLetter = true;
            else if (value[i] >= "0" && value[i] <= "9") isNumber = true;
            else isChar = true;
          }
          this.registerForm.isPassword = isLetter && isNumber && isChar;
          if (value.length < 8) {
            this.disabledRegister = true;
            callback(new Error("密码至少8位"));
          } else if (!this.registerForm.isPassword) {
            this.disabledRegister = true;
            callback(new Error("密码至少包含一个字母、一个数字和一个其他字符"));
          } else {
            this.disabledRegister = !(
              this.checkCode() &&
              this.registerForm.isPhone &&
              this.registerForm.userName &&
              this.registerForm.password === this.registerForm.repeatPassword
            );
          }
        }
        callback();
      }
      if (this.registerForm.repeatPassword !== "") {
        this.$refs.registerForm.validateField("repeatPassword");
      }
    };
    // 对重复密码的校验
    let checkRepeatPwd = (rule, value, callback) => {
      if (value === "" || value === null) {
        this.disabledRegister = true;
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        this.disabledRegister = true;
        callback(new Error("两次输入密码不一致!"));
      } else {
        this.disabledRegister = !(
          this.checkCode() &&
          this.registerForm.isPhone &&
          this.registerForm.userName &&
          this.registerForm.password.length >= 8 &&
          this.registerForm.isPassword
        );
        callback();
      }
    };
    return {
      // 页面加载
      loading: false,
      // 登入用户信息
      userInfo: {},
      // 当前活动（登录、注册）
      activeName: "login",

      // 登录方式（0：密码登录，1：验证码登录，2：微信登录）
      loginType: 0,
      authCodeImg: "",
      disableCode: false,
      // 登录表单
      loginForm: {
        phone: "",
        tempPhone: "",
        isPhone: false,
        password: "",
        sendVerification: "获取验证码",
        disabled: true,
        show: false,
        codeList: ["", "", "", "", "", ""],
        code: "",
        // 倒计时
        interval: null,
        authCode: "",
        isCode: false,
        imgCode: ""
      },
      // 登录校验
      loginRules: {
        phone: [{ validator: checkPhone, trigger: "change" }],
        password: [{ validator: checkPwd, trigger: "change" }],
        authCode: [{ validator: checkCode, trigger: "change" }]
      },
      // 禁用登录按钮
      disabledLogin: true,

      // 注册表单
      registerForm: {
        userName: "",
        isPassword: false,
        password: "",
        repeatPassword: "",
        phone: "",
        isPhone: false,
        tempPhone: "",
        sendVerification: "获取验证码",
        disabled: true,
        show: false,
        codeList: ["", "", "", "", "", ""],
        code: "",
        // 倒计时
        interval: null
      },
      // 注册校验
      registerRules: {
        userName: [{ validator: checkUserName, trigger: "change" }],
        password: [{ validator: checkPwd, trigger: "change" }],
        repeatPassword: [{ validator: checkRepeatPwd, trigger: "change" }],
        phone: [{ validator: checkPhone, trigger: "change" }]
      },
      // 禁用注册按钮
      disabledRegister: true,

      // 微信登录
      // 加载二维码
      loadingImg: false
    };
  },
  methods: {
    // 返回首页
    goBack(flag) {
      const params = {};
      if (this.userInfo.newUser && flag) params.activity = true;
      this.$router.push({
        name: "Welcome",
        params
      });
    },
    // 获取验证码
    getAuthCode() {
      if (this.disableCode) return;
      this.disableCode = true;
      setTimeout(() => {
        this.disableCode = false;
      }, 1000);
      this.$http
        .get(process.env.API_ROOT + "/yzm")
        .then(data => {
          let res = data.data;
          // 获取失败，根据message返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("验证码获取失败，" + res.message);
          }
          // 获取成功，整理数据
          else {
            this.authCodeImg = res.data.imgBytes;
            this.loginForm.imgCode = res.data.imgCode;
          }
        })
        .catch(err => {
          if (err.response.status === 503)
            this.$message.error("访问太过频繁，请稍后再试！");
        });
    },
    // 切换登录方式
    changeLoginType(val) {
      this.loginType = val;
      this.loginForm.codeList = ["", "", "", "", "", ""];
      this.loginForm.code = "";
      if (this.loginType)
        this.disabledLogin = !(this.loginForm.isPhone && this.checkCode());
      else
        this.disabledLogin = !(
          this.loginForm.isPhone && this.loginForm.password
        );
    },
    // 切换注册页面
    changeRegister() {
      if (this.activeName === "register") {
        clearInterval(this.registerForm.interval);
        this.registerForm = {
          userName: "",
          password: "",
          repeatPassword: "",
          phone: "",
          isPhone: false,
          tempPhone: "",
          sendVerification: "获取验证码",
          disabled: true,
          show: false,
          codeList: ["", "", "", "", "", ""],
          code: "",
          // 倒计时
          interval: null
        };
        this.$refs.registerForm.resetFields();
      }
      this.disabledRegister = true;
    },
    // 发送验证码
    sendVerificationCode() {
      this.loading = true;
      // 发送登录验证码
      if (this.activeName === "login") {
        this.$http
          .get(process.env.API_ROOT + "/sms", {
            params: { phone: this.loginForm.phone, type: "1" }
          })
          .then(data => {
            let res = data.data;
            // 发送失败，根据 status 输出提示信息
            if (res.status !== 0) {
              if (!res.message) res.message = "服务器错误，请稍后再试！";
              this.$message.error("发送失败，" + res.message);
              this.loginForm.disabled = true;
              this.loginForm.sendVerification = "5秒后重试";
              let i = 4;
              this.loginForm.interval = setInterval(() => {
                this.loginForm.sendVerification = i + "秒后重试";
                if (i === 0) {
                  this.loginForm.sendVerification = "获取验证码";
                  clearInterval(this.loginForm.interval);
                  this.loginForm.interval = null;
                  if (this.$refs.loginForm)
                    this.$refs.loginForm.validateField("phone");
                }
                i--;
              }, 1000);
            }
            // 发送成功
            else {
              this.loginForm.tempPhone = this.loginForm.phone;
              this.loginForm.show = true;
              this.loginForm.bizid = res.data.BizId;
              this.$message.success("已发送验证码到" + this.loginForm.phone);
              if (this.checkCode()) this.disabledLogin = false;
              // 倒计时60秒，禁用“发送验证码”按钮
              this.loginForm.disabled = true;
              this.loginForm.sendVerification = "60秒后重试";
              let i = 59;
              this.loginForm.interval = setInterval(() => {
                this.loginForm.sendVerification = i + "秒后重试";
                if (i === 0) {
                  this.loginForm.sendVerification = "获取验证码";
                  clearInterval(this.loginForm.interval);
                  this.loginForm.interval = null;
                  if (this.$refs.loginForm)
                    this.$refs.loginForm.validateField("phone");
                }
                i--;
              }, 1000);
            }
          })
          .catch(() => {
            this.$message.error("发送失败，服务器错误，请稍后再试！");
            this.loginForm.disabled = true;
            this.loginForm.sendVerification = "5秒后重试";
            let i = 4;
            this.loginForm.interval = setInterval(() => {
              this.loginForm.sendVerification = i + "秒后重试";
              if (i === 0) {
                this.loginForm.sendVerification = "获取验证码";
                clearInterval(this.loginForm.interval);
                this.loginForm.interval = null;
                if (this.$refs.loginForm)
                  this.$refs.loginForm.validateField("phone");
              }
              i--;
            }, 1000);
          })
          .finally(() => {
            this.loading = false;
          });
      }
      // 发送注册验证码
      else {
        this.$http
          .get(process.env.API_ROOT + "/sms", {
            params: { phone: this.registerForm.phone, type: "2" }
          })
          .then(data => {
            let res = data.data;
            // 发送失败，根据 status 输出提示信息
            if (res.status !== 0) {
              if (!res.message) res.message = "服务器错误，请稍后再试！";
              this.$message.error("发送失败，" + res.message);
              this.registerForm.disabled = true;
              this.registerForm.sendVerification = "5秒后重试";
              let i = 4;
              this.registerForm.interval = setInterval(() => {
                this.registerForm.sendVerification = i + "秒后重试";
                if (i === 0) {
                  this.registerForm.sendVerification = "获取验证码";
                  clearInterval(this.registerForm.interval);
                  this.registerForm.interval = null;
                  if (this.$refs.registerForm)
                    this.$refs.registerForm.validateField("phone");
                }
                i--;
              }, 1000);
            }
            // 发送成功
            else {
              this.registerForm.tempPhone = this.registerForm.phone;
              this.registerForm.show = true;
              this.registerForm.bizid = res.data.BizId;
              this.$message.success("已发送验证码到" + this.registerForm.phone);
              if (this.checkCode()) this.disabledRegister = false;
              // 倒计时60秒，禁用“发送验证码”按钮
              this.registerForm.disabled = true;
              this.registerForm.sendVerification = "60秒后重试";
              let i = 59;
              this.registerForm.interval = setInterval(() => {
                this.registerForm.sendVerification = i + "秒后重试";
                if (i === 0) {
                  this.registerForm.sendVerification = "获取验证码";
                  clearInterval(this.registerForm.interval);
                  this.registerForm.interval = null;
                  if (this.$refs.registerForm)
                    this.$refs.registerForm.validateField("phone");
                }
                i--;
              }, 1000);
            }
          })
          .catch(() => {
            this.$message.error("发送失败，服务器错误，请稍后再试！");
            this.registerForm.disabled = true;
            this.registerForm.sendVerification = "5秒后重试";
            let i = 4;
            this.registerForm.interval = setInterval(() => {
              this.registerForm.sendVerification = i + "秒后重试";
              if (i === 0) {
                this.registerForm.sendVerification = "获取验证码";
                clearInterval(this.registerForm.interval);
                this.registerForm.interval = null;
                if (this.$refs.registerForm)
                  this.$refs.registerForm.validateField("phone");
              }
              i--;
            }, 1000);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    // 输入验证码
    inputVerificationCode(val) {
      if (this.activeName === "login") {
        this.loginForm.codeList[val.target.getAttribute("data-index")] =
          val.target.value;
        if (!this.loginForm.show || !this.checkCode()) {
          this.disabledLogin = true;
          return;
        }
        this.disabledLogin = false;
      } else {
        this.registerForm.codeList[val.target.getAttribute("data-index")] =
          val.target.value;
        this.disabledRegister = !(
          this.checkCode() &&
          this.registerForm.isPhone &&
          this.registerForm.userName &&
          this.registerForm.password.length >= 8 &&
          this.registerForm.isPassword &&
          this.registerForm.password === this.registerForm.repeatPassword
        );
      }
    },
    // 校验验证码
    checkCode() {
      if (this.activeName === "login") {
        for (let i = 0; i < 6; i++) {
          if (this.loginForm.codeList[i] == "0") continue;
          if (!this.loginForm.codeList[i]) {
            return false;
          }
        }
        return true;
      } else {
        for (let i = 0; i < 6; i++) {
          if (this.registerForm.codeList[i] == "0") continue;
          if (!this.registerForm.codeList[i]) {
            return false;
          }
        }
        return true;
      }
    },
    // 登录
    login() {
      if (this.disabledLogin && this.disabledRegister) return;
      if (this.loading) return;
      this.loading = true;

      // 账号登录
      if (this.loginType === 0) {
        let data = {
          phone: this.loginForm.phone,
          password: this.loginForm.password,
          code: this.loginForm.authCode,
          imgCode: this.loginForm.imgCode
        };
        data.password = Base64.encode(data.password);
        this.$http
          .post(process.env.API_ROOT + "/user/loginAccount", data)
          .then(data => {
            this.processingLoginResults(data);
          })
          .catch(() => {
            this.$message.error("登录失败，服务器错误，请稍后再试！");
            this.loginForm.authCode = "";
            this.getAuthCode();
          })
          .finally(() => {
            this.loading = false;
          });
      }
      // 验证码登录
      else {
        const elems = document.getElementsByClassName("code_input");
        for (let i = 0; i < elems.length; i++) {
          let val = Number.parseInt(elems[i].value);
          if (val >= 0 && val <= 9) this.loginForm.codeList[i] = elems[i].value;
          else {
            return this.$message.error("请输入六位数字验证码！");
          }
        }
        this.loginForm.code = this.loginForm.codeList.join("");

        this.$http
          .post(process.env.API_ROOT + "/user/loginSms", this.loginForm)
          .then(data => {
            this.processingLoginResults(data);
          })
          .catch(() => {
            this.$message.error("登录失败，服务器错误，请稍后再试！");
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    // 注册
    register() {
      if (this.disabledRegister) return;
      const elems = document.getElementsByClassName("code_input");
      for (let i = 0; i < elems.length; i++) {
        let val = Number.parseInt(elems[i].value);
        if (val >= 0 && val <= 9)
          this.registerForm.codeList[i] = elems[i].value;
        else {
          return this.$message.error("请输入六位数字验证码！");
        }
      }
      this.registerForm.code = this.registerForm.codeList.join("");

      this.loading = true;
      // 处理数据
      this.registerForm.name = this.registerForm.userName;
      this.registerForm.pwd = this.registerForm.password;
      let data = JSON.parse(JSON.stringify(this.registerForm));
      data.pwd = Base64.encode(data.pwd);
      data.password = null;
      data.repeatPassword = null;
      this.$http
        .post(process.env.API_ROOT + "/user/regist", data)
        .then(data => {
          let res = data.data;
          // 注册失败，根据 message 输出错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("注册失败，" + res.message);
          }
          // 注册成功，整理数据
          else {
            this.$message({
              showClose: true,
              duration: 2000,
              message: "注册成功",
              type: "success"
            });
            res.data.name = res.data.name || "未命名用户";
            res.data.isVip = false;
            res.data.rz_time = "";
            res.data.newUser = false;
            this.userInfo = res.data;
            this.userInfo.token = res.token;
            this.$store.commit("setUserInfo", this.userInfo);
            // 返回首页
            this.goBack();
          }
        })
        .catch(() => {
          this.$message.error("注册失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * 处理登录结果
     */
    processingLoginResults(res) {
      const { status, message, data, token } = res.data
      // 登录失败，根据 message 返回错误信息
      if (status !== 0) {
        this.$message.error(`登录失败，${message || '服务器错误，请稍后再试！'}`)
        this.loginForm.authCode = ""
        this.getAuthCode()
      }
      // 登录成功，处理数据
      else {
        if (!Array.isArray(data.validity))
          data.validity = []
        data.name = data.name || "未命名用户"
        data.isVip = data.isVip || false
        data.rz_time = data.rz_time || ""
        this.userInfo = data
        this.userInfo.token = token
        this.$store.commit("setUserInfo", this.userInfo)
        if (message.includes("认证过期")) {
          this.$message({
            showClose: true,
            duration: 5000,
            message: "您的身份认证已到期，请重新认证",
            type: "warning"
          });
          this.$router.push('/user_center')
        }
        else {
          this.$message({
            showClose: true,
            duration: 2000,
            message: "登录成功",
            type: "success"
          });
          this.goBack(true);
        }
      }
    },
    // 切换为微信登录
    changeWechatLogin() {
      this.loginType = 2;
    }
  },
  mounted() {
    code_input();
    if (this.$store.getters.getUserInfo.name) this.$router.push("/");
    else this.getAuthCode();
  },
  updated() {
    code_input();
  }
};
</script>

<style scoped>
/* 容器样式 */
.login {
  width: 100%;
  height: 100%;
  padding: 100px 0;
  box-sizing: border-box;
}

.go_back {
  min-width: 300px;
  position: absolute;

  top: 20px;
  left: 40px;
}

.card_container {
  height: 100%;
  width: 1200px;
  margin: auto;
  border-radius: 15px;
}

/* 左侧背景 */
.image_title {
  width: 60%;
  background-image: url(~@/assets/bg/login.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}

.image_title > div {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.3));
}

.image_title > div > span {
  position: absolute;
  left: 50px;
  bottom: 60px;
  font-size: 32px;
  color: white;
}

/* 右侧登录表单 */
.login_form {
  width: 40%;
  padding: 20px 30px;
}

.change_type {
  float: right;
  font-size: 13px;
  color: #0e68b4;
  cursor: pointer;
}

.change_type .el-icon-sort {
  font-weight: 700;
  margin-right: 5px;
  transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  /* IE 9 */
  -webkit-transform: rotate(90deg);
  /* Safari and Chrome */
}

.login .card_container .login_form .disabled_button {
  background: #eef5fb;
  color: #7eb2d9;
}

.login .card_container .login_form .no_disabled_button {
  background: #dfedf7;
  color: #0e68b4;
}

.send_verify {
  float: right;
  font-size: 12px;
  color: #9e9e9e;
}

.send_verify span {
  margin-left: 7px;
  background: #f5f5f5;
  color: #0068b7;
  padding: 5px 10px;
  border-radius: 8px;
}

/* 验证码输入框 */
.code_vessel {
  font-size: 0;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
}

.code_frame {
  margin: 7px 0;
  font-size: 0;
  display: inline-block;
  width: 60px;
  height: 60px;
}

.code_input {
  background-color: rgba(0, 0, 0, 0.05);
  border: 2px solid #ccc;
  border-radius: 8px;
  font-weight: 700;
  color: #8f8f8f;
  font-size: 1.5rem;
  width: 55px;
  height: 55px;
  text-align: center;
  box-shadow: 0 5px 10px 2px rgba(0, 0, 0, 0.1);
}

.code_input:focus {
  outline: 0;
  border: 2px solid #0e68b4;
  color: #0e68b4;
}

.blue_button {
  width: 100%;
  margin-top: 10px;
  background: #0e68b4;
  color: white;
  border-radius: 12px;
  border: 2px solid #0e68b4;
}

/* 被禁用按钮 */
.blue_button.el-button.is-disabled,
.blue_button.el-button.is-disabled:focus {
  background: #5097cb;
  color: white;
  border: 2px solid #5097cb;
}

/* 分割线 */
.login .login_form .el-divider--horizontal {
  margin: 30px 0;
}

.login .login_form .el-divider__text {
  font-size: 12px;
  color: #bdbdbd;
}

/* 微信登录 */
.wechat_button {
  padding: 15px 16px;
  border: none;
  background: #f0f0f0;
  fill: #777777;
}

.wechat_button:hover {
  background: #0e68b4;
  fill: white;
}

.wechat_login {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}

.wechat_login .hint {
  font-size: 17px;
}

.wechat_login .hint .el-image {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 5px;
  margin-bottom: -5px;
}

.wechat_login .title {
  font-size: 22px;
  margin: 20px;
  font-weight: 700;
}
</style>

<style>
/* 卡片样式 */
.card_container .el-card__body {
  height: 100%;
  padding: 0;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-direction: row;
}

.login .login_form .el-tabs {
  height: 100%;
  position: relative;
}

.login .login_form .el-tabs .el-tabs__content {
  position: absolute;
  top: 40px;
  bottom: 0;
  width: 100%;
  overflow: auto;
}

.login .login_form .el-tabs .el-tabs__content::-webkit-scrollbar {
  display: none;
}

.login .login_form .el-tabs .el-tabs__content .el-tab-pane {
  height: 100%;
}

/* 标签页样式 */
.login .card_container .login_form .el-tabs__item {
  font-size: 24px;
  font-weight: 700;
  color: #8d8d8d;
}

.login .card_container .login_form .el-tabs__item.is-active {
  font-size: 32px;
  color: #0e68b4;
}

.login .card_container .login_form .el-tabs__nav-wrap::after {
  content: none;
}

.login .card_container .login_form .el-tabs__active-bar {
  height: 2px;
  background-color: #0e68b4;
}

.login .login_form .password_login .el-form-item__label {
  padding: 0;
}
</style>
