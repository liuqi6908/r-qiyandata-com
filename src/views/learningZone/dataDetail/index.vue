<template>
  <!-- 数据详情 -->
  <div class="data-detail scrollbar bg-white" v-loading="loading">
    <!-- 详情 -->
    <div class="detail">
      <el-page-header
        @back="jumpPage(0)"
        :content="dataDetail.title"
      />
      <div class="subtitle">
        <div class="date" v-text="dataDetail.date" />
        <div class="tags">
          <span
            class="tag"
            v-for="(tag, index) in dataDetail.tags"
            :key="index"
            v-text="tag"
          />
        </div>
      </div>
      <vue-core-video-player
        v-if="dataDetail.video"
        :src="dataDetail.video"
        :autoplay="false"
        :title="dataDetail.title"
      >
      </vue-core-video-player>
      <div class="operate">
        <div class="collect not-selected" @click="collectData(dataDetail)">
          <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            v-if="dataDetail.collect"
          >
            <path
              d="M335.008 916.629333c-35.914667 22.314667-82.88 10.773333-104.693333-25.557333a77.333333 77.333333 0 0 1-8.96-57.429333l46.485333-198.24a13.141333 13.141333 0 0 0-4.021333-12.864l-152.16-132.586667c-31.605333-27.52-35.253333-75.648-8.234667-107.733333a75.68 75.68 0 0 1 51.733333-26.752L354.848 339.2c4.352-0.362667 8.245333-3.232 10.026667-7.594667l76.938666-188.170666c16.032-39.2 60.618667-57.92 99.52-41.461334a76.309333 76.309333 0 0 1 40.832 41.461334l76.938667 188.16c1.781333 4.373333 5.674667 7.253333 10.026667 7.605333l199.712 16.277333c41.877333 3.413333 72.885333 40.458667 69.568 82.517334a76.938667 76.938667 0 0 1-26.08 51.978666l-152.16 132.586667c-3.541333 3.082667-5.141333 8.074667-4.021334 12.853333l46.485334 198.24c9.621333 41.013333-15.36 82.336-56.138667 92.224a75.285333 75.285333 0 0 1-57.525333-9.237333l-170.976-106.24a11.296 11.296 0 0 0-12.010667 0l-170.986667 106.24z"
              fill="#EFBB55"
            ></path>
          </svg>
          <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            v-else
          >
            <path
              d="M335.008 916.629333c-35.914667 22.314667-82.88 10.773333-104.693333-25.557333a77.333333 77.333333 0 0 1-8.96-57.429333l46.485333-198.24a13.141333 13.141333 0 0 0-4.021333-12.864l-152.16-132.586667c-31.605333-27.52-35.253333-75.648-8.234667-107.733333a75.68 75.68 0 0 1 51.733333-26.752L354.848 339.2c4.352-0.362667 8.245333-3.232 10.026667-7.594667l76.938666-188.170666c16.032-39.2 60.618667-57.92 99.52-41.461334a76.309333 76.309333 0 0 1 40.832 41.461334l76.938667 188.16c1.781333 4.373333 5.674667 7.253333 10.026667 7.605333l199.712 16.277333c41.877333 3.413333 72.885333 40.458667 69.568 82.517334a76.938667 76.938667 0 0 1-26.08 51.978666l-152.16 132.586667c-3.541333 3.082667-5.141333 8.074667-4.021334 12.853333l46.485334 198.24c9.621333 41.013333-15.36 82.336-56.138667 92.224a75.285333 75.285333 0 0 1-57.525333-9.237333l-170.976-106.24a11.296 11.296 0 0 0-12.010667 0l-170.986667 106.24zM551.786667 756.032l170.976 106.24c2.624 1.621333 5.717333 2.122667 8.650666 1.408 6.410667-1.557333 10.56-8.426667 8.928-15.424l-46.485333-198.24a77.141333 77.141333 0 0 1 24.277333-75.733333L870.293333 441.706667c2.485333-2.165333 4.053333-5.312 4.330667-8.746667 0.565333-7.136-4.490667-13.173333-10.976-13.696l-199.712-16.288a75.989333 75.989333 0 0 1-64.064-47.168l-76.938667-188.16a12.309333 12.309333 0 0 0-6.538666-6.741333c-5.898667-2.496-12.725333 0.373333-15.328 6.741333l-76.949334 188.16a75.989333 75.989333 0 0 1-64.064 47.168l-199.701333 16.288a11.68 11.68 0 0 0-7.978667 4.181333 13.226667 13.226667 0 0 0 1.333334 18.261334l152.16 132.586666a77.141333 77.141333 0 0 1 24.277333 75.733334l-46.485333 198.229333a13.333333 13.333333 0 0 0 1.514666 9.877333c3.488 5.792 10.581333 7.530667 16.064 4.128l170.986667-106.229333a75.296 75.296 0 0 1 79.562667 0z"
              fill="#222222"
            ></path>
          </svg>
          <span v-if="dataDetail.collectNum > 0" v-text="dataDetail.collectNum" />
        </div>
        <div class="collect not-selected" @click="likeData(dataDetail)">
          <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            v-if="dataDetail.like"
          >
            <path
              d="M64 483.04V872c0 37.216 30.144 67.36 67.36 67.36H192V416.32l-60.64-0.64A67.36 67.36 0 0 0 64 483.04zM857.28 344.992l-267.808 1.696c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-68.832-155.488-137.568-145.504-60.608 8.8-67.264 61.184-67.264 126.816v59.264c0 76.064-63.84 140.864-137.856 148L256 416.96v522.4h527.552a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824z"
              fill="#ff0000"
            ></path>
          </svg>
          <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            v-else
          >
            <path
              d="M194.792475 478.69343c16.167215 0 29.330002-13.163811 29.330002-29.346375 0-16.092513-13.015432-29.212322-29.801746-29.212322-0.086981 0-0.177032 0-0.264013 0l-60.606333 0.177032c-1.560542-0.206708-3.149736-0.325411-4.76963-0.325411-21.291932 0-38.636972 17.537422-38.636972 39.09439l-0.323365 423.853427c0 21.645996 16.9613 38.578644 38.636972 38.578644l1.677199 0.057305c0.707105 0.029676 1.385557 0.059352 2.032286 0.059352 0.823761 0 1.64957-0.029676 1.826602-0.11768l59.926858 0.086981c0.559748 0 1.001817-0.11768 1.089821-0.11768 0 0-0.029676 0-0.116657 0.057305l3.76986-0.147356 0-0.382717c13.517875-2.236947 23.64656-13.84124 23.64656-27.799136 0-13.987572-10.129708-25.589818-23.64656-27.828812l0-0.766456-49.827849 0 1.413186-385.92356L194.792475 478.69036z"
              fill="#222222"
            ></path>
            <path
              d="M918.228001 436.301947c-18.199501-29.66974-45.204551-44.821835-82.22163-46.322002-1.883907-0.25071-3.799536-0.412392-5.77247-0.412392l-195.744149-0.648776c13.398148-40.359196 20.732184-83.750449 20.732184-122.740462 0-27.255761-3.00545-54.686507-8.894577-81.543178l-1.206478-3.196809-0.089028 0.01535c-12.161994-46.837748-53.477982-79.259158-101.626585-79.259158-55.393611 0-97.18032 46.248324-97.18032 107.576087l-0.059352 3.047406c-0.057305 2.222621-0.116657 4.40124 0.059352 6.16849-2.796696 101.715613-83.869153 187.397041-188.559517 199.324698l-3.358491 0.36839-0.76441 274.43128 0 228.491994 13.930267 0.005117 0.587378 0.11154 3.179412-0.027629 0.01535-0.081864 485.653959 0.198521 8.685823-0.236384c19.84907 0 31.038924-5.03569 48.621371-16.344247 16.22452-10.482749 29.359678-25.266453 37.751812-42.316781 2.562359-3.76986 4.418636-7.862062 5.565762-12.251022l75.30101-336.657506c1.089821-4.225231 1.472538-8.643867 1.149173-12.56006C935.660023 478.42737 930.212964 455.900308 918.228001 436.301947zM879.148961 488.807788l-0.912789 3.799536 0.295735 0.074701-80.129992 355.2387-0.148379 0.353041c-2.296299 5.536087-6.15314 10.160407-11.101849 13.340843-3.415796 2.209318-7.185656 3.622504-11.161201 4.239558-0.470721-0.057305-0.941442-0.057305-1.413186-0.057305l-3.03308 0.086981-462.84344-0.530073-0.177032-392.299781c79.540567-35.986609 148.155295-73.959455 183.080735-167.79868l0.295735 0.074701 1.119497-3.328815c3.709485-11.263531 6.596232-22.350031 8.598842-32.909527 5.447059-28.577872 5.212722-56.422034 5.183046-58.041928-1.766226-13.502525 1.206478-24.738427 8.80555-33.394574 8.598842-9.777691 21.673625-14.151301 30.744211-14.151301 22.586414 0.766456 45.526893 30.966269 45.61592 48.163953 0.029676 0.26606 5.38873 26.945699 5.418406 55.186903 0.057305 27.65178-2.651386 45.277206-3.858888 51.828412l-0.500397 0-0.589424 3.062755c-5.595438 29.522384-15.518438 57.794287-29.41903 84.003206l-0.972141 2.856048 0.118704 0.132006c-1.885953 4.696975-2.856048 9.643638-2.856048 14.709003 0 25.032116 27.121707 25.032116 41.697681 25.032116l233.381351 0.264013 7.15598 0.221034c1.266853 0.045025 2.503007 0.089028 3.592828 0.118704l0 0.425695 5.538133-0.248663c10.453073 0 19.937075 5.344728 25.412786 14.296611C880.709503 471.080032 881.829 480.283648 879.148961 488.807788z"
              fill="#222222"
            ></path>
          </svg>
          <span v-if="dataDetail.likeNum > 0" v-text="dataDetail.likeNum" />
        </div>
      </div>
      <div class="digest">{{ dataDetail.digest }}</div>
      <div class="content" v-if="dataDetail.text">
        <el-button type="text" @click="showText" v-if="dataDetail.show">
          收起
          <i class="el-icon-arrow-left" v-for="i in 3" :key="i"></i>
        </el-button>
        <el-button type="text" @click="showText" v-else>
          展开查看更多
          <i class="el-icon-arrow-right" v-for="i in 3" :key="i"></i>
        </el-button>
        <div
          v-html="dataDetail.text"
          id="dataDetail"
          style="display:none"
        ></div>
      </div>
      <div class="button">
        <el-button
          class="button01"
          :disabled="!dataDetail.isDocument"
          :class="{ disable: !dataDetail.isDocument }"
          @click="downloadFile(dataDetail, 0)"
        >
          下载文稿
        </el-button>
        <el-button
          class="button02"
          :disabled="!dataDetail.isCode"
          :class="{ disable: !dataDetail.isCode }"
          @click="downloadFile(dataDetail, 1)"
        >
          下载代码
        </el-button>
      </div>
    </div>

    <el-divider></el-divider>

    <!-- 推荐 -->
    <div class="recommend">
      <div class="title">相关推荐</div>
      <template v-if="recommendList && recommendList.length">
        <div
          v-for="item in recommendList"
          :key="item.id"
          class="data-item"
        >
          <el-image :src="item.cover" fit="fill" @click="jumpPage(item.id)">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div>
            <div class="title over-hidden" @click="jumpPage(item.id)">
              {{ item.title }}
            </div>
            <div class="digest">{{ item.digest }}</div>
            <div class="subtitle">
              <div class="date">
                {{ item.date }}
              </div>
              <div class="tags">
                <span class="tag" v-for="(tag, j) in item.tags" :key="j">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <el-empty v-else style="height: 400px"></el-empty>
    </div>

    <!-- 对话框 -->
    <VerifyDialog :value.sync="verifyDialog" />
  </div>
