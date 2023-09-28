<template>
  <!-- 在线运行python demo -->
  <div
    class="python-demo"
    v-loading="loading"
    element-loading-text="正在加载中..."
  >
    <!-- 代码 -->
    <div class="input">
      <div class="title">
        Python代码输入区：
        <div>
          <el-button type="primary" size="small" @click="openDialog">
            可导入模块
          </el-button>
          <el-tooltip placement="top">
            <div slot="content" style="line-height: 1.6">
              1. 不能对本地文件系统进行读写
              <br />
              2. 如果无法运行请升级浏览器版本
              <br />
              3. 若某些代码无法运行请使用本地Python执行
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
      </div>
      <div class="main">
        <Codemirror
          :modelValue.sync="code"
          placeholder="请输入代码..."
          :autofocus="true"
          :indent-with-tab="true"
          :tabSize="4"
          :extensions="extensions"
          @keydown.native="handleKeyDown"
          :style="{
            fontSize: `${fontSize}px`
          }"
        />
      </div>
      <div class="operate">
        <div class="row items-center gap-8">
          <el-button type="primary" size="small" @click="init">
            清空代码
          </el-button>
          <div class="text-base font-400 row items-center gap-2">
            字号
            <div class="change-font-size row items-center gap-3 py-1 px-2">
              <i class="el-icon-minus" :class="{ disabled: fontSize <= 12 }" @click="changeFontSize('-')" />
              {{ fontSize }} px
              <i class="el-icon-plus" :class="{ disabled: fontSize >= 22 }" @click="changeFontSize('+')" />
            </div>
          </div>
        </div>
        <el-button v-if="!pyodide" type="primary" size="small" @click="init">
          重新加载
        </el-button>
        <el-button v-else type="primary" size="small" @click="runCode">
          运行代码
        </el-button>
      </div>
    </div>

    <!-- 结果 -->
    <div class="output">
      <div class="title">
        运行结果展示区：
        <el-tooltip placement="top">
          <div slot="content" style="line-height: 1.6">
            快捷键：
            <br />
            Alt + 回车：运行代码
            <br />
            Alt + L：清空结果
            <br />
            Alt + S：保存代码和结果
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </div>
      <div class="main">
        <div
          class="console scrollbar"
          :style="{
            fontSize: `${fontSize}px`
          }"
        >
          <div
            v-for="(item, i) in output.filter(v => v.text)"
            :key="i"
            :class="item.type"
            v-text="item.text"
          ></div>
        </div>
      </div>
      <div class="operate">
        <el-button type="primary" size="small" @click="emptyResult"
          >清空结果</el-button
        >
        <el-button type="primary" size="small" @click="saveResult"
          >保存代码和结果</el-button
        >
      </div>
    </div>

    <!-- 可导入模块 -->
    <el-dialog
      :visible.sync="dialog"
      width="500px"
      top="0"
      custom-class="module-list"
    >
      <div slot="title">
        可导入模块
        <el-input
          placeholder="输入关键词 搜索模块"
          size="small"
          v-model="filterText"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </div>
      <el-table
        :data="filterModuleList"
        v-loading="dialogLoading"
        height="100%"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="name" label="模块" sortable> </el-table-column>
        <el-table-column prop="version" label="版本"> </el-table-column>
        <template slot="empty">
          <el-empty description="暂无数据"></el-empty>
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
/** 引入codemirror（代码编辑器） */
import { Codemirror } from "vue-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

/** 引入file-saver */
import { saveAs } from "file-saver";
import { formatDateTime } from "@/util/format";

