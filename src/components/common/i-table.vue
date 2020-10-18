<template>
  <div class="i-table">
    <!-- 按钮列表 -->
    <div class="btn-list" v-show="toolbar.length">
      <el-button
        v-for="(item,index) in toolbar"
        @click="item.func"
        :key="index"
        :type="item.type">
        {{item.btnName}}
      </el-button>
    </div>

    <div class="table-container">
      <el-table
        border
        :data="tableData"
        @selection-change="handleselectionChange"
        >
        <el-table-column
          v-if="selectionShow"
          type="selection"
          width="55">
        </el-table-column>
        <slot></slot>
      </el-table>
    </div>

    <div class="table-pagination" v-show="this.tableData.length">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'i-table',
  props: {
    toolbar: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageInfo: {
      type: Object,
      default: () => {
        return {
          pageSize: 5,
          pageNum: 1,
          total: 0
        }
      }
    },
    selectionShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleSizeChange (value) {
      this.$emit('handleSizeChange', value)
    },
    handleCurrentChange (value) {
      this.$emit('handleCurrentChange', value)
    },
    handleselectionChange (rows) {
      this.$emit('selection-change', rows)
    }
  }
}
</script>

<style lang="scss" scoped>
.i-table {
  padding: 10px;
  .btn-list {
    padding-bottom: 15px;
    padding-left: 15px;
  }
  .el-pagination {
    text-align: right;
    margin-top: 10px;
  }
}
</style>
