<template>
  <div>
    <!-- 搜索 -->
    <i-search ref="iSearch" :model="formData" @search="search" @reset="reset">
      <div class="i-search-div">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="formData.goodsName"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="商品状态" prop="goodsStateId">
          <el-select  v-model="formData.goodsStateId">
            <el-option
              v-for="(item, index) in commOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="广告词" prop="goodsAdvertise">
          <el-input v-model="formData.goodsAdvertise"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="出版社" prop="goodsPress">
          <el-input v-model="formData.goodsPress"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="作者" prop="goodsAuthor">
          <el-input v-model="formData.goodsAuthor"></el-input>
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
        :width="item.width"
        :formatter="columnFormatter">
      </el-table-column>
    </i-table>

    <i-dialog
      v-model="dialogVisible"
      :title="dialogtitle"
      @dialog-cancel="dialogCancel"
      @dialog-comfirm="dialogComfirm"
      @dialog-befor-close="dialogBeforClose">

      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="dialogFormData.goodsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本价" prop="goodsOriginalCost">
              <el-input v-model.number="dialogFormData.goodsOriginalCost"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="在售价" prop="goodsPrice">
              <el-input v-model.number="dialogFormData.goodsPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一级分类" prop="oneClassifyId">
              <el-select  v-model="dialogFormData.oneClassifyId" @change="selectGoodsTwoClassify" placeholder="请选择">
                <el-option
                  v-for="(item, index) in oneOptions"
                  :key="index"
                  :label="item.classifyName"
                  :value="item.classifyId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级分类" prop="twoClassifyId">
              <el-select  v-model="dialogFormData.twoClassifyId" placeholder="请选择">
                <el-option
                  v-for="(item, index) in twoOptions"
                  :key="index"
                  :label="item.classifyName"
                  :value="item.classifyId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="广告词" prop="goodsAdvertise">
              <el-input type="textarea" :rows="1" v-model="dialogFormData.goodsAdvertise"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品介绍" prop="goodsDescribe">
              <el-input type="textarea" :rows="1"  v-model="dialogFormData.goodsDescribe"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商家名称" prop="supplierName">
              <el-input v-model="dialogFormData.supplierName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="goodsAuthor">
              <el-input v-model="dialogFormData.goodsAuthor"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社" prop="goodsPress">
              <el-input v-model="dialogFormData.goodsPress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="书号" prop="isbn">
              <el-input v-model="dialogFormData.isbn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="goodsInventory">
              <el-input v-model.number="dialogFormData.goodsInventory"></el-input>
            </el-form-item>
          </el-col>
          <!-- 上传文件 -->
          <el-col :span="12">
            <el-form-item label="图片上传" class="upImg" prop="goodsImagePath">
              <i-file v-model="dialogFormData.goodsImagePath"></i-file>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import IFile from '@/components/common/i-file.vue'

import req from '@/api/comm-manage.js'

