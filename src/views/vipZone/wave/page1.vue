<template>
  <div class="page-1">
    <img src="@/assets/bg/wave/bg-1.svg" class="bg" />
    <div class="content">
      <div class="title">Wave</div>
      <p>
        会员用户请用您的企研·社科大数据平台帐号进行登录，将获得高下制图的免费会员资格
      </p>
      <p>
        高下制图会员时长将与您的企研·社科大数据平台会员时长一致
      </p>
      <el-button round @click="jumpWave">前往高下制图</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    /** 跳转高下制图 */
    jumpWave() {
      window.open(
        "https://account.waveapp.cn/auth/login?redirect_uri=https%3A%2F%2Fwww.waveapp.cn%2Fapp%2Fhome%2Flist"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.page-1 {
  position: relative;

  .content {
    position: absolute;
    left: 18%;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    width: 560px;
    font-size: 18px;

    .title {
      font-size: 40px;
      font-weight: 600;
      margin-bottom: 25px;
    }

    .el-button {
      color: #0068b7;
      font-weight: 500;
      font-size: 18px;
      border: none;
      border-radius: 40px;
      padding: 16px 30px;
      margin-top: 40px;
    }
  }
}
</style>
