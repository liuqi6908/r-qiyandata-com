<template>
  <!-- 表格页面组件 -->
  <div class="database-table" v-loading="loading">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="index"
        @click.native="jumpRouter(index)"
      >
        <span class="not-selected"> {{ item.name }} </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主要内容 -->
    <el-card class="main" v-loading="downloadLoading">
      <el-tabs v-model="activeName" class="tab" @tab-click="changeTab">
        <el-tab-pane v-for="(menu, i) in menuList" :key="i" :name="menu.name">
          <span slot="label" class="not-selected">{{ menu.label }}</span>
          <div class="tab_body scrollbar">
            <!-- 数据查询下载 -->
            <div v-if="menu.name === '0'" class="tab_main filtrate">
              <h1 style="margin: 20px 0 0">筛选</h1>
              <el-collapse
                v-model="activeNames"
                v-if="config.items && config.items.length > 0"
              >
                <el-collapse-item
                  v-for="(item, j) in config.items"
                  :key="j"
                  :name="item.id"
                >
                  <template slot="title">
                    <div class="header">
                      <span class="title">{{ item.field_nickname }}</span>
                      <span class="hint">{{ item.name }}</span>
                      <el-switch
                        class="switch not-selected"
                        @click.stop.native="changeFiltrate"
                        v-model="item.undisable"
                        active-text="启用筛选"
                        inactive-text="不限"
                      >
                      </el-switch>
                    </div>
                  </template>
                  <div class="body">
                    <div
                      class="lock_filtrate"
                      :style="item.undisable ? 'display:none' : ''"
                    ></div>
                    <div v-if="item.template_id === 'A0001'">
                      <div>
                        <el-radio
                          style="margin: 10px 0"
                          v-model="item.number"
                          label="0"
                          @change="changeFiltrate"
                        >
                          <span class="title">数值区间</span>
                          <span class="hint">（例如 1000~5000）</span>
                        </el-radio>
                        <div
                          v-if="item.number === '0'"
                          style="margin: 10px 0; font-size: 16px; color: black"
                        >
                          从
                          <el-input
                            style="width: 300px; margin: 0 10px"
                            v-model.trim="item.from"
                            placeholder="请输入初始数值"
                            onkeyup="value=value.replace(/[^\d]/g,'')"
                          >
                          </el-input>
                          到
                          <el-input
                            style="width: 300px; margin: 0 10px"
                            v-model.trim="item.to"
                            placeholder="请输入结束数值"
                            onkeyup="value=value.replace(/[^\d]/g,'')"
                          >
                          </el-input>
                        </div>
                      </div>
                      <div>
                        <el-radio
                          style="margin: 10px 0"
                          v-model="item.number"
                          label="1"
                          @change="changeFiltrate"
                        >
                          <span class="title">精确数值</span>
                          <span class="hint">（例如 1000、2000、3000）</span>
                        </el-radio>
                        <div v-if="item.number === '1'" style="margin: 10px 0">
                          <el-input
                            style="width: 300px"
                            v-model.trim="item.temp"
                            placeholder="请输入精确数值"
                            onkeyup="value=value.replace(/[^\d]/g,'')"
                          >
                          </el-input>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.template_id === 'A0002'">
                      <el-cascader
                        style="width: 300px; margin: 10px 0"
                        v-model="item.data"
                        :options="cityList[item.type]"
                        :props="{ multiple: true, emitPath: true }"
                        placeholder="请选择地区（多选可搜索）"
                        collapse-tags
                        clearable
                        filterable
                      >
                      </el-cascader>
                    </div>
                    <div v-if="item.template_id === 'A0003'">
                      <div>
                        <el-radio
                          style="margin: 10px 0"
                          v-model="item.number"
                          label="0"
                          @change="changeFiltrate"
                        >
                          <span class="title">日期区间</span>
                          <span class="hint">（例如 2010 ~ 2020）</span>
                        </el-radio>
                        <div
                          v-if="item.number === '0'"
                          style="margin: 10px 0; font-size: 16px; color: black"
                        >
                          <div v-if="item.type === 0">
                            从
                            <el-date-picker
                              style="width: 300px; margin: 0 10px"
                              v-model="item.from"
                              type="year"
                              align="center"
                              :value-format="dateConfig[item.type].format"
                              placeholder="请选择起始日期"
                            >
                            </el-date-picker>
                            到
                            <el-date-picker
                              style="width: 300px; margin: 0 10px"
                              v-model="item.to"
                              type="year"
                              align="center"
                              :value-format="dateConfig[item.type].format"
                              placeholder="请选择结束日期"
                            >
                            </el-date-picker>
                          </div>
                          <el-date-picker
                            style="width: 650px"
                            v-if="item.type === 1 || item.type === 2"
                            v-model="item.date"
                            :type="dateConfig[item.type].type2"
                            range-separator="至"
                            unlink-panels
                            align="center"
                            :value-format="dateConfig[item.type].format"
                            start-placeholder="请选择起始日期"
                            end-placeholder="请选择结束日期"
                          >
                          </el-date-picker>
                        </div>
                      </div>
                      <div>
                        <el-radio
                          style="margin: 10px 0"
                          v-model="item.number"
                          label="1"
                          @change="changeFiltrate"
                        >
                          <span class="title">日期节点</span>
                          <span class="hint">（例如 2010、2015、2020）</span>
                        </el-radio>
                        <div v-if="item.number === '1'" style="margin: 10px 0">
                          <el-date-picker
                            style="width: 300px"
                            v-model="item.temp"
                            :type="dateConfig[item.type].type"
                            align="center"
                            :value-format="dateConfig[item.type].format"
                            placeholder="请选择日期节点"
                          >
                          </el-date-picker>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.template_id === 'A0004'">
                      <el-select
                        style="width: 300px; margin: 10px 0"
                        v-model="item.data"
                        multiple
                        collapse-tags
                        clearable
                        filterable
                        :placeholder="
                          '请选择' + item.field_nickname + '（多选可搜索）'
                        "
                      >
                        <el-option
                          v-for="(i, index) in item.enums"
                          :key="index"
                          :label="i"
                          :value="i"
                        >
                        </el-option>
                      </el-select>
                    </div>
                    <div v-if="item.template_id === 'A0005'">
                      <el-cascader
                        style="width: 300px; margin: 10px 0"
                        v-model="item.data"
                        :options="item.selectList"
                        :props="{
                          multiple: true,
                          emitPath: false,
                          value: 'name',
                          label: 'name',
                          children: 'sub'
                        }"
                        placeholder="请选择（多选可搜索）"
                        collapse-tags
                        clearable
                        filterable
                        :show-all-levels="false"
                      >
                      </el-cascader>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <el-empty
                v-if="!config.items || config.items.length === 0"
                description="暂无筛选项"
              ></el-empty>
              <h1>字段选择</h1>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选
              </el-checkbox>
              <el-checkbox-group
                v-model="checkedList"
                @change="handleCheckedChange"
              >
                <el-checkbox
                  v-for="item in fieldList"
                  :label="item.VARIABLE_ENG"
                  :key="item.VARIABLE_ENG"
                >
                  {{ item.VARIABLE }}
                </el-checkbox>
              </el-checkbox-group>
              <div style="margin: 20px 0; display: flex; align-items: center">
                <el-button
                  class="white_button"
                  @click="processingData(0)"
                  :class="{ 'is-disabled': disable_0 || disable_6 }"
                  :disabled="disable_0 || disable_6"
                >
                  <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M512 192c156.448 0 296.021333 98.730667 418.410667 291.605333a52.938667 52.938667 0 0 1 0 56.789334C808.021333 733.269333 668.448 832 512 832c-156.448 0-296.021333-98.730667-418.410667-291.605333a52.938667 52.938667 0 0 1 0-56.789334C215.978667 290.730667 355.552 192 512 192z m0 128c-106.037333 0-192 85.962667-192 192s85.962667 192 192 192 192-85.962667 192-192-85.962667-192-192-192z m0 320c70.688 0 128-57.312 128-128s-57.312-128-128-128-128 57.312-128 128 57.312 128 128 128z"
                      fill="#0e68b4"
                    ></path>
                  </svg>
                  {{ buttonText_0 }}
                  <el-popover
                    placement="top"
                    popper-class="my_popover"
                    title="预览提示"
                    width="360"
                    trigger="hover"
                    :popper-options="{
                      boundariesElement: 'body',
                      removeOnDestroy: true
                    }"
                  >
                    <i class="el-icon-question" slot="reference"></i>
                    <div style="margin-left: 15px">
                      <div>
                        1、一次最多可预览{{ config.previewLimit }}条数据；
                      </div>
                      <div>
                        2、该功能仅限机构用户或已通过认证的个人用户使用；
                      </div>
                      <div>3、个人用户申请认证请前往个人中心。</div>
                    </div>
                  </el-popover>
                </el-button>
                <el-button
                  class="blue_button"
                  @click="processingData(2)"
                  :class="{ 'is-disabled': disable_1 || disable_7 }"
                  :disabled="disable_1 || disable_7"
                >
                  <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M498.346667 824.32L201.386667 527.36c-11.946667-11.946667-3.413333-34.133333 13.653333-34.133333H375.466667c11.946667 0 20.48-8.533333 20.48-20.48V54.613333c0-11.946667 8.533333-20.48 20.48-20.48h189.44c11.946667 0 20.48 8.533333 20.48 20.48v418.133334c0 11.946667 8.533333 20.48 20.48 20.48h160.426666c18.773333 0 27.306667 22.186667 13.653334 34.133333L525.653333 824.32c-6.826667 6.826667-20.48 6.826667-27.306666 0zM916.48 989.866667H107.52c-18.773333 0-35.84-15.36-35.84-35.84 0-18.773333 15.36-35.84 35.84-35.84h810.666667c18.773333 0 35.84 15.36 35.84 35.84-1.706667 20.48-17.066667 35.84-37.546667 35.84z"
                      fill="#ffffff"
                    ></path>
                  </svg>
                  {{ buttonText_1 }}
                  <el-popover
                    placement="top"
                    popper-class="my_popover"
                    title="下载提示"
                    width="300"
                    trigger="hover"
                    :popper-options="{
                      boundariesElement: 'body',
                      removeOnDestroy: true
                    }"
                  >
                    <i class="el-icon-question" slot="reference"></i>
                    <div style="margin-left: 15px">
                      <div>1、该功能仅限已开通该数据库的用户使用；</div>
                      <div>2、开通数据库请联系客服：17767112526。</div>
                    </div>
                  </el-popover>
                </el-button>
                <el-button
                  class="grey_button"
                  style="padding: 10px"
                  v-if="config.isShow && config.isBuy"
                  @click="determiningUserType"
                >
                  已采购
                </el-button>
                <el-button
                  class="orange_button"
                  style="padding: 10px"
                  v-else-if="config.isShow && !config.isflag"
                  @click="addToShoppingCat"
                >
                  加入购物车
                </el-button>
                <el-button
                  class="gray_button"
                  style="padding: 10px"
                  v-if="config.isShow && config.isflag"
                >
                  已添加至购物车
                </el-button>
              </div>
            </div>
            <!-- 引用规范 -->
            <div v-if="menu.name === '1'" class="tab_main">
              <div
                v-for="(text, index) in dataList.filter(
                  item => item.name === '引用规范'
                )"
                v-html="text.html"
                :key="index"
              ></div>
            </div>
            <!-- 字段说明 -->
            <div v-if="menu.name === '2'" class="tab_main fieldDesc">
              <div
                v-for="(text, index) in dataList.filter(
                  item => item.name === '字段说明'
                )"
                :key="index"
              >
                <div id="directory1">
                  <span style="padding-left: 10px">目录</span>
                </div>
                <div class="collapse">
                  <div :title="collapseTitle1" @click="collapseDirectory(1)">
                    <i :class="collapseIcon1"></i>
                  </div>
                </div>
                <div
                  id="dataSynopsis1"
                  class="backtop"
                  v-html="text.html"
                ></div>
              </div>

              <!-- 跳转顶部 -->
              <div id="back_top1" @click="backTop(1)" class="hide">
                <i class="el-icon-caret-top"></i>
              </div>
            </div>
            <!-- 数据库简介 -->
            <div
              v-if="menu.name === '3'"
              class="tab_main dataSynopsis"
              id="vessel"
            >
              <div
                v-for="(text, index) in dataList.filter(
                  item => item.name === '数据简介'
                )"
                :key="index"
              >
                <div id="directory2">
                  <span style="padding-left: 10px">目录</span>
                </div>
                <div class="collapse">
                  <div :title="collapseTitle2" @click="collapseDirectory(2)">
                    <i :class="collapseIcon2"></i>
                  </div>
                </div>
                <div
                  id="dataSynopsis2"
                  class="backtop"
                  v-html="text.html"
                ></div>
              </div>

              <!-- 跳转顶部 -->
              <div id="back_top2" @click="backTop(2)" class="hide">
                <i class="el-icon-caret-top"></i>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 数据预览 -->
    <el-dialog
      :title="'当前共显示' + tableList.length + '条数据'"
      :visible.sync="dataDialog"
      width="1200px"
      top="0"
      custom-class="dataDialog"
      :destroy-on-close="true"
    >
      <el-table
        :data="tableList"
        v-loading="dataLoading"
        height="100%"
        stripe
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in tableHeader"
          :key="index"
          :prop="index + ''"
          :label="item"
          :render-header="renderHeader"
          sortable
          show-overflow-tooltip
        >
        </el-table-column>
        <template slot="empty">
          <el-empty description="暂无数据"></el-empty>
        </template>
      </el-table>
    </el-dialog>
    <!-- 下载数据 -->
    <el-dialog
      title="下载数据"
      :visible.sync="downloadDialog"
      width="600px"
      top="0"
      custom-class="downloadDialog"
      :destroy-on-close="true"
      :before-close="closeDialog_0"
      v-loading="dialogLoading_0"
      element-loading-text="正在下载"
    >
      <div>
        当前筛选条件下，共有<span
          style="color: #0e68b4; font-size: 24px; font-weight: 700"
          >{{ downloadInfo.count }}</span
        >条数据
      </div>
      <div v-if="downloadInfo.count !== 0">
        <div style="margin: 25px 0 10px">选择需下载的数据行数：</div>
        <el-select
          v-model="downloadInfo.value"
          style="width: 90%; margin-bottom: 30px"
          v-el-select-lazyloading="lazyloading"
        >
          <el-option
            v-for="(item, index) in downloadInfo.selectList"
            :key="index"
            :label="item.label"
            :value="item.value"
            :disabled="item.disable"
          >
          </el-option>
        </el-select>
        <div v-if="downloadInfo.status === '1'" style="font-size: 14px">
          您当前为
          <span style="color: #0e68b4">机构IP正式用户</span>
          ，每次可下载
          <span style="color: #0e68b4">{{ config.limit }}</span>
          条数据
        </div>
        <div v-else style="font-size: 14px">
          您当前为
          <span style="color: #0e68b4">机构IP试用用户</span>
          ，最多可下载前
          <span style="color: #0e68b4">1000</span>
          条数据
          <div
            style="color: #0e68b4; text-decoration: underline; margin: 10px 0"
          >
            <span style="cursor: pointer" @click="jumpRouter(4)">
              *如何成为正式用户？
            </span>
          </div>
        </div>
      </div>
      <el-empty
        v-else
        description="暂无数据"
        style="padding: 10px 0"
        :image-size="100"
      ></el-empty>
      <span slot="footer">
        <el-button class="white_button" @click="closeDialog_0">取 消</el-button>
        <el-button
          class="blue_button"
          @click="processingData(1)"
          :class="{ 'is-disabled': disable_5 }"
          :disabled="disable_5"
          >下 载</el-button
        >
      </span>
    </el-dialog>
    <!-- 输入验证码 -->
    <el-dialog
      title="输入验证码"
      :visible.sync="codeDialog"
      width="400px"
      top="0"
      custom-class="codeDialog"
      :destroy-on-close="true"
      :before-close="closeDialog_1"
      v-loading="dialogLoading_1"
      element-loading-text="正在下载"
      append-to-body
    >
      <div style="display: flex; align-items: center">
        <el-input
          style="width: 230px; margin-right: 20px"
          placeholder="请输入验证码"
          @keydown.enter.native="processingData(3)"
          v-model.trim="code"
          maxlength="4"
          show-word-limit
          autofocus
          onkeyup="value=value.replace(/[^\d\w]/g,'')"
          @input="checkCode"
        >
        </el-input>
        <el-image
          style="width: 110px; height: 40px"
          :src="authCodeImg"
          @click="getAuthCode"
        ></el-image>
      </div>
      <span slot="footer">
        <el-button class="white_button" @click="closeDialog_1">取 消</el-button>
        <el-button
          class="blue_button"
          @click="processingData(3)"
          :class="{ 'is-disabled': disable_3 }"
          :disabled="disable_3"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
