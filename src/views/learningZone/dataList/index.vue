<template>
  <!-- 资料列表 -->
  <el-container class="data-list" v-loading="loading">
    <el-header height="90px">
      <el-input
        placeholder="输入关键词 搜索相关教程"
        size="small"
        v-model="searchText"
        suffix-icon="el-icon-search"
      />
      <div class="tags">
        <span class="name">形态分类：</span>
        <span
          v-for="item in tags"
          :key="item.label"
          class="tag not-selected"
          :class="{ active: item.status }"
          @click="item.status = !item.status"
          v-text="item.name"
        />
      </div>
    </el-header>

    <el-main>
      <RecycleScroller
        v-if="filterData && filterData.length"
        class="scroller scrollbar"
        :items="filterData"
        :item-size="260"
        key-field="key"
      >
        <template v-slot="{ item }">
          <div class="data_item">
            <div class="title over-hidden">
              <span @click="openDetailPage(item)">
                {{ item.title }}
              </span>
            </div>
            <div class="subtitle">
              <div class="date">
                {{ item.date.substring(0, 10) }}
              </div>
              <div class="collect not-selected" @click="collectData(item)">
                <div v-if="item.collect">
                  <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                  >
                    <path
                      d="M335.008 916.629333c-35.914667 22.314667-82.88 10.773333-104.693333-25.557333a77.333333 77.333333 0 0 1-8.96-57.429333l46.485333-198.24a13.141333 13.141333 0 0 0-4.021333-12.864l-152.16-132.586667c-31.605333-27.52-35.253333-75.648-8.234667-107.733333a75.68 75.68 0 0 1 51.733333-26.752L354.848 339.2c4.352-0.362667 8.245333-3.232 10.026667-7.594667l76.938666-188.170666c16.032-39.2 60.618667-57.92 99.52-41.461334a76.309333 76.309333 0 0 1 40.832 41.461334l76.938667 188.16c1.781333 4.373333 5.674667 7.253333 10.026667 7.605333l199.712 16.277333c41.877333 3.413333 72.885333 40.458667 69.568 82.517334a76.938667 76.938667 0 0 1-26.08 51.978666l-152.16 132.586667c-3.541333 3.082667-5.141333 8.074667-4.021334 12.853333l46.485334 198.24c9.621333 41.013333-15.36 82.336-56.138667 92.224a75.285333 75.285333 0 0 1-57.525333-9.237333l-170.976-106.24a11.296 11.296 0 0 0-12.010667 0l-170.986667 106.24z"
                      fill="#EFBB55"
                    ></path>
                  </svg>
                  已收藏
                </div>
                <div v-else>
                  <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                  >
                    <path
                      d="M335.008 916.629333c-35.914667 22.314667-82.88 10.773333-104.693333-25.557333a77.333333 77.333333 0 0 1-8.96-57.429333l46.485333-198.24a13.141333 13.141333 0 0 0-4.021333-12.864l-152.16-132.586667c-31.605333-27.52-35.253333-75.648-8.234667-107.733333a75.68 75.68 0 0 1 51.733333-26.752L354.848 339.2c4.352-0.362667 8.245333-3.232 10.026667-7.594667l76.938666-188.170666c16.032-39.2 60.618667-57.92 99.52-41.461334a76.309333 76.309333 0 0 1 40.832 41.461334l76.938667 188.16c1.781333 4.373333 5.674667 7.253333 10.026667 7.605333l199.712 16.277333c41.877333 3.413333 72.885333 40.458667 69.568 82.517334a76.938667 76.938667 0 0 1-26.08 51.978666l-152.16 132.586667c-3.541333 3.082667-5.141333 8.074667-4.021334 12.853333l46.485334 198.24c9.621333 41.013333-15.36 82.336-56.138667 92.224a75.285333 75.285333 0 0 1-57.525333-9.237333l-170.976-106.24a11.296 11.296 0 0 0-12.010667 0l-170.986667 106.24zM551.786667 756.032l170.976 106.24c2.624 1.621333 5.717333 2.122667 8.650666 1.408 6.410667-1.557333 10.56-8.426667 8.928-15.424l-46.485333-198.24a77.141333 77.141333 0 0 1 24.277333-75.733333L870.293333 441.706667c2.485333-2.165333 4.053333-5.312 4.330667-8.746667 0.565333-7.136-4.490667-13.173333-10.976-13.696l-199.712-16.288a75.989333 75.989333 0 0 1-64.064-47.168l-76.938667-188.16a12.309333 12.309333 0 0 0-6.538666-6.741333c-5.898667-2.496-12.725333 0.373333-15.328 6.741333l-76.949334 188.16a75.989333 75.989333 0 0 1-64.064 47.168l-199.701333 16.288a11.68 11.68 0 0 0-7.978667 4.181333 13.226667 13.226667 0 0 0 1.333334 18.261334l152.16 132.586666a77.141333 77.141333 0 0 1 24.277333 75.733334l-46.485333 198.229333a13.333333 13.333333 0 0 0 1.514666 9.877333c3.488 5.792 10.581333 7.530667 16.064 4.128l170.986667-106.229333a75.296 75.296 0 0 1 79.562667 0z"
                      fill="#222222"
                    ></path>
                  </svg>
                  收藏
                </div>
              </div>
              <div class="tags">
                <span class="tag" v-for="(tag, j) in item.tags" :key="j">
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="content">
              <el-image
                :src="item.cover"
                fit="fill"
                @click="openDetailPage(item)"
              >
                <el-image
                  :src="require('@/assets/default/img.png')"
                  slot="error"
                  class="image-slot"
                  @click="openDetailPage(item)"
                >
                </el-image>
                <div
                  slot="error"
                  class="image-slot"
                  @click="openDetailPage(item)"
                >
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div>
                <div class="digest">{{ item.digest }}</div>
                <div class="button">
                  <el-button
                    class="button01"
                    :disabled="!item.isDocument"
                    :class="{ disable: !item.isDocument }"
                    @click="downloadFile(item, 0)"
                  >
                    下载文稿
                  </el-button>
                  <el-button
                    class="button02"
                    :disabled="!item.isCode"
                    :class="{ disable: !item.isCode }"
                    @click="downloadFile(item, 1)"
                  >
                    下载代码
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </RecycleScroller>
      <el-empty v-else style="height: 100%"></el-empty>
    </el-main>

    <!-- 对话框 -->
    <LoginDialog :value.sync="loginDialog" />
    <VerifyDialog :value.sync="verifyDialog" />
  </el-container>
