<template>
  <!-- 页脚组件 -->
  <div class="footer-element not-selected">
    <el-row class="main">
      <el-col style="width: 14%">
        <h1>
          产品中心
          <div></div>
        </h1>
        <div>
          <span @click="jumpRouter('/data_center/CCAD')">CCAD专题数据库</span>
        </div>
        <div>
          <span @click="jumpRouter('/data_center/TFID')">TFID专题数据库</span>
        </div>
        <div>
          <span @click="jumpRouter('/data_center/CPPGD')">CPPGD专题数据库</span>
        </div>
      </el-col>
      <el-col style="width: 10%">
        <h1>
          会员专区
          <div></div>
        </h1>
        <div>
          <span @click="jumpRouter('/vip_zone/data_zone')" v-text="'数据专区'" />
        </div>
        <div>
          <span @click="jumpRouter('/vip_zone/wave')" v-text="'高下制图'" />
        </div>
        <div>
          <span @click="jumpRouter('/vip_zone/data_resource')" v-text="'公共数据'" />
        </div>
      </el-col>
      <el-col style="width: 18%">
        <h1>
          客户咨询
          <div></div>
        </h1>
        <div>
          <span>
            <a href="mailto:cbdps@qiyandata.com?subject=客户咨询">
              邮件：cbdps@qiyandata.com
            </a>
          </span>
        </div>
        <div>
          <span>
            商务合作：17767112526（郑女士）
          </span>
        </div>
        <div>
          <span>
            电话：0571-85050832
          </span>
        </div>
      </el-col>
      <el-col style="width: 10%">
        <h1>
          服务与支持
          <div></div>
        </h1>
        <div>
          <span @click="jumpRouter('/service')">定制服务</span>
        </div>
        <div>
          <span @click="jumpRouter('/service/question')">常见问题</span>
        </div>
      </el-col>
      <el-col style="width: 10%">
        <h1>
          关于我们
          <div></div>
        </h1>
        <div>
          <span @click="jumpRouter('/about')">关于我们</span>
        </div>
        <div>
          <span @click="jumpRouter('/about/qiyan_cloud')">研盾·云桌面</span>
        </div>
        <div>
          <span @click="jumpRouter('/about/data_visual')">数据可视化系统</span>
        </div>
      </el-col>
      <el-col style="width: 5%">
        <el-divider direction="vertical"></el-divider>
      </el-col>
      <el-col style="width: 33%">
        <h1>
          公众号
          <div></div>
        </h1>
        <el-row class="other">
          <el-col :span="6">
            <el-image style="height: 100%"
                      :src="require('@/assets/qrcode/公众号.png')"
                      fit="contain">
            </el-image>
          </el-col>
          <el-col :offset="1" :span="17">
            <h1 class="title">扫码关注 “社科大数据” 公众号</h1>
            <div class="content">上新资讯，随时掌握。</div>
            <div class="content">一个大数据集散中心、发布平台和服务窗口，</div>
            <div class="content">致力于推进智库建设和学术研究。</div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="footer">
      <div>
        <a href="https://beian.miit.gov.cn/" target="_blank">
          Copyright © 企研数据科技（杭州）有限公司 | 浙ICP备19023396号-1
        </a>
      </div>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'FooterElement',
    data() {
      return {}
    },
    methods: {
      // 跳转路由
      jumpRouter(str) {
        this.$router.push(str);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .footer-element {
    height: 260px;
    width: 100%;
    background: #dedede;
    padding: 20px 100px;
    box-sizing: border-box;

    a {
      text-decoration: none;
    }

    a:link,
    a:visited,
    a:hover,
    a:active {
      color: inherit;
    }

    .main {
      > .el-col {
        height: 150px;

        > h1 {
          font-size: 14px;
          color: #0068b7;
          display: inline-block;
          margin: 15px 0 5px;

          > div {
            width: 100%;
            height: 1px;
            margin-top: 3px;
            border-radius: 1px;
            background: #999999;
          }
        }

        > div {
          font-size: 14px;
          color: #333333;
          margin: 10px 0;

          > span {
            cursor: pointer;
          }

          > span:hover {
            color: #0068b7;
          }
        }

        .el-divider--vertical {
          width: 0.5px;
          height: 90%;
          background: #bbbbbb;
        }
      }

      .other {
        height: 100px;
        margin: 5px 0;

        > .el-col {
          height: 100px;
        }

        .title {
          font-size: 16px;
          margin: 0;
        }

        .content {
          font-size: 14px;
          margin: 5px 0;
        }
      }
    }

    .footer {
      text-align: center;
      font-size: 13px;
      color: #666666;
      margin-top: 30px;

      > div {
        margin: auto;
        display: inline-flex;
        align-items: center;

        > a {
          margin-left: 10px;
        }
      }
    }
  }
</style>