import XLSX from "xlsx";

export default {
  name: "DatabaseTable",
  data() {
    return {
      // 页面加载
      loading: true,
      // 页面参数
      query: {},
      // 当前登入用户
      userInfo: {},
      // 面包屑
      breadcrumbList: [],
      // 表格树
      databaseTree: [],
      // 当前活动页面
      activeName: "0",
      menuList: [
        {
          label: "数据查询下载",
          name: "0"
        },
        {
          label: "引用规范",
          name: "1"
        },
        {
          label: "字段说明",
          name: "2"
        },
        {
          label: "数据库简介",
          name: "3"
        }
      ],
      // 表格配置
      config: {},
      // 表格字段
      fieldList: [],
      // 展示数据
      dataList: [],
      // 筛选组件列表
      filtrateList: [
        {
          template_id: "A0001",
          name: "数值筛选"
        },
        {
          template_id: "A0002",
          name: "地区筛选"
        },
        {
          template_id: "A0003",
          name: "日期筛选"
        },
        {
          template_id: "A0004",
          name: "枚举值筛选"
        },
        {
          template_id: "A0005",
          name: "层级筛选"
        }
      ],
      // 当前展开面板
      activeNames: [],
      // 城市列表
      cityList: [],
      // 日期筛选配置
      dateConfig: [
        {
          type: "year",
          format: "yyyy"
        },
        {
          type: "month",
          type2: "monthrange",
          format: "yyyy-MM"
        },
        {
          type: "date",
          type2: "daterange",
          format: "yyyy-MM-dd"
        }
      ],
      // 表格字段全选
      checkAll: true,
      checkedList: [],
      isIndeterminate: false,
      // 按钮文字
      buttonText_0: "预览数据",
      buttonText_1: "下载数据",
      // 禁用按钮
      disable_0: false,
      disable_1: false,
      disable_2: false,
      disable_3: true,
      disable_4: false,
      disable_5: false,
      disable_6: false,
      disable_7: false,
      // 倒计时
      interval_0: null,
      interval_1: null,
      // 数据预览
      dataDialog: false,
      dataLoading: true,
      // 数据下载
      downloadLoading: false,
      dialogLoading_0: false,
      dialogLoading_1: false,
      // 表头信息
      tableHeader: [],
      // 表格数据
      tableList: [],
      // 下载弹窗
      downloadDialog: false,
      // 下载信息
      downloadInfo: {
        count: 0,
        allSelectList: [],
        selectList: [],
        status: "2",
        value: [],
        pageNum: 0,
        totalPage: 0
      },
      // 验证码弹窗
      codeDialog: false,
      // 验证码
      code: "",
      imgCode: "",
      authCodeImg: "",
      // 是否生成目录
      isCreateDirectory1: true,
      isCreateDirectory2: true,
      // 显示数据简介目录
      isShowDirectory1: true,
      isShowDirectory2: true,
      // 折叠标题
      collapseTitle1: "收起",
      collapseTitle2: "收起",
      // 折叠图标
      collapseIcon1: "el-icon-arrow-left",
      collapseIcon2: "el-icon-arrow-left"
    };
  },
  methods: {
    // 跳转路由
    jumpRouter(val) {
      let path = "/data_center/" + this.query.database;
      let params = {};
      switch (val) {
        case 0:
          this.$router.push(path);
          break;
        case 1:
          params = {
            b_database: this.breadcrumbList[1].name,
            b_database_eng: this.breadcrumbList[1].code
          };
          this.$router.push({
            path: path,
            query: params
          });
          break;
        case 2:
          params = {
            b_database: this.breadcrumbList[1].name,
            b_database_eng: this.breadcrumbList[1].code,
            part: this.breadcrumbList[2].name,
            part_eng: this.breadcrumbList[2].code
          };
          this.$router.push({
            path: path,
            query: params
          });
          break;
        case 4:
          this.$router.push("/service/question");
          break;
      }
    },
    // 获取当前登入用户
    getUserInfo() {
      this.loading = true;
      this.userInfo = this.$store.getters.getUserInfo;
      if (!this.userInfo.name) {
        this.$router.push("/data_center");
      } else {
        this.init();
      }
    },
    // 初始化
    async init() {
      // 获取页面参数
      this.query = this.$route.query;
      // 获取面包屑
      let menuList = this.$store.getters.getMenuList;
      if (menuList && menuList.length > 0) {
        // 匹配数据库
        menuList.forEach(i => {
          if (i.children && i.children.length > 0) {
            i.children.forEach(j => {
              if (j.DATABASE_ENG === this.query.database) {
                this.breadcrumbList[0] = {
                  name: j.DATABASE.trim(),
                  code: j.DATABASE_ENG.trim()
                };
              }
            });
          }
        });
        if (this.breadcrumbList.length !== 1) this.$router.push("/data_center");
        // 匹配表
        this.databaseTree = [];
        await this.$http
          .post(process.env.API_ROOT + "/database/tree", {
            database: this.breadcrumbList[0].name,
            databaseEng: this.breadcrumbList[0].code
          })
          .then(data => {
            let res = data.data;
            // 获取失败
            if (res.status !== 0) {
              this.$router.push("/data_center");
            }
            // 获取成功，处理数据
            else {
              this.databaseTree = res.data.dataTree._sub;
              if (this.databaseTree && this.databaseTree.length > 0) {
                this.databaseTree.some(b_database => {
                  if (this.breadcrumbList.length === 4) return true;
                  if (b_database._sub && b_database._sub.length > 0) {
                    b_database._sub.some(part => {
                      if (this.breadcrumbList.length === 4) return true;
                      if (part._sub && part._sub.length > 0) {
                        part._sub.some(table => {
                          if (this.breadcrumbList.length === 4) return true;
                          if (table.TABLE_ENG === this.query.code) {
                            this.breadcrumbList[1] = {
                              name: b_database.B_DATABASE.trim(),
                              code: b_database.B_DATABASE_ENG.trim()
                            };
                            this.breadcrumbList[2] = {
                              name: part.PART.trim(),
                              code: part.PART_ENG.trim()
                            };
                            this.breadcrumbList[3] = {
                              name: table.TABLE.trim(),
                              code: table.TABLE_ENG.trim()
                            };
                            return true;
                          }
                        });
                      }
                    });
                  }
                });
              }
              if (this.breadcrumbList.length !== 4)
                this.$router.push("/data_center");
              else {
                // 获取表格数据
                this.getTableData();
                // 获取城市列表
                this.getCityList();
              }
            }
          })
          .catch(() => {
            this.$router.push("/data_center");
          });
      }
    },
    // 获取表格数据
    async getTableData() {
      this.$forceUpdate();

      let i = 0;
      // 获取表格字段
      this.fieldList = [];
      await this.$http
        .post(
          process.env.API_ROOT + "/table/field",
          {
            databaseEng: this.query.database,
            tableEng: this.query.code
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
            this.$message.error("获取表格字段失败，" + res.message);
          }
          // 获取成功，整理数据
          else {
            this.fieldList = res.data;
            if (this.fieldList && this.fieldList.length > 0) {
              this.checkedList = [];
              this.fieldList.forEach(item => {
                this.checkedList.push(item.VARIABLE_ENG);
              });
              this.checkAll = true;
              this.isIndeterminate = false;
            }
          }
        })
        .catch(() => {
          this.$message.error("获取表格字段失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          i++;
          if (i >= 2) this.loading = false;
          this.disable_6 = this.disable_7 = this.checkedList.length === 0;
        });

      // 获取表格配置
      this.config = {};
      await this.$http
        .post(
          process.env.API_ROOT + "/table/module",
          {
            time: new Date().getTime(),
            databaseEng: this.query.database,
            tableEng: this.query.code
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
            this.$message.error("获取筛选组件失败，" + res.message);
          }
          // 获取成功，整理数据
          else {
            if (res.data.items) res.data.items = JSON.parse(res.data.items);
            this.config = res.data;
            if (this.config.items && this.config.items.length > 0) {
              this.config.items.forEach(item => {
                item.id = this.getId();
                this.activeNames.push(item.id);
                item.undisable = false;
                if (
                  item.template_id === "A0001" ||
                  item.template_id === "A0003"
                )
                  item.number = "0";
                this.filtrateList.forEach(a => {
                  if (item.template_id === a.template_id) item.name = a.name;
                });
              });
            }
          }
        })
        .catch(() => {
          this.$message.error("获取筛选组件失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          i++;
          if (i >= 2) this.loading = false;
        });
    },
    // 获取引用规范及数据库简介
    async getDatabaseInfo(name) {
      if (this.dataList.map(item => item.name).includes(name)) {
        if (name === "数据简介")
          this.$nextTick(() => {
            this.createDirectory2();
          });
        return;
      }
      this.loading = true;
      await this.$http
        .post(process.env.API_ROOT + "/table/page_module", {
          databaseEng: this.query.database,
          tableEng: this.query.code
        })
        .then(data => {
          let res = data.data;
          // 获取失败，根据 message 返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("获取数据失败，" + res.message);
          }
          // 获取成功，整理数据
          else if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              if (item.name === "数据简介")
                item.html = this.highlight(item.html);
              if (!this.dataList.map(item => item.name).includes(item.name))
                this.dataList.push(item);
            });
          }
        })
        .catch(() => {
          this.$message.error("获取数据失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
          if (name === "数据简介")
            this.$nextTick(() => {
              this.createDirectory2();
            });
        });
    },
    // 获取字段说明
    async getFiledDes() {
      if (this.dataList.map(item => item.name).includes("字段说明")) {
        this.$nextTick(() => {
          this.createDirectory1();
        });
        return;
      }
      this.loading = true;

      await this.$http
        .post(process.env.API_ROOT + "/table/filedDes", {
          databaseEng: this.query.database
        })
        .then(data => {
          let res = data.data;
          // 获取失败，根据 message 返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("获取字段说明失败，" + res.message);
          }
          // 获取成功，整理数据
          else {
            res = res.data;
            let html =
              '<table style="border-collapse: collapse; width: 100%;" border="1">' +
              "<tbody>" +
              "<tr>" +
              '<th style="width: 100%; text-align: center; padding: 5px" colspan="7">' +
              '<span style="font-size: 20px;">' +
              this.breadcrumbList[0].name +
              "</span>" +
              "</th>" +
              "</tr>" +
              "<tr>" +
              '<td style="width: 10%">子库</td>' +
              '<td style="width: 10%">模块</td>' +
              '<td style="width: 15%">表格</td>' +
              '<td style="width: 15%">字段</td>' +
              '<td style="width: 30%">字段说明</td>' +
              '<td style="width: 10%">区间范围</td>' +
              '<td style="width: 10%">数据量</td>' +
              "</tr>";
            if (res.data && res.data.length > 0) {
              res.data.forEach(a => {
                // 子库
                a.count = 0;
                if (a._sub && a._sub.length > 0)
                  a._sub.forEach(b => {
                    // 模块
                    b.count = 0;
                    if (b._sub && b._sub.length > 0)
                      b._sub.forEach(c => {
                        // 表格
                        c.count = 0;
                        if (!c._sub || c._sub.length === 0)
                          c._sub = [{ name: "-", desc: "-" }];
                        c._sub.forEach(d => {
                          // 字段
                          a.count++;
                          b.count++;
                          c.count++;
                          d.desc = d.desc ? d.desc : "-";
                        });
                        c.range = c.range ? c.range : "-";
                        c.number = c.number ? c.number : "-";
                      });
                  });
              });
              res.data.forEach(item => {
                html +=
                  "<tr>" +
                  '<td rowspan="' +
                  item.count +
                  '" style="position: relative">' +
                  '<div style="position: absolute; top: 10px; bottom: 10px">' +
                  '<span style="position: sticky; top: 0" class="b_database">' +
                  item.name +
                  "</span>" +
                  "</div>" +
                  "</td>";
                for (let i = 0; i < item._sub.length; i++) {
                  if (i !== 0) html += "<tr>";
                  html +=
                    '<td rowspan="' +
                    item._sub[i].count +
                    '" style="position: relative">' +
                    '<div style="position: absolute; top: 10px; bottom: 10px">' +
                    '<span style="position: sticky; top: 0" class="part">' +
                    item._sub[i].name +
                    "</span>" +
                    "</div>" +
                    "</td>";
                  for (let j = 0; j < item._sub[i]._sub.length; j++) {
                    if (j !== 0) html += "<tr>";
                    if (item._sub[i]._sub[j].count === 1)
                      if (item._sub[i]._sub[j].name.length <= 14)
                        html +=
                          '<td rowspan="' +
                          item._sub[i]._sub[j].count +
                          '" style="height: 35px; position: relative">';
                      else
                        html +=
                          '<td rowspan="' +
                          item._sub[i]._sub[j].count +
                          '" style="height: 55px; position: relative">';
                    else
                      html +=
                        '<td rowspan="' +
                        item._sub[i]._sub[j].count +
                        '" style="position: relative">';
                    html +=
                      '<div style="position: absolute; top: 10px; bottom: 10px">';
                    if (
                      this.breadcrumbList[1].name === item.name &&
                      this.breadcrumbList[2].name === item._sub[i].name &&
                      this.breadcrumbList[3].name === item._sub[i]._sub[j].name
                    )
                      html +=
                        '<span style="position: sticky; top: 0; background: #0e68b4; color: white" class="table key1">' +
                        item._sub[i]._sub[j].name +
                        "</span>";
                    else
                      html +=
                        '<span style="position: sticky; top: 0" class="table">' +
                        item._sub[i]._sub[j].name +
                        "</span>";
                    html += "</div></td>";
                    for (let k = 0; k < item._sub[i]._sub[j]._sub.length; k++) {
                      if (k !== 0) html += "<tr>";
                      html +=
                        "<td>" +
                        item._sub[i]._sub[j]._sub[k].name +
                        "</td>" +
                        "<td>" +
                        item._sub[i]._sub[j]._sub[k].desc +
                        "</td>";
                      if (k === 0)
                        html +=
                          '<td rowspan="' +
                          item._sub[i]._sub[j].count +
                          '" style="position: relative">' +
                          '<div style="position: absolute; top: 10px; bottom: 10px">' +
                          '<span style="position: sticky; top: 0">' +
                          item._sub[i]._sub[j].range +
                          "</span>" +
                          "</div>" +
                          "</td>" +
                          '<td rowspan="' +
                          item._sub[i]._sub[j].count +
                          '" style="position: relative">' +
                          '<div style="position: absolute; top: 10px; bottom: 10px">' +
                          '<span style="position: sticky; top: 0">' +
                          item._sub[i]._sub[j].number +
                          "</span>" +
                          "</div>" +
                          "</td>";
                      if (k !== 0) html += "</tr>";
                    }
                    if (j !== 0) html += "</tr>";
                  }
                  if (i !== 0) html += "</tr>";
                }
                html += "</tr>";
              });
            }
            html += "</tbody></table>";
            this.dataList.push({
              name: "字段说明",
              html: html
            });
          }
        })
        .catch(() => {
          this.$message.error("获取字段说明失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
          this.$nextTick(() => {
            this.createDirectory1();
          });
        });
    },
    // 获取城市列表
    async getCityList() {
      this.cityList = this.$store.getters.getCityList;
      if (!this.cityList || this.cityList.length !== 3) {
        // 从city.json文件中获取
        await this.$http
          .get("../../../../static/city.json")
          .then(data => {
            let res = data.data.data;
            // 排序
            res.sort((a, b) => {
              return a.code - b.code;
            });
            res.forEach(items => {
              if (items.children && items.children.length > 1) {
                items.children.sort((a, b) => {
                  return a.code - b.code;
                });
              }
            });
            res.forEach(items => {
              if (items.children && items.children.length > 0) {
                items.children.forEach(item => {
                  if (item.children && item.children.length > 1) {
                    item.children.sort((a, b) => {
                      return a.code - b.code;
                    });
                  }
                });
              }
            });
            let city_0 = [];
            let city_1 = [];
            let city_2 = [];
            // 省
            res.forEach(province => {
              let i = {
                label: province.name,
                value: {
                  name: province.name,
                  code: province.code
                }
              };
              city_0.push(i);
            });
            // 省、市
            res.forEach(province => {
              let i = {
                label: province.name,
                value: {
                  name: province.name,
                  code: province.code
                },
                children: []
              };
              if (province.children && province.children.length > 0) {
                province.children.forEach(city => {
                  let j = {
                    label: city.name,
                    value: {
                      name: city.name,
                      code: city.code
                    }
                  };
                  i.children.push(j);
                });
              }
              city_1.push(i);
            });
            // 省、市、县
            res.forEach(province => {
              let i = {
                label: province.name,
                value: {
                  name: province.name,
                  code: province.code
                },
                children: []
              };
              if (province.children && province.children.length > 0) {
                province.children.forEach(city => {
                  let j = {
                    label: city.name,
                    value: {
                      name: city.name,
                      code: city.code
                    },
                    children: []
                  };
                  if (city.children && city.children.length > 0) {
                    city.children.forEach(county => {
                      let k = {
                        label: county.name,
                        value: {
                          name: county.name,
                          code: county.code
                        }
                      };
                      j.children.push(k);
                    });
                  }
                  i.children.push(j);
                });
              }
              city_2.push(i);
            });
            this.cityList = [city_0, city_1, city_2];
            this.$store.commit("setCityList", this.cityList);
          })
          .catch(() => {});
      }
    },
    // 高亮显示搜索字段
    highlight(text) {
      if (text) {
        const highlightStr = `><span class="key2">${this.breadcrumbList[3].name}</span><`;
        const reg = new RegExp(">" + this.breadcrumbList[3].name + "<", "gi");
        return text.replace(reg, highlightStr);
      }
    },
    // 跳转到关键词位置（字段说明）
    jumpKey1() {
      const key = document.getElementsByClassName("key1")[0];
      if (key) {
        setTimeout(() => {
          key.scrollIntoView();
          const div = document.getElementById("dataSynopsis1");
        }, 1);
      }
    },
    // 跳转到关键词位置（数据库简介）
    jumpKey2() {
      const elements = document.getElementsByClassName("key2");
      if (elements && elements.length > 0) {
        let flag = false;
        for (let i = 0; i < elements.length; i++) {
          const children =
            elements[i].parentElement.parentElement.parentElement.children;
          if (
            children.length >= 3 &&
            children[0].innerText.indexOf(this.breadcrumbList[1].name) >= 0 &&
            children[1].innerText.indexOf(this.breadcrumbList[2].name) >= 0 &&
            children[2].innerText.indexOf(this.breadcrumbList[3].name) >= 0
          ) {
            flag = true;
            setTimeout(() => {
              let key = children[2].getElementsByClassName("key2")[0];
              key.style = "background: #0e68b4; color: white";
              if (key) {
                key.scrollIntoView();
                const div = document.getElementById("dataSynopsis2");
                div.scrollTop -= 20;
              }
            }, 10);
            break;
          }
        }
        if (!flag) {
          for (let i = 0; i < elements.length; i++) {
            const children = elements[i].parentElement.parentElement.children;
            if (
              children.length >= 3 &&
              children[0].innerText.indexOf(this.breadcrumbList[1].name) >= 0 &&
              children[1].innerText.indexOf(this.breadcrumbList[2].name) >= 0 &&
              children[2].innerText.indexOf(this.breadcrumbList[3].name) >= 0
            ) {
              setTimeout(() => {
                let key = children[2].getElementsByClassName("key2")[0];
                key.style = "background: #0e68b4; color: white";
                if (key) {
                  key.scrollIntoView();
                  const div = document.getElementById("dataSynopsis2");
                  div.scrollTop -= 20;
                }
              }, 10);
              break;
            }
          }
        }
      }
    },
    // 生成唯一id
    getId() {
      let s = [];
      let hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      s[8] = s[13] = s[18] = s[23] = "-";
      return s.join("");
    },
    // 点击筛选开关
    changeFiltrate() {
      this.$forceUpdate();
    },
    // 全选
    handleCheckAllChange(val) {
      this.checkedList = [];
      if (val) {
        if (this.fieldList && this.fieldList.length > 0) {
          this.fieldList.forEach(item => {
            this.checkedList.push(item.VARIABLE_ENG);
          });
        }
      }
      this.isIndeterminate = false;
      this.disable_6 = this.disable_7 = this.checkedList.length === 0;
      this.$forceUpdate();
    },
    // 选择字段
    handleCheckedChange(val) {
      let count = val.length;
      this.checkAll = count === this.fieldList.length;
      this.isIndeterminate = count > 0 && count < this.fieldList.length;
      this.disable_6 = this.disable_7 = this.checkedList.length === 0;
      this.$forceUpdate();
    },
    // 处理数据
    processingData(val) {
      if (val === 0) {
        if (this.disable_0 || this.disable_6) return;
        this.disable_0 = true;
        this.buttonText_0 = "5秒后再试";
        let i = 4;
        this.interval_0 = setInterval(() => {
          this.buttonText_0 = i + "秒后再试";
          if (i <= 0) {
            this.buttonText_0 = "预览数据";
            clearInterval(this.interval_0);
            this.interval_0 = null;
            this.disable_0 = false;
          }
          i--;
        }, 1000);
      } else if (val === 1) {
        if (this.disable_5) return;
        this.disable_5 = true;
        setTimeout(() => {
          this.disable_5 = this.downloadInfo.count === 0;
        }, 2000);
      } else if (val === 2) {
        if (this.disable_1 || this.disable_2 || this.disable_7) return;
        this.disable_2 = true;
        setTimeout(() => {
          this.disable_2 = false;
        }, 2000);
      } else if (val === 3) {
        if (this.disable_3) return;
        this.disable_3 = true;
        setTimeout(() => {
          if (this.code.length === 4) this.disable_3 = false;
        }, 2000);
      }
      this.$forceUpdate();
      if (this.userInfo.type === "个人用户" && this.userInfo.status !== "1") {
        this.$confirm(
          "您暂无权限进行此操作, 是否前往个人中心申请认证?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$router.push("/user_center");
          })
          .catch(() => {});
      } else if (val === 2 && this.userInfo.type === "个人用户") {
        let content = "";
        let confirmButtonText = "";
        if (!this.config.isShow) {
          content =
            '您当前为个人用户登录，无下载数据权限，如需获取数据，可选择<span style="color: #0168b7">机构（IP）登录</span>！';
          confirmButtonText = "确定";
        } else if (this.config.isShow && this.config.isBuy) {
          content = "该表格已采购，请前往订单与发票页面查看！";
          confirmButtonText = "前往查看";
        } else if (this.config.isShow && !this.config.isflag) {
          content =
            '您当前为个人用户登录，无下载数据权限，如需获取数据，可选择<span style="color: #0168b7">机构（IP）登录</span>，或加入购物车采购结算！';
          confirmButtonText = "加入购物车";
        } else if (this.config.isShow && this.config.isflag) {
          content =
            '您当前为个人用户登录，无下载数据权限，如需获取数据，可选择<span style="color: #0168b7">机构（IP）登录</span>，或前往购物车采购结算！';
          confirmButtonText = "前往查看";
        }
        this.$confirm(content, "提示", {
          confirmButtonText: confirmButtonText,
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true
        })
          .then(() => {
            if (this.config.isShow && this.config.isBuy) {
              this.$router.push("/user_center/orders");
            } else if (this.config.isShow && !this.config.isflag) {
              this.addToShoppingCat();
            } else if (this.config.isShow && this.config.isflag) {
              this.$router.push("/user_center/shopping");
            }
          })
          .catch(() => {});
      } else {
        // 处理数据
        let data = {
          dbId: this.query.database,
          tableName: this.query.code,
          fields: this.checkedList,
          filters: {}
        };
        if (this.config.items && this.config.items.length > 0) {
          this.config.items.forEach(item => {
            if (item.undisable) {
              // 数值筛选
              if (item.template_id === "A0001") {
                let object = {
                  type: "A0001",
                  data: {}
                };
                if (item.number === "0") {
                  if (item.from && item.to) {
                    object.data = {
                      from: item.from,
                      to: item.to
                    };
                    data.filters[item.field] = object;
                  }
                } else if (item.number === "1") {
                  if (item.temp) {
                    object.data = {
                      from: item.temp,
                      to: item.temp
                    };
                    data.filters[item.field] = object;
                  }
                }
              }
              // 地区筛选
              else if (item.template_id === "A0002") {
                let object = {
                  type: "A0002",
                  data: []
                };
                if (item.data && item.data.length > 0) {
                  item.data.forEach(a => {
                    if (a && a.length > 0) {
                      a.forEach(b => {
                        object.data.push(b);
                      });
                    }
                  });
                  object.data = this.arrDistinctByProp(object.data, "code");
                  data.filters[item.field] = object;
                }
              }
              // 日期筛选
              else if (item.template_id === "A0003") {
                let object = {
                  type: "A0003",
                  data: {}
                };
                if (item.number === "0") {
                  if (item.type === 0) {
                    if (item.from && item.to) {
                      object.data = {
                        from: item.from,
                        to: item.to,
                        type: item.type
                      };
                      data.filters[item.field] = object;
                    }
                  } else if (item.type === 1 || item.type === 2) {
                    if (item.date && item.date.length === 2) {
                      object.data = {
                        from: item.date[0],
                        to: item.date[1],
                        type: item.type
                      };
                      data.filters[item.field] = object;
                    }
                  }
                } else if (item.number === "1") {
                  if (item.temp) {
                    object.data = {
                      from: item.temp,
                      to: item.temp,
                      type: item.type
                    };
                    data.filters[item.field] = object;
                  }
                }
              }
              // 枚举值筛选
              else if (item.template_id === "A0004") {
                let object = {
                  type: "A0004",
                  data: []
                };
                if (item.data && item.data.length > 0) {
                  object.data = item.data;
                  data.filters[item.field] = object;
                }
              }
              // 层级筛选
              else if (item.template_id === "A0005") {
                let object = {
                  type: "A0005",
                  data: []
                };
                if (item.data && item.data.length > 0) {
                  object.data = item.data;
                  data.filters[item.field] = object;
                }
              }
            }
          });
        }
        this.tableHeader = [];
        if (this.checkedList && this.checkedList.length > 0) {
          this.checkedList.forEach(i => {
            if (this.fieldList && this.fieldList.length > 0) {
              this.fieldList.some(j => {
                if (i === j.VARIABLE_ENG) {
                  this.tableHeader.push(j.VARIABLE);
                  return true;
                }
              });
            }
          });
        }
        if (val === 0) {
          data.type = 1;
          this.dataDialog = true;
          this.dataLoading = true;
          this.previewData(data);
        } else if (val === 1) {
          data.type = 2;
          data.value = this.downloadInfo.value;
          this.dialogLoading_0 = true;
          this.previewData(data);
        } else if (val === 2) {
          this.downloadLoading = true;
          this.getCount(data);
        } else if (val === 3) {
          data.type = 2;
          data.value = this.downloadInfo.value;
          data.code = this.code;
          data.imgCode = this.imgCode;
          this.dialogLoading_1 = true;
          this.previewData(data);
        }
      }
    },
    // 对象数组去重
    arrDistinctByProp(arr, prop) {
      let obj = {};
      return arr.reduce((preValue, item) => {
        obj[item[prop]] ? "" : (obj[item[prop]] = true && preValue.push(item));
        return preValue;
      }, []);
    },
    // 关闭弹窗
    closeDialog_0() {
      this.downloadDialog = false;
      this.downloadInfo.allSelectList = [];
      this.downloadInfo.selectList = [];
      this.downloadInfo.pageNum = 0;
    },
    closeDialog_1() {
      this.codeDialog = false;
      this.code = "";
      this.imgCode = "";
      this.authCodeImg = "";
    },
    // 获取数据量
    getCount(val) {
      /* if (this.downloadInfo.flag) {
        this.downloadDialog = true;
        this.downloadLoading = false;
        return;
      } */
      this.$http
        .post(process.env.API_ROOT + "/table/count", val, {
          headers: {
            token: this.userInfo.token
          }
        })
        .then(data => {
          let res = data.data;
          // 获取失败，根据message返回错误信息
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("数据信息获取失败，" + res.message);
          }
          // 获取成功，处理数据
          else {
            this.downloadDialog = true;
            this.downloadInfo.count = res.data.count;
            this.disable_5 = this.downloadInfo.count === 0;
            this.downloadInfo.status = res.data.status;
            let limit = this.config.limit;
            if (!(limit > 0)) limit = 1000;
            this.downloadInfo.allSelectList = [];
            if (this.downloadInfo.count > 0) {
              if (this.downloadInfo.count <= limit)
                this.downloadInfo.allSelectList.push({
                  label: "第1条-第" + this.downloadInfo.count + "条",
                  value: 1 + "," + this.downloadInfo.count,
                  disable: false
                });
              else
                this.downloadInfo.allSelectList.push({
                  label: "第1条-第" + limit + "条",
                  value: 1 + "," + limit,
                  disable: false
                });
              let i = 1;
              let flag = this.downloadInfo.status === "2";
              for (; i < Math.floor(this.downloadInfo.count / limit); i++) {
                let form = i * limit + 1;
                let to = (i + 1) * limit;
                this.downloadInfo.allSelectList.push({
                  label: "第" + form + "条-第" + to + "条",
                  value: form + "," + to,
                  disable: flag
                });
              }
              if (i * limit + 1 <= this.downloadInfo.count) {
                this.downloadInfo.allSelectList.push({
                  label:
                    "第" +
                    (i * limit + 1) +
                    "条-第" +
                    this.downloadInfo.count +
                    "条",
                  value: i * limit + 1 + "," + this.downloadInfo.count,
                  disable: flag
                });
              }
            }
            if (this.downloadInfo.allSelectList.length > 0) {
              this.downloadInfo.value = this.downloadInfo.allSelectList[0].value;
              this.downloadInfo.totalPage =
                Number.parseInt(this.downloadInfo.allSelectList.length / 100) +
                1;
              this.downloadInfo.pageNum = 0;
              this.lazyloading();
            }
            this.downloadInfo.flag = true;
          }
        })
        .catch(err => {
          if (err.response.status === 503)
            this.$message.error("访问太过频繁，请稍后再试！");
          else {
            this.$message.error("数据信息获取失败，服务器错误，请稍后再试！");
          }
        })
        .finally(() => {
          this.downloadLoading = false;
        });
    },
    // select懒加载
    lazyloading() {
      if (this.downloadInfo.pageNum < this.downloadInfo.totalPage) {
        for (
          let i = this.downloadInfo.pageNum * 100;
          i < (this.downloadInfo.pageNum + 1) * 100;
          i++
        ) {
          if (!this.downloadInfo.allSelectList[i]) break;
          this.downloadInfo.selectList.push(this.downloadInfo.allSelectList[i]);
        }
        this.downloadInfo.pageNum++;
        this.$forceUpdate();
      }
    },
    // 预览数据
    async previewData(val) {
      this.tableList = [];
      await this.$http
        .post(process.env.API_ROOT + "/table/preview", val, {
          headers: {
            token: this.userInfo.token,
            sign: window.crypt_tool.encrypt(
              val.tableName + "@@" + parseInt(new Date().getTime() / 1000)
            )
          }
        })
        .then(data => {
          let res = data.data;
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            if (val.type === 1)
              this.$message.error("预览数据失败，" + res.message);
            else if (val.type === 2)
              this.$message.error("下载数据失败，" + res.message);
            if (val.code) {
              this.code = "";
              this.getAuthCode();
            }
          } else {
            if (!res.data.imgBytes) {
              this.closeDialog_0();
              this.closeDialog_1();
              this.tableList = res.data;
              if (val.type === 2) {
                this.disable_1 = true;
                this.buttonText_1 = "5秒后再试";
                let i = 4;
                this.interval_1 = setInterval(() => {
                  this.buttonText_1 = i + "秒后再试";
                  if (i <= 0) {
                    this.buttonText_1 = "下载数据";
                    clearInterval(this.interval_1);
                    this.interval_1 = null;
                    this.disable_1 = false;
                  }
                  i--;
                }, 1000);
                this.downloadData();
              }
            } else {
              this.codeDialog = true;
              this.authCodeImg = res.data.imgBytes;
              this.imgCode = res.data.imgCode;
            }
          }
        })
        .catch(err => {
          if (err.response.status === 503)
            this.$message.error("访问太过频繁，请稍后再试！");
          else {
            if (val.type === 1) {
              if (!err.response.data.message)
                this.$message.error("预览数据失败，服务器错误，请稍后再试！");
              else
                this.$message.error(
                  "预览数据失败，" + err.response.data.message
                );
            } else if (val.type === 2) {
              if (!err.response.data.message)
                this.$message.error("下载数据失败，服务器错误，请稍后再试！");
              else
                this.$message.error(
                  "下载数据失败，" + err.response.data.message
                );
            }
          }
          if (val.code) {
            this.code = "";
            this.getAuthCode();
          }
        })
        .finally(() => {
          this.dataLoading = false;
          this.downloadLoading = false;
          this.dialogLoading_0 = false;
          this.dialogLoading_1 = false;
        });
    },
    // 表头部重新渲染
    renderHeader(h, { column, $index }) {
      let span = document.createElement("span");
      span.innerText = column.label;
      document.body.appendChild(span);
      column.minWidth = span.getBoundingClientRect().width + 60;
      document.body.removeChild(span);
      return h("span", column.label);
    },
    // 下载数据
    downloadData() {
      // 定义文件名
      let now = new Date();
      let year = now
        .getFullYear()
        .toString()
        .substr(2, 2);
      let month = now.getMonth() + 1;
      let date = now.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (date >= 0 && date <= 9) {
        date = "0" + date;
      }
      let hour = now.getHours();
      let minute = now.getMinutes();
      let second = now.getSeconds();
      if (hour >= 1 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
      }
      if (second >= 0 && second <= 9) {
        second = "0" + second;
      }
      let filename =
        this.breadcrumbList[2].name +
        "-" +
        this.breadcrumbList[3].name +
        "-" +
        year +
        month +
        date +
        hour +
        minute +
        second;

      // 表头
      const tHeader = this.tableHeader;
      // 对应属性名
      const filterVal = [];
      for (let i = 0; i < this.tableHeader.length; i++) {
        filterVal.push(i + "");
      }
      // 导出的数据
      const list = this.tableList;

      import("../../../../static/Export2Excel")
        .then(excel => {
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: filename
          });
        })
        .catch(err => {
          const data = XLSX.utils.json_to_sheet(this.formatData(tHeader, list));
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, data, "kalacloud-data");
          XLSX.writeFile(wb, filename + ".xlsx");
        });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    formatData(header, data) {
      let arr = [];
      if (data && data.length > 0)
        data.forEach(item => {
          let obj = {};
          for (let i = 0; i < header.length; i++) {
            obj[header[i]] = item[i];
          }
          arr.push(obj);
        });
      return arr;
    },
    // 检查验证码
    checkCode() {
      this.disable_3 = !(this.code.length === 4);
      this.$forceUpdate();
    },
    // 获取验证码
    async getAuthCode() {
      if (this.disable_4) return;
      this.disable_4 = true;
      setTimeout(() => {
        this.disable_4 = false;
      }, 1000);
      await this.$http
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
            this.imgCode = res.data.imgCode;
          }
        })
        .catch(err => {
          if (err.response.status === 503)
            this.$message.error("访问太过频繁，请稍后再试！");
        });
    },
    // 弹出联系客服二维码
    openQRCode(val) {
      this.$emit("openQRCode", val);
    },
    // 折叠、打开目录
    collapseDirectory(val) {
      this["isShowDirectory" + val] = !this["isShowDirectory" + val];
      this["collapseTitle" + val] = this["isShowDirectory" + val]
        ? "收起"
        : "展开";
      this["collapseIcon" + val] = this["isShowDirectory" + val]
        ? "el-icon-arrow-left"
        : "el-icon-arrow-right";
      document.getElementById("directory" + val).style.width = this[
        "isShowDirectory" + val
      ]
        ? "275px"
        : "0";
      document.getElementById("dataSynopsis" + val).style.width = this[
        "isShowDirectory" + val
      ]
        ? "calc(100% - 300px)"
        : "calc(100% - 25px)";
      this.$forceUpdate();
    },
    // 切换标签页
    changeTab(val) {
      if (val.name === "1") this.getDatabaseInfo("引用规范");
      else if (val.name === "2") this.getFiledDes();
      else if (val.name === "3") this.getDatabaseInfo("数据简介");
    },
    // 生成目录（字段说明）
    createDirectory1() {
      if (this.isCreateDirectory1) {
        // 不同标题等级的缩进
        let padding = [30, 45, 60];
        let name = ["b_database", "part", "table"];
        $("#dataSynopsis1")
          .find(".b_database, .part")
          .each((index, item) => {
            // 插入锚点地址
            $('<a id="b' + index + '" class="anchor1"></a>').insertBefore(item);
            let headerText = item.innerText;
            let className = item.className;
            // 根据标题等级分类，并设置不同的缩进。
            let tagIndex = name.indexOf(className);
            $("#directory1").append(
              $(
                '<a href="#b' +
                  index +
                  '" style="padding-left:' +
                  padding[tagIndex] +
                  'px;display:block;" title="' +
                  headerText +
                  '" class="directory1">' +
                  headerText +
                  "</a>"
              )
            );
          });
        if (document.getElementsByClassName("directory1")[0])
          document.getElementsByClassName("directory1")[0].className =
            "directory1 activation";
        let div = document.getElementById("dataSynopsis1");
        div.addEventListener("scroll", () => {
          this.activationDirectory1();
        });
        this.isCreateDirectory1 = false;
      }
      this.jumpKey1();
    },
    // 生成目录（数据库简介）
    createDirectory2() {
      if (this.isCreateDirectory2) {
        // 不同标题等级的缩进
        let padding = [15, 30, 45, 60, 75, 90];
        $("#dataSynopsis2")
          .find("h1, h2, h3, h4, h5, h6")
          .each((index, item) => {
            // 插入锚点地址
            $('<a id="c' + index + '" class="anchor2"></a>').insertBefore(item);
            let headerText = item.innerText;
            let tagName = item.tagName.toLowerCase();
            // 根据标题等级分类，并设置不同的缩进。
            let tagIndex = parseInt(tagName.charAt(1)) - 1;
            $("#directory2").append(
              $(
                '<a href="#c' +
                  index +
                  '" style="padding-left:' +
                  padding[tagIndex] +
                  'px;display:block;" title="' +
                  headerText +
                  '" class="directory2">' +
                  headerText +
                  "</a>"
              )
            );
          });
        if (document.getElementsByClassName("directory2")[0])
          document.getElementsByClassName("directory2")[0].className =
            "directory2 activation";
        let div = document.getElementById("dataSynopsis2");
        div.addEventListener("scroll", () => {
          this.activationDirectory2();
        });
        this.isCreateDirectory2 = false;
      }
      this.jumpKey2();
    },
    // 激活目录（字段说明）
    activationDirectory1() {
      let div = document.getElementById("dataSynopsis1");
      let scroll = div.scrollTop;
      if (scroll > 100) {
        $("#back_top1")
          .fadeIn("slow")
          .css("display", "flex");
      } else $("#back_top1").fadeOut("slow");

      // 获取元素距离 body 的高度
      let heightToBody = function(dom) {
        let top = dom.tagName === "TD" ? 0 : dom.offsetTop;
        if (dom.parentElement && dom.id !== "dataSynopsis1")
          return top + heightToBody(dom.parentElement);
        else return top;
      };

      let anchor = document.getElementsByClassName("anchor1");
      let directory = document.getElementsByClassName("directory1");
      for (let i = 0; i < anchor.length; i++) {
        directory[i].className = "directory1";
        if (i === 0) {
          if (scroll < heightToBody(anchor[i + 1]) - 1) {
            directory[i].className = "directory1 activation";
          }
        } else if (i + 1 === anchor.length) {
          if (scroll >= heightToBody(anchor[i]) - 1) {
            directory[i].className = "directory1 activation";
          }
        } else {
          if (
            scroll >= heightToBody(anchor[i]) - 1 &&
            scroll < heightToBody(anchor[i + 1]) - 1
          ) {
            directory[i].className = "directory1 activation";
          }
        }
      }
    },
    // 激活目录（数据库简介）
    activationDirectory2() {
      let div = document.getElementById("dataSynopsis2");
      let scroll = div.scrollTop;
      if (scroll > 100) {
        $("#back_top2")
          .fadeIn("slow")
          .css("display", "flex");
      } else $("#back_top2").fadeOut("slow");
      let anchor = document.getElementsByClassName("anchor2");
      let directory = document.getElementsByClassName("directory2");
      for (let i = 0; i < anchor.length; i++) {
        directory[i].className = "directory2";
        if (i === 0) {
          if (scroll < anchor[i + 1].offsetTop - 1) {
            directory[i].className = "directory2 activation";
          }
        } else if (i + 1 === anchor.length) {
          if (scroll >= anchor[i].offsetTop - 1) {
            directory[i].className = "directory2 activation";
          }
        } else {
          if (
            scroll >= anchor[i].offsetTop - 1 &&
            scroll < anchor[i + 1].offsetTop - 1
          ) {
            directory[i].className = "directory2 activation";
          }
        }
      }
    },
    // 返回顶部
    backTop(val) {
      $("#dataSynopsis" + val).animate({ scrollTop: 0 }, 800);
    },
    // 加入购物车
    async addToShoppingCat() {
      if (this.determiningUserType()) {
        this.downloadLoading = true;
        let list = [
          {
            databaseEng: this.query.database,
            tableEng: [this.query.code]
          }
        ];
        await this.$http
          .post(
            process.env.API_ROOT + "/market/shopCart",
            {
              time: new Date().getTime(),
              list: list,
              flag: true
            },
            {
              headers: {
                token: this.userInfo.token
              }
            }
          )
          .then(data => {
            let res = data.data;
            // 加入购物车失败，根据message返回错误信息
            if (res.status !== 0) {
              if (!res.message) res.message = "服务器错误，请稍后再试！";
              this.$message.error("加入购物车失败，" + res.message);
            }
            // 获取成功，处理数据
            else {
              this.config.isflag = true;
              this.$forceUpdate();
              this.$confirm(
                "已添加至购物车，请前往我的购物车页面查看！",
                "提示",
                {
                  confirmButtonText: "前往查看",
                  cancelButtonText: "取消",
                  type: "success"
                }
              )
                .then(() => {
                  this.$router.push("/user_center/shopping");
                })
                .catch(() => {});
            }
          })
          .catch(() => {
            this.$message.error("加入购物车失败，服务器错误，请稍后再试！");
          })
          .finally(() => {
            this.downloadLoading = false;
          });
      }
    },
    // 判断用户类型
    determiningUserType() {
      if (this.userInfo.type === "机构用户") {
        this.$confirm(
          "该功能仅限已认证的个人用户使用，请切换至个人账号！",
          "提示",
          {
            customClass: "data_mart_hint_dialog",
            confirmButtonText: "切换账号",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            sessionStorage.clear();
            this.userInfo = {};
            this.$store.commit("setUserInfo", this.userInfo);
            this.$router.push("/login");
          })
          .catch(() => {});
        return false;
      } else if (this.config.isBuy) {
        this.$confirm("该表格已采购，请前往订单与发票页面查看！", "提示", {
          confirmButtonText: "前往查看",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/user_center/orders");
          })
          .catch(() => {});
        return false;
      } else return true;
    }
  },
  mounted() {
    // 初始化
    this.getUserInfo();
    // 定时弹出客服二维码
    setTimeout(() => {
      this.openQRCode(true);
      setTimeout(() => {
        this.openQRCode(false);
      }, 60 * 1000);
    }, 60 * 1000);
  },
  beforeDestroy() {
    this.openQRCode(false);
  },
  directives: {
    "el-select-lazyloading": {
      bind(el, binding) {
        let SELECT_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECT_DOM.addEventListener("scroll", function() {
          let condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.database-table {
  width: 100%;
  height: 100%;
  position: relative;

  .el-breadcrumb {
    height: 50px;
    padding: 15px 20px;

    .el-breadcrumb__item {
      .el-breadcrumb__inner,
      .el-breadcrumb__separator {
        font-size: 18px;
        font-family: "黑体", "Microsoft YaHei", "serif";
        color: #333333;
        font-weight: 700;
        cursor: pointer;
      }

      .el-breadcrumb__inner:hover {
        color: black;
      }
    }
  }

  .main {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;

    .el-card__body {
      height: 100%;
      padding: 0;

      .tab {
        height: 100%;
        position: relative;

        > .el-tabs__header {
          height: 60px;
          padding: 10px 30px;
          box-sizing: border-box;
          box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
          margin: 0 0 10px;

          .el-tabs__item {
            font-size: 16px;
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
            background: #0168b7;
          }
        }

        > .el-tabs__content {
          padding: 0;
          position: absolute;
          top: 70px;
          bottom: 0;
          width: 100%;

          > .el-tab-pane {
            height: 100%;

            .tab_body {
              height: 100%;
              position: relative;

              .tab_main {
                padding: 0 150px;

                table {
                  border: 1px solid #999999;

                  tr:nth-child(2n + 1) {
                    background: white;
                  }

                  tr:nth-child(2n) {
                    background: #f5f5f5;
                  }

                  tr:nth-child(2n + 1):hover {
                    background: #f5f5f5;
                  }

                  tr {
                    border: 1px solid #999999;
                  }

                  td {
                    border: 1px solid #999999;
                    padding: 2px 5px;
                  }
                }
              }

              .tab_main.filtrate {
                h1 {
                  font-size: 22px;
                }

                .el-collapse {
                  border: none;
                  padding: 0 10px;

                  .el-collapse-item__header {
                    padding: 15px 0;

                    .header {
                      width: 95%;
                      position: relative;

                      .title {
                        font-size: 18px;
                        font-weight: 700;
                        color: #0068b7;
                      }

                      .hint {
                        font-size: 15px;
                        color: #9e9e9e;
                        margin: 0 5px;
                      }

                      .switch {
                        position: absolute;
                        top: 50%;
                        right: 0;
                        transform: scale(1.1) translate(0, -50%);

                        .is-active {
                          color: #0068b7;
                        }
                      }
                    }
                  }

                  .body {
                    position: relative;

                    > div {
                      padding: 0 20px;

                      .el-radio__input {
                        transform: scale(1.1);
                        position: relative;
                        top: -2px;
                      }

                      .title {
                        font-size: 16px;
                        font-weight: 700;
                        color: #0068b7;
                      }

                      .hint {
                        font-size: 14px;
                        color: #9e9e9e;
                        margin: 0 10px;
                      }

                      .el-date-editor {
                        .el-input__inner {
                          text-align: center;
                        }
                      }
                    }

                    .lock_filtrate {
                      z-index: 100;
                      position: absolute;
                      width: calc(100% - 10px);
                      height: 100%;
                      left: 0;
                      top: 0;
                      background-color: hsla(0, 0%, 100%, 0.5);
                      cursor: not-allowed;
                      transition: all 0.23s ease;
                    }
                  }
                }

                > .el-checkbox {
                  transform: scale(1.2);
                  transform-origin: 0 0;
                }

                .el-checkbox {
                  margin: 0 15px 10px;
                }

                .el-button {
                  border: 1px solid #0e68b4;
                  border-radius: 10px;
                  font-size: 16px;
                  margin-right: 15px;
                  padding: 8px 20px 12px;
                  width: 160px;
                  color: white;

                  svg {
                    margin-right: 3px;
                    position: relative;
                    top: 4px;
                  }

                  i {
                    font-size: 18px;
                    margin-left: 3px;
                    position: relative;
                    top: 1px;
                  }
                }

                .white_button {
                  color: #0e68b4;
                }

                .blue_button {
                  background: #0e68b4;
                }

                .grey_button {
                  line-height: 1.28;
                  background: #bbbbbb;
                  border-color: #bbbbbb;
                }

                .orange_button {
                  line-height: 1.28;
                  background: #efa53f;
                  border-color: #efa53f;
                }

                .gray_button {
                  line-height: 1.28;
                  background: #bbbbbb;
                  border-color: #bbbbbb;
                  cursor: not-allowed;
                }

                .blue_button:hover {
                  background: #0e80cc;
                }

                /* 被禁用按钮 */
                .white_button.el-button.is-disabled,
                .white_button.el-button.is-disabled:focus {
                  background: white;
                  color: #5097cb;

                  svg {
                    > path {
                      fill: #5097cb !important;
                    }
                  }
                }

                .blue_button.el-button.is-disabled,
                .blue_button.el-button.is-disabled:focus {
                  background: #5097cb;
                  color: white;
                }

                .el-button.is-disabled,
                .el-button.is-disabled:focus {
                  border: 1px solid #5097cb;

                  i {
                    cursor: pointer;
                  }
                }
              }

              .fieldDesc,
              .dataSynopsis {
                width: 100%;
                height: 100%;
                padding: 0;

                > div {
                  height: 100%;

                  #directory1,
                  #directory2 {
                    width: 275px;
                    height: 100%;
                    padding: 20px 0;
                    box-sizing: border-box;
                    float: left;
                    overflow-x: hidden;
                    overflow-y: auto;
                    transition: all 0.3s;

                    a {
                      color: #40485b;
                      margin: 6px 0;
                      text-decoration: none;
                      cursor: pointer;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }

                    a:hover {
                      color: #888888;
                    }

                    .activation {
                      color: #ee6600;
                      font-weight: 700;
                    }

                    .activation:hover {
                      color: #ee6600;
                    }
                  }

                  #directory1::-webkit-scrollbar,
                  #directory2::-webkit-scrollbar {
                    display: none;
                  }

                  .collapse {
                    width: 15px;
                    height: calc(100% - 10px);
                    border-left: 2px solid #dce3e8;
                    margin-left: 6px;
                    box-sizing: border-box;
                    position: relative;
                    display: inline-block;

                    > div {
                      z-index: 1;
                      width: 12px;
                      height: 56px;
                      position: absolute;
                      top: 50%;
                      left: 0;
                      transform: translate(0, -50%);
                      cursor: pointer;
                      background-image: url(~@/assets/icon/holder.webp);

                      i {
                        margin: 20.5px 0 0 -2px;
                        color: #b7bdcb;
                      }
                    }
                  }

                  #dataSynopsis1,
                  #dataSynopsis2 {
                    padding: 16px;
                    box-sizing: border-box;
                    width: calc(100% - 300px);
                    height: 100%;
                    float: right;
                    overflow: auto;
                    position: relative;
                    transition: all 0.3s;
                  }

                  #dataSynopsis1::-webkit-scrollbar,
                  #dataSynopsis2::-webkit-scrollbar {
                    width: 12px;
                    height: 10px;
                  }

                  #dataSynopsis1::-webkit-scrollbar-thumb,
                  #dataSynopsis2::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                    background: #b4b4b4;
                  }

                  #dataSynopsis1::-webkit-scrollbar-track,
                  #dataSynopsis2::-webkit-scrollbar-track {
                    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                    background: #ededed;
                  }
                }

                #back_top1,
                #back_top2 {
                  position: absolute;
                  right: 70px;
                  bottom: 30px;
                  background-color: #fff;
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  display: none;
                  -webkit-box-align: center;
                  -ms-flex-align: center;
                  align-items: center;
                  -webkit-box-pack: center;
                  -ms-flex-pack: center;
                  justify-content: center;
                  font-size: 20px;
                  -webkit-box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
                  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
                  cursor: pointer;
                  z-index: 5;
                  color: #409eff;
                }
              }
            }
          }
        }
      }
    }
  }

  .el-dialog__wrapper {
    padding: 115px 0;
  }

  .dataDialog {
    height: 100%;
    min-height: 600px;
    margin: 0 auto;
    border-radius: 10px;
    position: relative;

    .el-icon-close:before {
      font-size: 30px;
      font-weight: 700;
      color: #222222;
    }

    .el-dialog__header {
      padding: 20px;

      .el-dialog__title {
        font-size: 20px;
        font-weight: 700;
        color: black;
      }
    }

    .el-dialog__body {
      position: absolute;
      top: 65px;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px;
      box-sizing: border-box;

      .el-table__body-wrapper::-webkit-scrollbar {
        /* 高宽分别对应横竖滚动条的尺寸 */
        width: 12px;
        height: 7px;
      }

      .el-table__body-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #b4b4b4;
      }

      .el-table__body-wrapper::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #ededed;
      }
    }
  }

  .downloadDialog {
    height: 400px;
    margin: 0;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .el-icon-close:before {
      font-size: 30px;
      font-weight: 700;
      color: #222222;
    }

    .el-dialog__header {
      padding: 20px;

      .el-dialog__title {
        font-size: 20px;
        font-weight: 700;
        color: black;
      }
    }

    .el-dialog__body {
      position: absolute;
      top: 65px;
      bottom: 70px;
      left: 0;
      right: 0;
      padding: 0 30px;
      box-sizing: border-box;
      font-size: 16px;
      color: black;
    }

    .el-dialog__footer {
      position: absolute;
      bottom: 0;
      right: 0;

      .el-button {
        border: 1px solid #0e68b4;
        border-radius: 10px;
        font-size: 16px;
        margin-right: 15px;
        width: 80px;
      }

      .white_button {
        color: #0e68b4;
      }

      .blue_button {
        background: #0e68b4;
        color: white;
      }

      .blue_button:hover {
        background: #0e80cc;
      }

      .blue_button.el-button.is-disabled,
      .blue_button.el-button.is-disabled:focus {
        background: #5097cb;
        color: white;
        border: 1px solid #5097cb;
      }
    }
  }
}

.codeDialog {
  margin: 0;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .el-icon-close:before {
    font-size: 30px;
    font-weight: 700;
    color: #222222;
  }

  .el-dialog__header {
    padding: 20px;

    .el-dialog__title {
      font-size: 20px;
      font-weight: 700;
      color: black;
    }
  }

  .el-dialog__footer {
    .el-button {
      border: 1px solid #0e68b4;
      border-radius: 10px;
      font-size: 16px;
      margin-right: 15px;
      width: 80px;
    }

    .white_button {
      color: #0e68b4;
    }

    .blue_button {
      background: #0e68b4;
      color: white;
    }

    .blue_button:hover {
      background: #0e80cc;
    }

    .blue_button.el-button.is-disabled,
    .blue_button.el-button.is-disabled:focus {
      background: #5097cb;
      color: white;
      border: 1px solid #5097cb;
    }
  }
}

.my_popover.el-popover {
  border-radius: 10px;
  position: sticky;
  top: 0;
}

.el-tooltip__popper {
  max-width: 700px;
}

.data_mart_hint_dialog {
  width: 430px;
}
</style>
