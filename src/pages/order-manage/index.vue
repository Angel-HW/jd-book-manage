<template>
  <div>
    <!-- 搜索 -->
    <i-search ref="iSearch" :model="formData" @search="search" @reset="reset">
      <div class="i-search-div">
        <el-form-item label="下单人" prop="userName">
          <el-input v-model="formData.userName"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="订单编码" prop="orderId">
          <el-input v-model="formData.orderId"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="付款时间">
          <el-form-item prop="payTimeStart">
           <el-date-picker type="date" placeholder="选择日期" v-model="formData.payTimeStart" :picker-options="startDatePicker" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-col class="line" :span="2" style="text-align: center;margin-right: 15px">至</el-col>
          <el-form-item prop="payTimeEnd">
            <el-date-picker type="date" placeholder="选择日期" v-model="formData.payTimeEnd" :picker-options="endDatePicker" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="订单状态" prop="orderStateId">
          <el-select  v-model="formData.orderStateId">
            <el-option
              v-for="item in orderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </i-search>
    <!-- 表格 -->
    <i-table
      :toolbar="toolbar"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :selectionShow="true"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @selection-change="handleselectionChange"
      >
      <el-table-column
        v-for="(item, index) in columnList"
        :label="item.label"
        :key="index"
        :prop="item.prop"
        align="center"
        :formatter="columnFormatter">
      </el-table-column>
    </i-table>
    <!-- 弹出框 -->
    <i-dialog
      v-model="popDialogVisible"
      :title="dialogtitle"
      @dialog-cancel="dialogCancel"
      @dialog-befor-close="dialogBeforClose">

      <el-form ref="form" label-width="100px">
        <el-table
          :data="orderInfo"
          border
          style="width: 100%">
          <el-table-column
            prop="userId"
            label="用户编号"
            width="110">
          </el-table-column>
          <el-table-column
            prop="orderId"
            label="订单编码"
            width="110">
          </el-table-column>
          <el-table-column
            prop="goodsId"
            label="商品编号"
            width="110">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            label="商品名称"
            width="110">
          </el-table-column>
          <el-table-column
            prop="goodsCount"
            label="商品数量"
            width="110">
          </el-table-column>
          <el-table-column
            prop="theGoodsAllPrice"
            label="总金额"
            width="110">
          </el-table-column>
          <el-table-column
            prop="goodsPrice"
            label="售价"
            width="110">
          </el-table-column>
          <el-table-column
            prop="goodsShelfCost"
            label="定价"
            width="110">
          </el-table-column>
        </el-table>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'

import req from '@/api/order-manage.js'

