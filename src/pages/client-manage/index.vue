<template>
  <div>
    <!-- 搜索 -->
    <i-search ref="iSearch" :model="formData" @search="search" @reset="reset">
      <div class="i-search-div">
        <el-form-item label="客户名称" prop="userName">
          <el-input v-model="formData.userName"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="客户账号" prop="userAcct">
          <el-input v-model="formData.userAcct"></el-input>
        </el-form-item>
      </div>
    </i-search>
    <!-- 表格 -->
    <i-table
      :toolbar="toolbar"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :selectionShow="false"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @selection-change="handleselectionChange"
      >
      <el-table-column
        v-for="(item, index) in columnList"
        :label="item.label"
        :key="index"
        :prop="item.prop"
        align="center">
      </el-table-column>
    </i-table>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'

import req from '@/api/client-manage.js'

export default {
  name: 'client-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {
      },
      dialogFormData: {},
      pageInfo: {
        pageSize: 5,
        pageNum: 1,
        total: 0
      },
      toolbar: [
      ],
      // 表头
      columnList: [
        {label: '客户账号', prop: 'userAcct'},
        {label: '姓名', prop: 'userName'},
        {label: '性别', prop: 'sex'},
        {label: '手机', prop: 'phone'},
        {label: '客户邮箱', prop: 'mail'},
        {label: '身份证', prop: 'idCard'}
      ],
      // 表单数据
      tableData: [
        // {tableCommAccount: '1', tableName: '2', tableGender: '3', tablePhone: '4', tableCommEmail: '5', tableIdCar: '6'},
        // {tableCommAccount: '1', tableName: '2', tableGender: '3', tablePhone: '4', tableCommEmail: '5', tableIdCar: '6'},
        // {tableCommAccount: '1', tableName: '2', tableGender: '3', tablePhone: '4', tableCommEmail: '5', tableIdCar: '6'},
        // {tableCommAccount: '1', tableName: '2', tableGender: '3', tablePhone: '4', tableCommEmail: '5', tableIdCar: '6'},
        // {tableCommAccount: '1', tableName: '2', tableGender: '3', tablePhone: '4', tableCommEmail: '5', tableIdCar: '6'},
        // {tableCommAccount: '1', tableName: '2', tableGender: '3', tablePhone: '4', tableCommEmail: '5', tableIdCar: '6'},
        // {tableCommAccount: '1', tableName: '2', tableGender: '3', tablePhone: '4', tableCommEmail: '5', tableIdCar: '6'}
      ]
    }
  },
  mounted () {
    this.selectClientData()
  },
  computed: {
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      // this.selectTableData()
    },
    // 查询客户信息
    selectClientData () {
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        for (let i = 0; i < data.data.list.length; i++) {
          if (data.data.list[i].sex === 0) {
            data.data.list[i].sex = '男'
          } else {
            data.data.list[i].sex = '女'
          }
        }
        this.tableData = data.data.list
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.total = data.data.total
      })
    },
    search () {
      console.log('search被点击')
      this.fetch()
      this.selectClientData()
    },
    reset () {
      console.log('reset被点击')
      this.fetch()
      this.selectClientData()
    },
    handleSizeChange (value) {
      console.log('每页条数：' + value)
      this.pageInfo.pageSize = value
      this.pageInfo.pageNum = 1
      this.selectClientData()
    },
    handleCurrentChange (value) {
      console.log('页数：' + value)
      this.pageInfo.pageNum = value
      this.selectClientData()
    },
    handleselectionChange (rows) {
      console.log(rows)
    }
  }
}
</script>

<style lang="scss" scoped>
.i-search {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .i-search-div {
      width: 33%;
    }
  }
}
</style>
