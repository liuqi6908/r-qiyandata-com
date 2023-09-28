<template>
  <el-dialog
    title="提示"
    :visible.sync="dialog"
    width="450px"
    top="0"
  >
    <div>
      <i class="el-icon-warning" />
      该功能仅限已认证个人用户使用，请前往{{ isUser ? '认证' : '登录' }}
    </div>
    <template slot="footer">
      <el-button @click="dialog = false">
        取 消
      </el-button>
      <el-button type="primary" @click="confirm">
        立即前往
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { logout } from '@/util/user'

export default {
  name: 'VerifyDialog',
  props: {
    value: {
      type: Boolean
    }
  },
  methods: {
    /**
     * 立即前往（登录 / 认证）
     */
    confirm() {
      if (this.isUser)
        this.$router.push('/user_center')
      else
        logout('/login')
    },
  },
  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('update:value', newVal)
      }
    },
    /**
     * 是否为个人用户
     */
    isUser() {
      const { token, type } = this.$store.getters.getUserInfo
      return !!token && type === '个人用户'
    }
  }
}
</script>

<style lang="scss" src="./dialog.scss" scoped />