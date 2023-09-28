<template>
  <!-- 我的收藏 -->
  <div class="collect" v-loading="loading">
    <el-card>
      <div slot="header">
        <span>我的收藏</span>
        <el-input
          placeholder="输入关键词 搜索相关教程"
          size="small"
          v-model="searchText"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </div>
      <RecycleScroller
        class="scroller scrollbar"
        :items="filterData"
        :item-size="260"
        key-field="key"
        v-if="filterData && filterData.length > 0"
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
    </el-card>
  </div>
</template>

<script>
import { getId } from "@/util/randomNumber";

export default {
  name: "Collect",
  data() {
    return {
      // 页面加载
      loading: false,
      // 登入用户信息
      userInfo: {},
      // 搜索字段
      searchText: "",
      // 资料列表
      dataList: [],
    };
  },
  methods: {
    // 获取登入用户信息
    getUserInfo() {
      this.userInfo = this.$store.getters.getUserInfo;
      this.getDataList();
    },
    // 获取资料列表
    getDataList() {
      this.loading = true;
      this.$http
        .get(process.env.API_ROOT + "/collect/getDataList", {
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
            this.$message.error("数据获取失败，" + res.message);
          }
          // 获取成功，处理数据
          else if (res.data && res.data.length > 0) {
            // 根据日期默认排序
            res.data.sort((a, b) => b.date.localeCompare(a.date));
            this.dataList = res.data;
            this.dataList.forEach((item) => {
              item.key = getId();
            });
          }
        })
        .catch(() => {
          this.$message.error("数据获取失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 收藏资料
    collectData(val) {
      let _this = this;
      let collect = function (id) {
        _this.loading = true;
        _this.$http
          .post(
            process.env.API_ROOT + "/learning/collect",
            {
              id: id,
              collect: false,
              time: new Date().getTime(),
            },
            {
              headers: {
                token: _this.userInfo.token,
              },
            }
          )
          .then((data) => {
            let res = data.data;
            // 操作失败，根据 message 返回错误信息
            if (res.status !== 0) {
              if (!res.message) res.message = "服务器错误，请稍后再试！";
              _this.$message.error("操作失败，" + res.message);
            }
            // 操作成功，处理数据
            else {
              _this.$message.success("已取消收藏！");
              for (let i = 0; i < _this.dataList.length; i++) {
                if (id === _this.dataList[i].id) {
                  _this.dataList.splice(i, 1);
                  break;
                }
              }
              _this.searchText = "";
            }
          })
          .catch(() => {
            _this.$message.error("操作失败，服务器错误，请稍后再试！");
          })
          .finally(() => {
            _this.loading = false;
          });
      };

      this.$confirm("该操作将取消收藏，是否继续？", "提示", {
        confirmButtonText: "确定",
        type: "warning",
      })
        .then(() => {
          collect(val.id);
        })
        .catch(() => {});
    },
    // 判断是否为url
    isUrlValid(url) {
      const regexp = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      // 使用正则表达式判断字符串是否符合 URL 格式
      if (!regexp.test(url)) return false;

      try {
        // 判断该地址是否存在或可访问
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    },
    // 获取文件访问链接
    async getFileUrl(name) {
      if (name) {
        try {
          const { data: res } = await this.$http.get(
            process.env.API_ROOT + "/learning/getMinIoUrl",
            {
              params: {
                fileName: name,
              },
            }
          );
          // 获取成功，处理数据
          if (res.status === 0 && res.data.url) return res.data.url;
          else return "";
        } catch (e) {
          return "";
        }
      } else return "";
    },
    // 下载文件
    downloadFile(val, type) {
      if ((type === 0 && !val.isDocument) || (type === 1 && !val.isCode))
        return;

      this.loading = true;
      this.$http
        .post(
          process.env.API_ROOT + "/learning/download",
          {
            id: val.id,
            type,
          },
          {
            headers: {
              token: this.userInfo.token,
            },
          }
        )
        .then((data) => {
          let res = data.data;
          if (res.status !== 0) {
            if (!res.message) res.message = "服务器错误，请稍后再试！";
            this.$message.error("下载失败，" + res.message);
          } else {
            if (res.data) {
              let url = this.isUrlValid(res.data)
                ? res.data
                : this.getFileUrl(res.data);
              if (this.isUrlValid(url)) {
                window.open(url);
                this.$message.success("下载成功");
                return;
              }
            }
            this.$message.error("下载失败，未获取到下载链接！");
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 503)
            this.$message.error("访问太过频繁，请稍后再试！");
          else this.$message.error("下载失败，服务器错误，请稍后再试！");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 打开资料详情页
    openDetailPage(val) {
      const query = {
        id: val.id,
      };
      let routeData = this.$router.resolve({
        path: "/learning_zone",
        query,
      });
      window.open(routeData.href, "_blank");
    },
  },
  mounted() {
    this.$emit("changeActiveName", "4");
    this.getUserInfo();
  },
  // 计算属性
  computed: {
    // 筛选资料
    filterData() {
      // 根据搜索字段筛选
      let text = this.searchText;
      if (!text) return this.dataList;
      else text;
      return this.dataList.filter((item) => {
        return (
          item.title.toString().toLowerCase().includes(text) ||
          item.digest.toString().toLowerCase().includes(text)
        );
      });
    },
  },
};
</script>

<style lang="scss">
.collect {
  width: 100%;
  height: 100%;
  overflow: inherit;

  .el-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-card__header {
      box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
      font-size: 20px;
      font-weight: 700;
      padding: 13px 20px 14px;

      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-input {
          width: 300px;
          float: right;

          .el-input__inner {
            background: #f5f5f5;
            color: black;
            border-radius: 15px;
          }
        }
      }
    }

    .el-card__body {
      flex: 1;
      height: 0;

      .scroller {
        height: 100%;

        .data_item {
          height: 220px;
          margin: 20px 10px;
          font-size: 12px;
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
              display: flex;

              svg {
                margin-right: 5px;
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
}
</style>
