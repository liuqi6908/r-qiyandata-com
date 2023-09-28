<template>
  <div class="tabs-1 h-full py-25 px-5">
    <div class="h-full col gap-5 none-scrollbar">
      <button
        v-for="item in menu"
        :key="item.value"
        class="tab"
        :class="{ active: active === item.value }"
        @click="active = item.value"
      >
        <i :class="item.icon" />
        <span v-text="item.label" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    menu: {
      type: Array
    }
  },
  computed: {
    active: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs-1 {
  background-color: #fbfaff;
  border-right: 1px solid #dfe4ed;
  .tab {
    width: 100%;
    min-height: 2.5rem;
    padding: 0 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.3125rem;
    font-size: 1rem;
    font-weight: 700;
    color: #576388;
    background-color: transparent;
    border: none;
    border-radius: 0.625rem;
    cursor: pointer;
    &:hover {
      color: #0168b7;
    }
    &.active {
      color: white;
      background-color: #0168b7;
    }
    > i {
      font-size: 20px;
    }
    > span {
      text-align: left;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