</template>

<script>
import { getId } from "@/util/randomNumber";
import { getFileUrl } from "@/util/file";
import { isUrl } from "@/util/verify";
import { isLogin, isRegularUser, isVerify } from "@/util/user";

export default {
  name: "DataList",
  components: {
    LoginDialog: () => import('@/components/dialog/Login.vue'),
    VerifyDialog: () => import('@/components/dialog/Verify.vue')
  },
  props: {
    value: {
      type: String
    },
    tags: {
      type: Array
    }
  },
  data() {
    return {
      /** 页面加载 */
      loading: false,
      /** 搜索字段 */
      searchText: "",
      /** 资料列表 */
      dataList: [],
      /** 登录对话框 */
      loginDialog: false,
      /** 认证对话框 */
      verifyDialog: false
    };
  },
  methods: {
    /**
     * 初始化页面
    */
    init() {
      this.$router.push({ query: {} });
      this.getDataList();
    },

    /**
     * 获取资料列表
    */
    async getDataList() {
      try {
        const res = await this.$http.get(
          "/api/learning/getDataList",
          {
            params: {
              time: new Date().getTime()
            },
            headers: {
              token: this.userInfo.token
            }
          }
        )
        const { status, message, data } = res.data
        if (status !== 0) {
          this.$message.error(`数据获取失败，${message || '服务器错误，请稍后再试！'}`);
        }
        else if (Array.isArray(data) && data.length) {
          this.dataList = data.filter(v => Array.isArray(v.tags)).map(v => {
            return {
              ...v,
              key: getId()
            }
          });
          this.dataList.sort((a, b) => b.date.localeCompare(a.date));
        }
      }
      catch (_) {
        this.$message.error("数据获取失败，服务器错误，请稍后再试！");
      }
      finally {
        this.loading = false;
      }
    },

    /**
     * 收藏资料
     * @param {any} val 资料信息
    */
    collectData(val) {
      if (!isLogin()) {
        this.loginDialog = true
      }
      else if (!isVerify()) {
        this.verifyDialog = true
      }
      else {
        if (val.collect) {
          this.$confirm("该操作将取消收藏，是否继续？", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          })
            .then(() => {
              this.collect(val)
            })
            .catch(() => {})
        }
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
          if (collect)
            this.$message.success("已取消收藏！")
          else
            this.$message.success("已收藏，可前往“个人中心-我的收藏”查看！")
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
     * 下载文件
     * @param {any} val 资料信息
     * @param {0 | 1} type 下载类别
     */
    async downloadFile(val, type) {
      if ((type === 0 && !val.isDocument) || (type === 1 && !val.isCode))
        return;

      if (!isLogin()) {
        this.loginDialog = true
      }
      else if (!isRegularUser()) {
        this.verifyDialog = true
      }
      else {
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
      }
    },

    /**
     * 打开资料详情页
     * @param {any} val 资料信息
    */
    openDetailPage(val) {
      if (!isLogin()) {
        this.loginDialog = true
      }
      else if (!isRegularUser()) {
        this.verifyDialog = true
      }
      else {
        // 在新窗口打开路由
        const query = {
          id: val.id
        };
        const { path } = this.$route
        let routeData = this.$router.resolve({
          path,
          query
        });
        window.open(routeData.href, "_blank");
      }
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    /** 用户信息 */
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    /** 筛选资料 */
    filterData() {
      let list = this.dataList.filter(v => v.tags.includes(this.value))
      // 根据搜索字段筛选
      const text = this.searchText
      if (text) {
        list = list.filter(v => {
          return (
            v.title
              .toString()
              .toLowerCase()
              .includes(text) ||
            v.digest
              .toString()
              .toLowerCase()
              .includes(text)
          )
        })
      }

      // 根据标签筛选
      const tags = this.tags.filter(v => v.status).map(v => v.name)
      if (tags.length) {
        list = list.filter(v => {
          return tags.every(tag => {
            return v.tags.includes(tag);
          });
        });
      }

      return list;
    }
  },
  watch: {
    value() {
      this.searchText = ''
    }
  }
};
</script>

<style scoped lang="scss">
.data-list {
  height: 100%;
  padding: 15px 25px;
  background-color: white;

  .el-header {
    border-bottom: 1px solid #e4e4e4;
    padding: 0;
    margin-bottom: 8px;

    .el-input {
      width: 300px;
    }

    .tags {
      margin: 15px 0;
      .name {
        font-weight: 700;
        color: #5051f9;
      }
      .tag {
        margin-right: 20px;
        cursor: pointer;
        &.active {
          color: #5051f9;
        }
      }
    }
  }

  .el-main {
    padding: 0;

    .scroller {
      height: 100%;

      .data_item {
        height: 220px;
        margin: 20px 10px;
        font-size: 14px;
        color: #222222;
        display: flex;
        flex-direction: column;

        .title {
          font-weight: 700;
          font-size: 18px;

          > span {
            cursor: pointer;
          }

          > span:hover {
            text-decoration: underline;
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

          .collect {
            width: auto;
            min-width: 56px;
            cursor: pointer;
            margin-right: 30px;

            > div {
              display: flex;
              align-items: center;

              svg {
                margin-right: 5px;
              }
            }
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

        .content {
          flex: 1;
          height: 0;
          display: flex;

          .el-image {
            width: 364.23px;
            height: 100%;
            margin-right: 24px;
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

            .digest {
              flex: 1;
              height: 0;
              line-height: 1.5;
              white-space: pre-wrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 7;
              -webkit-box-orient: vertical;
            }

            .button {
              height: 30px;
              margin-top: 5px;

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
        }
      }
    }
  }
}
</style>
