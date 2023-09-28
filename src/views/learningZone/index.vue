<template>
  <!-- 学习专区 -->
  <div class="learning-zone full row" v-loading="loading">
    <!-- 导航栏 -->
    <Tab1
      class="w-60"
      :value.sync="activeMenu"
      :menu="menu"
    />

    <!-- 主要内容 -->
    <div class="flex-1 w-0 py-2 pl-2">
      <!-- 资料列表 -->
      <DataList
        v-if="page === 0"
        :value="activeMenu"
        :tags="tags"
      />

      <!-- 资料详情 -->
      <div
        v-else-if="!!page"
        class="data-detail-page"
      >
        <DataDetail
          :key="page"
          :page.sync="page"
          :codeEditor.sync="codeEditor"
        />
        <template v-if="codeEditor !== 0">
          <div class="line">
            <div class="collapse">
              <div :title="collapseTitle" @click="collapsePython">
                <i :class="collapseIcon"></i>
              </div>
            </div>
          </div>
          <div id="python-demo" class="bg-white">
            <PythonDemo v-if="codeEditor === 1" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LearningZone",
  components: {
    Tab1: () => import('@/components/tabs/Tabs1.vue'),
    DataList: () => import('./dataList'),
    DataDetail: () => import('./dataDetail'),
    PythonDemo: () => import('./pythonDemo')
  },
  data() {
    return {
      /** 页面加载 */
      loading: true,
      /** 激活菜单 */
      activeMenu: undefined,
      /** 菜单 */
      menu: [],
      /** 标签 */
      tags: [],
      /** 页面（0资料列表，非0资料详情） */
      page: undefined,
      /** 折叠标题 */
      collapseTitle: "收起",
      /** 折叠图标 */
      collapseIcon: "el-icon-arrow-left",
      /** 代码编辑区 */
      codeEditor: 0
    };
  },
  methods: {
    /**
     * 初始化页面
    */
    async init() {
      const id = this.$route.query.id;
      const { type, status } = this.userInfo
      if (id && this.isLogin && (type === '机构用户' || type === '个人用户' && status === '1'))
        this.page = id;
      else
        this.page = 0;
      await this.getTags();
    },

    /**
     * 获取标签
     */
    async getTags() {
      try {
        const res = await this.$http.get("/api/learning/getTag")
        const { data, status } = res.data
        if (status === 0 && Array.isArray(data)) {
          const menu = data.find(v => v.type === 0)
          const tags = data.find(v => v.type === 1)
          if (menu && Array.isArray(menu.tags)) {
            this.menu = menu.tags.map(v => {
              return {
                label: v,
                value: v,
                icon: 'el-icon-notebook-1'
              }
            })
          }
          if (tags && Array.isArray(tags.tags)) {
            this.tags = tags.tags.map(v => {
              return {
                name: v,
                status: false
              }
            })
          }
        }
      }
      catch (_) {}
      finally {
        if (!this.menu.length) {
          this.menu = [{
            label: '学习专区',
            value: '学习专区',
            icon: 'el-icon-notebook-1'
          }]
        }
        if (this.page === 0)
          this.activeMenu = this.menu[0].value
        this.loading = false
      }
    },

    /**
     * 折叠、打开在线python
    */
    collapsePython() {
      const show = this.collapseTitle === "收起";
      const container = document.querySelector("#python-demo");
      if (show) {
        this.collapseTitle = "展开";
        this.collapseIcon = "el-icon-arrow-right";
        container.style.flex = "0";
      } else {
        this.collapseTitle = "收起";
        this.collapseIcon = "el-icon-arrow-left";
        container.style.flex = "3";
      }
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    /** 用户信息 */
    userInfo() {
      return this.$store.getters.getUserInfo
    },
    /** 是否登录 */
    isLogin() {
      const { token } = this.userInfo
      return !!token
    }
  },
  watch: {
    activeMenu(newVal) {
      this.tags.forEach(item => {
        item.status = false
      })
      if (newVal)
        this.page = 0
    },
    page(newVal) {
      if (newVal !== 0)
        this.activeMenu = undefined
      else if (newVal === 0 && !this.activeMenu && this.menu.length)
        this.activeMenu = this.menu[0].value
    }
  }
};
</script>

<style scoped lang="scss">
.learning-zone {
  .data-detail-page {
    height: 100%;
    display: flex;
    font-size: 12px;
    color: #222222;

    .data-detail {
      flex: 4;
    }

    .line {
      width: 20px;
      background: #f1f1f1;
      position: relative;

      .collapse {
        width: 15px;
        height: 100%;
        position: absolute;
        right: 0;
        border-right: 2px solid #dce3e8;

        > div {
          z-index: 1;
          width: 12px;
          height: 56px;
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
          background-image: url(~@/assets/icon/holder.webp);
          transform: rotate(180deg);

          i {
            margin: 20.5px 0 0 -1px;
            color: #b7bdcb;
          }
        }
      }
    }

    #python-demo {
      flex: 3;
      width: 0;
      padding: 10px 20px 0;
      transition: all 0.3s;

      .python-demo {
        height: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>
