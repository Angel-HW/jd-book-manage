<template>
  <div>
    <!-- 搜索 -->
    <i-search ref="iSearch" :model="dialogFormData" @search="search" @reset="reset">
      <div class="i-search-div">
        <el-form-item label="状态" prop="slideshowStateId">
          <el-select  v-model="dialogFormData.slideshowStateId">
            <el-option
              v-for="(item, index) in commOptions"
              :key="index"
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
        :show-overflow-tooltip="true"
        :formatter="columnFormatter">
        <template slot-scope="scope">
          <el-link  v-if="item.prop === 'tablePreview'" @click="watchImg(scope.row)">预览</el-link>
          <div v-else>{{filterDist(scope.row[item.prop],item)}}</div>
        </template>
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
            <el-form-item label="图片上传" class="upImg" prop="imagePath">
              <i-file v-model="dialogFormData.imagePath"></i-file>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="slideshowNum">
              <el-input v-model.number="dialogFormData.slideshowNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期起" prop="startTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="dialogFormData.startTime" :picker-options="startDatePicker" value-format=" yyyy-MM-dd HH:mm" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期止" prop="endTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="dialogFormData.endTime" :picker-options="endDatePicker" value-format=" yyyy-MM-dd HH:mm" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品" prop="goodsId">
              <comm-select v-model="dialogFormData.goodsId"></comm-select>
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
import CommSelect from './comm-select.vue'

import req from '@/api/home-pic-manage.js'

export default {
  name: 'home-pic-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile,
    CommSelect
  },
  data () {
    return {
      startDatePicker: {
        disabledDate: time => {
          if (this.dialogFormData.endTime) { // payTimeEnd不为空时
            return time.getTime() > new Date(this.dialogFormData.endTime).getTime()
          }
        }
      },
      endDatePicker: {
        disabledDate: time => {
          if (this.dialogFormData.startTime) { // payTimeStart不为空时
            return time.getTime() < new Date(this.dialogFormData.startTime).getTime()
          }
        }
      },
      fileList: [],
      formData: {
        slideshowId: [],
        version: []
      },
      dialogFormData: {
      },
      dialogVisible: false,
      dialogtitle: '新增轮播图',
      options: [
        {label: '管理员', value: '1'},
        {label: '店长', value: '2'}
      ],
      commOptions: [
        {label: '启用', value: 1},
        {label: '禁用', value: 2}
      ],
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
            this.dialogVisible = true
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
              if (this.formData.slideshowId.length === 0) {
                this.$confirm('请至少选择一条数据').catch(() => {})
              } else {
                this.deleteOrderData()
              }
            }).catch(() => {})
          }
        },
        {
          btnName: '启用',
          type: 'primary',
          func: () => {
            this.formData.slideshowStateId = 1
            this.updatePicData()
          }
        },
        {
          btnName: '禁用',
          type: 'primary',
          func: () => {
            this.formData.slideshowStateId = 2
            this.updatePicData()
          }
        }
      ],
      columnList: [
        {label: '排序', prop: 'slideshowNum'},
        {label: '图片路径', prop: 'imagePath'},
        {label: '状态', prop: 'slideshowStateId', distName: 'commOptions'},
        {label: '预览', prop: 'tablePreview'},
        {label: '有效期起', prop: 'startTime'},
        {label: '有效期止', prop: 'endTime'}
      ],
      tableData: [],
      formRules: {
        imagePath: [
          {required: true, message: '请选择图片', trigger: 'change'}
        ],
        slideshowNum: [
          {required: true, message: '请输入序号', trigger: 'change'},
          { type: 'number', message: '轮播图排序必须为数字' }
        ],
        startTime: [
          {required: true, message: '请选择开始日期', trigger: 'change'}
        ],
        endTime: [
          {required: true, message: '请选择截止日期', trigger: 'change'}
        ],
        goodsId: [
          {required: true, message: '请选择商品', trigger: 'change'}
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
    // 修改轮播图状态
    updatePicData () {
      console.log(!this.formData.slideshowId)
      let selectSlideshowIds = this.formData.slideshowId.map(item => {
        return item
      }).toString()
      // let selectSlideshowStateIds = this.formData.slideshowStateId.map(item => {
      //   return item
      // }).toString()
      let selectVersions = this.formData.version.map(item => {
        return item
      }).toString()
      req('updatePic', {
        slideshowId: selectSlideshowIds,
        slideshowStateId: this.formData.slideshowStateId,
        version: selectVersions
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
    // 查询表格数据
    selectTableData () {
      req('getTableData', {
        ...this.dialogFormData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        console.log('获取表格')
        console.log(data)
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
    // 新增轮播图
    addTableData () {
      req('addPic', {
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
    // 删除
    deleteOrderData () {
      let selectSlideshowIds = this.formData.slideshowId.map(item => {
        return item
      }).toString()
      req('deletePic', {
        slideshowId: selectSlideshowIds
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
    // 图片预览
    watchImg (value) {
      window.open(value.imagePath)
    },
    filterDist (value, item) {
      // console.log('filter: ')
      // console.log(value)
      // console.log(item.distName)
      if (item.distName) {
        return this[item.distName].filter(distItem => {
          return distItem.value === value
        })[0].label
      } else {
        return value
      }
    },
    search () {
      console.log('search被点击')
      console.log(this.formData.slideshowStateId)
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
      this.formData.slideshowId = []
      this.formData.version = []
      if (rows.length !== 0) {
        for (let i = 0; i < rows.length; i++) {
          this.formData.slideshowId.push(rows[i].slideshowId)
          this.formData.version.push(rows[i].version)
        }
      }
    },
    dialogBeforClose () {
      console.log(this.$refs.form)
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.dialogVisible = false
    },
    dialogComfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('表单校验成功')
          console.log(this.dialogFormData)
          this.addTableData()
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