</template>

<script>
import { isUrl } from "@/util/verify";
import { isVerify } from "@/util/user";
import { getFileUrl } from "@/util/file";
import $ from "jquery";

export default {
  name: "DataDetail",
  components: {
    VerifyDialog: () => import('@/components/dialog/Verify.vue')
  },
  props: {
    page: {
      type: Number | String
    },
    codeEditor: {
      type: Number
    }
  },
  data() {
    return {
      /** 页面加载 */
      loading: true,
      /** 资料详情 */
      dataDetail: {},
      /** 禁用点赞 */
      disableLike: false,
      /** 禁用展开 */
      disableShow: false,
      /** 推荐列表 */
      recommendList: [],
      /** 认证对话框 */
      verifyDialog: false
    };
  },
  methods: {
    /** 
     * 获取资料详情
     */
    async getDataDetail() {
      try {
        const res = await this.$http.post(
          "/api/learning/getDataDetail",
          {
            id: this.page,
            time: new Date().getTime()
          },
          {
            headers: {
              token: this.userInfo.token
            }
          }
        )
        const { status, data } = res.data
        if (status !== 0 || !data) {
          throw new Error()
        }
        else {
          data.date = data.date.substring(0, 10)
          data.show = false
          this.dataDetail = data
          this.getRecommendList();
          this.$emit(
            "update:codeEditor",
            data.codeEditor > 0 ? data.codeEditor : 0
          );
        }
      }
      catch (_) {
        this.jumpPage()
      }
      finally {
        this.loading = false
      }
    },

    /** 
     * 收藏资料
     * @param {any} val 资料信息
     */
    collectData(val) {
      if (!isVerify()) {
        this.verifyDialog = true
      }
      else {
        if (val.collect)
          this.$confirm("该操作将取消收藏，是否继续？", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          })
            .then(() => {
              this.collect(val)
            })
            .catch(() => {})
        else {
          this.collect(val)
        }
      }
    },

    /**
     * 收藏
     * @param {any} val 资料信息
     */
    async collect(val) {
      try {
        this.loading = true
        const { id, collect } = val
        const res = await this.$http.post(
          "/api/learning/collect",
          {
            id,
            collect: !collect,
            time: new Date().getTime()
          },
          {
            headers: {
              token: this.userInfo.token
            }
          }
        )
        const { status, message } = res.data
        if (status !== 0) {
          this.$message.error(`收藏失败，${message || '服务器错误，请稍后再试！'}`)
        }
        else {
          if (collect) {
            this.$message.success("已取消收藏！")
            val.collectNum--
          }
          else {
            this.$message.success("已收藏，可前往“个人中心-我的收藏”查看！")
            val.collectNum++
          }
          val.collect = !collect
        }
      }
      catch (_) {
        this.$message.error('收藏失败，服务器错误，请稍后再试！')
      }
      finally {
        this.loading = false
      }
    },

    /**
     * 点赞资料
     * @param {any} val 资料信息
     */
    likeData(val) {
      if (this.disableLike)
        return
      this.disableLike = true
      setTimeout(() => {
        this.disableLike = false
      }, 300)

      if (!isVerify()) {
        this.verifyDialog = true
      }
      else {
        try {
          const { id, like }  = val
          if (like)
            val.likeNum--
          else
            val.likeNum++
          val.like = !val.like
          this.$http.post(
            "/api/learning/like",
            {
              id,
              like: !like,
              time: new Date().getTime()
            },
            {
              headers: {
                token: this.userInfo.token
              }
            }
          )
        }
        catch (_) {}
      }
    },

    /**
     * 下载文件
     * @param {any} val 资料信息
     * @param {0 | 1} type 下载类别
     */
    async downloadFile(val, type) {
      if ((type === 0 && !val.isDocument) || (type === 1 && !val.isCode))
        return;

      try {
        this.loading = true;
        const res = await this.$http.post(
          "/api/learning/download",
          {
            id: val.id,
            type
          },
          {
            headers: {
              token: this.userInfo.token
            }
          }
        )
        const { status, message, data } = res.data
        if (status !== 0) {
          this.$message.error(`下载失败，${message || '服务器错误，请稍后再试！'}`)
        }
        else if (!data) {
          this.$message.error("下载失败，未获取到下载链接！")
        }
        else {
          let url = isUrl(data) ? data : getFileUrl(this, data)
          if (isUrl(url)) {
            window.open(url);
            this.$message.success("下载成功")
          }
        }
      }
      catch (_) {
        this.$message.error("下载失败，服务器错误，请稍后再试！")
      }
      finally {
        this.loading = false
      }
    },

    /**
     * 展开正文
    */
    showText() {
      if (this.disableShow)
        return
      this.disableShow = true
      setTimeout(() => {
        this.disableShow = false
      }, 500)

      this.dataDetail.show = !this.dataDetail.show
      if (this.dataDetail.show)
        $("#dataDetail").slideDown()
      else
        $("#dataDetail").slideUp()
    },

    /**
     * 获取推荐列表
    */
    async getRecommendList() {
      try {
        const res = await this.$http.get(
          "/api/learning/getRecommendList",
          {
            params: {
              id: this.page
            }
          }
        )
        const { status, data } = res.data
        if (status === 0 && Array.isArray(data))
          this.recommendList = data
      }
      catch (_) {}
    },

    /**
     * 跳转页面
     * @param {undefined | number} id
    */
    jumpPage(id) {
      const query = id ? { id } : {};
      this.$router.push({ query });
      this.$emit("update:page", id || 0);
    }
  },
  mounted() {
    this.getDataDetail();
  },
  computed: {
    /** 用户信息 */
    userInfo() {
      return this.$store.getters.getUserInfo;
    }
  }
};
</script>

