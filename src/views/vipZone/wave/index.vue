<template>
  <!-- 高下制图 -->
  <div class="wave">
    <Page1 />
    <Page2 />
    <Page3 />
  </div>
</template>

<script>
import Page1 from "./page1";
import Page2 from "./page2";
import Page3 from "./page3";

export default {
  mounted() {
    this.$emit("changeActiveName", "1");
  },
  components: {
    Page1,
    Page2,
    Page3
  }
};
</script>

<style lang="scss" scoped>
.wave {
  >>> .bg {
    display: block;
    width: 100%;
  }
}
</style>
