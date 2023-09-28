<template>
  <div class="page-2">
    <img src="@/assets/bg/wave/bg-2.svg" class="bg" />
    <img src="@/assets/bg/wave/bg-3.svg" class="bg" />
    <img src="@/assets/bg/wave/bg-4.svg" class="bg" />
    <div class="content">
      <div class="title">三步快速制图</div>
      <div class="title mb-20">“快而美”简单且高效</div>
      <div>
        哪有那么多时间可以挥霍？三步出图，WAVE教你在最短的时间内出最高级的图表。
      </div>
      <div class="mb-20">即使是在这个比谁跑得更快的时代也能轻松胜出。</div>
      <div>
        更多详细教程，点此查看👉
        <a
          href="https://mp.weixin.qq.com/s/csRG2rHxIG2gqfkZ4OjZEQ"
          target="_blank"
        >
          有了这份WAVE快色上手指南，再也不慌了！
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.page-2 {
  position: relative;

  .content {
    color: white;
    text-align: center;
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    line-height: 1.6;
    font-size: 16px;

    .title {
      font-size: 24px;
    }

    .mb-20 {
      margin-bottom: 20px;
    }

    a {
      color: white;
    }
  }
}
</style>