export default {
  name: 'user-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile
  },
  data () {
    return {
      fileList: [],
      formData: {
        goodsName: '',
        goodsAdvertise: '',
        goodsPress: '',
        goodsAuthor: ''
      },
      dialogFormData: {
        goodsStateId: 1,
        twoClassifyId: ''
      },
      rowVersion: [],
      rowsGoodsId: [],
      dialogVisible: false,
      dialogtitle: '',
      commOptions: [
        {label: '售罄', value: 1},
        {label: '在售', value: 2},
        {label: '已下架', value: 3},
        {label: '未发布', value: 4}
      ],
      oneOptions: [],
      twoOptions: [],
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
            this.dialogtitle = '新增商品'
            this.selectGoodsOneClassify()
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            console.log('修改')
            console.log(this.rowsGoodsId.length)
            if (this.rowsGoodsId.length === 0) {
              this.$confirm('请选择要修改的数据').catch(() => {})
            } else if (this.rowsGoodsId.length !== 1) {
              this.$confirm('请不要选择多条数据').catch(() => {})
            } else {
              this.dialogtitle = '修改用户'
              this.selectGoodsOneClassify()
              this.selectGoodsData()
              this.dialogVisible = true
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            console.log(this.pageInfo)
            this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
              if (this.rowsGoodsId.length === 0) {
                this.$confirm('请至少选择一条数据').catch(() => {})
              } else {
                this.deleteGoodsData()
              }
            }).catch(() => {})
          }
        },
        {
          btnName: '上架',
          type: 'primary',
          func: () => {
            if (this.rowsGoodsId.length === 0) {
              this.$confirm('请选择要修改的数据').catch(() => {})
            } else {
              this.dialogFormData.goodsStateId = 2
              this.updateGoodsStateIdData()
            }
          }
        },
        {
          btnName: '下架',
          type: 'primary',
          func: () => {
            if (this.rowsGoodsId.length === 0) {
              this.$confirm('请选择要修改的数据').catch(() => {})
            } else {
              this.dialogFormData.goodsStateId = 1
              this.updateGoodsStateIdData()
            }
          }
        }
      ],
      columnList: [
        {label: '商品名称', prop: 'goodsName', width: 150},
        {label: '定价', prop: 'goodsOriginalCost'},
        {label: '售价', prop: 'goodsPrice'},
        {label: '销售量', prop: 'goodsSales'},
        {label: '一级分类', prop: 'oneClassifyName'},
        {label: '二级分类', prop: 'twoClassifyName'},
        {label: '广告词', prop: 'goodsAdvertise', width: 200},
        {label: '商品介绍', prop: 'goodsDescribe', width: 250},
        {label: '商品状态', prop: 'goodsStateId', distName: 'commOptions'},
        {label: '上架时间', prop: 'goodsShelfTime'},
        {label: '浏览量', prop: 'goodsViewsNum'},
        {label: '商品编码', prop: 'goodsId', width: 150},
        {label: '商家名称', prop: 'supplierName'},
        {label: '库存', prop: 'goodsInventory'},
        {label: 'isbn书号', prop: 'isbn'}
      ],
      tableData: [],
      formRules: {
        goodsName: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        goodsAuthor: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        goodsPress: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        isbn: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        oneClassifyId: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        twoClassifyId: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        goodsAdvertise: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        goodsDescribe: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        supplierName: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        goodsInventory: [
          {required: true, message: '请输入活动名称', trigger: 'change'},
          {type: 'number', message: '请输入数字', trigger: 'change'}
        ],
        goodsOriginalCost: [
          {required: true, message: '请输入活动名称', trigger: 'change'},
          {type: 'number', message: '请输入数字', trigger: 'change'}
        ],
        goodsPrice: [
          {required: true, message: '请输入活动名称', trigger: 'change'},
          {type: 'number', message: '请输入数字', trigger: 'change'}
        ],
        goodsImagePath: [
          {required: true, message: '请选择图片', trigger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.selectTableData()
    this.selectGoodsOneClassify()
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
      // console.log(this.formData)
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        // console.log(data.data.list)
        if (data.code === 0) {
          this.tableData = data.data.list
          this.pageInfo.pageSize = data.data.pageSize
          this.pageInfo.pageNum = data.data.pageNum
          this.pageInfo.total = data.data.total
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 查询用户详情
    selectGoodsData () {
      req('getGoodsData', {
        ...this.dialogFormData,
        goodsId: this.rowsGoodsId[0]
      }).then(data => {
        console.log('et')
        console.log(data)
        this.selectGoodsTwoClassify(data.data.oneClassifyId)
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    // 增加商品
    addGoodsData () {
      console.log('新增')
      console.log(this.dialogFormData)
      req('addGoods', {
        ...this.dialogFormData
      }).then(data => {
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
    // 修改商品
    updateGoodsData () {
      req('updateGoods', {
        ...this.dialogFormData
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
    // 删除商品deleteGoods
    deleteGoodsData () {
      let selectGoodsIds = this.rowsGoodsId.map(item => {
        return item
      }).toString()
      req('deleteGoods', {
        goodsId: selectGoodsIds
      }).then(data => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.fetch()
          this.selectTableData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 修改商品状态
    updateGoodsStateIdData () {
      let selectGoodsIds = this.rowsGoodsId.map(item => {
        return item
      }).toString()
      let selectversions = this.rowVersion.map(item => {
        return item
      }).toString()
      console.log('---')
      console.log(this.dialogFormData)
      req('updateGoodsStateId', {
        goodsId: selectGoodsIds,
        goodsStateId: this.dialogFormData.goodsStateId,
        version: selectversions
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
    // 一级下拉框
    selectGoodsOneClassify () {
      req('commClassifyList', {
        classifyId: -1
      }).then(data => {
        console.log(data)
        this.oneOptions = data.data.list
      })
    },
    // 二级下拉框
    selectGoodsTwoClassify (value) {
      console.log('----')
      console.log(value)
      // this.twoOptions = []
      this.dialogFormData.twoClassifyId = ''
      req('commClassifyList', {
        classifyId: value
      }).then(data => {
        // console.log('----')
        // console.log(data)
        this.twoOptions = data.data.list
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
    handleCurrentChange (pageNum) {
      console.log('页数：' + pageNum)
      this.pageInfo.pageNum = pageNum
      this.selectTableData()
    },
    handleselectionChange (rows) {
      this.rowsGoodsId = []
      this.rowVersion = []
      if (rows.length !== 0) {
        for (let i = 0; i < rows.length; i++) {
          this.rowsGoodsId.push(rows[i].goodsId)
          this.rowVersion.push(rows[i].version)
        }
      }
    },
    dialogBeforClose () {
      console.log(this.$refs.form)
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogComfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogtitle === '新增商品') {
            console.log('表单校验成功')
            this.addGoodsData()
          } else {
            console.log('修改')
            this.updateGoodsData()
            // this.dialogVisible = false
            // this.$refs.form.resetFields()
            // this.selectTableData()
          }
        } else {
          return false
        }
      })
    },
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        // console.log('row: '+row[column.property])
        // console.log('distName: '+this[distName])
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
.el-select {
  width: 100%;
}
.el-dialog {
  .el-dialog__body{
    .el-form {
      .el-row {
        .el-col {
          .upImg {
            .el-form-item__content {
              .el-input{
                /deep/ .el-input__inner {
                  border: 0px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
