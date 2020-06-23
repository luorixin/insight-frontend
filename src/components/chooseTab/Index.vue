<template>
  <ul class="choose-tab">
    <li
      v-for="(item, key) in text"
      :key="'chooseTab' + key"
      :class="getClass(key)"
      @click="handleClick"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'chooseTab',
  props: {
    choose: {
      type: Boolean,
      default: true
    },
    text: {
      type: Array,
      default: () => ['Yes', 'No']
    },
    isClick: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    choose: {
      handler(newData, oldData) {
        this.selected = newData
      },
      immediate: true
    }
  },
  data() {
    return {
      selected: this.choose
    }
  },
  methods: {
    handleClick() {
      if (this.isClick) {
        this.selected = !this.selected
        this.$emit('handleChoose', this.selected)
      }
    },
    getClass(index) {
      if (this.selected) {
        return index === 0 ? 'status_recording' : 'disabled'
      } else {
        return index === 0 ? 'disabled' : 'status_paused'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.choose-tab {
  display: flex;
  justify-content: center;
  line-height: 15px;
  li {
    padding: 5px;
    cursor: pointer;
    border: 1px solid #dfdfdf;
    color: #333;
    position: relative;
    z-index: 999;
    & ~ li {
      border-left: none;
    }
    &.disabled {
      color: #c5c5c5;
      background: #f2f2f2;
    }
  }
}
</style>
