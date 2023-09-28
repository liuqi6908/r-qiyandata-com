<template>
  <!-- 账号设置 -->
  <div class="account" v-loading="loading">
    <!-- 基本信息 -->
    <el-card class="basic_info" v-if="!loading">
      <div slot="header" class="card_header">
        <span>基础信息</span>
      </div>
      <div class="card_body">
        <el-row>
          <el-col class="card_label"> 手机 </el-col>
          <el-col class="icon">
            <i v-if="userInfo.phone" class="el-icon-success success"></i>
            <i v-else class="el-icon-error error"></i>
          </el-col>
          <el-col :span="10" class="content">
            <el-row v-if="userInfo.phone" class="text success">
              {{ userInfo.showPhone }}
            </el-row>
            <el-row v-else class="text error"> 未绑定手机 </el-row>
            <el-row class="hint">
              可用于登录企研·社科大数据平台，并接收订单信息
            </el-row>
          </el-col>
          <el-col class="card_update">
            <el-button
              v-if="userInfo.phone"
              type="text"
              @click="updatePhone.dialog = true"
              >更改绑定</el-button
            >
            <el-button
              v-else
              type="text"
              @click="
                () => {
                  updatePhone.dialog = true;
                  updatePhone.active = 2;
                }
              "
              >绑定手机
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="card_label"> 邮箱 </el-col>
          <el-col class="icon">
            <i v-if="userInfo.email" class="el-icon-success success"></i>
            <i v-else class="el-icon-error error"></i>
          </el-col>
          <el-col :span="10" class="content">
            <el-row v-if="userInfo.email" class="text success">
              {{ userInfo.showEmail }}
            </el-row>
            <el-row v-else class="text error"> 未绑定邮箱 </el-row>
            <el-row class="hint"> 可用接收订单信息 </el-row>
          </el-col>
          <el-col class="card_update">
            <el-button
              v-if="userInfo.email"
              type="text"
              @click="updateEmail.dialog = true"
              >更改绑定</el-button
            >
            <el-button
              v-else
              type="text"
              @click="
                () => {
                  updateEmail.dialog = true;
                  updateEmail.active = 2;
                }
              "
              >绑定邮箱
            </el-button>
          </el-col>
          <el-col class="card_cancel">
            <el-button
              v-if="userInfo.email"
              type="text"
              @click="updateEmail.removeDialog = true"
              >解除绑定</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col class="card_label"> 微信 </el-col>
          <el-col class="icon">
            <i v-if="userInfo.wechatId" class="el-icon-success success"></i>
            <i v-else class="el-icon-error error"></i>
          </el-col>
          <el-col :span="10" class="content">
            <el-row v-if="userInfo.wechatId" class="text success">
              已绑定微信
            </el-row>
            <el-row v-else class="text error"> 未绑定微信 </el-row>
            <el-row class="hint"> 绑定后可使用该微信直接扫码登录 </el-row>
          </el-col>
          <el-col class="card_update">
            <el-button
              v-if="userInfo.wechatId"
              type="text"
              @click="moreOperation"
              >更改绑定</el-button
            >
            <el-button v-else type="text" @click="moreOperation"
              >绑定微信</el-button
            >
          </el-col>
          <el-col class="card_cancel">
            <el-button
              v-if="userInfo.wechatId"
              type="text"
              @click="moreOperation"
              >解除绑定</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col class="card_label"> 密码 </el-col>
          <el-col class="icon">
            <i class="el-icon-success success"></i>
          </el-col>
          <el-col :span="10" class="content">
            <el-row class="text success"> 已设置密码 </el-row>
            <el-row class="hint"> 设置密码以确保账户安全 </el-row>
          </el-col>
          <el-col class="card_update">
            <el-button type="text" @click="openDialog(0)">修改密码</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 个人信息 -->
    <el-card class="personal_info" v-if="!loading">
      <div slot="header" class="card_header">
        <span>个人信息</span>
      </div>
      <div class="card_body">
        <el-row>
          <el-col class="card_label"> 头像 </el-col>
          <el-col :span="10" class="content">
            <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              v-model="updateAvatar.dialog"
              :popper-options="{
                boundariesElement: 'body',
                removeOnDestroy: true
              }"
            >
              <div slot="reference" class="select_avatar">
                <el-avatar :size="48" :src="userInfo.avatarUrl" @error="true">
                  <el-avatar :size="48" v-if="userInfo.name">{{
                    userInfo.name.substring(0, 1)
                  }}</el-avatar>
                </el-avatar>
              </div>
              <div class="avatar_popover" v-loading="updateAvatar.loading">
                <div class="avatar_list">
                  <el-avatar
                    v-for="(item, index) in updateAvatar.list"
                    :size="50"
                    :src="item"
                    :key="index"
                    @click.native="updateUserAvatar(item)"
                  >
                  </el-avatar>
                </div>
                <el-button @click="getAvatar">
                  <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M421.376 481.28s117.248 24.576 175.104-8.704c0 0-89.6 70.144-89.6 166.4 0.512-0.512-8.192-121.344-85.504-157.696zM438.784 969.216s68.608 6.656 68.608-80.896c0 0 3.072 88.576 65.024 78.336 0 0.512-50.688 22.016-133.632 2.56zM161.28 238.08s-30.208 65.536 11.264 91.648c0 0-67.072-17.408-81.408 37.376 0 0 8.704-82.944 70.144-129.024zM857.6 227.328s49.152 50.176 1.024 81.408c0 0 58.88-18.432 66.56 36.352 0 0 5.12-69.632-67.584-117.76z"
                      fill="#ffffff"
                    ></path>
                    <path
                      d="M443.392 970.752c-5.632 0-10.752-1.024-15.36-3.072l-270.848-157.184-1.536-1.024s-1.024-1.024-4.608-2.56c-51.2-29.184-62.976-94.208-65.536-120.832V386.56c0-3.072 0.512-7.168 1.024-11.264l0.512-3.584 1.024-2.56c19.456-50.688 76.8-51.2 103.936-44.032l-1.536 5.632 4.096-6.144L476.16 486.4l18.944 37.888c20.992 36.864 29.184 77.824 32.768 99.84v258.048c-4.608 56.32-36.864 76.288-55.808 82.944-1.024 0.512-15.36 5.632-28.672 5.632z m-262.144-196.096l263.168 152.576c12.288-0.512 36.864-6.656 40.448-48.128v-250.368c-4.608-31.744-20.992-103.936-72.192-128L322.56 445.44l1.536 3.072-142.336-82.432c-2.048-0.512-40.448-9.216-52.736 15.872-0.512 2.56-0.512 4.608-0.512 6.144v294.4c1.536 16.896 9.728 67.072 43.52 86.528 3.584 2.048 6.656 4.096 9.216 5.632z"
                      fill="#ffffff"
                    ></path>
                    <path
                      d="M837.632 212.992c6.656 4.096 12.8 7.168 18.432 10.752l1.536 1.024 1.536 1.536c5.12 4.096 10.752 9.216 16.384 15.36 6.144 11.776 5.632 33.28 4.608 49.152-1.024 12.288-6.656 30.208-26.624 44.544l-1.024 0.512-247.808 156.672c-26.624 14.336-62.976 18.432-96.256 18.432-40.96 0-77.824-6.656-89.088-8.704l-3.072-0.512-245.248-142.336c-39.424-29.696-28.16-85.504-15.36-113.664l2.56-6.144 263.68-166.912c29.184-14.336 104.448-43.008 173.056-1.024 3.584 2.56 58.368 34.304 119.296 69.632M431.616 460.8c40.448 7.168 114.176 13.824 152.576-6.144l244.736-155.136c7.168-5.632 8.192-10.24 8.704-12.8 1.024-11.264-9.728-26.624-15.36-32.768-55.808-32.256-243.712-141.312-250.368-145.408-49.664-30.72-107.008-9.216-130.048 2.56L192.512 268.8c-4.096 12.288-12.288 42.496 3.584 55.808l235.52 136.192z"
                      fill="#ffffff"
                    ></path>
                    <path
                      d="M831.488 299.008c4.096-1.024 38.4-11.264 66.048 6.144 7.168 4.608 17.92 11.776 24.064 24.576 1.024 5.632 4.096 10.752 4.608 16.896v2.048l-1.024 323.072c-5.12 35.328-22.528 91.648-77.312 125.44l-5.12 3.584h-1.024l-262.144 165.888-4.608 0.512c-4.096 0.512-8.704 1.024-12.8 1.024-15.872 0-30.208-5.12-41.984-14.848-24.576-20.48-32.768-55.808-35.328-73.728l-1.024-252.928h1.536c6.144-96.768 88.576-164.864 96.768-171.008l-0.512-0.512L829.44 299.52m-301.056 567.808c0.512 10.24 5.12 41.472 19.968 53.76 3.072 2.56 7.68 5.632 16.384 5.12l264.704-167.936c56.32-38.4 53.76-115.712 53.76-116.224l-0.512-32.256 1.024-250.368h-0.512c-1.536-12.8-7.168-16.384-8.704-17.408-8.704-5.632-23.552-3.072-28.672-2.048l-235.52 148.992c-1.024 0.512-80.896 65.024-80.896 149.504h-1.536l0.512 228.864zM435.2 264.192c0 27.648 31.744 50.176 71.168 50.176s71.168-22.528 71.168-50.176-31.744-50.176-71.168-50.176S435.2 236.544 435.2 264.192z"
                      fill="#ffffff"
                    ></path>
                    <path
                      d="M663.552 782.848c0 30.72-22.528 67.072-49.664 80.384-27.648 13.824-50.176-0.512-50.176-31.232s22.528-67.072 50.176-80.384c27.136-13.824 49.664 0 49.664 31.232zM760.32 602.624c0 30.72-22.528 67.072-49.664 80.384-27.648 13.824-49.664-0.512-49.664-31.232s22.528-67.072 49.664-80.384c27.136-13.824 49.664 0.512 49.664 31.232zM867.84 428.032c0 30.72-22.528 67.072-49.664 80.384-27.648 13.824-50.176-0.512-50.176-31.232s22.528-67.072 50.176-80.384c27.136-13.824 49.664 0 49.664 31.232zM270.848 538.112c0 30.72-22.016 41.984-48.64 24.576-27.136-16.896-48.64-55.808-48.64-86.528 0-30.72 22.016-41.984 48.64-24.576 26.624 16.896 48.64 55.808 48.64 86.528zM432.128 823.296c0 30.72-22.016 41.984-48.64 24.576-26.624-17.408-48.64-55.808-48.64-86.528 0-30.72 22.016-41.984 48.64-24.576 26.624 16.896 48.64 55.808 48.64 86.528z"
                      fill="#ffffff"
                    ></path>
                  </svg>
                  换一换
                </el-button>
              </div>
            </el-popover>
          </el-col>
          <el-col class="card_update">
            <el-upload
              ref="upload"
              :action="'/api/user/uploadImg?time=' + new Date().getTime()"
              :headers="{ token: userInfo.token }"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleSuccess"
              :on-error="handleError"
              :before-upload="beforeUpload"
              :file-list="fileList"
              :limit="1"
            >
              <el-button type="text"> 上传头像 </el-button>
            </el-upload>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="card_label"> 账号名称 </el-col>
          <el-col :span="10" class="content">
            <el-row class="text">
              {{ userInfo.name }}
            </el-row>
          </el-col>
          <el-col class="card_update">
            <el-button
              type="text"
              @click="
                () => {
                  updateName.dialog = true;
                  updateName.name = userInfo.name;
                }
              "
              >修改名称
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="card_label"> 真实姓名 </el-col>
          <el-col :span="10" class="content">
            <el-row class="text">
              {{ userInfo.verifyName }}
            </el-row>
          </el-col>
          <el-col class="card_update">
            <el-button type="text" @click="revocation">重新认证</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="card_label"> 学校名称 </el-col>
          <el-col :span="10" class="content">
            <el-row class="text">
              {{ userInfo.departent }}
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="userInfo.college">
          <el-col class="card_label"> 学院名称 </el-col>
          <el-col :span="10" class="content">
            <el-row class="text">
              {{ userInfo.college }}
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="card_label"> 身份 </el-col>
          <el-col :span="10" class="content">
            <el-row class="text">
              {{ userInfo.identity }}
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="userInfo.validity && userInfo.validity.length">
          <el-col class="card_label"> 有效期 </el-col>
          <el-col :span="10" class="content">
            <el-row class="text">
              {{ userInfo.validity.join(' 至 ') }}
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="card_label" style="height: 70px"> 开票信息 </el-col>
          <el-col style="width: calc(100% - 130px)">
            <el-row v-for="(item, index) in userInfo.invoices" :key="index">
              <el-col style="width: 670px" class="content">
                <el-row class="text" style="margin-bottom: 8px">
                  单位名称：{{ item.department }}
                </el-row>
                <el-row class="text" style="margin-bottom: 8px">
                  开票税号：{{ item.credit_code }}
                </el-row>
                <el-row
                  class="text"
                  style="margin-bottom: 8px"
                  v-if="item.addr"
                >
                  单位地址：{{ item.addr }}
                </el-row>
                <el-row
                  class="text"
                  style="margin-bottom: 8px"
                  v-if="item.phone"
                >
                  单位电话：{{ item.phone }}
                </el-row>
                <el-row
                  class="text"
                  style="margin-bottom: 8px"
                  v-if="item.account_bank"
                >
                  开户银行：{{ item.account_bank }}
                </el-row>
                <el-row
                  class="text"
                  style="margin-bottom: 0"
                  v-if="item.card_num"
                >
                  银行账号：{{ item.card_num }}
                </el-row>
                <el-row>
                  <el-divider></el-divider>
                </el-row>
              </el-col>
              <el-col class="card_update">
                <el-button type="text" @click="openAddInvoices(1, item)"
                  >修改</el-button
                >
                <el-button type="text" @click="deleteInvoices(item.id)"
                  >删除</el-button
                >
              </el-col>
            </el-row>
            <div class="card_update">
              <el-button type="text" @click="openAddInvoices(0)"
                >新增开票信息</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 更改手机 -->
    <el-dialog
      title="修改手机"
      :visible.sync="updatePhone.dialog"
      width="800px"
      top="0"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="done => closeDialog(done, 0)"
    >
      <div class="body none-scrollbar" v-loading="loadingDialog">
        <!-- 手机校验 -->
        <div v-if="updatePhone.active === 0" class="phone_verify">
          <div>
            验证码将发送到手机
            <span style="font-size: 22px; color: #0e68b4">{{
              userInfo.showPhone
            }}</span>
          </div>
          <div class="subtitle">
            如果长时间未收到验证码，请检查是否将运营商拉黑
          </div>
          <div class="hint" :class="updatePhone.show[0] ? 'show' : 'hide'">
            已发送至
            <span>{{ userInfo.showPhone }}</span>
          </div>
          <div class="input">
            填写验证码：
            <el-input
              style="width: 300px"
              placeholder="请输入验证码"
              v-model.number.trim="updatePhone.code[0]"
              @input="checkCode(0)"
              maxlength="6"
              show-word-limit
              onkeyup="value=value.replace(/[^\d]/g,'')"
            >
              <el-button
                slot="append"
                style="width: 112px"
                @click="sendVerificationCode(0)"
                :disabled="updatePhone.disabled[0]"
                :class="{ disabled: updatePhone.disabled[0] }"
              >
                {{ updatePhone.sendVerification[0] }}
              </el-button>
            </el-input>
          </div>
          <div class="next_button">
            <el-button
              :disabled="updatePhone.disabledNext[0]"
              :class="{ disabled: updatePhone.disabledNext[0] }"
              @click="checkout(0)"
              >下一步
            </el-button>
          </div>
          <div class="change_button">
            <el-button type="text" @click="changeActive(0)"
              >手机号不可用？可通过邮箱修改</el-button
            >
          </div>
        </div>
        <!-- 邮箱校验 -->
        <div v-else-if="updatePhone.active === 1" class="email_verify">
          <div>
            验证码将发送到邮箱
            <span style="font-size: 22px; color: #0e68b4">{{
              userInfo.showEmail
            }}</span>
          </div>
          <div class="subtitle">如果长时间未收到验证码，请检查垃圾箱</div>
          <div class="hint" :class="updatePhone.show[1] ? 'show' : 'hide'">
            已发送至
            <span>{{ userInfo.showEmail }}</span>
          </div>
          <div class="input">
            填写验证码：
            <el-input
              style="width: 300px"
              placeholder="请输入验证码"
              v-model.number.trim="updatePhone.code[1]"
              @input="checkCode(1)"
              maxlength="6"
              show-word-limit
              onkeyup="value=value.replace(/[^\d]/g,'')"
            >
              <el-button
                slot="append"
                style="width: 112px"
                @click="sendVerificationCode(1)"
                :disabled="updatePhone.disabled[1]"
                :class="{ disabled: updatePhone.disabled[1] }"
              >
                {{ updatePhone.sendVerification[1] }}
              </el-button>
            </el-input>
          </div>
          <div class="next_button">
            <el-button
              :disabled="updatePhone.disabledNext[1]"
              :class="{ disabled: updatePhone.disabledNext[1] }"
              @click="checkout(1)"
              >下一步
            </el-button>
          </div>
          <div class="change_button">
            <el-button type="text" @click="updatePhone.active = 0"
              >邮箱不可用？可通过手机号修改</el-button
            >
          </div>
        </div>
        <!-- 绑定新手机 -->
        <div v-else-if="updatePhone.active === 2" class="binding_phone">
          <div class="input">
            输入新手机：
            <el-input
              style="width: 300px"
              placeholder="请输入手机号码"
              v-model.number.trim="updatePhone.newPhone"
              @input="checkCode(2)"
              maxlength="11"
              show-word-limit
              onkeyup="value=value.replace(/[^\d]/g,'')"
            >
            </el-input>
          </div>
          <div class="hint" :class="updatePhone.show[2] ? 'show' : 'hide'">
            已发送至
            <span>{{ updatePhone.tempPhone }}</span>
          </div>
          <div class="input">
            填写验证码：
            <el-input
              style="width: 300px"
              placeholder="请输入验证码"
              v-model.number.trim="updatePhone.code[2]"
              @input="checkCode(3)"
              maxlength="6"
              show-word-limit
              onkeyup="value=value.replace(/[^\d]/g,'')"
            >
              <el-button
                slot="append"
                style="width: 112px"
                @click="sendVerificationCode(2)"
                :disabled="updatePhone.disabled[2]"
                :class="{ disabled: updatePhone.disabled[2] }"
              >
                {{ updatePhone.sendVerification[2] }}
              </el-button>
            </el-input>
          </div>
          <div class="next_button">
            <el-button
              :disabled="updatePhone.disabledNext[2]"
              :class="{ disabled: updatePhone.disabledNext[2] }"
              @click="checkout(2)"
              >下一步
            </el-button>
          </div>
        </div>
        <!-- 绑定成功 -->
        <div v-else class="binding_succes">
          <el-result
            icon="success"
            title="成功设置/修改手机"
            :subTitle="'新手机号码为' + updatePhone.newPhone"
          >
            <template slot="extra">
              <el-button @click="finish(0)">完成</el-button>
            </template>
          </el-result>
        </div>
      </div>
    </el-dialog>

    <!-- 更改邮箱 -->
    <el-dialog
      title="修改邮箱"
      :visible.sync="updateEmail.dialog"
      width="800px"
      top="0"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="done => closeDialog(done, 1)"
    >
      <div class="body none-scrollbar" v-loading="loadingDialog">
        <!-- 邮箱校验 -->
        <div v-if="updateEmail.active === 0" class="email_verify">
          <div>
            验证码将发送到邮箱
            <span style="font-size: 22px; color: #0e68b4">{{
              userInfo.showEmail
            }}</span>
          </div>
          <div class="subtitle">如果长时间未收到验证码，请检查垃圾箱</div>
          <div class="hint" :class="updateEmail.show[0] ? 'show' : 'hide'">
            已发送至
            <span>{{ userInfo.showEmail }}</span>
          </div>
          <div class="input">
            填写验证码：
            <el-input
              style="width: 300px"
              placeholder="请输入验证码"
              v-model.number.trim="updateEmail.code[0]"
              @input="checkCode(4)"
              maxlength="6"
              show-word-limit
              onkeyup="value=value.replace(/[^\d]/g,'')"
            >
              <el-button
                slot="append"
                style="width: 112px"
                @click="sendVerificationCode(3)"
                :disabled="updateEmail.disabled[0]"
                :class="{ disabled: updateEmail.disabled[0] }"
              >
                {{ updateEmail.sendVerification[0] }}
              </el-button>
            </el-input>
          </div>
          <div class="next_button">
            <el-button
              :disabled="updateEmail.disabledNext[0]"
              :class="{ disabled: updateEmail.disabledNext[0] }"
              @click="checkout(3)"
              >下一步
            </el-button>
          </div>
          <div class="change_button">
            <el-button type="text" @click="changeActive(1)"
              >邮箱不可用？可通过手机号修改</el-button
            >
          </div>
        </div>
        <!-- 手机校验 -->
        <div v-else-if="updateEmail.active === 1" class="phone_verify">
          <div>
            验证码将发送到手机
            <span style="font-size: 22px; color: #0e68b4">{{
              userInfo.showPhone
            }}</span>
          </div>
          <div class="subtitle">
            如果长时间未收到验证码，请检查是否将运营商拉黑
          </div>
          <div class="hint" :class="updateEmail.show[1] ? 'show' : 'hide'">
            已发送至
            <span>{{ userInfo.showPhone }}</span>
          </div>
          <div class="input">
            填写验证码：
            <el-input
              style="width: 300px"
              placeholder="请输入验证码"
              v-model.number.trim="updateEmail.code[1]"
              @input="checkCode(5)"
              maxlength="6"
              show-word-limit
              onkeyup="value=value.replace(/[^\d]/g,'')"
            >
              <el-button
                slot="append"
                style="width: 112px"
                @click="sendVerificationCode(4)"
                :disabled="updateEmail.disabled[1]"
                :class="{ disabled: updateEmail.disabled[1] }"
              >
                {{ updateEmail.sendVerification[1] }}
              </el-button>
            </el-input>
          </div>
          <div class="next_button">
            <el-button
              :disabled="updateEmail.disabledNext[1]"
              :class="{ disabled: updateEmail.disabledNext[1] }"
              @click="checkout(4)"
              >下一步
            </el-button>
          </div>
          <div class="change_button">
            <el-button type="text" @click="updateEmail.active = 0"
              >手机号不可用？可通过邮箱修改</el-button
            >
          </div>
        </div>
        <!-- 绑定新邮箱 -->
        <div v-else-if="updateEmail.active === 2" class="binding_email">
          <div class="input">
            输入新邮箱：
            <el-input
              style="width: 300px"
              placeholder="请输入邮箱地址"
              v-model.trim="updateEmail.newEmail"
              @input="checkCode(6)"
            >
            </el-input>
          </div>
          <div class="hint" :class="updateEmail.show[2] ? 'show' : 'hide'">
            已发送至
            <span>{{ updateEmail.tempEmail }}</span>
          </div>
          <div class="input">
            填写验证码：
            <el-input
              style="width: 300px"
              placeholder="请输入验证码"
              v-model.number.trim="updateEmail.code[2]"
              @input="checkCode(7)"
              maxlength="6"
              show-word-limit
              onkeyup="value=value.replace(/[^\d]/g,'')"
            >
              <el-button
                slot="append"
                style="width: 112px"
                @click="sendVerificationCode(5)"
                :disabled="updateEmail.disabled[2]"
                :class="{ disabled: updateEmail.disabled[2] }"
              >
                {{ updateEmail.sendVerification[2] }}
              </el-button>
            </el-input>
          </div>
          <div class="next_button">
            <el-button
              :disabled="updateEmail.disabledNext[2]"
              :class="{ disabled: updateEmail.disabledNext[2] }"
              @click="checkout(5)"
              >下一步
            </el-button>
          </div>
        </div>
        <!-- 绑定成功 -->
        <div v-else class="binding_succes">
          <el-result
            icon="success"
            title="成功设置/修改邮箱"
            :subTitle="'新邮箱地址为' + updateEmail.newEmail"
          >
            <template slot="extra">
              <el-button @click="finish(1)">完成</el-button>
            </template>
          </el-result>
        </div>
      </div>
    </el-dialog>

    <!-- 解除绑定 -->
    <el-dialog
      title="解除绑定"
      :visible.sync="updateEmail.removeDialog"
      width="800px"
      top="0"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="done => closeDialog(done, 2)"
    >
      <div class="body none-scrollbar" v-loading="loadingDialog">
        <!-- 邮箱校验 -->
        <div v-if="updateEmail.active === 0" class="email_verify">
          <div>
            验证码将发送到邮箱
            <span style="font-size: 22px; color: #0e68b4">{{
              userInfo.showEmail
            }}</span>
          </div>
          <div class="subtitle">如果长时间未收到验证码，请检查垃圾箱</div>
          <div class="hint" :class="updateEmail.show[0] ? 'show' : 'hide'">
            已发送至
            <span>{{ userInfo.showEmail }}</span>
          </div>
          <div class="input">
            填写验证码：
            <el-input
              style="width: 300px"
              placeholder="请输入验证码"
              v-model.number.trim="updateEmail.code[0]"
              @input="checkCode(4)"
              maxlength="6"
              show-word-limit
              onkeyup="value=value.replace(/[^\d]/g,'')"
            >
              <el-button
                slot="append"
                style="width: 112px"
                @click="sendVerificationCode(3)"
                :disabled="updateEmail.disabled[0]"
                :class="{ disabled: updateEmail.disabled[0] }"
              >
                {{ updateEmail.sendVerification[0] }}
              </el-button>
            </el-input>
          </div>
          <div class="next_button">
            <el-button
              :disabled="updateEmail.disabledNext[0]"
              :class="{ disabled: updateEmail.disabledNext[0] }"
              @click="checkout(6)"
              >下一步
            </el-button>
          </div>
        </div>
        <!-- 解绑成功 -->
        <div v-else class="binding_succes">
          <el-result icon="success" title="成功解除绑定">
            <template slot="extra">
              <el-button @click="finish(2)">完成</el-button>
            </template>
          </el-result>
        </div>
      </div>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="updatePassword.dialog"
      width="800px"
      top="0"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="done => closeDialog(done, 3)"
    >
      <div class="body none-scrollbar" v-loading="loadingDialog">
        <!-- 手机校验 -->
        <div v-if="updatePassword.active === 0" class="phone_verify">
          <div>
            验证码将发送到手机
            <span style="font-size: 22px; color: #0e68b4">{{
              userInfo.showPhone
            }}</span>
          </div>
          <div class="subtitle">
            如果长时间未收到验证码，请检查是否将运营商拉黑
          </div>
          <div class="hint" :class="updatePassword.show ? 'show' : 'hide'">
            已发送至
            <span>{{ userInfo.showPhone }}</span>
          </div>
          <div class="input">
            填写验证码：
            <el-input
              style="width: 300px"
              placeholder="请输入验证码"
              v-model.number.trim="updatePassword.code"
              @input="checkCode(8)"
              maxlength="6"
              show-word-limit
              onkeyup="value=value.replace(/[^\d]/g,'')"
            >
              <el-button
                slot="append"
                style="width: 112px"
                @click="sendVerificationCode(6)"
                :disabled="updatePassword.disabled"
                :class="{ disabled: updatePassword.disabled }"
              >
                {{ updatePassword.sendVerification }}
              </el-button>
            </el-input>
          </div>
          <el-form
            ref="updatePassword"
            :model="updatePassword"
            :rules="updatePasswordRules"
            :hide-required-asterisk="true"
            label-width="89px"
          >
            <el-form-item prop="newPassword" label="填写新密码：">
              <el-input
                type="password"
                placeholder="请输入新密码"
                show-password
                v-model.trim="updatePassword.newPassword"
                :maxlength="20"
                onkeyup="value=value.replace(/[\s]/g,'')"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="repeatPassword" label="确认新密码：">
              <el-input
                type="password"
                placeholder="请确认新密码"
                show-password
                v-model.trim="updatePassword.repeatPassword"
                :maxlength="20"
                onkeyup="value=value.replace(/[\s]/g,'')"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <div class="next_button">
            <el-button
              :disabled="updatePassword.disabledNext"
              :class="{ disabled: updatePassword.disabledNext }"
              @click="checkout(7)"
              >下一步
            </el-button>
          </div>
        </div>
        <!-- 修改成功 -->
        <div v-else class="binding_succes">
          <el-result icon="success" title="成功修改密码">
            <template slot="extra">
              <el-button @click="finish(3)">完成</el-button>
            </template>
          </el-result>
        </div>
      </div>
    </el-dialog>

    <!-- 修改名称 -->
    <el-dialog
      title="修改名称"
      :visible.sync="updateName.dialog"
      width="700px"
      top="0"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      custom-class="update_name"
    >
      <div class="body none-scrollbar" v-loading="loadingDialog">
        <div class="update_name">
          <div style="margin: 20px">
            填写名称：
            <el-input
              style="width: 300px"
              placeholder="请输入账号名称"
              v-model.trim="updateName.name"
              :maxlength="20"
              @input="checkCode(9)"
            >
            </el-input>
          </div>
          <div class="next_button">
            <el-button
              :disabled="updateName.disabledNext"
              :class="{ disabled: updateName.disabledNext }"
              @click="checkout(8)"
              >下一步
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 新增开票信息 -->
    <el-dialog
      :title="addInvoices.title"
      :visible.sync="addInvoices.dialog"
      width="700px"
      top="0"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      custom-class="add_invoices"
    >
      <div class="body none-scrollbar" v-loading="loadingDialog">
        <div class="add_invoices">
          <el-form
            ref="addInvoices"
            :model="addInvoices"
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
                v-model.trim="addInvoices.department"
                :maxlength="100"
                @input="checkCode(addInvoices.val)"
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
                v-model.trim="addInvoices.creditCode"
                :maxlength="20"
                @input="limitInput(0)"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="addr" label="单位地址：">
              <el-input
                placeholder="请输入单位地址"
                v-model.trim="addInvoices.addr"
                :maxlength="100"
                @input="checkCode(addInvoices.val)"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="phone" label="单位电话：">
              <el-input
                placeholder="请输入单位电话"
                v-model.trim="addInvoices.phone"
                :maxlength="20"
                @input="limitInput(1)"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="accountBank" label="开户银行：">
              <el-input
                placeholder="请输入开户银行"
                v-model.trim="addInvoices.accountBank"
                :maxlength="100"
                @input="checkCode(addInvoices.val)"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="cardNum" label="银行账号：">
              <el-input
                placeholder="请输入银行账号"
                v-model.trim="addInvoices.cardNum"
                :maxlength="25"
                @input="limitInput(2)"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <div class="next_button">
            <el-button
              :disabled="addInvoices.disabledNext"
              :class="{ disabled: addInvoices.disabledNext }"
              @click="checkout(addInvoices.val - 1)"
              >下一步
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Base64 from "base-64";

