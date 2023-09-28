<template>
  <!-- 自定义组件 -->
  <div class="my-element" :style="divStyle">
    <!-- 轮播图（A0001） -->
    <div v-if="elementData.template_id === 'A0001'">
      <el-carousel
        trigger="click"
        :height="elementData.config.height"
        :interval="elementData.config.timeout"
      >
        <el-carousel-item
          v-for="(item, index) in elementData.config.items"
          :key="index"
        >
          <a :href="item.link" target="_blank">
            <div :style="item.divStyle" class="A0001">
              <div
                :style="item.modeStyle"
                class="text"
                v-if="!elementData.config.disableMask"
              >
                <div :style="item.textStyle">
                  <span style="font-size: 34px; margin: 15px 0">{{
                    item.title
                  }}</span>
                  <span style="font-size: 22px; margin: 10px 0; white-space: pre-wrap;">{{
                    item.subtitle
                  }}</span>
                  <span style="font-size: 16px; white-space: pre-wrap">{{
                    item.content
                  }}</span>
                </div>
              </div>
            </div>
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 轮播图（卡片化）（A0002） -->
    <div v-if="elementData.template_id === 'A0002'" class="A0002">
      <el-carousel
        trigger="click"
        type="card"
        :height="elementData.config.height"
        :interval="elementData.config.timeout"
      >
        <el-carousel-item
          v-for="(item, index) in elementData.config.items"
          :key="index"
        >
          <a :href="item.link" target="_blank">
            <div :style="item.divStyle" class="A0001">
              <div
                :style="item.modeStyle"
                class="text"
                v-if="!elementData.config.disableMask"
              >
                <div :style="item.textStyle">
                  <span style="font-size: 34px; margin: 15px 0">{{
                    item.title
                  }}</span>
                  <span style="font-size: 22px; margin: 10px 0; white-space: pre-wrap;">{{
                    item.subtitle
                  }}</span>
                  <span style="font-size: 16px; white-space: pre-wrap">{{
                    item.content
                  }}</span>
                </div>
              </div>
            </div>
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 纵向轮播图（A0003） -->
    <div v-if="elementData.template_id === 'A0003'">
      <el-carousel
        trigger="click"
        direction="vertical"
        :height="elementData.config.height"
        :interval="elementData.config.timeout"
      >
        <el-carousel-item
          v-for="(item, index) in elementData.config.items"
          :key="index"
        >
          <a :href="item.link" target="_blank">
            <div :style="item.divStyle" class="A0001">
              <div
                :style="item.modeStyle"
                class="text"
                v-if="!elementData.config.disableMask"
              >
                <div :style="item.textStyle">
                  <span style="font-size: 34px; margin: 15px 0">{{
                    item.title
                  }}</span>
                  <span style="font-size: 22px; margin: 10px 0; white-space: pre-wrap;">{{
                    item.subtitle
                  }}</span>
                  <span style="font-size: 16px; white-space: pre-wrap">{{
                    item.content
                  }}</span>
                </div>
              </div>
            </div>
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 成果展示（A0004） -->
    <div v-if="elementData.template_id === 'A0004'" class="A0000 A0004">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <el-button
        class="blue_button"
        style="position: absolute; top: 20px; right: 0;"
        @click="moreA0004Dialog = true"
      >
        查看更多
      </el-button>
      <el-row :gutter="20" style="height: 390px">
        <el-col :span="5">
          <el-image
            style="width: 100%; height: 90%; border-radius: 10px"
            :src="elementData.config.attachPic"
            fit="cover"
          >
            <el-image
              slot="error"
              style="width: 100%; height: 100%"
              :src="img"
              fit="cover"
            >
            </el-image>
          </el-image>
        </el-col>
        <el-col :span="19" class="table">
          <el-row style="height: 40px" class="table_header">
            <el-col :span="7">
              <span>期刊</span>
            </el-col>
            <el-col :span="10">
              <span>标题</span>
            </el-col>
            <el-col :span="3">
              <span>时间</span>
            </el-col>
            <el-col :span="4">
              <span>数据库</span>
            </el-col>
          </el-row>
          <div style="height: 300px">
            <el-row
              style="height: 65px"
              class="table_row"
              v-for="item in elementData.config.infoList"
              :key="item.id"
              @click.native="openA0004Dialog(item)"
            >
              <el-col :span="7">
                <span>{{ item.periodical }}</span>
              </el-col>
              <el-col :span="10">
                <span style="color: #0e68b4">{{ item.title }}</span>
              </el-col>
              <el-col :span="3">
                <span>{{ item.time }}</span>
              </el-col>
              <el-col :span="4">
                <span>{{ item.database }}</span>
              </el-col>
            </el-row>
          </div>
          <el-row style="height: 40px">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="elementData.config.currentPage"
              :page-size="elementData.config.pageSize"
              layout="total, prev, pager, next"
              :total="elementData.config.items.length"
            >
            </el-pagination>
          </el-row>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="moreA0004Dialog"
        width="1200px"
        top="0"
        custom-class="MoreA0004Dialog"
      >
        <div class="MoreA0004Dialog_body">
          <div class="A0000">
            <h1 v-if="elementData.config.title" style="margin-left: 0">
              {{ elementData.config.title }}
              <div></div>
            </h1>
            <p v-if="elementData.config.description" style="margin-left: 10px">
              {{ elementData.config.description }}
            </p>
          </div>
          <div class="table">
            <el-row style="height: 40px" class="table_header">
              <el-col :span="7">
                <span>期刊</span>
              </el-col>
              <el-col :span="10">
                <span>标题</span>
              </el-col>
              <el-col :span="2">
                <span>时间</span>
              </el-col>
              <el-col :span="5">
                <span>数据库</span>
              </el-col>
            </el-row>
            <div style="flex: 1; height: 0; overflow: auto;" class="none-scrollbar">
              <el-row
                style="height: 65px"
                class="table_row"
                v-for="item in elementData.config.items"
                :key="item.id"
                @click.native="openA0004Dialog(item)"
              >
                <el-col :span="7">
                  <span>{{ item.periodical }}</span>
                </el-col>
                <el-col :span="10">
                  <span style="color: #0e68b4">{{ item.title }}</span>
                </el-col>
                <el-col :span="2">
                  <span>{{ item.time }}</span>
                </el-col>
                <el-col :span="5">
                  <span>{{ item.database }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="A0004Dialog"
        width="1200px"
        top="0"
        custom-class="A0004Dialog"
        :destroy-on-close="true"
        :show-close="false"
      >
        <el-button v-if="moreA0004Dialog" type="text" style="color: black" class="text-base font-700 absolute l-10 t-4" @click="A0004Dialog = false">
          <i class="el-icon-back font-700" /> 返回
        </el-button>
        <button class="el-dialog__headerbtn" @click="() => (moreA0004Dialog = false, A0004Dialog = false)">
          <i class="el-dialog__close el-icon el-icon-close" />
        </button>
        <div class="none-scrollbar" style="height: 100%">
          <h1 class="title">{{ A0004Info.title }}</h1>
          <div class="subtitle">
            <div class="time">{{ A0004Info.time }}</div>
            <div class="author">{{ A0004Info.author }}</div>
            <div>
              {{ A0004Info.periodical }}
              <span class="database">
                {{ A0004Info.database }}
              </span>
            </div>
          </div>
          <el-divider></el-divider>
          <p class="content">{{ A0004Info.details }}</p>
          <el-divider></el-divider>
          <div style="text-align: center">
            <a :href="A0004Info.dbUrl" target="_blank">
              <el-button class="blue_button">查看数据库</el-button>
            </a>
            <a :href="A0004Info.link" target="_blank">
              <el-button class="white_button"
                >查看原文 <i class="el-icon-right"></i
              ></el-button>
            </a>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 文本+5×N卡片（A0005） -->
    <div v-if="elementData.template_id === 'A0005'" class="A0000 A0005">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <el-row
        v-for="cardRow in elementData.config.cardRows"
        :key="cardRow.id"
        class="cardRows"
      >
        <div v-for="item in cardRow.items" :key="item.id" class="card">
          <a :href="item.link" target="_blank">
            <el-card>
              <el-image
                style="width: 100%; height: 50%"
                :src="item.thumbnail"
                fit="cover"
              >
                <el-image
                  slot="error"
                  style="width: 100%; height: 100%"
                  :src="img"
                  fit="cover"
                >
                </el-image>
              </el-image>
              <div class="iconDiv">
                <i :class="item.icon + ' icon'" :style="item.iconStyle"> </i>
              </div>
              <div style="height: 50%">
                <p class="title">{{ item.title }}</p>
                <p class="content">{{ item.description }}</p>
              </div>
            </el-card>
          </a>
        </div>
      </el-row>
    </div>
    <!-- 合作商（A0006） -->
    <div v-if="elementData.template_id === 'A0006'" class="A0000 A0006">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <div>
        <vue-seamless-scroll
          :data="elementData.config.items"
          :class-option="elementData.config.classOption"
          class="warp"
          :style="elementData.config.divStyle"
        >
          <ul class="item">
            <li
              v-for="(item, index) in elementData.config.items.filter(
                (v, i) => i % 2 === 0
              )"
              :key="index"
              :style="elementData.config.liStyle"
            >
              <div class="card" :style="elementData.config.cardStyle">
                <div
                  style="height: 100%; width: 100%; display: flex; align-items: center;"
                >
                  <img
                    :src="item.thumbnail"
                    :title="item.title"
                    :style="elementData.config.cardStyle"
                  />
                </div>
              </div>
            </li>
          </ul>
          <ul class="item" id="ul">
            <li
              v-for="(item, index) in elementData.config.items.filter(
                (v, i) => i % 2 === 1
              )"
              :key="index"
              :style="elementData.config.liStyle"
            >
              <div class="card" :style="elementData.config.cardStyle">
                <div
                  style="height: 100%; width: 100%; display: flex; align-items: center;"
                >
                  <img
                    :src="item.thumbnail"
                    :title="item.title"
                    :style="elementData.config.cardStyle"
                  />
                </div>
              </div>
            </li>
          </ul>
        </vue-seamless-scroll>
      </div>
    </div>
    <!-- 产品动态（A0007） -->
    <div v-if="elementData.template_id === 'A0007'" class="A0000 A0007">
      <h1>
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <el-button @click="A0007Dialog = true"
        >查看全部<i class="el-icon-arrow-right"></i
      ></el-button>
      <p>{{ elementData.config.description }}</p>
      <div
        class="card"
        v-for="(item, index) in elementData.config.items.filter(
          (v, i) => i < 8
        )"
        :key="index"
      >
        <a :href="item.link" target="_blank">
          <span class="time">{{ item.time }}</span>
          <span class="title">{{ item.title }}</span>
          <span
            v-for="(tag, j) in item.tags"
            class="tag"
            :style="tag.tagStyle"
            :key="j"
          >
            {{ tag.tagName }}
          </span>
        </a>
      </div>
      <el-dialog
        :visible.sync="A0007Dialog"
        width="1200px"
        top="0"
        custom-class="A0007Dialog"
        :destroy-on-close="true"
      >
        <div class="none-scrollbar A0000" style="height: 100%">
          <h1 style="margin-left: 0">
            {{ elementData.config.title }}
            <div></div>
          </h1>
          <p style="margin-left: 10px">{{ elementData.config.description }}</p>
          <div
            class="card"
            v-for="(item, index) in elementData.config.items"
            :key="index"
          >
            <a :href="item.link" target="_blank">
              <span class="time">{{ item.time }}</span>
              <span class="title">{{ item.title }}</span>
              <span
                v-for="(tag, j) in item.tags"
                class="tag"
                :style="tag.tagStyle"
                :key="j"
              >
                {{ tag.tagName }}
              </span>
            </a>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 文本+背景图片（A0008） -->
    <div v-if="elementData.template_id === 'A0008'" class="A0008">
      <div :style="elementData.config.divStyle" class="div">
        <div
          :style="elementData.config.modeStyle"
          v-if="!elementData.config.disableMask"
        >
          <div :style="elementData.config.textStyle" class="text">
            <h1>{{ elementData.config.title }}</h1>
            <p :style="'max-height:' + elementData.config.maxHeight">
              {{ elementData.config.description }}
            </p>
          </div>
          <a :href="elementData.config.link" target="_blank">
            <el-button :style="elementData.config.btnStyle">查看详情</el-button>
          </a>
        </div>
      </div>
    </div>
    <!-- 文本+图片（左右布局）（A0009） -->
    <div v-if="elementData.template_id === 'A0009'" class="A0009">
      <div
        class="card"
        v-for="(item, index) in elementData.config.items"
        :key="index"
      >
        <el-row
          :gutter="30"
          v-if="item.title || item.content || item.thumbnail"
          style="margin-bottom: 50px"
        >
          <el-col :span="12">
            <el-image :src="item.thumbnail" v-if="index % 2 === 0">
              <el-image
                slot="error"
                style="width: 100%; height: 100%"
                :src="img"
                fit="cover"
              >
              </el-image>
            </el-image>
            <div v-if="index % 2 === 1">
              <h1 style="font-size: 26px; margin-top: 0">{{ item.title }}</h1>
              <el-divider></el-divider>
              <div v-html="item.content"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-image :src="item.thumbnail" v-if="index % 2 === 1">
              <el-image
                slot="error"
                style="width: 100%; height: 100%"
                :src="img"
                fit="cover"
              >
              </el-image>
            </el-image>
            <div v-if="index % 2 === 0">
              <h1 style="font-size: 26px; margin-top: 0">{{ item.title }}</h1>
              <el-divider></el-divider>
              <div v-html="item.content"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 指数成果（A0010） -->
    <div v-if="elementData.template_id === 'A0010'" class="A0000 A0010">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <div style="height: 580px">
        <el-row
          :gutter="20"
          class="card"
          v-for="(item, index) in elementData.config.infoList"
          :key="index"
        >
          <el-col :span="5" class="svgDiv">
            <svg
              class="svg"
              width="113"
              height="158"
              viewBox="0 0 113 158"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.319336 4.997C0.319336 4.07997 0.893588 3.26111 1.75577 2.94873L8.52762 0.495117V157.111L1.31887 152.472C0.695863 152.071 0.319336 151.381 0.319336 150.64V4.997Z"
                fill="#9F9F9F"
              ></path>
              <path
                d="M0.319336 7.95374L8.52762 6.41699V87.3433L0.319336 84.6136V7.95374Z"
                fill="#C9C9C9"
              ></path>
              <path
                d="M8.52734 0.495117L110.707 5.25049C111.482 5.28656 112.092 5.92543 112.092 6.7013V146.507C112.092 147.259 111.518 147.887 110.769 147.954L8.52734 157.111V0.495117Z"
                fill="#C4C4C4"
              ></path>
              <path
                d="M8.52734 6.41699L112.092 11.1824V82.5504L8.52734 87.3434V6.41699Z"
                fill="#DEDEDE"
              ></path>
              <path
                d="M18.9707 17.2185C18.9707 16.4075 19.6349 15.7536 20.4459 15.7663L102.02 17.0462C102.813 17.0587 103.449 17.7052 103.449 18.4984V25.8459C103.449 26.6431 102.807 27.2914 102.01 27.2982L20.4356 27.9999C19.6286 28.0068 18.9707 27.3546 18.9707 26.5476V17.2185Z"
                fill="#D0D0D0"
              ></path>
              <path
                d="M18.9707 32.4733C18.9707 31.6676 19.6265 31.0159 20.4322 31.0209L102.006 31.5351C102.805 31.5401 103.449 32.1889 103.449 32.9874V34.2012C103.449 35.0014 102.802 35.6508 102.002 35.6536L20.4281 35.9354C19.624 35.9382 18.9707 35.2872 18.9707 34.4831V32.4733Z"
                fill="#D0D0D0"
              ></path>
              <path
                d="M18.9707 47.5907C18.9707 46.3875 19.9461 45.4121 21.1493 45.4121H38.5392C39.7424 45.4121 40.7178 46.3875 40.7178 47.5907V47.8994C40.7178 49.0912 39.7601 50.0618 38.5685 50.0778L21.1785 50.3112C19.964 50.3275 18.9707 49.3475 18.9707 48.1329V47.5907Z"
                fill="#D0D0D0"
              ></path>
              <path
                d="M17.7959 143.373C17.7959 142.606 18.3891 141.97 19.1544 141.916L107.187 135.7C107.762 135.659 108.251 136.115 108.251 136.691V136.691C108.251 137.208 107.854 137.639 107.338 137.681L19.3757 144.83C18.5247 144.899 17.7959 144.227 17.7959 143.373V143.373Z"
                fill="#D0D0D0"
              ></path>
              <path
                d="M19.2734 40.6722C19.2734 40.2087 19.6492 39.833 20.1126 39.833H29.0469C29.487 39.833 29.8439 40.1898 29.8439 40.63V40.63C29.8439 41.0672 29.4916 41.4228 29.0544 41.4269L20.1206 41.5113C19.654 41.5157 19.2734 41.1388 19.2734 40.6722V40.6722Z"
                fill="#D0D0D0"
              ></path>
            </svg>
          </el-col>
          <el-col :span="6" class="other">
            <div class="title">{{ item.title }}</div>
            <div class="subtitle">{{ item.subtitle }}</div>
            <div class="time">发布时间：{{ item.time }}</div>
          </el-col>
          <el-col :span="9" class="content">
            {{ item.content }}
          </el-col>
          <el-col :span="4" class="button">
            <el-button @click="openA0010Dialog(item)"
              >查看详情<i class="el-icon-right"></i
            ></el-button>
          </el-col>
        </el-row>
      </div>
      <div style="text-align: center; margin-top: 20px">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="elementData.config.currentPage"
          :page-size="elementData.config.pageSize"
          layout="total, prev, pager, next"
          :total="elementData.config.items.length"
        >
        </el-pagination>
      </div>
      <el-dialog
        :visible.sync="A0010Dialog"
        width="1200px"
        top="0"
        custom-class="A0004Dialog"
        :destroy-on-close="true"
      >
        <div class="none-scrollbar" style="height: 100%; color: #111827">
          <div style="text-align: center">
            <h1 style="font-size: 22px">{{ A0010Info.title }}</h1>
            <div style="font-size: 12px; color: #999999; margin: 30px">
              发布时间：{{ A0010Info.time }}
            </div>
            <div style="font-size: 13px">{{ A0010Info.subtitle }}</div>
          </div>
          <el-divider></el-divider>
          <p class="content" style="white-space: pre-wrap">
            {{ A0010Info.details }}
          </p>
        </div>
      </el-dialog>
    </div>
    <!-- 可检索内容列表（A0011） -->
    <div v-if="elementData.template_id === 'A0011'" class="A0000 A0011">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <el-row class="search">
        <el-col :span="6">
          <div style="height: 1px"></div>
        </el-col>
        <el-col :span="15">
          <el-input
            style="width: 80%"
            prefix-icon="el-icon-search"
            :placeholder="elementData.config.searchLabel"
            v-model.trim="A0011SearchText"
          >
          </el-input>
          <el-button @click="A0011Search">搜索</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="menu">
          <ul v-if="elementData.config.naviDisplay">
            <ol
              v-for="(items, i) in elementData.config.itemArray"
              :key="i"
            >
              <a @click.prevent="anchor(items.id)" style="cursor: pointer">
                {{ items.title }}
              </a>
              <ul>
                <ol
                  v-for="(item, j) in items.items.filter(v => v.type)"
                  :key="j"
                >
                  <a @click.prevent="anchor(item.id)" style="cursor: pointer">
                    {{ item.title }}
                  </a>
                </ol>
              </ul>
            </ol>
          </ul>
          <div style="height: 1px"></div>
        </el-col>
        <el-col id="A0011" :span="15" class="items none-scrollbar">
          <div v-for="(items, i) in elementData.config.infoList" :key="i">
            <h1 :id="items.id" style="font-size: 28px">{{ items.title }}</h1>
            <template v-for="(item, j) in items.items">
              <el-row :key="j" class="item" v-if="!item.type">
                <el-col :span="8" style="text-align: center">
                  <img class="img" :src="item.thumbnail" :key="j" v-lazy alt="" />
                </el-col>
                <el-col :span="16" style="text-align: left">
                  <div class="title" v-html="highlight(item.title)"></div>
                  <div class="content" v-html="highlight(item.content)"></div>
                  <a class="button" :href="item.link" target="_blank">
                    <el-button>
                      前往查看
                      <i class="el-icon-right"></i>
                    </el-button>
                  </a>
                </el-col>
              </el-row>
              <h2 :id="item.id" v-else :key="item.id">{{ item.title }}</h2>
            </template>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 滚动卡片（A00012） -->
    <div v-if="elementData.template_id === 'A0012'" class="A0012">
      <div :style="elementData.config.divStyle">
        <vue-seamless-scroll
          :data="elementData.config.items"
          :class-option="elementData.config.classOption"
          class="warp"
        >
          <ul class="item">
            <li v-for="(item, index) in elementData.config.items" :key="index">
              <div class="card">
                <div style="height: 50%">
                  <h2 class="subtitle">{{ item.subtitle }}</h2>
                  <h1 class="title">{{ item.title }}</h1>
                  <p class="content">{{ item.content }}</p>
                </div>
                <img
                  style="width: 100%; height: 50%"
                  :src="item.thumbnail"
                  @error="imgErrorFun"
                />
              </div>
            </li>
          </ul>
        </vue-seamless-scroll>
      </div>
    </div>
    <!-- 单图片组件（A00013） -->
    <div v-if="elementData.template_id === 'A0013'" class="A0013">
      <el-image
        :style="elementData.config.imgStyle"
        :src="elementData.config.attachPic"
        fit="fill"
      >
        <el-image
          slot="error"
          style="width: 100%; height: 100%"
          src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          fit="contain"
        >
        </el-image>
      </el-image>
    </div>
    <!-- 富文本（A00014） -->
    <div
      v-if="elementData.template_id === 'A0014'"
      v-html="elementData.config.html"
    ></div>
    <!-- 通知消息组件（A00015） -->
    <div v-if="elementData.template_id === 'A0015'" class="A0015">
      <div>
        <span class="title">
          <i class="el-icon-bell"></i>
          {{ elementData.config.title }}
        </span>
        <vue-seamless-scroll
          :data="elementData.config.items"
          :class-option="elementData.config.classOption"
          class="warp"
        >
          <ul class="item">
            <li v-for="(item, index) in elementData.config.items" :key="index">
              <a :href="item.link" target="_blank">
                <span class="desc" :style="'color:' + item.textColor">{{
                  item.title
                }}</span>
              </a>
            </li>
          </ul>
        </vue-seamless-scroll>
      </div>
    </div>
    <!-- 左右标题按钮布局（A00016） -->
    <div v-if="elementData.template_id === 'A0016'" class="A0016">
      <el-row :gutter="20" v-if="elementData.config.contentStyle === 0">
        <el-col :span="12">
          <div>
            <h1 class="title">{{ elementData.config.title }}</h1>
            <p class="content">{{ elementData.config.description }}</p>
            <a :href="elementData.config.link" target="_blank">
              <el-button>{{ elementData.config.btnText }}</el-button>
            </a>
          </div>
        </el-col>
        <el-col :span="12">
          <el-image
            style="width: 100%; height: 100%"
            :src="elementData.config.attachPic"
            fit="fill"
          >
            <el-image
              slot="error"
              style="width: 100%; height: 100%"
              :src="img"
              fit="fill"
            >
            </el-image>
          </el-image>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-else>
        <el-col :span="12">
          <el-image
            style="width: 100%; height: 100%"
            :src="elementData.config.attachPic"
            fit="fill"
          >
            <el-image
              slot="error"
              style="width: 100%; height: 100%"
              :src="img"
              fit="fill"
            >
            </el-image>
          </el-image>
        </el-col>
        <el-col :span="12">
          <div>
            <h1 class="title">{{ elementData.config.title }}</h1>
            <p class="content">{{ elementData.config.description }}</p>
            <a :href="elementData.config.link" target="_blank">
              <el-button>{{ elementData.config.btnText }}</el-button>
            </a>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 用户评价组件（A0017） -->
    <div v-if="elementData.template_id === 'A0017'" class="A0000 A0017">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <div class="items">
        <el-card v-for="(item, index) in elementData.config.items" :key="index">
          <el-image
            style="width: 80%; height: 90px"
            :src="item.institutionThumb"
            fit="fill"
          >
            <el-image
              slot="error"
              style="width: 100%; height: 100%"
              :src="img"
              fit="fill"
            >
            </el-image>
          </el-image>
          <div class="content">
            {{ item.comments }}
          </div>
          <div style="height: 100px">
            <el-row style="display: flex; align-items: center">
              <el-col :span="7">
                <el-avatar :size="64" :src="item.userAvatar" @error="true">
                  <el-avatar :size="64" icon="el-icon-user-solid"></el-avatar>
                </el-avatar>
              </el-col>
              <el-col :span="17">
                <div class="title">{{ item.userName }}</div>
                <div class="subtitle">{{ item.userUnit }}</div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 招聘列表（A0018） -->
    <div v-if="elementData.template_id === 'A0018'" class="A0018">
      <el-row class="header">
        <el-col :span="13">
          <el-row class="tb">
            <svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              class="icon"
            >
              <path
                d="M512 938.666667c-53.333333 0-384-257.258667-384-469.333334S299.925333 85.333333 512 85.333333s384 171.925333 384 384-330.666667 469.333333-384 469.333334z m0-352c64.8 0 117.333333-52.533333 117.333333-117.333334s-52.533333-117.333333-117.333333-117.333333-117.333333 52.533333-117.333333 117.333333 52.533333 117.333333 117.333333 117.333334z"
                fill="#414141"
              ></path>
            </svg>
            工作地点：
            <span :title="elementData.config.location">
              {{ elementData.config.location }}
            </span>
          </el-row>
          <el-row class="tb" :title="elementData.config.email">
            <svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              class="icon"
            >
              <path
                d="M1021.407 146.857L512.645 574.783 3.909 146.857zM0.007 183.402L339.886 471.24 0.007 876.743z"
                fill="#414141"
              ></path>
              <path
                d="M39.354 877.144L363.529 494.4 512.54 616.772l149.274-126.179 324.157 386.551zM1023.993 876.743L684.122 471.24l339.871-287.838z"
                fill="#414141"
              ></path>
            </svg>
            简历投递邮箱：
            <span :title="elementData.config.email">
              {{ elementData.config.email }}
            </span>
          </el-row>
        </el-col>
        <el-col :span="8" :offset="3">
          <el-col :span="11" style="max-width: 170px">
            <div class="tb">
              <svg
                viewBox="0 0 1041 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                class="icon"
              >
                <path
                  d="M948.906667 931.84h92.16V1024h-92.16zM948.906667 559.786667v184.32H853.333333v-184.32H576.853333V1024h92.16V651.946667h92.16v184.32h279.893334v-276.48z"
                  fill="#414141"
                ></path>
                <path
                  d="M761.173333 931.84H853.333333V1024h-92.16zM187.733333 187.733333h92.16v92.16H187.733333z"
                  fill="#414141"
                ></path>
                <path
                  d="M0 464.213333h464.213333V0H0v464.213333zM92.16 92.16h279.893333v279.893333H92.16V92.16zM187.733333 744.106667h92.16v92.16H187.733333z"
                  fill="#414141"
                ></path>
                <path
                  d="M0 1024h464.213333V559.786667H0V1024z m92.16-372.053333h279.893333v279.893333H92.16v-279.893333zM761.173333 187.733333H853.333333v92.16h-92.16z"
                  fill="#414141"
                ></path>
                <path
                  d="M1041.066667 0H576.853333v464.213333h464.213334V0z m-92.16 372.053333h-279.893334V92.16h279.893334v279.893333z"
                  fill="#414141"
                ></path>
              </svg>
              HR企业微信：
            </div>
          </el-col>
          <el-col :span="10">
            <el-image
              style="width: 100px; height: 100px"
              :src="elementData.config.wx"
              fit="fill"
            >
              <el-image
                slot="error"
                style="width: 100%; height: 100%"
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                fit="fill"
              >
              </el-image>
            </el-image>
          </el-col>
        </el-col>
      </el-row>
      <div class="table">
        <el-row class="table_header">
          <el-col :span="9">
            <span>招聘岗位</span>
          </el-col>
          <el-col :span="5">
            <span>学历要求</span>
          </el-col>
          <el-col :span="5">
            <span>岗位职责</span>
          </el-col>
          <el-col :span="5">
            <span>任职要求</span>
          </el-col>
        </el-row>
        <div v-for="(item, index) in elementData.config.items" :key="index">
          <el-row
            class="table_row"
            @click.native="rowClick(item)"
            :style="item.isShow ? 'background:#2b65e8;color:white' : ''"
          >
            <el-col :span="9">
              <span v-if="item.name">{{ item.name }}</span>
              <span v-else>暂无内容</span>
            </el-col>
            <el-col :span="5">
              <span v-if="item.eduRequire">{{ item.eduRequire }}</span>
              <span v-else>暂无内容</span>
            </el-col>
            <el-col :span="5">
              <span v-if="!item.isShow">查看详情</span>
              <span v-if="item.isShow">收起</span>
            </el-col>
            <el-col :span="5">
              <span v-if="!item.isShow">查看详情</span>
              <span v-if="item.isShow">收起</span>
            </el-col>
          </el-row>
          <div v-if="item.isShow" class="other">
            <h1 class="title">岗位职责：</h1>
            <div v-html="item.jobRespon"></div>
            <h1 class="title">任职要求：</h1>
            <div v-html="item.workRequire"></div>
            <div style="text-align: center">
              <a
                :href="
                  'mailto:' + elementData.config.email + '?Subject=' + item.name
                "
                class="button"
                title="安装邮箱客户端程序后才可使用"
              >
                <el-button>
                  <span>
                    发送简历
                    <svg
                      viewBox="0 0 1024 1024"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      class="icon"
                    >
                      <path
                        d="M1021.407 146.857L512.645 574.783 3.909 146.857zM0.007 183.402L339.886 471.24 0.007 876.743z"
                        fill="#2b65e8"
                      ></path>
                      <path
                        d="M39.354 877.144L363.529 494.4 512.54 616.772l149.274-126.179 324.157 386.551zM1023.993 876.743L684.122 471.24l339.871-287.838z"
                        fill="#2b65e8"
                      ></path>
                    </svg>
                  </span>
                </el-button>
              </a>
            </div>
          </div>
        </div>
        <el-empty
          description="暂无数据"
          v-if="
            !elementData.config.items || elementData.config.items.length === 0
          "
        ></el-empty>
      </div>
    </div>
    <!-- 专栏标签页+子页（A0019） -->
    <div v-if="elementData.template_id === 'A0019'" class="A0000 A0019">
      <el-tabs type="border-card">
        <el-tab-pane
          v-for="(items, i) in elementData.config.items"
          :key="i"
          :label="items.title"
        >
          <div class="tab scrollbar">
            <div
              v-for="(item, j) in items.articles"
              class="item"
              @click="openA0019Dialog(item)"
              :key="j"
            >
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
              >
                <path
                  d="M512 320a192.064 192.064 0 0 1 0 384 192 192 0 0 1 0-384z"
                  fill="#132772"
                ></path>
              </svg>
              {{ item.title }}
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :visible.sync="A0019Dialog"
        width="1200px"
        top="0"
        custom-class="A0019Dialog"
        :destroy-on-close="true"
      >
        <div class="none-scrollbar" style="height: 100%">
          <h1 class="title">
            {{ A0019Info.title }}
          </h1>
          <div class="subtitle">
            {{ A0019Info.subtitle }}
          </div>
          <el-divider></el-divider>
          <p class="content" v-html="A0019Info.content"></p>
        </div>
      </el-dialog>
    </div>
    <!-- 文本卡片+子页（A0020） -->
    <div v-if="elementData.template_id === 'A0020'" class="A0000 A0020">
      <el-row>
        <el-col :span="12">
          <el-card
            v-for="(items, i) in elementData.config.items.filter((v, i) => {
              i % 2 === 0;
            })"
            class="card"
            :key="i"
          >
            <div slot="header" class="header">
              <div style="display: inline-block">
                <i class="el-icon-postcard"></i>
                <span>{{ items.title }}</span>
                <div class="inline"></div>
              </div>
            </div>
            <div class="body">
              <el-collapse accordion>
                <el-collapse-item
                  v-for="(item, j) in items.articles"
                  class="item"
                  :key="j"
                >
                  <template slot="title">
                    <span class="title">{{ item.title }}</span>
                  </template>
                  <div class="content">
                    <div>
                      <p>{{ item.subtitle }}</p>
                      <div v-html="item.content"></div>
                    </div>
                    <el-button @click="openA0020Dialog(item)"
                      >查看详情</el-button
                    >
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card
            v-for="(items, i) in elementData.config.items.filter((v, i) => {
              i % 2 === 1;
            })"
            class="card"
            :key="i"
          >
            <div slot="header" class="header">
              <div style="display: inline-block">
                <i class="el-icon-postcard"></i>
                <span>{{ items.title }}</span>
                <div class="inline"></div>
              </div>
            </div>
            <div class="body">
              <el-collapse accordion>
                <el-collapse-item
                  v-for="(item, j) in items.articles"
                  class="item"
                  :key="j"
                >
                  <template slot="title">
                    <span class="title">{{ item.title }}</span>
                  </template>
                  <div class="content">
                    <div>
                      <p>{{ item.subtitle }}</p>
                      <div v-html="item.content"></div>
                    </div>
                    <el-button @click="openA0020Dialog(item)"
                      >查看详情</el-button
                    >
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="A0020Dialog"
        width="1000px"
        top="0"
        custom-class="A0020Dialog"
        :destroy-on-close="true"
      >
        <div class="none-scrollbar" style="height: 100%">
          <h1 class="title">
            {{ A0020Info.title }}
          </h1>
          <div class="subtitle">
            {{ A0020Info.subtitle }}
          </div>
          <el-divider></el-divider>
          <div v-html="A0020Info.content" class="content"></div>
        </div>
      </el-dialog>
    </div>
    <!-- 时间轴（A0021） -->
    <div v-if="elementData.template_id === 'A0021'" class="A0000">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <div>
        <el-timeline :reverse="elementData.config.sort === 0">
          <el-timeline-item
            v-for="(item, index) in elementData.config.items"
            :key="index"
            :timestamp="item.time"
            placement="top"
            color="#0e68b4"
            size="large"
          >
            {{ item.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <!-- 标签导航（A0022） -->
    <div v-if="elementData.template_id === 'A0022'" class="A0000 A0022">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <div class="tabs_div">
        <el-tabs tab-position="left" type="border-card">
          <el-tab-pane
            v-for="(items, i) in elementData.config.items"
            :key="i"
            :label="items.title"
          >
            <div class="tab none-scrollbar">
              <a
                v-for="(item, j) in items.articles"
                :key="j"
                :href="item.link"
                target="_blank"
              >
                <div class="item">
                  <el-row>
                    <el-col :span="20" :title="item.title" class="title">
                      <svg
                        viewBox="0 0 1024 1024"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                      >
                        <path
                          d="M512 320a192.064 192.064 0 0 1 0 384 192 192 0 0 1 0-384z"
                          fill="#909399"
                        ></path>
                      </svg>
                      {{ item.title }}
                    </el-col>
                    <el-col :span="4" class="time">
                      {{ item.time }}
                    </el-col>
                  </el-row>
                </div>
              </a>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 标题组件（A0023） -->
    <div v-if="elementData.template_id === 'A0023'" class="A0000">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
    </div>
    <!-- 轮播图（按钮版）（A0024） -->
    <div v-if="elementData.template_id === 'A0024'">
      <el-carousel
        trigger="click"
        :height="elementData.config.height"
        :interval="elementData.config.timeout"
      >
        <el-carousel-item
          v-for="(item, index) in elementData.config.items"
          :key="index"
        >
          <div :style="item.divStyle" class="A0001">
            <div
              :style="item.modeStyle"
              class="text"
              v-if="!elementData.config.disableMask"
            >
              <div :style="item.textStyle">
                <span style="font-size: 34px; margin: 15px 0">{{
                  item.title
                }}</span>
                <span style="font-size: 22px; margin: 10px 0; white-space: pre-wrap;">{{
                  item.subtitle
                }}</span>
                <span style="font-size: 16px; white-space: pre-wrap">{{
                  item.content
                }}</span>
                <el-button
                  :style="item.btnStyle"
                  style="margin: 10px 0; border: none"
                  @click="openA0024Window(item.link)"
                  v-if="item.link"
                >
                  查看详情
                </el-button>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 合作商（批量）（A0025） -->
    <div v-if="elementData.template_id === 'A0025'" class="A0000 A0006 A0025">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <div>
        <vue-seamless-scroll
          :data="elementData.config.items"
          :class-option="elementData.config.classOption"
          class="warp"
          :style="elementData.config.divStyle"
        >
          <ul class="item">
            <li
              v-for="(item, index) in elementData.config.items.filter(
                (v, i) => i % 2 === 0
              )"
              :key="index"
              :style="elementData.config.liStyle"
              style="margin: 15px"
            >
              <div style="width: 100%; height: 100%">
                <img :src="item" style="width: 100%; height: 100%" />
              </div>
            </li>
          </ul>
          <ul class="item" id="ul_0">
            <li
              v-for="(item, index) in elementData.config.items.filter(
                (v, i) => i % 2 === 1
              )"
              :key="index"
              :style="elementData.config.liStyle"
              style="margin: 15px"
            >
              <div style="width: 100%; height: 100%">
                <img :src="item" style="width: 100%; height: 100%" />
              </div>
            </li>
          </ul>
        </vue-seamless-scroll>
      </div>
    </div>
    <!-- 标签导航（自定颜色）（A0026） -->
    <div v-if="elementData.template_id === 'A0026'" class="A0000 A0026">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <div class="tabs_div">
        <div
          :style="'width: calc(100% / ' + elementData.config.column + ')'"
          v-for="(card, i) in elementData.config.items"
          class="card"
          :key="i"
        >
          <el-card :key="i">
            <div
              slot="header"
              class="card_title"
              :style="'background:' + card.color"
              :title="card.title"
            >
              {{ card.title }}
            </div>
            <div
              v-for="(item, j) in card.articles.filter((v, i) => i < 5)"
              :key="j"
              class="card_item"
            >
              <span class="icon" :style="'background:' + card.color"></span>
              <span
                class="title"
                :style="
                  'max-width: calc(100% - ' +
                    (item.download ? item.width : '115') +
                    'px);'
                "
                :title="item.title"
              >
                <div>
                  <a :href="item.link" target="_blank">
                    {{ item.title }}
                  </a>
                </div>
              </span>
              <span class="time" v-if="item.time">{{ item.time }}</span>
              <el-button
                class="download"
                v-if="item.download"
                @click="downloadFile(item.download, 'A0026')"
              >
                <span v-html="item.btnText"> </span>
              </el-button>
            </div>
            <div class="card_footer" @click="openA0026Dialog(i)">浏览更多</div>
          </el-card>
        </div>
      </div>
      <el-dialog
        :visible.sync="A0026Dialog"
        width="1200px"
        top="0"
        custom-class="A0026Dialog"
      >
        <div class="A0026Dialog_body">
          <div class="A0000">
            <h1 v-if="elementData.config.title" style="margin-left: 0">
              {{ elementData.config.title }}
              <div></div>
            </h1>
            <p v-if="elementData.config.description" style="margin-left: 10px">
              {{ elementData.config.description }}
            </p>
          </div>
          <el-tabs tab-position="left" v-model="elementData.config.activeName">
            <el-tab-pane
              v-for="(card, i) in elementData.config.items"
              :key="i"
              :name="'' + i"
            >
              <div slot="label" :title="card.title">
                <span class="icon"></span>
                {{ card.title }}
              </div>
              <div class="tab none-scrollbar">
                <div class="tab_title">
                  <span>{{ card.title }}</span>
                </div>
                <div style="padding: 0 20px; box-sizing: border-box">
                  <div
                    v-for="(item, j) in card.articles"
                    :key="j"
                    class="card_item"
                  >
                    <i class="el-icon-coin"></i>
                    <span
                      class="title"
                      :style="'max-width: calc(100% - 280px);'"
                      :title="item.title"
                    >
                      <div>
                        <a :href="item.link" target="_blank">
                          {{ item.title }}
                        </a>
                      </div>
                    </span>
                    <span class="time" v-if="item.time">{{ item.time }}</span>
                    <el-button
                      class="download"
                      style="max-width: 150px"
                      v-if="item.download"
                      @click="downloadFile(item.download, 'A0026')"
                    >
                      <span v-html="item.btnText"> </span>
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-dialog>
      <!-- 提示对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="A0026HintDialog"
        width="450px"
        top="0"
        custom-class="A0026_hint_dialog"
        append-to-body
      >
        <span>
          <i class="el-icon-warning"></i>
          该功能需登录之后才可使用，请先登录！
        </span>
        <span slot="footer">
          <el-button @click="A0026HintDialog = false">取 消</el-button>
          <el-button type="success" @click="IPLogin">机构 IP 登录</el-button>
          <el-button type="primary" @click="jumpLogin">个人用户登录</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 文本卡片（A0027） -->
    <div v-if="elementData.template_id === 'A0027'" class="A0000 A0027">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <div class="tabs_div">
        <div
          :style="
            'width: calc(100% / ' +
              elementData.config.column +
              ');max-width: calc(100% / ' +
              elementData.config.column +
              ')'
          "
          v-for="(item, index) in elementData.config.items"
          class="card"
          :key="index"
        >
          <el-image
            style="width: 100%; height: 180px"
            :src="item.thumbnail"
            fit="cover"
          >
            <el-image
              slot="error"
              style="width: 100%; height: 180px"
              :src="img"
              fit="cover"
            >
            </el-image>
          </el-image>
          <div class="card_title" :style="'background:' + item.color">
            {{ item.title }}
          </div>
          <div class="card_subtitle">{{ item.subtitle }}</div>
          <div class="card_content">{{ item.content }}</div>
          <div class="card_footer">
            <a :href="item.link" target="_blank"> 查看详情 </a>
          </div>
        </div>
      </div>
    </div>
    <!-- 成果表格（纯表格）（A0028） -->
    <div v-if="elementData.template_id === 'A0028'" class="A0000 A0004 A0028">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <el-table
        :data="elementData.config.infoList"
        height="256px"
        style="width: 100%"
        @row-click="openA0028Dialog"
      >
        <el-table-column prop="periodical" label="期刊名称" min-width="140px">
        </el-table-column>
        <el-table-column prop="title" label="论文标题" min-width="200px">
        </el-table-column>
        <el-table-column prop="time" label="发布时间" min-width="60px">
        </el-table-column>
        <el-table-column prop="database" label="相关数据库" min-width="80px">
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin: 5px 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="elementData.config.currentPage"
          :page-size="elementData.config.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="elementData.config.items.length"
        >
        </el-pagination>
      </div>
      <el-dialog
        :visible.sync="A0028Dialog"
        width="1200px"
        top="0"
        custom-class="A0004Dialog"
        :destroy-on-close="true"
      >
        <div class="none-scrollbar" style="height: 100%">
          <h1 class="title">{{ A0028Info.title }}</h1>
          <div class="subtitle">
            <div class="time">{{ A0028Info.time }}</div>
            <div class="author">{{ A0028Info.author }}</div>
            <div>
              {{ A0028Info.periodical }}
              <span class="database">
                {{ A0028Info.database }}
              </span>
            </div>
          </div>
          <el-divider></el-divider>
          <p class="content">{{ A0028Info.details }}</p>
          <el-divider></el-divider>
          <div style="text-align: center">
            <a :href="A0028Info.dbUrl" target="_blank">
              <el-button class="blue_button">查看数据库</el-button>
            </a>
            <a :href="A0028Info.link" target="_blank">
              <el-button class="white_button"
                >查看原文 <i class="el-icon-right"></i
              ></el-button>
            </a>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 下载卡片（A0029） -->
    <div v-if="elementData.template_id === 'A0029'" class="A0029">
      <h1 class="title">{{ elementData.config.title }}</h1>
      <div class="div" :style="elementData.config.divStyle">
        <div class="text" :style="elementData.config.textStyle">
          <div>
            <div class="subtitle">{{ elementData.config.subtitle }}</div>
            <div class="content">{{ elementData.config.content }}</div>
            <el-button
              class="download"
              @click="downloadFile(elementData.config.download, 'A0029')"
            >
              <i class="el-icon-download"></i>
              立即下载
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 常见问题（A0030） -->
    <div v-if="elementData.template_id === 'A0030'" class="A0030">
      <div
        v-for="(module, i) in elementData.config.modules"
        :key="i"
        class="module"
      >
        <div
          class="title"
          :style="
            'color:' +
              elementData.config.color +
              ';border-color:' +
              elementData.config.color
          "
        >
          {{ module.title }}
        </div>
        <el-collapse
          v-model="elementData.config.activeName"
          accordion
          @change="handleChange"
        >
          <el-collapse-item
            v-for="(item, j) in module.items"
            :name="i + '.' + j"
            :key="i + '.' + j"
          >
            <template slot="title">
              <span
                class="icon"
                :style="'color:' + elementData.config.hintColor"
                >Q</span
              >
              <span class="text" :style="'color:' + elementData.config.color">{{
                j + 1 + ". " + item.title
              }}</span>
            </template>
            <div class="icon" :style="'color:' + elementData.config.hintColor">
              A
            </div>
            <div class="content" v-html="item.content"></div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <!-- 标题组件（纯文本）（A0031） -->
    <div v-if="elementData.template_id === 'A0031'" class="A0031">
      <div class="icon" style="float: left">
        <i :class="elementData.config.icon"></i>
      </div>
      <div class="title" style="float: left">
        {{ elementData.config.title }}：
      </div>
      <div class="content" style="clear: both">
        <el-row v-for="(item, index) in elementData.config.items" :key="index">
          <span v-if="item.title">{{ item.title }}</span>
        </el-row>
      </div>
    </div>
    <!-- 标题组件（图文版）（A0032） -->
    <div v-if="elementData.template_id === 'A0032'" class="A0031 A0032">
      <div class="icon" style="float: left">
        <i :class="elementData.config.icon"></i>
      </div>
      <div class="title" style="float: left">
        {{ elementData.config.title }}：
      </div>
      <div class="items" style="clear: both">
        <div
          v-for="(item, index) in elementData.config.items"
          :key="index"
          class="item"
        >
          <el-image :src="item.thumbnail">
            <el-image
              slot="error"
              style="width: 100%; height: 100%"
              :src="img"
              fit="cover"
            >
            </el-image>
          </el-image>
          <div v-if="item.title" class="text">{{ item.title }}</div>
        </div>
      </div>
    </div>
    <!-- 文本卡片（数据超市）（A0033） -->
    <div v-if="elementData.template_id === 'A0033'" class="A0000 A0027">
      <h1 v-if="elementData.config.title">
        {{ elementData.config.title }}
        <div></div>
      </h1>
      <p v-if="elementData.config.description">
        {{ elementData.config.description }}
      </p>
      <div class="tabs_div">
        <div
          :style="
            'width: calc(100% / ' +
              elementData.config.column +
              ');max-width: calc(100% / ' +
              elementData.config.column +
              ')'
          "
          v-for="(item, index) in elementData.config.items"
          class="card"
          :key="index"
        >
          <el-image
            style="width: 100%; height: 180px"
            :src="item.thumbnail"
            fit="cover"
          >
            <el-image
              slot="error"
              style="width: 100%; height: 180px"
              :src="img"
              fit="cover"
            >
            </el-image>
          </el-image>
          <div class="card_title" :style="'background:' + item.color">
            {{ item.title }}
          </div>
          <div class="card_subtitle">{{ item.subtitle }}</div>
          <div class="card_content">{{ item.content }}</div>
          <div class="card_footer" @click="jumpA0033Database(item.database)">
            获取数据
          </div>
        </div>
      </div>
    </div>
    <!-- 文本卡片（专属特权）（A0034） -->
    <div v-if="elementData.template_id === 'A0034'" class="A0034">
      <div
        class="title"
        v-if="elementData.config.title || elementData.config.description"
      >
        <h1 v-if="elementData.config.title" class="over-hidden">
          {{ elementData.config.title }}
        </h1>
        <p v-if="elementData.config.description" class="over-hidden">
          {{ elementData.config.description }}
        </p>
      </div>
      <div class="cards">
        <div
          class="card"
          v-for="(card, i) in elementData.config.cards"
          :key="i"
          :style="
            'width: calc(' + 100 / elementData.config.column + '% - 20px)'
          "
        >
          <div class="title over-hidden">
            {{ card.title }}
          </div>
          <div class="items">
            <div
              class="item"
              v-for="(item, j) in card.items"
              :key="j"
              :style="'width: calc(' + 100 / card.items.length + '% - 10px)'"
            >
              <h3 class="title over-hidden" :style="'color:' + item.color">
                {{ item.title }}
              </h3>
              <p class="subtitle over-hidden">
                {{ item.subtitle }}
              </p>
              <p
                class="content over-hidden"
                :style="'color:' + item.color"
                v-html="item.content"
              ></p>
              <el-button
                :style="'background:' + item.color"
                @click="jumpA0034Link(item.link)"
              >
                {{ item.buttonText }}
              </el-button>
              <ul class="list">
                <li
                  v-for="(li, k) in item.list.filter((v, i) => i < 7)"
                  :key="k"
                >
                  <span class="name over-hidden">{{ li.name }}</span>
                  <span class="unit over-hidden">{{ li.unit }}</span>
                </li>
              </ul>
              <div
                class="tag over-hidden"
                :style="'background:' + item.tagColor"
                v-if="item.tagName"
              >
                {{ item.tagName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 文本卡片（会员权益）（A0035） -->
    <div v-if="elementData.template_id === 'A0035'" class="A0035">
      <div
        class="title"
        v-if="elementData.config.title || elementData.config.description"
      >
        <h1 v-if="elementData.config.title" class="over-hidden">
          {{ elementData.config.title }}
        </h1>
        <p v-if="elementData.config.description" class="over-hidden">
          {{ elementData.config.description }}
        </p>
      </div>
      <div class="items">
        <div
          class="item"
          v-for="(item, index) in elementData.config.items"
          :key="index"
          :style="
            'width: calc(' +
              100 / (elementData.config.size + 2) +
              '% - 23px); height: ' +
              A0035Height[elementData.config.size]
          "
        >
          <div class="header">
            <h1>{{ item.title }}</h1>
            <el-image :src="item.thumbnail" fit="cover">
              <el-image
                slot="error"
                style="width: 100%; height: 100%"
                :src="A0035Image[item.image]"
                fit="cover"
              >
              </el-image>
            </el-image>
          </div>
          <div class="main">
            <div v-html="item.richtext"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import img from "@/assets/default/img.png";
import img0 from "@/assets/default/img-0.png";
import img1 from "@/assets/default/img-1.png";
import img2 from "@/assets/default/img-2.png";
import img3 from "@/assets/default/img-3.png";
import img4 from "@/assets/default/img-4.png";
import img5 from "@/assets/default/img-5.png";

export default {
  name: "MyElement",
  props: {
    elementData: {
      type: Object,
      default: {
        template_id: 0
      }
    }
  },
  // 自定义懒加载图片的指令
  directives: {
    lazy: {
      bind(el, binding) {
        // 保存旧的src，方便后期渲染时候赋值src真实路径
        let oldSrc = el.src;
        // 渲染默认图片
        el.src = img;
        // 调用方法得到该元素是否处于可视区域
        let observer = new IntersectionObserver(([{ isIntersecting }]) => {
          // 回调是否处于可视区域，true or false
          if (isIntersecting) {
            // 如果处于可视区域额，将最开始保存的真实路径赋予DOM元素渲染
            if (Boolean(oldSrc)) el.src = oldSrc;
            // 只需要监听一次即可，第二次滑动到可视区域时候不在监听
            observer.unobserve(el);
          }
        });
        observer.observe(el); // 调用方法
      }
    }
  },
  data() {
    return {
      // 默认图片
      img,
      // div 内外边距样式
      divStyle: "",
      // 文字排布
      textAlign: ["left", "center", "right"],
      // 遮罩配色
      colorMode: ["none", "light", "dark", "deep-dark"],
      // A0004 对话框
      moreA0004Dialog: false,
      A0004Dialog: false,
      // A0004 对话框内容
      A0004Info: {},
      // A0007 对话框
      A0007Dialog: false,
      // A0010 对话框
      A0010Dialog: false,
      // A0010 对话框内容
      A0010Info: {},
      // A0011 查询字段
      A0011SearchText: "",
      // A0019 对话框
      A0019Dialog: false,
      // A0019 对话框内容
      A0019Info: {},
      // A0020 对话框
      A0020Dialog: false,
      // A0020 对话框内容
      A0020Info: {},
      // A0026 对话框
      A0026Dialog: false,
      A0026HintDialog: false,
      // A0028 对话框
      A0028Dialog: false,
      // A0028 对话框内容
      A0028Info: {},
      // A0035 卡片高度
      A0035Height: ["440px", "350px", "245px"],
      // A0035 图片
      A0035Image: [
        img0,
        img1,
        img2,
        img3,
        img4,
        img5
      ]
    };
  },
  methods: {
    // 处理数据
    processingData() {
      // 内外边距
      if (!(this.elementData.config.paddingX > 0))
        this.elementData.config.paddingX = 0;
      if (!(this.elementData.config.marginY > 0))
        this.elementData.config.marginY = 0;
      this.divStyle =
        "padding:" +
        this.elementData.config.marginY +
        "px " +
        this.elementData.config.paddingX +
        "px";
      // 轮播图（A0001） 或 轮播图（卡片化）（A0002） 或 纵向轮播图（A0003）或 轮播图（按钮版）（A0024）
      if (
        this.elementData.template_id === "A0001" ||
        this.elementData.template_id === "A0002" ||
        this.elementData.template_id === "A0003" ||
        this.elementData.template_id === "A0024"
      ) {
        if (!(this.elementData.config.timeout > 0))
          this.elementData.config.timeout = 5000;
        this.elementData.config.height =
          this.elementData.config.height > 0
            ? this.elementData.config.height + "px"
            : "500px";
        if (
          this.elementData.config.items &&
          this.elementData.config.items.length > 0
        ) {
          this.elementData.config.items.forEach(item => {
            if (!item.link) item.link = null;
            item.divStyle =
              "height:" +
              this.elementData.config.height +
              ';background-image:url("' +
              item.thumbnail +
              '")';
            if (!this.elementData.config.disableMask) {
              if (this.textAlign.indexOf(item.textAlign) < 0)
                item.textAlign = "left";
              if (this.colorMode.indexOf(item.colorMode) < 0)
                item.colorMode = "none";
              item.textStyle = "text-align:" + item.textAlign;
              if (this.colorMode.indexOf(item.colorMode) === 0) {
                item.btnStyle = "background:#0e68b4;color:white";
              } else if (this.colorMode.indexOf(item.colorMode) === 1) {
                item.textStyle += ";color:black";
                item.btnStyle = "background:#0e68b4;color:white";
                if (
                  this.textAlign.indexOf(item.textAlign) === 0 ||
                  this.textAlign.indexOf(item.textAlign) === 1
                ) {
                  item.modeStyle =
                    "background: linear-gradient(to right, rgba(255, 255, 255, 0.9), transparent)";
                } else {
                  item.modeStyle =
                    "background: linear-gradient(to left, rgba(255, 255, 255, 0.9), transparent)";
                }
              } else if (this.colorMode.indexOf(item.colorMode) === 2) {
                item.textStyle += ";color:white";
                item.btnStyle = "background:white;color:#0e68b4";
                if (
                  this.textAlign.indexOf(item.textAlign) === 0 ||
                  this.textAlign.indexOf(item.textAlign) === 1
                ) {
                  item.modeStyle =
                    "background: linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent)";
                } else {
                  item.modeStyle =
                    "background: linear-gradient(to left, rgba(0, 0, 0, 0.5), transparent)";
                }
              } else if (this.colorMode.indexOf(item.colorMode) === 3) {
                item.textStyle += ";color:white";
                item.btnStyle = "background:white;color:#0e68b4";
                if (
                  this.textAlign.indexOf(item.textAlign) === 0 ||
                  this.textAlign.indexOf(item.textAlign) === 1
                ) {
                  item.modeStyle =
                    "background: linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent)";
                } else {
                  item.modeStyle =
                    "background: linear-gradient(to left, rgba(0, 0, 0, 0.8), transparent)";
                }
              }
            }
          });
        }
      }
      // 成果展示（A0004）
      else if (this.elementData.template_id === "A0004") {
        if (
          this.elementData.config.items &&
          this.elementData.config.items.length > 0
        ) {
          this.elementData.config.items.forEach(item => {
            if (!item.link) item.link = null;
            if (!item.dbUrl) item.dbUrl = null;
          });
        }
        this.elementData.config.currentPage = 1;
        this.elementData.config.pageSize = 4;
        this.elementData.config.infoList = [];
        for (let i = 0; i < this.elementData.config.pageSize; i++) {
          if (this.elementData.config.items[i])
            this.elementData.config.infoList.push(
              this.elementData.config.items[i]
            );
        }
      }
      // 文本+5×N卡片（A0005）
      else if (this.elementData.template_id === "A0005") {
        let i = 0;
        if (
          this.elementData.config.cardRows &&
          this.elementData.config.cardRows.length > 0
        ) {
          this.elementData.config.cardRows.forEach(cardRow => {
            cardRow.id = i;
            let j = 0;
            if (cardRow.items && cardRow.items.length > 0) {
              cardRow.items.forEach(item => {
                if (!item.link) item.link = null;
                item.id = j;
                if (!item.icon) item.icon = "el-icon-minus";
                item.rgbColor = this.set16ToRgb(item.btnColor);
                if (!item.rgbColor) item.rgbColor = "46,58,112";
                item.iconStyle =
                  "background:rgb(" +
                  item.rgbColor +
                  ");box-shadow: rgba(" +
                  item.rgbColor +
                  ",0.467) 0 0 12px 8px";
                if (j > 4) cardRow.items.splice(5, cardRow.items.length);
                j++;
              });
            }
            i++;
          });
        }
      }
      // 合作商（A0006）
      else if (this.elementData.template_id === "A0006") {
        if (!(this.elementData.config.duration >= 0))
          this.elementData.config.duration = 1;
        if (
          !(
            this.elementData.config.imgSize >= 0 &&
            this.elementData.config.imgSize <= 2
          )
        )
          this.elementData.config.imgSize = 0;
        let sizeList = [
          {
            size: 140,
            marginRight: 110,
            height: 440,
            padding: 30
          },
          {
            size: 100,
            marginRight: 85,
            height: 340,
            padding: 25
          },
          {
            size: 60,
            marginRight: 60,
            height: 240,
            padding: 20
          }
        ];
        this.elementData.config.cardSize =
          sizeList[this.elementData.config.imgSize];
        this.elementData.config.divStyle =
          "height:" + this.elementData.config.cardSize.height + "px";
        this.elementData.config.cardStyle =
          "width:" +
          this.elementData.config.cardSize.size +
          "px;height:" +
          this.elementData.config.cardSize.size +
          "px";
        this.elementData.config.liStyle =
          "width:" +
          this.elementData.config.cardSize.size +
          "px;height:" +
          this.elementData.config.cardSize.size +
          "px;padding:" +
          this.elementData.config.cardSize.padding +
          "px";
        for (let i = 0; i < this.elementData.config.items.length; i++) {
          if (
            !this.elementData.config.items[i].title &&
            !this.elementData.config.items[i].thumbnail
          )
            this.elementData.config.items.splice(i, 1);
        }
        if (this.elementData.config.items.length > 0) {
          for (; this.elementData.config.items.length < 20; ) {
            this.elementData.config.items = this.elementData.config.items.concat(
              this.elementData.config.items
            );
          }
          if (this.elementData.config.items.length % 2 === 1)
            this.elementData.config.items = this.elementData.config.items.concat(
              this.elementData.config.items
            );
        }
        this.elementData.config.classOption = {
          limitMoveNum: 1,
          direction: 2,
          step: this.elementData.config.duration
        };
      }
      // 产品动态（A0007）
      else if (this.elementData.template_id === "A0007") {
        if (!this.elementData.config.title)
          this.elementData.config.title = "产品动态";
        if (
          this.elementData.config.items &&
          this.elementData.config.items.length > 0
        ) {
          this.elementData.config.items.forEach(item => {
            if (!item.link) item.link = null;
            if (item.tags && item.tags.length > 0) {
              item.tags.forEach(tag => {
                if (tag.tagName) {
                  tag.tagColor = this.set16ToRgb(tag.tagColor);
                }
                if (!tag.tagColor) tag.tagColor = "240,61,62";
                tag.tagStyle =
                  "background:rgb(" +
                  tag.tagColor +
                  ");box-shadow: rgba(" +
                  tag.tagColor +
                  ",0.33) 0 0 10px 1px";
              });
            }
          });
        }
      }
      // 文本+背景图片（A0008）
      else if (this.elementData.template_id === "A0008") {
        if (!this.elementData.config.link) this.elementData.config.link = null;
        this.elementData.config.height =
          this.elementData.config.height >= 200
            ? this.elementData.config.height + "px"
            : "500px";
        this.elementData.config.maxHeight =
          this.elementData.config.height >= 200
            ? this.elementData.config.height - 200 + "px"
            : "300px";
        this.elementData.config.divStyle =
          "height:" +
          this.elementData.config.height +
          ';background-image:url("' +
          this.elementData.config.attachPic +
          '")';
        if (!this.elementData.config.disableMask) {
          if (this.colorMode.indexOf(this.elementData.config.colorMode) < 0)
            this.elementData.config.colorMode = "none";
          this.elementData.config.modeStyle =
            "height:" + this.elementData.config.height;
          if (this.colorMode.indexOf(this.elementData.config.colorMode) === 0) {
            this.elementData.config.btnStyle = "background:#0e68b4;color:white";
          } else if (
            this.colorMode.indexOf(this.elementData.config.colorMode) === 1
          ) {
            this.elementData.config.textStyle = "color:black";
            this.elementData.config.btnStyle = "background:#0e68b4;color:white";
            this.elementData.config.modeStyle +=
              ";background: linear-gradient(to right, rgba(255, 255, 255, 0.9), transparent)";
          } else if (
            this.colorMode.indexOf(this.elementData.config.colorMode) === 2
          ) {
            this.elementData.config.textStyle = "color:white";
            this.elementData.config.btnStyle = "background:white;color:#0e68b4";
            this.elementData.config.modeStyle +=
              ";background: linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent)";
          } else if (
            this.colorMode.indexOf(this.elementData.config.colorMode) === 3
          ) {
            this.elementData.config.textStyle = "color:white";
            this.elementData.config.btnStyle = "background:white;color:#0e68b4";
            this.elementData.config.modeStyle +=
              ";background: linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent)";
          }
        }
      }
      // 指数成果（A0010）
      else if (this.elementData.template_id === "A0010") {
        this.elementData.config.currentPage = 1;
        this.elementData.config.pageSize = 3;
        this.elementData.config.infoList = [];
        for (let i = 0; i < this.elementData.config.pageSize; i++) {
          if (this.elementData.config.items[i])
            this.elementData.config.infoList.push(
              this.elementData.config.items[i]
            );
        }
      }
      // 可检索内容列表（A0011）
      else if (this.elementData.template_id === "A0011") {
        if (
          this.elementData.config.itemArray &&
          this.elementData.config.itemArray.length > 0
        ) {
          this.elementData.config.itemArray.forEach(items => {
            items.id = this.getId();
            if (items.items && items.items.length > 0) {
              items.items.forEach(item => {
                if (item.type) 
                  return item.id = this.getId();
                if (!item.link) item.link = null;
              });
            }
          });
        }
        this.elementData.config.infoList = JSON.parse(
          JSON.stringify(this.elementData.config.itemArray)
        );
      }
      // 滚动卡片（A0012）
      else if (this.elementData.template_id === "A0012") {
        if (!(this.elementData.config.duration >= 0))
          this.elementData.config.duration = 1;
        this.elementData.config.divStyle =
          'background-image: url("' + this.elementData.config.attachPic + '")';
        this.elementData.config.items.forEach(item => {
          if (!item.thumbnail) item.thumbnail = img;
        });
        if (this.elementData.config.items.length > 0) {
          for (; this.elementData.config.items.length < 10; ) {
            this.elementData.config.items = this.elementData.config.items.concat(
              this.elementData.config.items
            );
          }
        }
        this.elementData.config.classOption = {
          limitMoveNum: this.elementData.config.items.length,
          direction: 2,
          step: this.elementData.config.duration
        };
      }
      // 单图片组件（A0013）
      else if (this.elementData.template_id === "A0013") {
        this.elementData.config.width =
          this.elementData.config.width > 0
            ? this.elementData.config.width + "px"
            : "100%";
        this.elementData.config.height =
          this.elementData.config.height > 0
            ? this.elementData.config.height + "px"
            : "500px";
        this.elementData.config.imgStyle =
          "width:" +
          this.elementData.config.width +
          ";height:" +
          this.elementData.config.height;
      }
      // 通知消息组件（A00015）
      else if (this.elementData.template_id === "A0015") {
        if (!this.elementData.config.title)
          this.elementData.config.title = "通知";
        if (!(this.elementData.config.duration >= 0))
          this.elementData.config.duration = 1;
        if (
          this.elementData.config.items &&
          this.elementData.config.items.length > 0
        ) {
          this.elementData.config.items.forEach(item => {
            if (!item.link) item.link = null;
            if (!this.set16ToRgb(item.textColor)) item.textColor = "#000000";
          });
        }
        if (this.elementData.config.items.length > 0) {
          for (; this.elementData.config.items.length < 20; ) {
            this.elementData.config.items = this.elementData.config.items.concat(
              this.elementData.config.items
            );
          }
        }
        this.elementData.config.classOption = {
          limitMoveNum: this.elementData.config.items.length,
          direction: 2,
          step: this.elementData.config.duration
        };
      }
      // 左右标题按钮布局（A0016）
      else if (this.elementData.template_id === "A0016") {
        if (!this.elementData.config.link) this.elementData.config.link = null;
      }
      // 招聘列表（A0018）
      else if (this.elementData.template_id === "A0018") {
        this.elementData.config.items.forEach(item => {
          item.isShow = false;
        });
      }
      // 标签导航（A0022）
      else if (this.elementData.template_id === "A0022") {
        if (
          this.elementData.config.items &&
          this.elementData.config.items.length > 0
        ) {
          this.elementData.config.items.forEach(items => {
            if (items.articles && items.articles.length > 0) {
              items.articles.forEach(item => {
                if (!item.link) item.link = null;
              });
            }
          });
        }
      }
      // 合作商（批量）（A00025）
      else if (this.elementData.template_id === "A0025") {
        if (!(this.elementData.config.duration >= 0))
          this.elementData.config.duration = 1;
        this.elementData.config.divStyle =
          "height:" + (this.elementData.config.height * 2 + 80) + "px";
        this.elementData.config.liStyle =
          "width:" +
          this.elementData.config.width +
          "px;height:" +
          this.elementData.config.height +
          "px";
        if (this.elementData.config.items.length > 0) {
          for (; this.elementData.config.items.length < 20; ) {
            this.elementData.config.items = this.elementData.config.items.concat(
              this.elementData.config.items
            );
          }
          if (this.elementData.config.items.length % 2 === 1)
            this.elementData.config.items = this.elementData.config.items.concat(
              this.elementData.config.items
            );
        }
        this.elementData.config.classOption = {
          limitMoveNum: 1,
          direction: 2,
          step: this.elementData.config.duration
        };
      }
      // 标签导航（自定颜色）（A0026）
      else if (this.elementData.template_id === "A0026") {
        this.elementData.config.column =
          this.elementData.config.column >= 1 &&
          this.elementData.config.column <= 4
            ? this.elementData.config.column
            : 2;
        if (
          this.elementData.config.items &&
          this.elementData.config.items.length > 0
        ) {
          this.elementData.config.items.forEach(items => {
            if (!items.title) items.title = "未命名";
            if (!this.set16ToRgb(items.color)) items.color = "#10A6CC";
            if (items.articles && items.articles.length > 0) {
              items.articles.forEach(item => {
                if (!item.link) item.link = null;
                if (!item.title) item.title = "未命名";
                if (!item.btnText) item.btnText = "i查看详情";
                if (item.btnText.length > 0) {
                  item.width = 150 + item.btnText.length * 15;
                  if (item.width > 270) item.width = 270;
                }
                item.btnText = item.btnText.replace(
                  /[i]/g,
                  "<i class='el-icon-download'></i>\n"
                );
              });
            }
          });
        }
      }
      // 文本卡片（A0027）
      else if (this.elementData.template_id === "A0027") {
        this.elementData.config.column =
          this.elementData.config.column >= 1 &&
          this.elementData.config.column <= 4
            ? this.elementData.config.column
            : 2;
        if (
          this.elementData.config.items &&
          this.elementData.config.items.length > 0
        ) {
          this.elementData.config.items.forEach(item => {
            if (!item.title) item.title = "未命名";
            if (!this.set16ToRgb(item.color)) item.color = "#10A6CC";
            if (!item.link) item.link = null;
          });
        }
      }
      // 成果表格（纯表格）（A0028）
      else if (this.elementData.template_id === "A0028") {
        if (
          this.elementData.config.items &&
          this.elementData.config.items.length > 0
        ) {
          this.elementData.config.items.forEach(item => {
            if (!item.link) item.link = null;
            if (!item.dbUrl) item.dbUrl = null;
          });
        }
        this.elementData.config.currentPage = 1;
        this.elementData.config.pageSize = 6;
        this.elementData.config.infoList = [];
        for (let i = 0; i < this.elementData.config.pageSize; i++) {
          if (this.elementData.config.items[i])
            this.elementData.config.infoList.push(
              this.elementData.config.items[i]
            );
        }
      }
      // 下载卡片（A0029）
      else if (this.elementData.template_id === "A0029") {
        this.elementData.config.height =
          this.elementData.config.height > 0
            ? this.elementData.config.height + "px"
            : "350px";
        this.elementData.config.width =
          this.elementData.config.width > 0
            ? this.elementData.config.width + "px"
            : "100%";
        this.elementData.config.divStyle =
          "height:" +
          this.elementData.config.height +
          ";width:" +
          this.elementData.config.width +
          ';background-image:url("' +
          this.elementData.config.attachPic +
          '")';
        if (this.colorMode.indexOf(this.elementData.config.colorMode) < 0)
          this.elementData.config.colorMode = "none";
        if (this.colorMode.indexOf(this.elementData.config.colorMode) === 0)
          this.elementData.config.textStyle = "color:black";
        else if (
          this.colorMode.indexOf(this.elementData.config.colorMode) === 1
        )
          this.elementData.config.textStyle =
            "color:black;background:rgba(255, 255, 255, 0.5)";
        else if (
          this.colorMode.indexOf(this.elementData.config.colorMode) === 2
        )
          this.elementData.config.textStyle =
            "color:white;background:rgba(0, 0, 0, 0.4)";
        else if (
          this.colorMode.indexOf(this.elementData.config.colorMode) === 3
        )
          this.elementData.config.textStyle =
            "color:white;background:rgba(0, 0, 0, 0.6)";
      }
      // 常见问题（A0030）
      else if (this.elementData.template_id === "A0030") {
        if (!this.set16ToRgb(this.elementData.config.color))
          this.elementData.config.color = "#333333";
        this.elementData.config.hintColor =
          "rgba(" + this.set16ToRgb(this.elementData.config.color) + ",0.4)";
        this.elementData.config.activeName = "";
      }
      // 标题组件（纯文本）（A0031） 或 标题组件（图文版）（A0032）
      else if (
        this.elementData.template_id === "A0031" ||
        this.elementData.template_id === "A0032"
      ) {
        if (!this.elementData.config.title)
          this.elementData.config.title = "未命名";
        if (!this.elementData.config.icon)
          this.elementData.config.icon = "el-icon-menu";
        this.elementData.config.hintColor =
          "rgba(" + this.set16ToRgb(this.elementData.config.color) + ",0.4)";
        this.elementData.config.activeName = "";
      }
      // 文本卡片（专属特权）（A0034）
      else if (this.elementData.template_id === "A0034") {
        this.elementData.config.column =
          this.elementData.config.column >= 1 &&
          this.elementData.config.column <= 3
            ? this.elementData.config.column
            : 2;
        if (
          this.elementData.config.cards &&
          this.elementData.config.cards.length > 0
        )
          this.elementData.config.cards.forEach(card => {
            if (card.items && card.items.length > 0)
              card.items.forEach(item => {
                if (!item.title) item.title = "标题";
                if (!item.subtitle) item.subtitle = "副标题";
                if (!item.content) item.content = "文本内容";
                if (!this.set16ToRgb(item.color)) item.color = "#2489ff";
                if (!item.buttonText) item.buttonText = "查看详情";
                if (!item.link) item.link = null;
                if (item.tagName && !this.set16ToRgb(item.tagColor))
                  item.tagColor = "#ff4c42";
                let arr = item.content.split(" ");
                if (arr.length > 2) {
                  let str = "";
                  for (let i = 0; i < arr.length; i++) {
                    if (i === 0)
                      str = arr[0] + "<span style='font-size: 30px'>";
                    else if (i === arr.length - 1) str += "</span>" + arr[i];
                    else str += arr[i];
                  }
                  item.content = str;
                }
              });
          });
      }
      // 文本卡片（会员权益）（A0035）
      else if (this.elementData.template_id === "A0035") {
        this.elementData.config.size =
          this.elementData.config.size >= 0 && this.elementData.config.size <= 2
            ? this.elementData.config.size
            : 0;
        if (
          this.elementData.config.items &&
          this.elementData.config.items.length > 0
        )
          this.elementData.config.items.forEach(item => {
            if (!item.title) item.title = "标题";
            if (!(item.image >= 0 && item.image <= 5)) item.image = 0;
          });
      }
    },
    // 翻页
    handleCurrentChange() {
      this.elementData.config.infoList = [];
      for (let i = 0; i < this.elementData.config.items.length; i++) {
        this.elementData.config.items[i].id = i;
      }
      for (
        let i =
          (this.elementData.config.currentPage - 1) *
          this.elementData.config.pageSize;
        i <
        this.elementData.config.currentPage * this.elementData.config.pageSize;
        i++
      ) {
        if (this.elementData.config.items[i])
          this.elementData.config.infoList.push(
            this.elementData.config.items[i]
          );
      }
      this.$forceUpdate();
    },
    // 打开 A0004 对话框
    openA0004Dialog(val) {
      this.A0004Dialog = true;
      this.A0004Info = val;
    },
    // 打开 A0010 对话框
    openA0010Dialog(val) {
      this.A0010Dialog = true;
      this.A0010Info = val;
    },
    // 16进制转换为RGB
    set16ToRgb(str) {
      var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
      if (!reg.test(str)) {
        return;
      }
      let newStr = str.toLowerCase().replace(/\#/g, "");
      let len = newStr.length;
      if (len === 3) {
        let t = "";
        for (let i = 0; i < len; i++) {
          t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1));
        }
        newStr = t;
      }
      let arr = []; //将字符串分隔，两个两个的分隔
      for (let i = 0; i < 6; i = i + 2) {
        let s = newStr.slice(i, i + 2);
        arr.push(parseInt("0x" + s));
      }
      return arr.join(",");
    },
    // A0011 查询
    A0011Search() {
      if (!this.A0011SearchText)
        this.elementData.config.infoList = JSON.parse(
          JSON.stringify(this.elementData.config.itemArray)
        );
      else {
        this.elementData.config.infoList = JSON.parse(
          JSON.stringify(this.elementData.config.itemArray)
        );
        this.elementData.config.infoList.forEach(items => {
          items.items = items.items.filter(item => {
            if (
              (item.title && item.title.indexOf(this.A0011SearchText) >= 0) ||
              (item.content && item.content.indexOf(this.A0011SearchText) >= 0)
            )
              return true;
            else return false;
          });
        });
      }
      const div = document.getElementById("A0011");
      div.scrollTop = 0;
      this.$forceUpdate();
    },
    // 生成唯一id
    getId() {
      var s = [];
      var hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      s[8] = s[13] = s[18] = s[23] = "-";
      let id = s.join("");
      return id;
    },
    // 高亮显示搜索字段
    highlight(text) {
      if (text) {
        const highlightStr = `<span style="background: #0e68b4; color: white">${this.A0011SearchText}</span>`;
        const reg = new RegExp(this.A0011SearchText, "gi");
        return text.replace(reg, highlightStr);
      }
    },
    // 跳转锚点
    anchor(id) {
      let element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    },
    // 图片显示错误
    imgErrorFun(img) {
      img.target.src = img;
    },
    // 点击行
    rowClick(val) {
      val.isShow = !val.isShow;
      this.$forceUpdate();
    },
    // 打开 A0019 对话框
    openA0019Dialog(val) {
      if (val.link) window.open(val.link);
      else {
        this.A0019Dialog = true;
        this.A0019Info = val;
      }
    },
    // 打开 A0020 对话框
    openA0020Dialog(val) {
      this.A0020Dialog = true;
      this.A0020Info = val;
    },
    // 下载文件
    downloadFile(url, name) {
      if (name === "A0029") window.open(url);
      else {
        let userInfo = this.$store.getters.getUserInfo;
        if (!userInfo.name) this.A0026HintDialog = true;
        else {
          if (userInfo.type === "个人用户" && userInfo.status !== "1") {
            this.$confirm(
              "您暂无权限进行此操作, 是否前往个人中心申请认证?",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.$router.push("/user_center");
              })
              .catch(() => {});
          } else window.open(url);
        }
      }
    },
    // 跳转到登录页面
    jumpLogin() {
      this.A0026HintDialog = false;
      this.$router.push("/login");
    },
    // IP登录
    IPLogin() {
      this.A0026HintDialog = false;
      this.$emit("IPLogin");
    },
    // 打开 A0024 窗口
    openA0024Window(url) {
      if (url.includes(location.hostname)) location.href = url;
      else window.open(url);
    },
    // 打开 A0026 对话框
    openA0026Dialog(val) {
      this.elementData.config.activeName = "" + val;
      this.A0026Dialog = true;
    },
    // 打开 A0028 对话框
    openA0028Dialog(val) {
      this.A0028Dialog = true;
      this.A0028Info = val;
    },
    // 点击折叠面板
    handleChange() {
      this.$forceUpdate();
    },
    // 跳转 A0033 数据库
    jumpA0033Database(name) {
      this.$router.push({
        name: "DataMartDatabase",
        params: {
          id: 1,
          database: name
        }
      });
    },
    // 跳转 A0034 链接
    jumpA0034Link(url) {
      if (url.includes(location.hostname)) {
        let str = url.substring(
          url.indexOf(location.hostname) + location.hostname.length
        );
        str = str.substring(str.indexOf("/"));
        if (
          this.$route.path === "/user_center/vip" &&
          str.includes("/user_center/vip")
        )
          this.$emit("showVipDialog");
        else this.$router.push(str);
      } else window.open(url);
    }
  },
  beforeMount() {
    this.processingData();
  },
  mounted() {
    if (this.elementData.template_id === "A0006") {
      const ul = document.getElementById("ul");
      ul.style.position = "relative";
      ul.style.left = this.elementData.config.cardSize.marginRight + "px";
      ul.style.overflow = "visible";
      const div = ul.parentElement;
      div.style.overflow = "visible";
    } else if (this.elementData.template_id === "A0025") {
      const ul = document.getElementById("ul_0");
      ul.style.position = "relative";
      ul.style.left = this.elementData.config.width / 2 + 15 + "px";
      ul.style.overflow = "visible";
      const div = ul.parentElement;
      div.style.overflow = "visible";
    }
  }
};
</script>

