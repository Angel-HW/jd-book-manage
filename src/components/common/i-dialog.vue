<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="50%"
      @close="closeDialog"
      :before-close="dialogBeforClose"
      :append-to-body="appendToBody">

      <slot></slot>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'i-dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    closeDialog () {
      // this.visible = false
      this.$emit('input', this.visible)
    },
    dialogCancel () {
      this.$emit('dialog-cancel')
    },
    dialogConfirm () {
      this.$emit('dialog-comfirm')
    },
    dialogBeforClose () {
      this.$emit('dialog-befor-close')
      this.visible = false
    }
  },
  watch: {
    value: {
      handler (value) {
        this.visible = value
      },
      deep: true
    }
  }
}
</script>