<style scoped lang="scss">
.data-detail {
  padding: 15px 25px;

  .detail {
    .el-page-header {
      >>> .el-page-header__content {
        font-weight: 700;
        font-size: 18px;
      }
    }

    .subtitle {
      margin: 10px 0;
      display: flex;
      align-items: center;

      > div {
        white-space: nowrap;
        overflow: hidden;
      }

      .date {
        width: 100px;
        color: #979797;
      }

      .tags {
        flex: 1;

        .tag {
          padding: 2px 6px;
          border-radius: 6px;
          color: #778399;
          background: #f0f0f0;
          margin: 0 4px;
          line-height: 1.5;
        }
      }
    }

    .vcp-container {
      height: 600px;
    }

    .operate {
      margin: 20px 0;
      display: flex;
      align-items: center;

      .collect {
        width: auto;
        min-width: 35px;
        cursor: pointer;
        display: flex;
        margin-right: 30px;

        svg {
          margin-right: 5px;
          position: relative;
          top: -2px;
        }
      }
    }

    .digest {
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .content {
      margin: 10px 0;

      .text {
        overflow: hidden;
        max-height: 0;
        transition: all 1s;
      }

      .text.show {
        max-height: 10000px;
        transition: all 1s;
      }

      .el-button {
        font-size: 12px;
        color: #5051f9;
        padding: 8px 0;
      }
    }

    .button {
      margin: 10px 0;

      .el-button {
        font-size: 12px;
        padding: 8px 16px;
        margin-right: 24px;
        border: 1px solid #5051f9;
        border-radius: 5px;
      }

      .button01 {
        color: #5051f9;
        background: white;
      }

      .button02 {
        color: white;
        background: #5051f9;
      }

      .el-button.disable {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .comment {
    .el-header {
      padding: 0;

      .comment_count {
        margin: 0 6px;
        color: #778399;
      }

      .comment_sort {
        font-size: 14px;
        color: #778399;
        margin-left: 50px;

        .item {
          cursor: pointer;
        }

        .active {
          color: black;
        }
      }
    }

    .el-main {
      padding: 15px 0;

      .comment_item {
        margin-bottom: 15px;
        display: flex;

        .el-avatar {
          margin-right: 10px;
        }

        > div:nth-child(2) {
          flex: 1;
          width: 0;

          .name {
            font-size: 16px;
            font-weight: 700;
            margin-right: 10px;
          }

          .time {
            color: #778399;
          }

          .comment {
            margin: 8px 0;
            line-height: 1.5;
            white-space: pre-wrap;
          }
        }
      }

      .comment_more {
        cursor: pointer;
      }
    }

    .el-footer {
      padding: 0;
      display: flex;
      align-items: center;
      position: sticky;
      bottom: 0;
      outline: white solid 15px;
      background: white;

      .el-avatar {
        margin-right: 15px;
      }

      .el-textarea {
        flex: 1;

        .el-textarea__inner {
          background: #f5f5f5;
          border: none;
          height: 60px;
        }

        .el-textarea__inner::placeholder {
          color: #979797;
        }

        .el-input__count {
          background: transparent;
        }
      }

      .el-button {
        margin-left: 20px;
        padding: 8px 15px;
        background: #0168b7;
        color: white;
        border: none;
        border-radius: 7px;
      }

      .el-button.disable,
      .el-button:hover {
        opacity: 0.8;
      }
    }
  }

  .recommend {
    .title {
      font-weight: 700;
      font-size: 18px;
    }

    .data-item {
      height: 150px;
      margin: 25px 0;
      font-size: 14px;
      color: #222222;
      display: flex;

      .el-image {
        width: 364.23px;
        margin-right: 20px;
        cursor: pointer;

        .image-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: #f5f7fa;
          color: #909399;
          font-size: 25px;
        }
      }

      > div:nth-child(2) {
        flex: 1;
        width: 0;
        display: flex;
        flex-direction: column;

        .title {
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 6px;
        }

        .title:hover {
          text-decoration: underline;
        }

        .digest {
          flex: 1;
          height: 0;
          line-height: 1.4;
          white-space: pre-wrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
        }

        .subtitle {
          margin: 6px 0 0;
          display: flex;
          align-items: center;

          > div {
            white-space: nowrap;
            overflow: hidden;
          }

          .date {
            width: 100px;
            color: #979797;
          }

          .tags {
            flex: 1;

            .tag {
              padding: 2px 6px;
              border-radius: 6px;
              color: #778399;
              background: #f0f0f0;
              margin: 0 4px;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
}
</style>