<style scoped lang="scss">
.A0000 {
  > h1 {
    color: #0e68b4;
    display: inline-block;
    margin: 15px 80px;

    > div {
      width: 100%;
      height: 5px;
      margin-top: 10px;
      border-radius: 3px;
      background: #0e68b4;
    }
  }

  > p {
    color: #4b5563;
    text-indent: 10px;
    margin: 10px 20px 30px;
    white-space: pre-wrap;
  }
}

.A0001 {
  display: flex;
  align-items: center;
  width: 100%;
  background-size: cover;
  background-position: center center;

  .text {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 100px;

    > div {
      width: 100%;
    }

    span {
      display: block;
      margin: 5px 0;
    }
  }
}

.A0002 {
  .el-carousel--card {
    .el-carousel__item {
      opacity: 0.6;
      filter: alpha(opacity=60);
    }

    .el-carousel__item.is-active {
      opacity: 1;
      filter: alpha(opacity=100);
    }
  }
}

a {
  text-decoration: none;
}

a:link,
a:visited,
a:hover,
a:active {
  color: inherit;
}

.A0004 {
  position: relative;

  .blue_button {
      background: #0e68b4;
      color: white;
      font-weight: 700;
      border-radius: 10px;
      margin-right: 20px;
    }

  .el-col {
    height: 100%;
    text-align: center;
  }

  .table .table_row {
    margin: 10px 0;
    background: #e2e2e2;
    border-radius: 8px;
    cursor: pointer;
  }

  .table .table_row:hover {
    background: #cccccc;
  }

  .table_header .el-col,
  .table_row .el-col {
    display: flex;
    align-items: center;
    padding: 0 10px;

    span {
      margin: auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      font-weight: 700;
      color: #222222;
    }
  }

  .A0004Dialog {
    .title {
      padding: 10px 100px;
      text-align: center;
      font-size: 24px;
    }

    .subtitle {
      text-align: center;
      font-size: 12px;
      color: #818181;
      line-height: 20px;
    }

    .time {
      color: #c92b2f;
      font-weight: 700;
    }

    .author {
      padding: 5px 50px;
    }

    .database {
      margin-left: 20px;
      background: #0e68b4;
      color: white;
      font-weight: 700;
      border-radius: 10px;
      padding: 3px 10px;
    }

    .content {
      white-space: pre-wrap;
      padding: 10px 50px;
      line-height: 25px;
    }

    .white_button,
    .white_button .el-icon-right {
      background: transparent;
      color: black;
      border: none;
      font-weight: 700;
    }
  }

  .MoreA0004Dialog {
    .MoreA0004Dialog_body {
      width: 120%;
      height: 100%;
      transform: translateX(-8%);
      display: flex;
      flex-direction: column;

      .table {
        flex: 1;
        height: 0;
        display: flex;
        flex-direction: column;
      }
    }
  }
}

