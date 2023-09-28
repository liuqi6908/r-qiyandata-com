<template>
  <el-dialog
    title="提示"
    :visible.sync="dialog"
    width="450px"
    top="0"
  >
    <div>
      <i class="el-icon-warning" />
      该功能需登录之后才可使用，请先登录！
    </div>
    <template slot="footer">
      <el-button @click="dialog = false">
        取 消
      </el-button>
      <el-button type="success" @click="IPLogin">
        机构 IP 登录
      </el-button>
      <el-button type="primary" @click="jumpLogin">
        个人用户登录
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { IPLogin, jumpLogin } from '@/util/user'

export default {
  name: 'LoginDialog',
  props: {
    value: {
      type: Boolean
    }
  },
  methods: {
    /**
     * 机构IP登录
     */
    IPLogin() {
      IPLogin()
      this.dialog = false
    },

    /**
     * 跳转登录页面
     */
    jumpLogin
  },
  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('update:value', newVal)
      }
    }
  }
}
</script>

<style lang="scss" src="./dialog.scss" scoped />