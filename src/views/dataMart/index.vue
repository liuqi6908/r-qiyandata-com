<template>
  <!-- 数据超市 -->
  <div class="data_mart">
    <router-view style="height: 100%" ref="child" @getUserInfo="getUserInfo" />
  </div>
</template>

<script>
export default {
  name: "DataMart",
  data() {
    return {};
  },
  methods: {
    // 初始化页面
    init() {
      this.$refs.child.getUserInfo();
    },
    // 获取用户信息
    getUserInfo() {
      this.$emit("getUserInfo");
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.data_mart {
  width: 100%;
  height: 100%;
}
</style>