.A0005 {
  .cardRows {
    height: 370px;
    text-align: center;
  }

  .card {
    display: inline-block;
    width: 20%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;

    .el-card {
      height: 100%;
      width: 240px;
      margin: auto;
      border-radius: 15px;
      color: #111111;
      transition: all 0.3s;
    }

    .el-card:hover {
      cursor: pointer;
      transform: scale(1.05) translateZ(0);
    }

    .iconDiv {
      height: 0;
      position: relative;
      text-align: left;
      top: -30px;
    }

    .icon {
      margin-left: 30px;
      padding: 16px;
      width: 16px;
      height: 16px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 900;
      color: white;
      display: block;
    }

    .title {
      margin: 0;
      padding: 20px 16px 0;
      font-size: 16px;
      font-weight: 700;
      text-align: left;
      line-height: 25px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .content {
      margin: 0;
      padding: 8px 16px 0;
      font-size: 13px;
      text-align: left;
      line-height: 18px;
      white-space: pre-wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
  }
}

.A0006 {
  .warp {
    width: 100%;
    overflow: hidden;

    ul {
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      text-align: center;

      li {
        margin: 10px;
        background: white;
        border-radius: 15px;

        .card {
          display: inline-block;
          align-items: center;

          img {
            object-fit: contain;
          }
        }
      }
    }
  }
}

.A0007 {
  .card:hover {
    background: #cccccc;
    border-radius: 20px;

    .time {
      background: #132772;
    }
  }

  .el-button {
    float: right;
    margin: 20px 70px 0 0;
    background: transparent;
    border: none;
    color: #1f2937;
    font-size: 16px;
    border-radius: 15px;

    .el-icon-arrow-right {
      font-weight: 700;
      margin-left: 7px;
    }
  }

  .el-button:hover {
    background: #e4e5e7;
    color: #203b88;
  }

  .card {
    display: inline-block;
    width: 50%;
    height: 40px;
    font-size: 14px;

    > a {
      display: flex;
      align-items: center;
      height: 40px;
    }

    .time {
      margin: 0 15px;
      padding: 2px 7px;
      border-radius: 15px;
      color: white;
      background: #8993b8;
    }

    .title {
      display: inline-block;
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 5px;
    }

    .tag {
      margin: 0 5px;
      padding: 3px 7px;
      font-size: 12px;
      color: white;
      border-radius: 15px;
    }
  }
}

.A0008 {
  .div {
    background-size: cover;

    a {
      margin: 0 100px;

      .el-button {
        font-weight: 700;
        font-size: 15px;
        border: none;
      }
    }
  }

  .text {
    padding: 20px 300px 10px 100px;
    overflow: hidden;

    h1 {
      font-size: 30px;
    }

    p {
      font-size: 16px;
      white-space: pre-wrap;
      line-height: 23px;
      margin: 0 0 10px 0;
      overflow: hidden;
    }
  }
}

.A0009 {
  .card {
    p {
      white-space: pre-wrap;
    }
  }
}

.A0010 {
  .card {
    height: 160px;
    margin: 48px 0;
    padding: 24px;
    border-radius: 15px;
    background: #e2e2e2;
    color: #111827;

    .svgDiv {
      text-align: center;
    }

    .svg {
      transform: scale(1.2);
      position: relative;
      top: -25px;
    }

    .title {
      font-size: 20px;
    }

    .subtitle {
      font-size: 18px;
      margin: 5px 0 35px;
    }

    .time {
      font-size: 14px;
    }

    .content {
      font-size: 13px;
      line-height: 19px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
    }

    .button {
      height: 100%;
      display: flex;
      align-items: center;

      .el-button {
        margin: auto;
        background: #152871;
        border: none;
        color: white;
        font-weight: 700;
        border-radius: 10px;

        .el-icon-right {
          margin-left: 5px;
          font-weight: 700;
        }
      }
    }
  }

  .card:hover {
    background: #cccccc;
  }

  .other {
    text-align: left;
    font-weight: 700;

    div {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}

.A0011 {
  .menu {
    text-align: left;
    position: sticky;
    top: 100px;

    > ul {
      padding: 0;
      font-size: 16px;

      ol {
        padding: 6px 0;
        color: #5c5c5c;

        a:hover {
          color: #0168b7;
        }

        ul {
          padding-left: 20px;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }

  .search {
    margin-bottom: 20px;

    .el-button {
      margin-left: 5px;
      background: #0e68b4;
      border-radius: 25px;
      border: none;
      padding: 15px 30px;
      color: white;
    }
  }

  .items {
    text-align: left;

    h1 {
      font-size: 28px;
      display: flex;
      align-items: center;
    }

    h1::before {
      content: "|";
      font-weight: bolder;
      margin-right: 10px;
    }

    h2 {
      font-size: 22px;
      padding-left: 40px;
    }

    .item {
      margin: 20px 0;

      .img {
        width: 150px;
        height: 180px;
        border-radius: 15px;
        box-shadow: 0 5px 15px -4px rgba(0, 0, 0, 0.8);
        transition: all 0.3s;
      }

      .img:hover {
        cursor: pointer;
        transform: scale(1.07) translateZ(0);
      }

      .title {
        font-size: 20px;
        font-weight: bold;
        margin: 0 0 10px;
        color: #0e68b4;
      }

      .content {
        font-size: 14px;
        line-height: 23px;
        margin: 0 0 20px;
        color: #999999;
      }

      .button {
        .el-button {
          background: transparent;
          border: none;
          font-size: 16px;
          font-weight: 700;
          color: #0e68b4;
        }

        .el-button:hover {
          background: #cccccc;
          border-radius: 15px;
        }
      }
    }
  }
}

.A0012 {
  > div {
    height: 400px;
    padding: 100px 0 30px;
    background-size: 100% 100%;
  }

  .warp {
    width: auto;
    height: 400px;
    overflow: hidden;
    margin: 0 auto;

    ul {
      width: inherit;
      height: 400px;
      list-style: none;
      padding: 0;
      margin: 0 auto;
      display: flex;

      li {
        height: 370px;
        margin: 15px;
        display: inline-block;

        .card {
          background: white;
          width: 240px;
          height: 330px;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 5px 15px -4px rgba(0, 0, 0, 0.8);
          transition: all 0.3s;

          .title {
            font-size: 17px;
            margin: 7px 0 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .subtitle {
            font-size: 14px;
            color: #132772;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .content {
            font-size: 14px;
            color: #333333;
            margin: 5px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }

          img {
            object-fit: contain;
          }
        }

        .card:hover {
          cursor: pointer;
          transform: scale(1.07) translateZ(0);
        }
      }
    }
  }
}

.A0015 {
  > div {
    padding: 6px 12px;
    background: #e6e6e6;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #5a5a5a;
  }

  .el-icon-bell {
    font-weight: 700;
    margin-right: 8px;
  }

  .title {
    display: inline-block;
    white-space: nowrap;
    background: #cccccc;
    width: initial;
    padding: 3px 8px;
    border-radius: 5px;
    font-weight: 700;
    margin-right: 5px;
  }

  .warp {
    height: 48px;
    width: auto;
    margin: 0 auto;
    overflow: hidden;

    ul {
      width: inherit;
      list-style: none;
      padding: 0;
      margin: 0 auto;
      display: flex;

      li {
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        margin-right: 50px;
        text-align: center;
        display: inline-block;
        white-space: nowrap;
      }
    }
  }
}

.A0016 {
  > .el-row {
    height: 400px;

    > .el-col {
      height: 100%;
      display: flex;
      align-items: center;

      .title {
        font-size: 26px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .content {
        font-size: 16px;
        line-height: 23px;
        white-space: pre-wrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 8;
        -webkit-box-orient: vertical;
      }

      .el-button {
        padding: 10px 30px;
        color: white;
        font-weight: 700;
        background: #0e68b4;
        border: none;
        border-radius: 15px;
      }
    }
  }
}

.A0017 {
  .items {
    .el-card {
      width: 300px;
      height: 400px;
      display: inline-block;
      margin: 10px 20px;
      border-radius: 20px;

      .content {
        font-size: 14px;
        line-height: 22px;
        color: #4b5563;
        margin: 10px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 8;
        -webkit-box-orient: vertical;
      }

      .title {
        font-size: 18px;
        margin-bottom: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .subtitle {
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.A0018 {
  .header {
    font-size: 18px;
    font-weight: 700;
    color: #414141;

    .tb {
      margin-bottom: 40px;
      white-space: nowrap;
      overflow: hidden;

      .icon {
        margin-right: 10px;
        position: relative;
        top: 2px;
      }
    }
  }

  .table {
    font-size: 15px;
    color: #4b5563;

    .el-col {
      text-align: center;
    }

    .table_header {
      font-weight: 700;
      padding: 10px 0;
      margin: 5px 0;
      background: #dddddd;
      border-radius: 15px;
    }

    .table_row {
      padding: 10px 0;
      margin: 5px 0;
      border-radius: 15px;
    }

    .table_row:hover {
      background: #dbeafd;
    }

    .other {
      margin: 5px 0;
      background: #dddddd;
      border-radius: 15px;
      padding: 20px 40px;

      .title {
        font-size: 18px;
        margin: 10px 0;
      }

      .button {
        height: 50px;

        .el-button {
          background: white;
          border: none;
          border-radius: 15px;
          color: #2b65e8;
          font-size: 18px;
          font-weight: 700;

          span {
            display: flex;
            align-items: center;

            svg {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
}

.A0019 {
  .tab {
    height: 700px;

    .item {
      width: 40%;
      display: inline-block;
      padding: 4px 10px;
      margin: 1px 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;

      svg {
        position: relative;
        top: 2px;
      }
    }

    .item:hover {
      background: #dddddd;
      border-radius: 15px;
    }
  }

  .A0019Dialog {
    .title {
      padding: 10px 100px;
      text-align: center;
      font-size: 24px;
    }

    .subtitle {
      text-align: center;
      font-size: 14px;
      color: #818181;
      line-height: 20px;
    }

    .content {
      padding: 10px 50px;
      line-height: 25px;
    }
  }
}

.A0020 {
  .card {
    width: 97%;
    display: inline-block;
    border-radius: 15px;
    margin: 5px auto;

    .header {
      color: #132772;
      font-size: 18px;

      .el-icon-postcard {
        font-size: 28px;
        font-weight: 700;
        position: relative;
        top: 3px;
        margin-right: 3px;
      }

      .inline {
        width: 100%;
        height: 3px;
        margin-top: 6px;
        border-radius: 2px;
        background: #132772;
      }
    }

    .body {
      .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .content {
        font-size: 16px;
        padding: 0 15px;

        > div {
          max-height: 210px;
          overflow: hidden;
        }

        .el-button {
          margin-top: 10px;
          background: #132772;
          border-radius: 25px;
          color: white;
        }
      }
    }
  }

  .A0020Dialog {
    .title {
      padding: 10px 100px;
      text-align: center;
      font-size: 24px;
    }

    .subtitle {
      text-align: center;
      font-size: 14px;
      color: #818181;
      line-height: 20px;
    }

    .content {
      white-space: pre-wrap;
      padding: 10px 20px;
    }
  }
}

.A0034 {
  > .title {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > h1 {
      font-size: 35px;
      margin: 25px 0;
      max-width: 90%;
    }

    > p {
      margin: 0;
      font-size: 18px;
      color: #888888;
      max-width: 80%;
    }
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .card {
      height: 600px;
      margin: 10px;
      box-sizing: border-box;
      border-radius: 20px;
      position: relative;
      background: linear-gradient(-160deg, #d0e8fb, #eff7fe, #fefefe, #ffffff);

      > .title {
        height: 60px;
        padding: 0 30px;
        display: flex;
        align-items: center;
        font-size: 22px;
        font-weight: 700;
        color: #91bbdf;
        font-style: oblique;
      }

      .items {
        position: absolute;
        top: 60px;
        bottom: 10px;
        left: 10px;
        right: 10px;
        display: flex;
        justify-content: space-between;

        .item {
          padding: 40px 0 0 24px;
          box-sizing: border-box;
          background: white;
          box-shadow: 4px 10px 30px rgba(152, 174, 200, 0.2);
          border-radius: 8px;
          position: relative;

          .title {
            font-weight: 600;
            font-size: 16px;
            margin: 0 0 15px;
          }

          .subtitle {
            font-weight: 600;
            font-size: 20px;
            color: #33383e;
            margin: 0 0 28px;
          }

          .content {
            font-weight: 700;
            font-size: 16px;
            margin: 0 0 22px;
          }

          .el-button {
            width: calc(100% - 24px);
            margin: 0 0 32px;
            border: none;
            height: 48px;
            border-radius: 4px;
            padding: 14px 24px;
            font-size: 16px;
            color: white;

            > span {
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .el-button:hover {
            opacity: 0.8;
          }

          .list {
            padding: 0 24px 0 0;
            margin: 0;
            list-style: none;
            box-sizing: border-box;

            > li {
              padding: 0;
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin-bottom: 18px;

              .name {
                color: #7f8792;
                max-width: 70%;
                min-width: 60%;
                margin-right: 10px;
              }

              .unit {
                color: #636c78;
                font-weight: 600;
              }
            }
          }

          .tag {
            position: absolute;
            top: 0;
            right: 0;
            color: white;
            font-size: 14px;
            font-weight: 600;
            padding: 5px 20px;
            border-radius: 0 8px 0 8px;
            max-width: 50%;
          }
        }
      }
    }
  }
}

.A0035 {
  > .title {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > h1 {
      font-size: 35px;
      margin: 25px 0;
      max-width: 90%;
    }

    > p {
      margin: 0;
      font-size: 18px;
      color: #888888;
      max-width: 80%;
    }
  }

  .items {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .item {
      border: 1px solid #e8eaec;
      border-radius: 16px;
      background: white;
      overflow: hidden;
      margin: 10px;

      .header {
        height: 123px;
        background: #f6f7f9;
        padding: 0 16px 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        > h1 {
          font-weight: 600;
          font-size: 20px;
          color: #33383e;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          max-width: calc(100% - 122px);
        }

        .el-image {
          width: 122px;
          height: 122px;
        }
      }

      .main {
        padding: 10px;
        box-sizing: border-box;
      }
    }
  }
}
</style>

<style lang="scss">
.my-element .el-carousel {
  .el-carousel__indicator--horizontal .el-carousel__button {
    height: 5px;
    border-radius: 3px;
  }

  .el-carousel__indicator--vertical .el-carousel__button {
    width: 5px;
    border-radius: 3px;
  }
}

.A0000 {
  .el-pagination {
    .btn-prev,
    .btn-next,
    .el-pager li {
      background: none;
    }
  }

  .el-dialog__wrapper {
    padding: 80px 0;
  }
}

.MoreA0004Dialog,
.A0004Dialog,
.A0007Dialog,
.A0019Dialog,
.A0020Dialog,
.A0026Dialog {
  height: 100%;
  min-height: 600px;
  margin: 0 auto;
  border-radius: 10px;

  .el-icon-close:before {
    font-size: 30px;
    font-weight: 700;
    color: #222222;
  }

  .el-dialog__header {
    height: 0;
    padding: 0;
  }

  .el-dialog__body {
    height: 100%;
    padding: 50px 150px;
    box-sizing: border-box;
    color: #111111;
  }
}

.A0007Dialog .el-dialog__body {
  padding: 20px;
}

.A0005 .card .el-card .el-card__body {
  height: 100%;
  padding: 0;
}

.A0011 {
  .search {
    .el-input {
      .el-input__inner {
        padding: 0 40px;
      }
    }
  }
}

.A0017 .items .el-card .el-icon-user-solid {
  font-size: 30px;
}

.A0020 .card .body .el-collapse .el-collapse-item {
  .el-collapse-item__header {
    font-size: 16px;
  }

  .el-collapse-item__header:hover,
  .el-collapse-item__header.is-active {
    background: #eeeeee;
  }
}

.A0022 {
  .tabs_div {
    height: 400px;

    .el-tabs {
      height: 100%;
      background: transparent;
      border: none;
      box-shadow: none;

      .el-tabs__header {
        height: 100%;
        max-width: 20%;
        background: transparent;
        border: none;

        .el-tabs__item {
          min-width: 150px;
          font-size: 16px;
          height: auto;
          text-align: center;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          border: none;
          margin: 10px 10px;
          padding: 5px;
          background: #ededed;
        }

        .el-tabs__item.is-active {
          transform: scale(1.05) translateZ(0);
          background: #0e68b4;
          color: white;
        }
      }

      .el-tabs__content {
        height: 100%;
        box-sizing: border-box;

        .el-tab-pane {
          height: 100%;

          .tab {
            height: 100%;

            .item {
              font-size: 18px;
              padding: 10px 20px;
              border-radius: 20px;
              cursor: pointer;

              svg {
                position: relative;
                top: 3px;
              }

              .title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .time {
                text-align: right;
                color: #999999;
              }
            }

            .item:hover {
              background: #dddddd;
            }
          }
        }
      }
    }
  }
}

.A0026 {
  .tabs_div {
    width: 100%;

    .card {
      display: inline-table;
      padding: 10px 20px;
      box-sizing: border-box;

      .el-card {
        height: 400px;
        overflow: visible;
        width: calc(100% - 10px);
        margin-left: 10px;
        font-size: 15px;

        .el-card__header {
          padding: 20px 0 0;
          border: none;

          .card_title {
            padding: 7px 15px;
            height: 34px;
            box-sizing: border-box;
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-radius: 3px;
            display: inline-block;
            color: white;
            position: relative;
            left: -10px;
            z-index: 2;
            cursor: default;
          }
        }

        .el-card__body {
          padding: 10px;
          width: 100%;
          box-sizing: border-box;

          .card_item {
            .icon {
              display: inline-block;
              width: 9px;
              height: 9px;
              position: relative;
              top: -5px;
              left: -3px;
            }
          }

          .card_footer {
            display: inline-block;
            padding-bottom: 8px;
            border-bottom: 1px solid #2a83d3;
            color: #2a83d3;
            margin: 20px 10px;
            cursor: pointer;
          }
        }
      }
    }
  }

  .A0026Dialog {
    .el-dialog__body {
      padding: 20px 50px;

      .A0026Dialog_body {
        height: 100%;
        display: flex;
        flex-direction: column;

        .el-tabs {
          flex: 1;

          .el-tabs__header {
            border-right-color: #ebecec;

            .el-tabs__nav-wrap::after {
              content: none;
            }

            .el-tabs__active-bar {
              display: none;
            }

            .el-tabs__item {
              color: black;
              font-size: 16px;
              padding: 7px 20px;
              margin: 8px;
              text-align: left;
              display: table;
              border: none;
              border-radius: 3px;

              > div {
                width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;

                .icon {
                  display: inline-block;
                  width: 6px;
                  height: 20px;
                  background: transparent;
                  position: relative;
                  top: 4px;
                  left: -8px;
                }
              }
            }

            .el-tabs__item:hover {
              background: #f0f0f0;
            }

            .el-tabs__item.is-active {
              background: white;
              box-shadow: 1px 1px 10px 2px #ddd;
              -webkit-box-shadow: 1px 1px 10px 2px #ddd;
              color: #2a83d3;

              .icon {
                background: #2a83d3;
              }
            }

            .el-tabs__item.is-active:hover {
              background: white;
            }
          }

          .el-tabs__content {
            height: 100%;
            padding: 5px 15px;
            box-sizing: border-box;

            .el-tab-pane {
              height: 100%;

              .tab {
                height: 100%;

                .tab_title {
                  margin-bottom: 10px;
                  border-bottom: 2px solid #ebeef1;

                  > span {
                    display: inline-block;
                    padding: 10px 0;
                    color: black;
                    font-weight: 400;
                    font-size: 18px;
                    border-bottom: 2px solid #2a83d3;
                    position: relative;
                    top: 5px;
                    max-width: 700px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }

                .card_item {
                  font-size: 16px;

                  > i {
                    position: relative;
                    top: -4px;
                    left: -3px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .card_item {
    width: 100%;
    padding: 12px 10px;
    color: #505050;
    border-bottom: 1px solid #dee0e2;
    box-sizing: border-box;

    .title {
      display: inline-block;
      cursor: pointer;

      > div {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;

        a {
          color: #505050;
          text-decoration: none;
        }

        a:hover {
          color: #2a83d3;
        }
      }
    }

    .time {
      width: 75px;
      float: right;
      white-space: nowrap;
      overflow: hidden;
      background: #8993b8;
      color: white;
      text-align: center;
      padding: 3px 6px;
      font-size: 12px;
      border-radius: 15px;
    }

    .download {
      max-width: 150px;
      padding: 5px 10px;
      margin-right: 10px;
      float: right;
      background: #2a83d3;
      color: white;
      position: relative;
      top: -3px;

      > span {
        max-width: 100%;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.A0026_hint_dialog {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .el-dialog__header {
    padding: 15px 15px 10px;
  }

  .el-dialog__body {
    padding: 10px 15px;

    i {
      font-size: 24px;
      color: #e6a23c;
      margin-right: 5px;
      position: relative;
      top: 3px;
    }
  }

  .el-dialog__footer {
    padding: 5px 15px 20px;

    .el-button {
      font-size: 12px;
      padding: 9px 12px;
    }
  }
}

.A0027 {
  .tabs_div {
    width: 100%;

    .card {
      display: inline-table;
      padding: 10px 20px;
      box-sizing: border-box;
      height: 420px;
      position: relative;

      .card_title {
        padding: 7px 15px;
        height: 34px;
        box-sizing: border-box;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-radius: 3px;
        display: inline-block;
        color: white;
        position: absolute;
        top: 30px;
        left: 10px;
      }

      .card_subtitle {
        font-size: 17px;
        color: black;
        margin: 10px 0 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .card_content {
        font-size: 15px;
        color: #617089;
        line-height: 1.7;
        white-space: pre-wrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }

      .card_footer {
        display: inline-block;
        padding-bottom: 8px;
        font-size: 15px;
        border-bottom: 1px solid #2a83d3;
        color: #2a83d3;
        margin: 15px 0;
        cursor: pointer;
      }
    }
  }
}

.A0028 {
  .el-table {
    -webkit-box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.12);
    box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.12);
    border: 1px solid #e9e9f5;

    table {
      border-collapse: collapse;
    }

    .el-table__cell {
      border: 1px solid #e9e9f5;
      box-sizing: border-box;
      text-align: center;
      color: #333333;
      font-size: 14px;
      padding: 6px;
      font-weight: 400;

      .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    th {
      background: #f0f0ff;

      > div {
        color: #50308d;
      }
    }

    .el-table__row:hover {
      background: #f5f7fa;
      cursor: pointer;
    }

    .el-table__row {
      .el-table__cell:hover {
        color: #bca57c;
      }
    }
  }
}

.A0029 {
  text-align: center;
  padding-top: 23px;

  .title {
    font-size: 28px;
    color: #333333;
    margin: 0 0 23px 0;
  }

  .div {
    background-size: cover;
    background-position: center center;
    border-radius: 20px;
    overflow: hidden;
    margin: auto;

    .text {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;

      > div {
        width: 100%;
        font-weight: 100;

        .subtitle {
          font-size: 24px;
          margin: 10px;
        }

        .content {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
          white-space: pre-wrap;
        }

        .download {
          padding: 15px 60px;
          font-size: 16px;
          background: #2856f1;
          color: white;
          border: none;
          margin: 10px;

          i {
            margin-right: 6px;
          }
        }
      }
    }
  }
}

.A0030 {
  .module {
    margin-bottom: 60px;

    .title {
      margin: 25px 0;
      padding: 0 20px;
      font-size: 28px;
      border-left: 12px solid;
      font-weight: 700;
    }

    .el-collapse {
      border: none;

      .el-collapse-item {
        border-bottom: 1px solid #dddddd;

        .el-collapse-item__header {
          background: transparent;
          padding: 10px 0;
          border-bottom: none;

          .icon {
            font-weight: 700;
            font-size: 28px;
            margin-right: 15px;
          }

          .text {
            font-weight: 700;
            font-size: 18px;
            transform-origin: left center;
            transition: all 0.23s ease;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: calc(100% - 120px);
          }

          .text:hover {
            transform: scale(1.04);
          }
        }

        .el-collapse-item__wrap {
          background: transparent;
          border-bottom: none;

          .icon {
            font-weight: 700;
            font-size: 28px;
          }

          .content {
            padding: 0 25px;
            font-size: 14px;
          }
        }
      }

      .el-collapse-item.is-active {
        > div:first-child {
          background: white;
          position: sticky;
          top: 0;
        }
      }
    }
  }
}

.A0031 {
  margin: 10px 0;
  font-size: 18px;
  color: black;
  font-weight: 700;

  > div {
    display: inline-block;
  }

  .icon {
    margin-right: 10px;
    position: relative;
    top: 3px;

    > i {
      font-weight: 700;
    }
  }

  .content {
    max-width: calc(100% - 410px);

    .el-row {
      margin-bottom: 8px;
    }
  }
}

.A0032 {
  .items {
    max-width: calc(100% - 410px);

    .item {
      display: inline-table;
      width: 150px;
      height: 140px;
      text-align: center;

      .el-image {
        width: 100px;
        height: 100px;
      }

      .text {
        font-size: 14px;
        font-weight: 400;
        color: #979797;
        max-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>