export default {
  name: 'user-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {
        orderId: '',
        payTimeStart: '',
        payTimeEnd: ''
      },
      startDatePicker: {
        disabledDate: time => {
          if (this.formData.payTimeEnd) { // payTimeEnd不为空时
            return time.getTime() > new Date(this.formData.payTimeEnd).getTime()
          }
        }
      },
      endDatePicker: {
        disabledDate: time => {
          if (this.formData.payTimeStart) { // payTimeStart不为空时
            return time.getTime() < new Date(this.formData.payTimeStart).getTime()
          }
        }
      },
      orderInfo: [],
      orderId: [],
      orderStateId: 0,
      version: [],
      dialogFormData: {},
      popDialogVisible: false,
      dialogtitle: '订单详情',
      orderOptions: [
        {label: '已下单', value: 1},
        {label: '已取消', value: 2},
        {label: '已到货', value: 3},
        {label: '已取货', value: 4},
        {label: '已完成未评价', value: 5},
        {label: '已完成已评价', value: 6}
      ],
      pageInfo: {
        pageSize: 5,
        pageNum: 1,
        total: 0
      },
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            if (this.orderId.length === 0) {
              this.$confirm('请选择要查看的数据').catch(() => {})
            } else if (this.orderId.length !== 1) {
              this.$confirm('请不要选择多条数据').catch(() => {})
            } else {
              this.popDialogVisible = true
              this.selectClientData()
            }
          }
        },
        {
          btnName: '订单取消',
          type: 'primary',
          func: () => {
            this.orderStateId = 2
            this.updateOrderStateData()
          }
        },
        {
          btnName: '订单到货',
          type: 'primary',
          func: () => {
            this.orderStateId = 3
            this.updateOrderStateData()
          }
        },
        {
          btnName: '取消到货',
          type: 'primary',
          func: () => {
            this.orderStateId = 1
            this.updateOrderStateData()
          }
        },
        {
          btnName: '订单已取货',
          type: 'primary',
          func: () => {
            this.orderStateId = 4
            this.updateOrderStateData()
          }
        },
        {
          btnName: '取消已取货',
          type: 'primary',
          func: () => {
            this.orderStateId = 3
            this.updateOrderStateData()
          }
        }
      ],
      orderData: [
        // {tableCommName: '1', tableSetPrice: '2', tableSellPrice: '3', tableSales: '4', tableClassifyOne: '5', tableClassifyTwo: '6', tableAdWords: '7', tableIntroduce: '8'}
      ],
      columnList: [
        {label: '订单编号', prop: 'orderId'},
        {label: '订单总价', prop: 'orderAllCost'},
        {label: '订单状态', prop: 'orderStateId', distName: 'orderOptions'},
        {label: '支付状态', prop: 'tableSales'},
        {label: '门店编号', prop: 'storeId'},
        {label: '下单人姓名', prop: 'userName'},
        {label: '下单人手机号', prop: 'phone'},
        {label: '确认付款时间', prop: 'payTime'}
      ],
      tableData: []
    }
  },
  mounted () {
    this.selectTableData()
  },
  computed: {
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      // this.selectTableData()
    },
    // 查询表格数据
    selectTableData () {
      console.log(this.formData)
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        console.log('---')
        console.log(data)
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    // 查询详细信息
    selectClientData () {
      req('getClientData', {
        orderId: this.orderId[0]
      }).then(data => {
        // console.log(data)
        this.orderInfo = []
        this.orderInfo.push(data.data.list[0])
      })
    },
    // 修改订单状态
    updateOrderStateData () {
      let tableorderIds = this.orderId.map(item => {
        return item
      }).toString()
      let tableversions = this.version.map(item => {
        return item
      }).toString()
      req('updateOrderState', {
        orderId: tableorderIds,
        orderStateId: this.orderStateId,
        version: tableversions
      }).then(data => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.selectTableData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    search () {
      console.log('search被点击')
      console.log(this.formData.orderStateId)
      this.fetch()
      this.selectTableData()
    },
    reset () {
      console.log('reset被点击')
      this.fetch()
      this.selectTableData()
    },
    handleSizeChange (value) {
      console.log('每页条数：' + value)
      this.pageInfo.pageSize = value
      this.pageInfo.pageNum = 1
      this.selectTableData()
    },
    handleCurrentChange (value) {
      console.log('页数：' + value)
      this.pageInfo.pageNum = value
      this.selectTableData()
    },
    handleselectionChange (rows) {
      // console.log(rows)
      this.orderId = []
      this.orderStateId = []
      this.version = []
      if (rows.length !== 0) {
        for (let i = 0; i < rows.length; i++) {
          this.orderId.push(rows[i].orderId)
          this.orderStateId.push(rows[i].orderStateId)
          this.version.push(rows[i].version)
        }
      }
    },
    // 弹出框
    dialogBeforClose () {
      console.log(this.$refs.form)
    },
    dialogCancel () {
      this.popDialogVisible = false
    },
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.i-search {
  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    .i-search-div {
      width: 33%;
    }
  }
}
.i-search {
  .el-form {
    .i-search-div:nth-child(3) {
      /deep/ .el-form-item {
        display: flex;
        flex-wrap: wrap;
        .el-form-item__content {
          width: 80%;
          display: flex;
          align-items: center;
          .el-col {
            text-align: center;
            margin-right: 15px;
          }
          .el-form-item {
            margin: 0;
            .el-form-item__content{
              width: 90%;
            }
          }
        }
      }
    }
  }
}
</style>
