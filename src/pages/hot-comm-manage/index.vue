<template>
  <div>
    <!-- 搜索 -->
    <i-search ref="iSearch" :model="formDataSearch" @search="search" @reset="reset">
      <div class="i-search-div">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="formDataSearch.goodsName"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="商品编号" prop="goodsId">
          <el-input v-model="formDataSearch.goodsId"></el-input>
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
        align="center">
      </el-table-column>
    </i-table>
    <!-- 新增弹出框 -->
    <i-dialog
      v-model="dialogVisible"
      :title="dialogtitle"
      @dialog-cancel="dialogCancel"
      @dialog-befor-close="dialogBeforClose"
      @dialog-comfirm="dialogComfirm">

      <el-form :model="formData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="15">
            <el-form-item label="商品" prop="goodsId">
              <comm-select v-model="formData.goodsId"></comm-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="热门位排序" prop="hotGoodsNum">
              <el-input v-model.number="formData.hotGoodsNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
    <!-- 数量设置弹出框 -->
    <i-dialog
      v-model="dialogVisibleShowHot"
      :title="dialogtitleShowHot"
      @dialog-cancel="dialogCancelShowHot"
      @dialog-comfirm="dialogComfirmShowHot">
      <el-form :model="formDataShowHot" ref="form" :rules="showHotFormRules" label-width="120px">
        <div class="i-search-div-two">
          <el-form-item label="展示商品数量" prop="hotGoodsShowNum">
            <el-input v-model.number="formDataShowHot.hotGoodsShowNum"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import CommSelect from './comm-select.vue'

import req from '@/api/hot-comm-manage.js'

export default {
  name: 'client-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect
  },
  data () {
    return {
      dialogtitle: '',
      // dialogtitleChange: '修改商品',
      dialogtitleShowHot: '展示热门商品数量设置',
      dialogVisible: false,
      // dialogVisible: false,
      dialogVisibleShowHot: false,
      formDataSearch: {},
      formData: {
        goodsId: '',
        hotGoodsNum: ''
      },
      formDataShowHot: {
      },
      dialogFormData: {
        hotGoodsId: []
      },
      rowsHotGoodsId: [],
      pageInfo: {
        pageSize: 5,
        pageNum: 1,
        total: 0
      },
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogtitle = '新增热门位商品'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            this.dialogtitle = '修改商品'
            if (this.rowsHotGoodsId.length === 0) {
              this.$confirm('请选择要修改的数据').catch(() => {})
            } else if (this.rowsHotGoodsId.length !== 1) {
              this.$confirm('请不要选择多条数据').catch(() => {})
            } else {
              this.dialogVisible = true
              this.getGoodsData()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.rowsHotGoodsId.length === 0) {
              this.$confirm('请选择要删除的数据').catch(() => {})
            } else {
              this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
                this.deleteGoodsData()
              }).catch(() => {})
            }
          }
        },
        {
          btnName: '展示数量设置',
          type: 'primary',
          func: () => {
            this.getShowData()
            this.dialogVisibleShowHot = true
          }
        }
      ],
      // 表头
      columnList: [
        {label: '排序', prop: 'hotGoodsNum'},
        {label: '商品编号', prop: 'goodsId'},
        {label: '商品名称', prop: 'goodsName'},
        {label: '商品价格', prop: 'goodsPrice'},
        {label: '商品介绍', prop: 'goodsDescribe'}
      ],
      twoColumnList: [
        {label: '商品编号', prop: 'tableCommAccount'},
        {label: '商品名称', prop: 'tableName'},
        {label: '商品状态', prop: 'tableGender'},
        {label: '一级分类', prop: 'tablePhone'},
        {label: '二级分类', prop: 'tableCommEmail'}
      ],
      // 表单数据
      tableData: [],
      formRules: {
        goodsId: [
          {required: true, message: '请选择商品', trigger: 'change'}
        ],
        hotGoodsNum: [
          { required: true, message: '请输入排序', trigger: 'change' },
          { type: 'number', message: '排序必须为数字' }
        ]
      },
      showHotFormRules: {
        hotGoodsShowNum: [
          {required: true, message: '不能为空，请输入', trigger: 'change'},
          { type: 'number', message: '请输入数字', trigger: 'change' }
        ]
      }
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
    // 查询热门商品
    selectTableData () {
      req('getHotGoods', {
        ...this.formDataSearch,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        console.log(data)
        this.tableData = data.data.list
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.total = data.data.total
      })
    },
    // 查看展示数量
    getShowData () {
      req('getShow', {

      }).then(data => {
        console.log(data)
        this.formDataShowHot = data.data
        console.log(this.formDataShowHot)
      })
    },
    // 修改展示数量
    changeData () {
      req('changeShow', {
        ...this.formDataShowHot
      }).then(data => {
        console.log(data)
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.dialogVisibleShowHot = false
          this.selectTableData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 新增
    addGoodsData () {
      req('addGoods', {
        ...this.formData
      }).then(data => {
        console.log(data)
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          // this.fetch()
          this.$refs.form.resetFields()
          this.dialogVisible = false
          this.selectTableData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 修改商品信息
    changeGoodsData () {
      console.log('=====')
      // console.log(this.formData.hotGoodsId)
      // console.log(this.formData.goodsId)
      console.log(this.formData.version)
      req('changeData', {
        ...this.formData
      }).then(data => {
        console.log(data)
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.$refs.form.resetFields()
          this.dialogVisible = false
          this.selectTableData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 获取商品详情
    getGoodsData () {
      // let hotGoodsData = this.rowsHotGoodsId.map(item => {
      //   return item
      // }).toString()
      req('getGoods', {
        hotGoodsId: this.rowsHotGoodsId[0]
      }).then(data => {
        console.log(data)
        let tableList = data.data
        this.formData = Object.assign({}, tableList)
      })
    },
    // 删除
    deleteGoodsData () {
      let hotGoodsIds = this.rowsHotGoodsId.map(item => {
        return item
      }).toString()
      console.log(hotGoodsIds)
      req('deleteGoods', {
        hotGoodsId: hotGoodsIds
      }).then(data => {
        console.log(data)
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
      this.rowsHotGoodsId = []
      if (rows.length !== 0) {
        for (let i = 0; i < rows.length; i++) {
          this.rowsHotGoodsId.push(rows[i].hotGoodsId)
        }
      }
    },
    // 新增弹出框
    dialogBeforClose () {
      // console.log(this.$refs.form)
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    dialogComfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('表单校验成功')
          if (this.dialogtitle === '新增热门位商品') {
            this.addGoodsData()
          } else {
            this.changeGoodsData()
          }
        } else {
          return false
        }
      })
    },
    // // 修改弹出框
    // dialogBeforCloseChange () {
    //   // console.log(this.$refs.form)
    //   this.$refs.form.resetFields()
    // },
    // dialogCancelChange () {
    //   this.$refs.form.resetFields()
    //   this.dialogVisible = false
    // },
    // dialogComfirmChange () {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       console.log('表单校验成功')
    //       this.changeGoodsData()
    //     } else {
    //       return false
    //     }
    //   })
    // },
    // 展示热门商品设置
    dialogCancelShowHot () {
      this.$refs.form.resetFields()
      this.dialogVisibleShowHot = false
    },
    dialogComfirmShowHot () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('表单校验成功')
          this.changeData()
        } else {
          return false
        }
      })
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
.el-dialog__body {
  .el-form {
    .el-row {
      .el-col {
        .el-form-item {
          /deep/ .el-form-item__content {
            display: flex;
            align-items: center;
            .el-button {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
}
.el-dialog__body {
  display: flex;
  justify-content: center;
}

</style>