export default {
  name: "PythonDemo",
  components: {
    Codemirror
  },
  data() {
    return {
      /** 页面加载 */
      loading: false,
      /** 字体大小 */
      fontSize: 14,
      /** pyodide url */
      pyodideUrl1: "https://fastly.jsdelivr.net/pyodide/v0.23.3/full/",
      pyodideUrl2: "https://gcore.jsdelivr.net/pyodide/v0.23.3/full/",
      pyodideUrl3: "https://cdn.jsdelivr.net/pyodide/v0.23.3/full/",
      /** pyodide实例 */
      pyodide: null,
      /** codemirror配置项 */
      extensions: [python(), oneDark],
      /** 输入的python代码 */
      code: "",
      /** 运行结果 */
      output: [],
      /** 可导入模块列表 */
      moduleList: [],
      /** 筛选字段 */
      filterText: "",
      /** 对话框 */
      dialog: false,
      dialogLoading: false
    };
  },
  methods: {
    /** 初始化页面 */
    async init() {
      this.loading = true;
      // 加载pyodide
      this.code = "";
      this.output = [];

      try {
        if (typeof loadPyodide === "undefined") {
          try {
            await this.loadPyodide(1);
          } catch (e) {
            try {
              await this.loadPyodide(2);
            } catch (e) {
              await this.loadPyodide(3);
            }
          }
        }
        this.pyodide = await loadPyodide();
      } catch (e) {
        this.$message.error("网络错误，pyodide加载失败！");
      } finally {
        this.loading = false;
      }
    },

    /** 加载pyodide */
    loadPyodide(index) {
      // 移除原来的script
      const scripts = document.getElementsByTagName("script");
      const head = document.head;
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes("pyodide")) head.removeChild(scripts[i]);
      }
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `${this["pyodideUrl" + index]}pyodide.js`;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        head.appendChild(script);
      });
    },

    /** 运行代码 */
    runCode() {
      if (!this.pyodide || !this.code) return;
      this.loading = true;
      this.output = [];
      setTimeout(async () => {
        try {
          this.output.push({
            text: "运行中...",
            type: "code"
          });

          // 自动加载包
          await this.pyodide.loadPackagesFromImports(this.code);

          // 重定向console.log输出
          let result = [];

          console.log = function(...args) {
            args.map(v => {
              result.push(v + "\n");
            });
          };

          // 运行代码
          result.push(this.pyodide.runPython(this.code));
          if (result && result.length > 0)
            this.output.push({
              text: result.join(""),
              type: "result"
            });
        } catch (e) {
          if (e)
            this.output.push({
              text: e.message,
              type: "error"
            });
        } finally {
          setTimeout(() => {
            this.output.push({
              text: "\n进程结束",
              type: "finish"
            });
            this.loading = false;
          }, 100);
        }
      }, 100);
    },

    /** 清空结果 */
    emptyResult() {
      this.output = [];
    },

    /** 保存结果 */
    saveResult() {
      // 整理保存的文本
      let text = "";
      text += `Python代码：\n${this.code}\n\n`;
      text += `运行结果：\n`;
      for (let i = 0; i < this.output.length; i++) {
        if (this.output[i].type === "result" || this.output[i].type === "error")
          text += `${this.output[i].text}\n`;
      }

      // 创建Blob对象
      const data = new Blob([text], { type: "text/plain" });
      // 下载文件
      saveAs(data, `企研在线Python运行结果-${formatDateTime()}.txt`);
    },

    /** 获取可导入模块列表 */
    async getModuleList(index) {
      if (this.moduleList.length > 0) return;
      try {
        const { data: res } = await this.$http.get(
          `${this["pyodideUrl" + index]}repodata.json`
        );
        if (res.packages)
          for (const key in res.packages) {
            if (res.packages[key].package_type === "package")
              this.moduleList.push({
                name: res.packages[key].name,
                version: res.packages[key].version
              });
          }
      } catch (e) {
        if (index < 3) await this.getModuleList(index + 1);
      }
    },

    /** 打开对话框 */
    async openDialog() {
      this.dialog = true;
      this.dialogLoading = true;
      await this.getModuleList(1);
      this.dialogLoading = false;
    },

    /** 快捷键 */
    handleKeyDown(event) {
      // 按下alt键
      if (event && event.altKey) {
        // alt + enter（运行）
        if (event.key === "Enter") {
          this.runCode();
          event.preventDefault();
        }
        // alt + L（清空）
        else if (event.code === "KeyL") {
          this.emptyResult();
          event.preventDefault();
        }
        // alt + S（保存）
        else if (event.code === "KeyS") {
          this.saveResult();
          event.preventDefault();
        }
      }
    },

    /**
     * 调整字体大小
     * @param { '-' | '+'} type
     */
    changeFontSize(type) {
      if (type === '-' && this.fontSize > 12)
        this.fontSize--
      else if (type === '+' && this.fontSize < 22)
        this.fontSize++
    }
  },
  mounted() {
    // 修改代码编辑器滚动条样式
    this.$nextTick(() => {
      const dom = document.getElementsByClassName("cm-scroller");
      for (let i = 0; i < dom.length; i++) {
        dom[i].className += " scrollbar";
      }
    });
    this.init();
  },
  computed: {
    /** 筛选模块列表 */
    filterModuleList() {
      if (!this.filterText) return this.moduleList;
      else
        return this.moduleList.filter(item =>
          item.name.includes(this.filterText)
        );
    }
  }
};
</script>

<style scoped lang="scss">
.python-demo {
  display: flex;
  flex-direction: column;

  .input,
  .output {
    flex: 1;
    height: 0;

    .title,
    .operate {
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;

      > i {
        position: relative;
        top: 2px;
      }

      .change-font-size {
        background-color: #f0f0f0;
        border-radius: 0.25rem;
        > i {
          font-weight: 700;
          cursor: pointer;
          padding: 0.125rem;
          border-radius: 0.125rem;
          &.disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          &:not(.disabled):hover {
            background-color: #e0e0e0;
          }
        }
      }
    }

    .main {
      height: calc(100% - 70px);
      padding: 5px 0;
      box-sizing: border-box;

      .v-codemirror {
        height: 100%;
        font-size: 14px;

        >>> .cm-editor {
          height: 100%;
        }
      }

      .console {
        height: 100%;
        line-height: 1.4;
        background: black;
        color: white;
        padding: 5px;
        box-sizing: border-box;
        white-space: pre-wrap;
        font-family: monospace;

        .code::before {
          content: ">>>";
          margin-right: 8px;
        }

        .error {
          color: #f56c6c;
        }
      }
    }
  }

  .el-dialog__wrapper {
    padding: 80px 0;

    >>> .module-list {
      height: 100%;
      min-height: 600px;
      margin: 0 auto;
      border-radius: 10px;
      position: relative;

      .el-icon-close:before {
        font-size: 30px;
        font-weight: 700;
        color: #222222;
      }

      .el-dialog__header {
        padding: 20px;

        > div:first-child {
          display: flex;
          align-items: center;
          font-size: 20px;
          font-weight: 700;
          color: black;

          .el-input {
            width: 200px;
            margin-left: 50px;

            .el-input__inner {
              background: #f5f5f5;
              color: black;
              border-radius: 15px;
            }
          }
        }
      }

      .el-dialog__body {
        position: absolute;
        top: 65px;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        box-sizing: border-box;

        .el-table__body-wrapper::-webkit-scrollbar {
          /* 高宽分别对应横竖滚动条的尺寸 */
          width: 12px;
          height: 7px;
        }

        .el-table__body-wrapper::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: #b4b4b4;
        }

        .el-table__body-wrapper::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          background: #ededed;
        }
      }
    }
  }
}
</style>
