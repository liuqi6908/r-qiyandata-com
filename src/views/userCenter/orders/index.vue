<template>
  <!-- 订单与发票 -->
  <div class="orders">
    <el-tabs v-model="activeName" :before-leave="beforeLeave">
      <el-tab-pane
        v-for="(item, index) in menuList"
        :key="index"
        :name="item.name"
        :label="item.label"
        lazy
      >
        <template v-if="activeName === item.name">
          <DataOrder v-if="activeName === '0'" />
          <VipOrder v-else-if="activeName === '1'" />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "Orders",
  components: {
    DataOrder: () => import('./dataOrder'),
    VipOrder: () => import('./vipOrder')
  },
  data() {
    return {
      // 当前活动页面
      activeName: "0",
      // 导航列表
      menuList: [
        {
          label: "数据订单",
          name: "0"
        },
        {
          label: "会员订单",
          name: "1"
        }
      ],
      // 禁用跳转
      disable: false
    };
  },
  methods: {
    // 标签切换
    beforeLeave() {
      if (this.disable) return false;
      this.disable = true;
      setTimeout(() => {
        this.disable = false;
      }, 300);
      return true;
    }
  },
  mounted() {
    this.$emit("changeActiveName", "2");
  }
};
</script>

<style lang="scss">
.orders {
  width: 100%;
  height: 100%;
  overflow: hidden;

  > .el-tabs {
    height: 100%;
    position: relative;

    > .el-tabs__header {
      height: 60px;
      padding: 10px 30px;
      box-sizing: border-box;
      box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.25);
      margin: 0 0 10px;
      background: white;

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
      overflow: visible;

      > .el-tab-pane {
        height: 100%;
        padding: 10px;
        box-sizing: border-box;

        > div {
          height: 100%;
        }
      }
    }
  }
}
</style>
