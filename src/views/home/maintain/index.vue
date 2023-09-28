<template>
  <!-- 维护中 -->
  <div class="maintain">
    <div class="main">
      <div class="content">
        <h1>网站升级维护中……</h1>
        <span>为了更好地服务用户，程序猿正在努力升级维护中，敬请期待！</span>
      </div>
    </div>
    <FooterElement class="footer"></FooterElement>
  </div>
</template>

<script>
export default {
  name: "Maintain",
  mounted() {
    if (sessionStorage.getItem("maintain") !== "true") this.$router.push("/");
  }
};
</script>

<style scoped>
.maintain {
  width: 100%;
  height: 100%;
  position: relative;
}

.main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 260px;
  text-align: center;
}

.content {
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.footer {
  position: absolute;
  bottom: 0;
}
</style>