export default {
  name: "Account",
  data() {
    // 校验密码
    let checkPwd = (rule, value, callback) => {
      if (!value) {
        this.updatePassword.disabledNext = true;
        callback(new Error("请输入密码"));
      } else {
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
        this.updatePassword.isPassword = isLetter && isNumber && isChar;
        if (value.length < 8) {
          this.updatePassword.disabledNext = true;
          callback(new Error("密码至少8位"));
        } else if (!this.updatePassword.isPassword) {
          this.updatePassword.disabledNext = true;
          callback(new Error("密码至少包含一个字母、一个数字和一个其他字符"));
        } else {
          this.updatePassword.disabledNext = !(
            this.updatePassword.show &&
            this.updatePassword.code.toString().length === 6 &&
            this.updatePassword.newPassword ===
              this.updatePassword.repeatPassword
          );
        }
        callback();
      }
      if (this.updatePassword.repeatPassword !== "") {
        this.$refs.updatePassword.validateField("repeatPassword");
      }
    };
    // 对重复密码的校验
    let checkRepeatPwd = (rule, value, callback) => {
      if (value === "" || value === null) {
        this.updatePassword.disabledNext = true;
        callback(new Error("请再次输入密码"));
      } else if (value !== this.updatePassword.newPassword) {
        this.updatePassword.disabledNext = true;
        callback(new Error("两次输入密码不一致!"));
      } else {
        this.updatePassword.disabledNext = !(
          this.updatePassword.show &&
          this.updatePassword.code.toString().length === 6 &&
          this.updatePassword.isPassword
        );
        callback();
      }
    };
    return {
      // 页面加载
      loading: false,
      // 当前登入用户信息
      userInfo: {},
      // 加载对话框
      loadingDialog: false,
      // 更改手机
      updatePhone: {
        dialog: false,
        active: 0,
        // 验证
        sendVerification: ["获取验证码", "获取验证码", "获取验证码"],
        disabled: [false, false, true],
        disabledNext: [true, true, true, false],
        show: [false, false, false],
        bizid: ["", "", ""],
        code: ["", "", ""],
        interval: [null, null, null],
        // 绑定新手机
        newPhone: "",
        tempPhone: ""
      },
      // 更改邮箱
      updateEmail: {
        dialog: false,
        removeDialog: false,
        active: 0,
        // 验证
        sendVerification: ["获取验证码", "获取验证码", "获取验证码"],
        disabled: [false, false, true],
        disabledNext: [true, true, true, false],
        show: [false, false, false],
        bizid: ["", "", ""],
        code: ["", "", ""],
        interval: [null, null, null],
        // 绑定新邮箱
        newEmail: "",
        tempEmail: ""
      },
      // 更改密码
      updatePassword: {
        dialog: false,
        active: 0,
        sendVerification: "获取验证码",
        disabled: false,
        disabledNext: true,
        disabledNext_0: false,
        show: false,
        bizid: "",
        code: "",
        interval: null,
        newPassword: "",
        repeatPassword: "",
        isPassword: false
      },
      // 更改密码校验
      updatePasswordRules: {
        newPassword: [{ validator: checkPwd, trigger: "change" }],
        repeatPassword: [{ validator: checkRepeatPwd, trigger: "change" }]
      },
      // 上传文件列表
      fileList: [],
      time: "",
      // 更改头像
      updateAvatar: {
        dialog: false,
        loading: false,
        disable: false,
        list: [
          "data:image/jpeg;base64,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",
          "data:image/jpeg;base64,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",
          "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABkAGQDASIAAhEBAxEB/8QAHAABAAICAwEAAAAAAAAAAAAAAAYIBQcBAgME/8QAPxAAAQMDAwEFBAYHCAMAAAAAAQIDBAAFEQYSITEHE0FRYQgUMoEiUnGRocEVI0JDcoKSFhckJTNiY6KjsdH/xAAbAQABBQEBAAAAAAAAAAAAAAAAAQIDBAUGB//EAC8RAAIBAwMCAwUJAAAAAAAAAAABAgMEEQUSITFRIkFhEzKBkdEUFSMzcaGx4fH/2gAMAwEAAhEDEQA/ALGlJAyRxQpIGSK7KKtvI4osq2jI4rlnFGjlnUpIHIoUkdRXZZVgZFcOqKUblkJSOSSelDiuQycFJHUUKSOtVv7VfaIWxKftmhEsr7slC7m6nekn/iSeCAf2lZB5wCMGtMK7UtcqmGSrVN17zOdoeIR/R8P4VtW+gXNxDevCvLJXlcxi8F9qVUfRntF6jtrrbWpo7F4iZwpxKQy+keYKRtP2EDPnVkdDa6sGt4PvFhmpccSAXYzn0Xmf4kfmMg+BNULzTbiz/Njx38iWFWM+hJ6UpVAkFKUoAUpSgDurds56UXu2jNcFRIxQqJGDUrkueRuDlwkJyrAA5Jqufb52zWiZpy4aZ0vLclS5BDMiWyP1KW8/TSlefpE9OARgnmsj7VeuZFoscTTNudLci5pU5KUk4UGAcbf5zkfYkjxqp1dNoukq4SuarePJd8d/QqV623wIUrJ2GwXbUEksWS3Spzqcbgw2VBGehUeiR6mtuf3BXYaEXLUsHU/ed4IYcSUd1jHd7um/xznHh6109e/oUGozlz/H6lenQnUWYo0hX12i5zbPcWJ9qlPRJjKtzbzStqkn/wCeY6Gs3qjQeptLQ2Zd+tLsWM6dqXd6HEg+SiknafQ4z8jUZqaM6VxB4akhjjKD54ZdnsO7UGdfWlUWdsZ1BDQDIbHAeT071A8s4yPAkeBFbQqg3ZDen7B2k6fmMKKUqloYdGeFNuHYoevCiftAq/NefazYxsrjbD3XyjSoVHOPPUUpSsgmFKUoAUpSgCn/ALWaVp7Toxc6KtrRR/DvcH/sGtK1Z72vtOuPQbLqJhvcmOpUOSoDJCVfSbJ8gCFj7VCq8saXv0q1m4x7Jc3rft3e8IirLZT57gMY9eleg6Nc0/sEeUmsr4mbWg/aMur2e2BjTOjrXbI7SW1NsIU8QOVukArUftOflgeFeU66X5PaBbbXEtZVYFRVvS56mlkBf0glCVZ2g5SMg5yFeFZXTVwTdtO2u4p+GXFafH8yAr861JfrzrKN7R9uiR3JxsL7baERwVGOpju/1iiPh3Be4568AeVc5BKbbk+TVqylCMdi44N0SozEyM5Hlstvx3UlK23EhSVg9QQeCKr72k9kOmf7U2uHZr3Csc25BWy3yFKWHFZwko67cnIwTg4wmrBSJLMYsh9xLZeWGm9x+JRBIA9eDWqu1Dsunat7QNP3+DPZYZiBtuSlwqC0pQ4VgowDkncRzjwp9tWdGW5NoS6pupHEVyaTh6Huuie1DSUbUrDYYkXJgtvMubm3Uh1AVg9eNwyCAcGrw1oz2ireo6cs18ZRl60XJl1S/qtrUEn/ALd3W86q6rcSudlSfXDX7/2RRpKlJxXQUpSsgeKUpQApSlAEc7RbcbtoW+QhF97U7FXiPjJcIGQkf7jjg+BwajGn9PxUagbv0B4SoUuJltxaslvKsthsYASjYopwPqpzzk1sqog7oZpbbkVu93hm0rCk/o9pbQQlJzlCV933oTzwAvgcDA4q3b11TTixU0nlo+bRl1g3e1POWtSFRmZciOCj4fouK6emMY9Kzta57B9PL01oqRBekh94XB/vEhG3uVpIbUjr5tk58QoVJe0GVdYOjLrL0/t/STDXeN5QF8AgqwD1O3dj1rQkk5YiTxk9m5nOuUd5p9xLbcpcsOIXFMZhTqkvpO9BIHROUgEkgYOCeazUJbzkNhctoMyFNpU40FbghRHKc+ODxmqso7b9Ypb2qehqV9Yxxn8OKj121vq3VchqJKukt8vLDaI7GG0rJOANqMAnPnVhW0sYZVd5DOUmWq7R7W3etB36A6OHYbhT6LSNyT8lJBqZ2eWJ9phTAMCQwh4Dy3JB/OoNqNT9p7On46ll+f7kmE0Scl2QtIaQPXK1D76n1ugpt9vhw21ZQw0hlJ9EgD8qzLtZisEtVrce1K7qRggZ60UjBAz1qlsZHlHSlehb8jSj2cuwbkedKUpgopSlAGvtVOI0bfVXsn/Jrq4lua2kZUy+E4S+kDqClOFgcjalX1qkUZ9mVHbfjOtvMOJCkONqCkqB6EEdRWL1Or37XNhgDluCy9cnR5LI7lr7wt4/y1hL1paXAUubo2W7bH1KK3Yje0sPE8khtQKUqJ6lO0nzrVoc01uJabaXoR7VXYlp69TnJcF1+1uuHctDICmifEhJ6fI49KyWiuy/Tui3jcitcqY0kn3qUoBLIxyUjonjxOT61gpGsdZxlqYkO2htxPB7y3OhY/8ANjPyqWdntna1lYo941RKkXN4SHmzBdKUxWlNuqSD3SQAvISFDfuxnirFSrKEPE+CP8JSyo8mSsbK9XXuJdihSNPQFlyFvGPfX8EB7B/dpBO36xO7oEkz9STuHPWhRjaAeOg9KKSdw561l1ZObbaGt5eWFJO4c9aKSdw560Uk7hz1opJ3DnrTGuvAhyUEn4qUKCT8VKVx56CZ9TzpSlQDxUP7Q9cW3Slnmf42Mbz3R92hleVlZ4SpSRyEAkEnpgGonqrW0y/yHoOmpK4lobUW3bi0f1kkjgpZP7KByO86n9nHxGOQYEaChSYrKUFZ3LV1Us+alHlR9SSagq3UKLw+X2+poW2nVK63N4QsUVSQLhYtUTnZbjSG3pXfplpf27iMhwKwNylnCSnBUazyLxq5kYE6yyE+bsFxCvmUu4/AVGJditct4vPQWO/P75Cdjn9ScH8a8xYmkf6E67NDwCbg8QPkpRp8NWj5t/JMuPTJL3cfNok8m56omJ2PvafQjzNvcdPyy6APuNY6DJu2kC/do90cksB8ypdvLbTTDqSkJXsAGUrwkEfSxuHPxE1iv0ID8dzvCh5e/uJ/EEGjenbWlxLjsUSXUnIXKcU+oHzysk0stVg1h5fwQ37rnLrj5s3zYb9bNQwGptmnx5kdxAWFNOBRAIzgjqD6HkVkySepqvT9oguvpkCOlmUn4JDBLTyPscThQ++pFYta3jTykovC3bzaBwXto97jjzOOHUj7Av8AiPFR07unVeE8P1+v+FWvptWity8S9PobjJJ6mhJPU181vmxrlBYmQH25EV9AW262rKVpPQg19FWHkzzkknxpXFKMgKgvbJNkRdIojxnVNCfMZhPLQcKDSyd4SfAkDGfInHPNKUseo6CzJIgLTaGWkNtIShtACUpSMAAdAK70pXNnaClKUAKUpQApSlAGW7Kpj0HW8yyx1YtsmEqeWTyG3g4lJKPIKCskeJGeCTnb9KV0FN5pxb7I5K7SVeaXcUpSnFY//9k="
        ]
      },
      // 更改账号名称
      updateName: {
        dialog: false,
        name: "",
        disabledNext: false
      },
      // 新增、修改开票信息
      addInvoices: {
        dialog: false,
        title: "",
        val: null,
        department: "",
        creditCode: "",
        addr: "",
        phone: "",
        accountBank: "",
        cardNum: "",
        disabledNext: true
      },
      // 新增、修改开票信息校验规则
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
      timeout: null
    };
  },
  methods: {
    // 初始化
    init() {
      this.userInfo = this.$store.getters.getUserInfo;
      this.getUserInfo();
      this.getAvatar();
    },
    // 获取用户信息
    getUserInfo() {
      const _this = this;
      const fun = function() {
        _this.loading = false;
        _this.userInfo = _this.$store.getters.getUserInfo;
      };

      this.loading = true;
      this.$emit("getUserInfo", fun, "account");
    },
    // 打开对话框
    openDialog(val) {
      switch (val) {
        case 0:
          if (this.userInfo.phone) this.updatePassword.dialog = true;
          else
            this.$message({
              message: "暂未绑定手机，请绑定手机后再试！",
              type: "warning"
            });
          break;
      }
    },
    // 关闭对话框
    closeDialog(done, val) {
      this.loadingDialog = false;
      switch (val) {
        case 0:
          this.updatePhone.interval.forEach(item => {
            if (item) clearInterval(item);
          });
          if (this.updatePhone.active === 3) this.getUserInfo();
          this.updatePhone = {
            dialog: false,
            active: 0,
            sendVerification: ["获取验证码", "获取验证码", "获取验证码"],
            disabled: [false, false, true],
            disabledNext: [true, true, true, false],
            show: [false, false, false],
            bizid: ["", "", ""],
            code: ["", "", ""],
            interval: [null, null, null],
            newPhone: "",
            tempPhone: ""
          };
          break;
        case 1:
          this.updateEmail.interval.forEach(item => {
            if (item) clearInterval(item);
          });
          if (this.updateEmail.active === 3) this.getUserInfo();
          this.updateEmail = {
            dialog: false,
            removeDialog: false,
            active: 0,
            sendVerification: ["获取验证码", "获取验证码", "获取验证码"],
            disabled: [false, false, true],
            disabledNext: [true, true, true, false],
            show: [false, false, false],
            bizid: ["", "", ""],
            code: ["", "", ""],
            interval: [null, null, null],
            newEmail: "",
            tempEmail: ""
          };
          break;
        case 2:
          this.updateEmail.interval.forEach(item => {
            if (item) clearInterval(item);
          });
          if (this.updateEmail.active === 1) this.getUserInfo();
          this.updateEmail = {
            dialog: false,
            removeDialog: false,
            active: 0,
            sendVerification: ["获取验证码", "获取验证码", "获取验证码"],
            disabled: [false, false, true],
            disabledNext: [true, true, true, false],
            show: [false, false, false],
            bizid: ["", "", ""],
            code: ["", "", ""],
            interval: [null, null, null],
            newEmail: "",
            tempEmail: ""
          };
          break;
        case 3:
          if (this.updatePassword.interval)
            clearInterval(this.updatePassword.interval);
          this.updatePassword = {
            dialog: false,
            active: 0,
            sendVerification: "获取验证码",
            disabled: false,
            disabledNext: true,
            disabledNext_0: false,
            show: false,
            bizid: "",
            code: "",
            interval: null,
            newPassword: "",
            repeatPassword: "",
            isPassword: false
          };
          break;
      }
      done();
    },
    // 完成
    finish(val) {
      switch (val) {
        case 0:
          this.updatePhone.interval.forEach(item => {
            if (item) clearInterval(item);
          });
          this.getUserInfo();
          this.updatePhone = {
            dialog: false,
            active: 0,
            sendVerification: ["获取验证码", "获取验证码", "获取验证码"],
            disabled: [false, false, true],
            disabledNext: [true, true, true, false],
            show: [false, false, false],
            bizid: ["", "", ""],
            code: ["", "", ""],
            interval: [null, null, null],
            newPhone: "",
            tempPhone: ""
          };
          break;
        case 1:
          this.updateEmail.interval.forEach(item => {
            if (item) clearInterval(item);
          });
          this.getUserInfo();
          this.updateEmail = {
            dialog: false,
            removeDialog: false,
            active: 0,
            sendVerification: ["获取验证码", "获取验证码", "获取验证码"],
            disabled: [false, false, true],
            disabledNext: [true, true, true, false],
            show: [false, false, false],
            bizid: ["", "", ""],
            code: ["", "", ""],
            interval: [null, null, null],
            newEmail: "",
            tempEmail: ""
          };
          break;
        case 2:
          this.updateEmail.interval.forEach(item => {
            if (item) clearInterval(item);
          });
          this.getUserInfo();
          this.updateEmail = {
            dialog: false,
            removeDialog: false,
            active: 0,
            sendVerification: ["获取验证码", "获取验证码", "获取验证码"],
            disabled: [false, false, true],
            disabledNext: [true, true, true, false],
            show: [false, false, false],
            bizid: ["", "", ""],
            code: ["", "", ""],
            interval: [null, null, null],
            newEmail: "",
            tempEmail: ""
          };
          break;
        case 3:
          if (this.updatePassword.interval)
            clearInterval(this.updatePassword.interval);
          this.updatePassword = {
            dialog: false,
            active: 0,
            sendVerification: "获取验证码",
            disabled: false,
            disabledNext: true,
            disabledNext_0: false,
            show: false,
            bizid: "",
            code: "",
            interval: null,
            newPassword: "",
            repeatPassword: "",
            isPassword: false
          };
          break;
      }
    },
    // 切换验证方式
    changeActive(val) {
      switch (val) {
        case 0:
          if (this.userInfo.email) this.updatePhone.active = 1;
          else
            this.$message({
              message: "暂未绑定邮箱，请绑定邮箱后再试！",
              type: "warning"
            });
          break;
        case 1:
          if (this.userInfo.phone) this.updateEmail.active = 1;
          else
            this.$message({
              message: "暂未绑定手机，请绑定手机后再试！",
              type: "warning"
            });
          break;
      }
    },
    // 校验验证码
    checkCode(val) {
      switch (val) {
        case 0:
        case 1:
          if (this.updatePhone.show[val]) {
            this.updatePhone.disabledNext[val] = !(
              this.updatePhone.code[val].toString().length === 6
            );
          } else {
            this.updatePhone.disabledNext[val] = true;
          }
          break;
        case 2:
          if (this.updatePhone.newPhone.toString().length === 11) {
            if (!this.updatePhone.interval[2])
              this.updatePhone.disabled[2] = false;
            if (this.updatePhone.show[2])
              this.updatePhone.disabledNext[2] = !(
                this.updatePhone.code[2].toString().length === 6
              );
          } else {
            this.updatePhone.disabled[2] = true;
            this.updatePhone.disabledNext[2] = true;
          }
          break;
        case 3:
          if (this.updatePhone.show[2]) {
            this.updatePhone.disabledNext[2] = !(
              this.updatePhone.newPhone.toString().length === 11 &&
              this.updatePhone.code[2].toString().length === 6
            );
          } else {
            this.updatePhone.disabledNext[2] = true;
          }
          break;
        case 4:
        case 5:
          if (this.updateEmail.show[val - 4]) {
            this.updateEmail.disabledNext[val - 4] = !(
              this.updateEmail.code[val - 4].toString().length === 6
            );
          } else {
            this.updateEmail.disabledNext[val - 4] = true;
          }
          break;
        case 6:
          if (this.updateEmail.newEmail.length > 0) {
            if (!this.updateEmail.interval[2])
              this.updateEmail.disabled[2] = false;
            if (this.updateEmail.show[2])
              this.updateEmail.disabledNext[2] = !(
                this.updateEmail.code[2].toString().length === 6
              );
          } else {
            this.updateEmail.disabled[2] = true;
            this.updateEmail.disabledNext[2] = true;
          }
          break;
        case 7:
          if (this.updateEmail.show[2]) {
            this.updateEmail.disabledNext[2] = !(
              this.updateEmail.newEmail.length > 0 &&
              this.updateEmail.code[2].toString().length === 6
            );
          } else {
            this.updateEmail.disabledNext[2] = true;
          }
          break;
        case 8:
          if (this.updatePassword.show) {
            this.updatePassword.disabledNext = !(
              this.updatePassword.isPassword &&
              this.updatePassword.newPassword ===
                this.updatePassword.repeatPassword &&
              this.updatePassword.code.toString().length === 6
            );
          } else {
            this.updatePassword.disabledNext = true;
          }
          break;
        case 9:
          this.updateName.disabledNext = !this.updateName.name;
          break;
        case 10:
        case 11:
          let data = this.addInvoices;
          data.disabledNext = !(
            data.department.length > 1 &&
            data.creditCode.length > 14 &&
            (!data.addr || data.addr.length > 4) &&
            (!data.phone || data.phone.length > 4) &&
            (!data.accountBank || data.accountBank.length > 4) &&
            (!data.cardNum || data.cardNum.length > 14)
          );
          break;
      }
    },
    // 校验邮箱
    checkEmail(email) {
      const reg = /^[a-zA-Z0-9]+([-_.][A-Za-z0-9]*)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/;
      if (!reg.test(email)) {
        this.$message.error("请输入正确的邮箱地址");
        return false;
      } else {
        return true;
      }
    },
    // 发送验证码
    sendVerificationCode(val) {
      switch (val) {
        // 修改手机 -> 手机验证
        case 0:
        case 2:
          if (this.updatePhone.disabled[val]) return;
          this.loadingDialog = true;
          let phone =
            val === 0 ? this.userInfo.phone : this.updatePhone.newPhone;
          let type = val === 0 ? "3" : "4";
          this.$http
            .get(process.env.API_ROOT + "/sms", {
              params: { phone: phone, type: type, time: new Date().getTime() }
            })
            .then(data => {
              let res = data.data;
              // 发送失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("发送失败，" + res.message);
                this.updatePhone.disabled[val] = true;
                this.updatePhone.sendVerification[val] = "5秒后重试";
                let i = 4;
                this.updatePhone.interval[val] = setInterval(() => {
                  this.$forceUpdate();
                  this.updatePhone.sendVerification[val] = i + "秒后重试";
                  if (i === 0) {
                    this.updatePhone.sendVerification[val] = "获取验证码";
                    clearInterval(this.updatePhone.interval[val]);
                    this.updatePhone.interval[val] = null;
                    if (
                      val === 0 ||
                      (val === 2 &&
                        this.updatePhone.newPhone.toString().length === 11)
                    )
                      this.updatePhone.disabled[val] = false;
                  }
                  i--;
                }, 1000);
                this.$forceUpdate();
              }
              // 发送成功
              else {
                this.updatePhone.show[val] = true;
                this.updatePhone.bizid[val] = res.data.BizId;
                if (val === 0)
                  this.$message.success(
                    "已发送验证码到" + this.userInfo.showPhone
                  );
                else this.$message.success("已发送验证码到" + phone);
                if (this.updatePhone.code[val].toString().length === 6)
                  this.updatePhone.disabledNext[val] = false;
                // 倒计时60秒，禁用“发送验证码”按钮
                this.updatePhone.disabled[val] = true;
                this.updatePhone.sendVerification[val] = "60秒后重试";
                let i = 59;
                this.updatePhone.interval[val] = setInterval(() => {
                  this.$forceUpdate();
                  this.updatePhone.sendVerification[val] = i + "秒后重试";
                  if (i === 0) {
                    this.updatePhone.sendVerification[val] = "获取验证码";
                    clearInterval(this.updatePhone.interval[val]);
                    this.updatePhone.interval[val] = null;
                    if (
                      val === 0 ||
                      (val === 2 &&
                        this.updatePhone.newPhone.toString().length === 11)
                    )
                      this.updatePhone.disabled[val] = false;
                  }
                  i--;
                }, 1000);
                if (val === 2) this.updatePhone.tempPhone = phone;
                this.$forceUpdate();
              }
            })
            .catch(() => {
              this.$message.error("发送失败，服务器错误，请稍后再试！");
              this.updatePhone.disabled[val] = true;
              this.updatePhone.sendVerification[val] = "5秒后重试";
              let i = 4;
              this.updatePhone.interval[val] = setInterval(() => {
                this.$forceUpdate();
                this.updatePhone.sendVerification[val] = i + "秒后重试";
                if (i === 0) {
                  this.updatePhone.sendVerification[val] = "获取验证码";
                  clearInterval(this.updatePhone.interval[val]);
                  this.updatePhone.interval[val] = null;
                  if (
                    val === 0 ||
                    (val === 2 &&
                      this.updatePhone.newPhone.toString().length === 11)
                  )
                    this.updatePhone.disabled[val] = false;
                }
                i--;
              }, 1000);
              this.$forceUpdate();
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改手机 -> 邮箱验证
        case 1:
          if (this.updatePhone.disabled[val]) return;
          this.loadingDialog = true;
          this.$http
            .post(process.env.API_ROOT + "/email/send", {
              email: this.userInfo.email,
              type: "1",
              time: new Date().getTime()
            })
            .then(data => {
              let res = data.data;
              // 发送失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("发送失败，" + res.message);
                this.updatePhone.disabled[val] = true;
                this.updatePhone.sendVerification[val] = "5秒后重试";
                let i = 4;
                this.updatePhone.interval[val] = setInterval(() => {
                  this.$forceUpdate();
                  this.updatePhone.sendVerification[val] = i + "秒后重试";
                  if (i === 0) {
                    this.updatePhone.sendVerification[val] = "获取验证码";
                    clearInterval(this.updatePhone.interval[val]);
                    this.updatePhone.interval[val] = null;
                    this.updatePhone.disabled[val] = false;
                  }
                  i--;
                }, 1000);
                this.$forceUpdate();
              }
              // 发送成功
              else {
                this.updatePhone.show[val] = true;
                this.updatePhone.bizid[val] = res.data.encCode;
                this.$message.success(
                  "已发送验证码到" + this.userInfo.showEmail
                );
                if (this.updatePhone.code[val].toString().length === 6)
                  this.updatePhone.disabledNext[val] = false;
                // 倒计时60秒，禁用“发送验证码”按钮
                this.updatePhone.disabled[val] = true;
                this.updatePhone.sendVerification[val] = "60秒后重试";
                let i = 59;
                this.updatePhone.interval[val] = setInterval(() => {
                  this.$forceUpdate();
                  this.updatePhone.sendVerification[val] = i + "秒后重试";
                  if (i === 0) {
                    this.updatePhone.sendVerification[val] = "获取验证码";
                    clearInterval(this.updatePhone.interval[val]);
                    this.updatePhone.interval[val] = null;
                    this.updatePhone.disabled[val] = false;
                  }
                  i--;
                }, 1000);
                this.$forceUpdate();
              }
            })
            .catch(() => {
              this.$message.error("发送失败，服务器错误，请稍后再试！");
              this.updatePhone.disabled[val] = true;
              this.updatePhone.sendVerification[val] = "5秒后重试";
              let i = 4;
              this.updatePhone.interval[val] = setInterval(() => {
                this.$forceUpdate();
                this.updatePhone.sendVerification[val] = i + "秒后重试";
                if (i === 0) {
                  this.updatePhone.sendVerification[val] = "获取验证码";
                  clearInterval(this.updatePhone.interval[val]);
                  this.updatePhone.interval[val] = null;
                  this.updatePhone.disabled[val] = false;
                }
                i--;
              }, 1000);
              this.$forceUpdate();
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改邮箱 -> 邮箱验证
        case 3:
        case 5:
          if (this.updateEmail.disabled[val - 3]) return;
          if (val === 5) {
            if (!this.checkEmail(this.updateEmail.newEmail)) return;
          }
          this.loadingDialog = true;
          let email =
            val === 3 ? this.userInfo.email : this.updateEmail.newEmail;
          let type0 = val === 3 ? "1" : "2";
          this.$http
            .post(process.env.API_ROOT + "/email/send", {
              email: email,
              type: type0,
              time: new Date().getTime()
            })
            .then(data => {
              let res = data.data;
              // 发送失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("发送失败，" + res.message);
                this.updateEmail.disabled[val - 3] = true;
                this.updateEmail.sendVerification[val - 3] = "5秒后重试";
                let i = 4;
                this.updateEmail.interval[val - 3] = setInterval(() => {
                  this.$forceUpdate();
                  this.updateEmail.sendVerification[val - 3] = i + "秒后重试";
                  if (i === 0) {
                    this.updateEmail.sendVerification[val - 3] = "获取验证码";
                    clearInterval(this.updateEmail.interval[val - 3]);
                    this.updateEmail.interval[val - 3] = null;
                    if (
                      val === 3 ||
                      (val === 5 && this.updateEmail.newEmail.length > 0)
                    )
                      this.updateEmail.disabled[val - 3] = false;
                  }
                  i--;
                }, 1000);
                this.$forceUpdate();
              }
              // 发送成功
              else {
                this.updateEmail.show[val - 3] = true;
                this.updateEmail.bizid[val - 3] = res.data.encCode;
                if (val === 3)
                  this.$message.success(
                    "已发送验证码到" + this.userInfo.showEmail
                  );
                else this.$message.success("已发送验证码到" + email);
                if (this.updateEmail.code[val - 3].toString().length === 6)
                  this.updateEmail.disabledNext[val - 3] = false;
                // 倒计时60秒，禁用“发送验证码”按钮
                this.updateEmail.disabled[val - 3] = true;
                this.updateEmail.sendVerification[val - 3] = "60秒后重试";
                let i = 59;
                this.updateEmail.interval[val - 3] = setInterval(() => {
                  this.$forceUpdate();
                  this.updateEmail.sendVerification[val - 3] = i + "秒后重试";
                  if (i === 0) {
                    this.updateEmail.sendVerification[val - 3] = "获取验证码";
                    clearInterval(this.updateEmail.interval[val - 3]);
                    this.updateEmail.interval[val - 3] = null;
                    if (
                      val === 3 ||
                      (val === 5 && this.updateEmail.newEmail.length > 0)
                    )
                      this.updateEmail.disabled[val - 3] = false;
                  }
                  i--;
                }, 1000);
                if (val === 5) this.updateEmail.tempEmail = email;
                this.$forceUpdate();
              }
            })
            .catch(() => {
              this.$message.error("发送失败，服务器错误，请稍后再试！");
              this.updateEmail.disabled[val - 3] = true;
              this.updateEmail.sendVerification[val - 3] = "5秒后重试";
              let i = 4;
              this.updateEmail.interval[val - 3] = setInterval(() => {
                this.$forceUpdate();
                this.updateEmail.sendVerification[val - 3] = i + "秒后重试";
                if (i === 0) {
                  this.updateEmail.sendVerification[val - 3] = "获取验证码";
                  clearInterval(this.updateEmail.interval[val - 3]);
                  this.updateEmail.interval[val - 3] = null;
                  if (
                    val === 3 ||
                    (val === 5 && this.updateEmail.newEmail.length > 0)
                  )
                    this.updateEmail.disabled[val - 3] = false;
                }
                i--;
              }, 1000);
              this.$forceUpdate();
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改邮箱 -> 手机验证
        case 4:
          if (this.updateEmail.disabled[val - 3]) return;
          this.loadingDialog = true;
          this.$http
            .get(process.env.API_ROOT + "/sms", {
              params: {
                phone: this.userInfo.phone,
                type: "3",
                time: new Date().getTime()
              }
            })
            .then(data => {
              let res = data.data;
              // 发送失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("发送失败，" + res.message);
                this.updateEmail.disabled[val - 3] = true;
                this.updateEmail.sendVerification[val - 3] = "5秒后重试";
                let i = 4;
                this.updateEmail.interval[val - 3] = setInterval(() => {
                  this.$forceUpdate();
                  this.updateEmail.sendVerification[val - 3] = i + "秒后重试";
                  if (i === 0) {
                    this.updateEmail.sendVerification[val - 3] = "获取验证码";
                    clearInterval(this.updateEmail.interval[val - 3]);
                    this.updateEmail.interval[val - 3] = null;
                    this.updateEmail.disabled[val - 3] = false;
                  }
                  i--;
                }, 1000);
                this.$forceUpdate();
              }
              // 发送成功
              else {
                this.updateEmail.show[val - 3] = true;
                this.updateEmail.bizid[val - 3] = res.data.BizId;
                this.$message.success(
                  "已发送验证码到" + this.userInfo.showPhone
                );
                if (this.updateEmail.code[val - 3].toString().length === 6)
                  this.updateEmail.disabledNext[val - 3] = false;
                // 倒计时60秒，禁用“发送验证码”按钮
                this.updateEmail.disabled[val - 3] = true;
                this.updateEmail.sendVerification[val - 3] = "60秒后重试";
                let i = 59;
                this.updateEmail.interval[val - 3] = setInterval(() => {
                  this.$forceUpdate();
                  this.updateEmail.sendVerification[val - 3] = i + "秒后重试";
                  if (i === 0) {
                    this.updateEmail.sendVerification[val - 3] = "获取验证码";
                    clearInterval(this.updateEmail.interval[val - 3]);
                    this.updateEmail.interval[val - 3] = null;
                    this.updateEmail.disabled[val - 3] = false;
                  }
                  i--;
                }, 1000);
                this.$forceUpdate();
              }
            })
            .catch(() => {
              this.$message.error("发送失败，服务器错误，请稍后再试！");
              this.updateEmail.disabled[val - 3] = true;
              this.updateEmail.sendVerification[val - 3] = "5秒后重试";
              let i = 4;
              this.updateEmail.interval[val - 3] = setInterval(() => {
                this.$forceUpdate();
                this.updateEmail.sendVerification[val - 3] = i + "秒后重试";
                if (i === 0) {
                  this.updateEmail.sendVerification[val - 3] = "获取验证码";
                  clearInterval(this.updateEmail.interval[val - 3]);
                  this.updateEmail.interval[val - 3] = null;
                  this.updateEmail.disabled[val - 3] = false;
                }
                i--;
              }, 1000);
              this.$forceUpdate();
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改密码 -> 手机验证
        case 6:
          if (this.updatePassword.disabled) return;
          this.loadingDialog = true;
          this.$http
            .get(process.env.API_ROOT + "/sms", {
              params: {
                phone: this.userInfo.phone,
                type: "3",
                time: new Date().getTime()
              }
            })
            .then(data => {
              let res = data.data;
              // 发送失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("发送失败，" + res.message);
                this.updatePassword.disabled = true;
                this.updatePassword.sendVerification = "5秒后重试";
                let i = 4;
                this.updatePassword.interval = setInterval(() => {
                  this.$forceUpdate();
                  this.updatePassword.sendVerification = i + "秒后重试";
                  if (i === 0) {
                    this.updatePassword.sendVerification = "获取验证码";
                    clearInterval(this.updatePassword.interval);
                    this.updatePassword.interval = null;
                    this.updatePassword.disabled = false;
                  }
                  i--;
                }, 1000);
                this.$forceUpdate();
              }
              // 发送成功
              else {
                this.updatePassword.show = true;
                this.updatePassword.bizid = res.data.BizId;
                this.$message.success(
                  "已发送验证码到" + this.userInfo.showPhone
                );
                if (
                  this.updatePassword.isPassword &&
                  this.updatePassword.newPassword ===
                    this.updatePassword.repeatPassword &&
                  this.updatePassword.code.toString().length === 6
                )
                  this.updatePassword.disabledNext = false;
                // 倒计时60秒，禁用“发送验证码”按钮
                this.updatePassword.disabled = true;
                this.updatePassword.sendVerification = "60秒后重试";
                let i = 59;
                this.updatePassword.interval = setInterval(() => {
                  this.$forceUpdate();
                  this.updatePassword.sendVerification = i + "秒后重试";
                  if (i === 0) {
                    this.updatePassword.sendVerification = "获取验证码";
                    clearInterval(this.updatePassword.interval);
                    this.updatePassword.interval = null;
                    this.updatePassword.disabled = false;
                  }
                  i--;
                }, 1000);
                this.$forceUpdate();
              }
            })
            .catch(() => {
              this.$message.error("发送失败，服务器错误，请稍后再试！");
              this.updatePassword.disabled = true;
              this.updatePassword.sendVerification = "5秒后重试";
              let i = 4;
              this.updatePassword.interval = setInterval(() => {
                this.$forceUpdate();
                this.updatePassword.sendVerification = i + "秒后重试";
                if (i === 0) {
                  this.updatePassword.sendVerification = "获取验证码";
                  clearInterval(this.updatePassword.interval);
                  this.updatePassword.interval = null;
                  this.updatePassword.disabled = false;
                }
                i--;
              }, 1000);
              this.$forceUpdate();
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
      }
    },
    // 校验
    checkout(val) {
      let data = {};
      switch (val) {
        // 修改手机 -> 手机验证
        case 0:
          if (this.updatePhone.disabledNext[val]) return;
          if (this.updatePhone.disabledNext[3]) return;
          this.updatePhone.disabledNext[3] = true;
          setTimeout(() => {
            this.updatePhone.disabledNext[3] = false;
          }, 2000);
          this.loadingDialog = true;
          data = {
            phone: this.userInfo.phone,
            bizid: this.updatePhone.bizid[val],
            code: this.updatePhone.code[val].toString()
          };
          this.$http
            .post(process.env.API_ROOT + "/smsVerify", data)
            .then(data => {
              let res = data.data;
              // 校验失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("校验失败，" + res.message);
              }
              // 校验成功
              else {
                this.updatePhone.active = 2;
                this.$message.success("校验成功");
              }
            })
            .catch(() => {
              this.$message.error("校验失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改手机 -> 邮箱验证
        case 1:
          if (this.updatePhone.disabledNext[val]) return;
          if (this.updatePhone.disabledNext[3]) return;
          this.updatePhone.disabledNext[3] = true;
          setTimeout(() => {
            this.updatePhone.disabledNext[3] = false;
          }, 2000);
          this.loadingDialog = true;
          data = {
            email: this.userInfo.email,
            encCode: this.updatePhone.bizid[val],
            code: this.updatePhone.code[val].toString()
          };
          this.$http
            .post(process.env.API_ROOT + "/email/verify", data)
            .then(data => {
              let res = data.data;
              // 校验失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("校验失败，" + res.message);
              }
              // 校验成功
              else {
                this.updatePhone.active = 2;
                this.$message.success("校验成功");
              }
            })
            .catch(() => {
              this.$message.error("校验失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改手机 -> 绑定手机
        case 2:
          if (this.updatePhone.disabledNext[val]) return;
          if (this.updatePhone.disabledNext[3]) return;
          this.updatePhone.disabledNext[3] = true;
          setTimeout(() => {
            this.updatePhone.disabledNext[3] = false;
          }, 2000);
          this.loadingDialog = true;
          data = {
            phone: this.updatePhone.newPhone,
            bizid: this.updatePhone.bizid[val],
            code: this.updatePhone.code[val].toString()
          };
          this.$http
            .post(process.env.API_ROOT + "/user/phoneBind", data, {
              headers: {
                token: this.userInfo.token
              }
            })
            .then(data => {
              let res = data.data;
              // 绑定失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("绑定失败，" + res.message);
              }
              // 绑定成功
              else {
                this.updatePhone.active = 3;
                this.$message.success("绑定成功");
              }
            })
            .catch(() => {
              this.$message.error("绑定失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改邮箱 -> 邮箱验证
        case 3:
          if (this.updateEmail.disabledNext[val - 3]) return;
          if (this.updateEmail.disabledNext[3]) return;
          this.updateEmail.disabledNext[3] = true;
          setTimeout(() => {
            this.updateEmail.disabledNext[3] = false;
          }, 2000);
          this.loadingDialog = true;
          data = {
            email: this.userInfo.email,
            encCode: this.updateEmail.bizid[val - 3],
            code: this.updateEmail.code[val - 3].toString()
          };
          this.$http
            .post(process.env.API_ROOT + "/email/verify", data)
            .then(data => {
              let res = data.data;
              // 校验失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("校验失败，" + res.message);
              }
              // 校验成功
              else {
                this.updateEmail.active = 2;
                this.$message.success("校验成功");
              }
            })
            .catch(() => {
              this.$message.error("校验失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改邮箱 -> 手机验证
        case 4:
          if (this.updateEmail.disabledNext[val - 3]) return;
          if (this.updateEmail.disabledNext[3]) return;
          this.updateEmail.disabledNext[3] = true;
          setTimeout(() => {
            this.updateEmail.disabledNext[3] = false;
          }, 2000);
          this.loadingDialog = true;
          data = {
            phone: this.userInfo.phone,
            bizid: this.updateEmail.bizid[val - 3],
            code: this.updateEmail.code[val - 3].toString()
          };
          this.$http
            .post(process.env.API_ROOT + "/smsVerify", data)
            .then(data => {
              let res = data.data;
              // 校验失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("校验失败，" + res.message);
              }
              // 校验成功
              else {
                this.updateEmail.active = 2;
                this.$message.success("校验成功");
              }
            })
            .catch(() => {
              this.$message.error("校验失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改邮箱 -> 绑定邮箱
        case 5:
          if (this.updateEmail.disabledNext[val - 3]) return;
          if (this.updateEmail.disabledNext[3]) return;
          this.updateEmail.disabledNext[3] = true;
          setTimeout(() => {
            this.updateEmail.disabledNext[3] = false;
          }, 2000);
          this.loadingDialog = true;
          data = {
            email: this.updateEmail.newEmail,
            encCode: this.updateEmail.bizid[val - 3],
            code: this.updateEmail.code[val - 3].toString()
          };
          this.$http
            .post(process.env.API_ROOT + "/user/emailBindEmail", data, {
              headers: {
                token: this.userInfo.token
              }
            })
            .then(data => {
              let res = data.data;
              // 绑定失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("绑定失败，" + res.message);
              }
              // 绑定成功
              else {
                this.updateEmail.active = 3;
                this.$message.success("绑定成功");
              }
            })
            .catch(() => {
              this.$message.error("绑定失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 解除绑定
        case 6:
          if (this.updateEmail.disabledNext[0]) return;
          if (this.updateEmail.disabledNext[3]) return;
          this.updateEmail.disabledNext[3] = true;
          setTimeout(() => {
            this.updateEmail.disabledNext[3] = false;
          }, 2000);
          this.$confirm("此操作将解除绑定邮箱, 是否继续？", "解绑提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.loadingDialog = true;
              data = {
                email: "",
                encCode: this.updateEmail.bizid[0],
                code: this.updateEmail.code[0].toString()
              };
              this.$http
                .post(process.env.API_ROOT + "/user/emailBindEmail", data, {
                  headers: {
                    token: this.userInfo.token
                  }
                })
                .then(data => {
                  let res = data.data;
                  // 解绑失败，根据 status 输出提示信息
                  if (res.status !== 0) {
                    if (!res.message) res.message = "服务器错误，请稍后再试！";
                    this.$message.error("解绑失败，" + res.message);
                  }
                  // 解绑成功
                  else {
                    this.updateEmail.active = 1;
                    this.$message.success("解绑成功");
                  }
                })
                .catch(() => {
                  this.$message.error("解绑失败，服务器错误，请稍后再试！");
                })
                .finally(() => {
                  this.loadingDialog = false;
                });
            })
            .catch(() => {});
          break;
        // 修改密码
        case 7:
          if (this.updatePassword.disabledNext) return;
          if (this.updatePassword.disabledNext_0) return;
          this.updatePassword.disabledNext_0 = true;
          setTimeout(() => {
            this.updatePassword.disabledNext_0 = false;
          }, 2000);
          this.loadingDialog = true;
          data = {
            phone: this.userInfo.phone,
            pwd: Base64.encode(this.updatePassword.newPassword),
            bizid: this.updatePassword.bizid,
            code: this.updatePassword.code.toString()
          };
          this.$http
            .post(process.env.API_ROOT + "/user/pwdUpdate", data, {
              headers: {
                token: this.userInfo.token
              }
            })
            .then(data => {
              let res = data.data;
              // 修改失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("修改失败，" + res.message);
              }
              // 修改成功
              else {
                this.updatePassword.active = 1;
                this.$message.success("修改成功");
              }
            })
            .catch(() => {
              this.$message.error("修改失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改名称
        case 8:
          if (this.updateName.disabledNext) return;
          this.loadingDialog = true;
          this.$http
            .post(
              process.env.API_ROOT + "/user/nickNameUpdate",
              {
                nickName: this.updateName.name,
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
              // 修改失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("修改失败，" + res.message);
              }
              // 修改成功
              else {
                this.updateName.dialog = false;
                this.userInfo.name = res.data.name;
                this.$emit("getUserInfo");
                this.$message.success("修改成功");
              }
            })
            .catch(() => {
              this.$message.error("修改失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 新增开票信息
        case 9:
          if (this.addInvoices.disabledNext) return;
          this.loadingDialog = true;
          this.addInvoices.time = new Date().getTime();
          this.$http
            .post(
              process.env.API_ROOT + "/market/invoiceAdd",
              this.addInvoices,
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
                this.addInvoices.dialog = false;
                this.getUserInfo();
                this.$message.success("新增成功");
              }
            })
            .catch(() => {
              this.$message.error("新增失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
        // 修改开票信息
        case 10:
          if (this.addInvoices.disabledNext) return;
          this.loadingDialog = true;
          this.addInvoices.time = new Date().getTime();
          this.$http
            .post(
              process.env.API_ROOT + "/market/invoiceUpdate",
              this.addInvoices,
              {
                headers: {
                  token: this.userInfo.token
                }
              }
            )
            .then(data => {
              let res = data.data;
              // 修改失败，根据 status 输出提示信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("修改失败，" + res.message);
              }
              // 修改成功
              else {
                this.addInvoices.dialog = false;
                this.getUserInfo();
                this.$message.success("修改成功");
              }
            })
            .catch(() => {
              this.$message.error("修改失败，服务器错误，请稍后再试！");
            })
            .finally(() => {
              this.loadingDialog = false;
            });
          break;
      }
    },
    // 更多功能
    moreOperation() {
      this.$confirm("该功能尚未开通，敬请期待！", "提示", {
        confirmButtonText: "确定",
        showClose: false,
        showCancelButton: false,
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    },
    // 获取头像
    getAvatar() {
      if (this.updateAvatar.disable) return;
      this.updateAvatar.disable = true;
      setTimeout(() => {
        this.updateAvatar.disable = false;
      }, 1000);
      this.updateAvatar.loading = true;
      this.$http
        .get(
          "https://www.waveapp.cn/api/avatar?renderer=2&amount=6&size=50&gender=0"
        )
        .then(data => {
          let res = data.data;
          if (res && res.length > 0) {
            this.updateAvatar.list.splice(3);
            this.updateAvatar.list = this.updateAvatar.list.concat(res);
          }
        })
        .finally(() => {
          this.updateAvatar.loading = false;
        });
    },
    // 更新用户头像
    updateUserAvatar(val) {
      if (this.updateAvatar.disable) return;
      this.updateAvatar.disable = true;
      setTimeout(() => {
        this.updateAvatar.disable = false;
      }, 1000);
      this.$http
        .post(
          process.env.API_ROOT + "/user/avatarUrlUpdate",
          {
            avatarUrl: val,
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
          // 更新失败，根据 status 输出提示信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("头像更新失败，" + res.message);
          }
          // 更新成功
          else {
            this.updateAvatar.dialog = false;
            this.userInfo.avatarUrl = val;
            this.$emit("getUserInfo");
            this.$message.success("头像更新成功");
          }
        })
        .catch(() => {
          this.$message.error("头像更新失败，服务器错误，请稍后再试！");
        });
    },
    // 头像上传成功
    handleSuccess(res, file) {
      // 上传失败，返回错误信息
      if (res.status !== 0) {
        if (!res.message) res.message = "服务器错误，请稍后再试！";
        this.$message.error("头像上传失败，" + res.message);
      }
      //上传成功，整理数据
      else {
        this.$message.success("头像上传成功");
        this.userInfo.avatarUrl = res.data.avatarUrl;
        this.$emit("getUserInfo");
        let upload = this.$refs.upload;
        if (upload) {
          if (upload.length > 0) {
            upload.forEach(a => {
              a.clearFiles();
            });
          } else {
            upload.clearFiles();
          }
        }
      }
    },
    // 头像上传失败
    handleError() {
      this.$message.error("头像上传失败，服务器错误，请稍后再试！");
    },
    // 上传头像前的校验
    beforeUpload(file) {
      const isJPG = file.type.indexOf("image/") >= 0;
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) this.$message.error("只能上传图片文件！");
      else if (!isLt2M) this.$message.error("上传头像大小不能超过 2MB！");
      return isJPG && isLt2M;
    },
    // 撤销申请
    revocation() {
      this.$confirm("此操作将撤销您的用户认证, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(
              process.env.API_ROOT + "/user/revoke",
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
              // 获取失败，根据message返回错误信息
              if (res.status !== 0) {
                if (!res.message) res.message = "服务器错误，请稍后再试！";
                this.$message.error("撤销认证失败，" + res.message);
              }
              // 获取成功，处理数据
              else {
                this.userInfo.status = res.data.status;
                this.$store.commit("setUserInfo", this.userInfo);
                this.$message.success("撤销认证成功");
                this.$router.push("/user_center");
                this.$emit("getUserInfo");
              }
            })
            .catch(() => {
              this.$message.error("撤销认证失败，服务器错误，请稍后再试！");
            });
        })
        .catch(() => {});
    },
    // 打开新增开票信息对话框
    openAddInvoices(val, data) {
      if (val === 0) {
        if (this.userInfo.invoices && this.userInfo.invoices.length === 5) {
          this.$message.warning("最多可设置 5 个开票信息！");
          return;
        }
        this.addInvoices = {
          dialog: true,
          title: "新增开票信息",
          val: 10,
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
      } else {
        this.addInvoices = {
          dialog: true,
          title: "修改开票信息",
          val: 11,
          id: data.id,
          department: data.department,
          creditCode: data.credit_code,
          addr: data.addr,
          phone: data.phone,
          accountBank: data.account_bank,
          cardNum: data.card_num,
          disabledNext: true
        };
      }
      this.checkCode(10);
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
            this.addInvoices.creditCode = res.TAXNUMBER;
            this.addInvoices.addr = res.OPLOC;
          }
        })
        .catch(() => {});
    },
    // 删除开票信息
    deleteInvoices(id) {
      this.$confirm("此操作将永久删除该开票信息, 是否继续?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
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
                this.getUserInfo();
                this.$message.success("删除成功");
              }
            })
            .catch(() => {
              this.$message.error("删除失败，服务器错误，请稍后再试！");
            });
        })
        .catch(() => {});
    },
    // 限制输入
    limitInput(val) {
      if (val === 0) {
        let value = this.addInvoices.creditCode;
        // 将非数字和字母的字符替换成空
        value = value.replace(/[^\da-zA-Z]/g, "");
        // 将小写字母替换为大写字母
        value = value.toLocaleUpperCase();
        this.$set(this.addInvoices, "creditCode", value.toString());
      } else if (val === 1) {
        let value = this.addInvoices.phone;
        // 将非数字和"-"的字符替换成空
        value = value.replace(/[^\d\-]/g, "");
        this.$set(this.addInvoices, "phone", value.toString());
      } else if (val === 2) {
        let value = this.addInvoices.cardNum;
        // 将非数字的字符替换成空
        value = value.replace(/[^\d]/g, "");
        this.$set(this.addInvoices, "cardNum", value.toString());
      }
      this.checkCode(this.addInvoices.val);
    }
  },
  mounted() {
    this.$emit("changeActiveName", "0");
    this.init();
  }
};
</script>

<style lang="scss">
.account {
  width: 100%;
  height: 100%;

  .basic_info,
  .personal_info {
    color: black;

    .el-card__header {
      box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
      padding: 17px 20px 16px;

      .card_header {
        font-size: 20px;
        font-weight: 700;
      }
    }

    .card_body {
      font-size: 18px;

      > .el-row {
        height: 80px;
        display: flex;
        align-items: center;

        .card_label {
          width: 100px;
          font-weight: 700;
        }

        .icon {
          width: 30px;

          .success {
            color: #5051f9;
          }

          .error {
            color: red;
          }
        }

        .content {
          .text {
            font-weight: 700;
            margin-bottom: 5px;
          }

          .hint {
            font-size: 15px;
            color: #666666;
          }
        }

        .card_update {
          width: 100px;

          .el-button {
            padding: 0;
            font-size: 18px;
            color: #5051f9;
          }
        }

        .card_cancel {
          width: 100px;

          .el-button {
            padding: 0;
            font-size: 18px;
            color: #9e9e9e;
          }
        }
      }
    }
  }

  .personal_info {
    margin-top: 20px;

    .card_body {
      > .el-row {
        margin: 30px 0;
        display: block;
        height: auto;

        .card_label {
          width: 130px;
        }

        .content {
          .text {
            font-weight: 400;
          }
        }
      }

      > .el-row:first-child {
        margin: 10px 0;

        .select_avatar {
          display: inline-flex;
          width: 60px;
          height: 60px;
          position: relative;
          top: -12px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
        }

        .select_avatar::after {
          content: "更改头像";
          position: absolute;
          width: 100%;
          height: 100%;
          font-size: 12px;
          text-align: center;
          line-height: 60px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          color: #fff;
          font-weight: 700;
          opacity: 0;
          transition: all 0.26s ease;
        }

        .select_avatar:hover::after {
          opacity: 1;
        }
      }

      > .el-row:nth-child(2) {
        margin: 10px 0 30px;
      }
    }
  }

  .el-dialog__wrapper {
    padding: 160px 0;
    box-sizing: border-box;

    .el-dialog {
      margin: 0 auto;
      height: 500px;
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

          .phone_verify,
          .email_verify,
          .binding_phone,
          .binding_email,
          .update_name,
          .add_invoices {
            display: inline-block;
            text-align: left;

            > div {
              margin: 15px 0;
            }

            .subtitle {
              color: #bbbbbb;
            }

            .hint {
              font-size: 12px;
              text-align: right;
              color: #9e9e9e;

              span {
                margin-left: 7px;
                background: #f5f5f5;
                color: #0e68b4;
                padding: 5px 10px;
                border-radius: 8px;
              }
            }

            .hint.show {
              visibility: visible;
            }

            .hint.hide {
              visibility: hidden;
            }

            .input {
              .el-input {
                .el-button {
                  background: #dfedf7;
                  color: #0e68b4;
                }

                .el-button.disabled {
                  background: #eef5fb;
                  color: #7eb2d9;
                  cursor: not-allowed;
                }
              }
            }

            .next_button,
            .change_button {
              text-align: center;
            }

            .next_button {
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
                  text-align: left;
                  padding: 0;
                }
              }
            }
          }

          .add_invoices {
            .el-form .el-form-item .el-form-item__label {
              text-align: right;
            }
          }

          .binding_succes {
            .el-result {
              .el-result__title p {
                color: #69c242;
                margin: 10px;
              }

              .el-result__extra .el-button {
                background: #0e68b4;
                color: white;
                border-radius: 10px;
              }

              .el-result__extra .el-button:hover {
                background: #0e68b4;
                color: white;
              }
            }
          }
        }
      }
    }

    .el-dialog.update_name {
      height: 300px;
    }

    .el-dialog.add_invoices {
      height: 550px;

      .el-input {
        width: 300px;
      }
    }
  }
}

.el-popover {
  .avatar_popover {
    padding: 4px;

    .avatar_list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      height: 210px;

      .el-avatar {
        cursor: pointer;
        margin-top: 20px;
        transition: all 0.3s ease;
      }

      .el-avatar:hover {
        transform: scale(1.05);
        box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, 0.25);
      }
    }

    .el-button {
      background: #0168b7;
      color: white;
      border-radius: 7px;
      border: none;
      width: 100%;
      padding: 10px;
      margin: 25px 0 10px;

      > span {
        display: inline-flex;

        svg {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
