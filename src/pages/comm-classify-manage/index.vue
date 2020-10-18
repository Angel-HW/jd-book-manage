<template>
  <div class="box">
    <div class="left-box">
      <div class="btn-list">
        <el-button
            v-for="(item,index) in options"
            @click="item.func"
            :key="index"
            :type="item.type">
            {{item.btnName}}
          </el-button>
      </div>

      <div class="tree-list">
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          @node-click="nodeClick"
          >
        </el-tree>
      </div>
    </div>

    <div class="right-box">
      <div class="title">分类详情</div>
      <div class="classify-content">
        <el-form :inline="true" :model="formData">
          <el-form-item label="分类名称" prop="classifyName">
            <el-input v-model="formData.classifyName"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="classifyComment">
            <el-input v-model="formData.classifyComment"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 弹出框 -->
    <i-dialog
      v-model="dialogVisible"
      :title="dialogtitle"
      @dialog-cancel="dialogCancel"
      @dialog-comfirm="dialogComfirm"
      @dialog-befor-close="dialogBeforClose"
      >

      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名称" prop="classifyName">
              <el-input v-model="dialogFormData.classifyName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="classifyComment">
              <el-input v-model="dialogFormData.classifyComment"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import IDialog from '@/components/common/i-dialog.vue'

import req from '@/api/comm-classify-manage.js'

export default {
  name: 'menu-manage',
  components: {
    IDialog
  },
  data () {
    return {
      dialogVisible: false,
      dialogtitle: '',
      dialogFormData: {},
      title: '',
      name: '',
      options: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogFormData = {}
            this.dialogtitle = '新增分类'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            this.dialogtitle = '修改分类'
            if (this.selectedNodeId.length === 0) {
              this.$confirm('请点击要修改的数据').catch(() => {})
            } else {
              this.dialogVisible = true
              this.getClassifyData()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            console.log(this.pageInfo)
            this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
              this.deleteClassifyData()
            }).catch(() => {})
          }
        },
        {
          btnName: '刷新',
          type: 'primary',
          func: () => {
            this.selectedNodeId = '-1'
            this.selectOneTableData()
          }
        }
      ],
      formData: {},
      classifyId: [],
      tableData: [
        {}
      ],
      defaultProps: {
        children: 'twoClassifyList',
        label: 'classifyName'
      },
      selectedNodeId: '-1',
      version: '',
      treeData: [],
      // 表单验证
      formRules: {
        classifyName: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        classifyComment: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.selectOneTableData()
  },
  methods: {
    nodeClick (data) {
      console.log('node')
      // console.log(this.selectedNodeId)
      console.log(data)
      // console.log(data.classifyId)
      this.selectedNodeId = data.classifyId
      if (data.classifyParent === '-1') {
        this.version = data.version
      } else {
        this.version = data.versionTow
      }
      console.log(this.version)
      this.getClassifyData()
    },
    // 查询商品分类列表
    selectOneTableData () {
      console.log(this.formData)
      this.formData = {}
      console.log(this.formData)
      req('getTableData', {
      }).then(data => {
        console.log('===')
        console.log(data)
        this.treeData = data.data
        this.treeData.forEach(item => {
          item.twoClassifyList = item.twoClassifyList.map(itemTwo => {
            return Object.assign({}, itemTwo, {classifyName: itemTwo.classifyTowName, classifyId: itemTwo.classifyTowId})
          })
        })
      })
    },
    // 新增
    addClassifyData () {
      req('addClassify', {
        ...this.dialogFormData,
        classifyParent: this.selectedNodeId
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
          this.selectOneTableData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 获取详情
    getClassifyData () {
      console.log(this.selectedNodeId)
      req('getClassify', {
        classifyId: this.selectedNodeId
      }).then(data => {
        // console.log(data)
        if (this.dialogtitle === '修改分类') {
          this.dialogFormData = data.data
        } else {
          this.formData = data.data
        }
      })
    },
    // 修改
    updateClassifyData () {
      req('updateClassify', {
        ...this.dialogFormData,
        classifyId: this.selectedNodeId,
        version: this.version
      }).then(data => {
        console.log(data)
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.$refs.form.resetFields()
          this.dialogVisible = false
          this.selectOneTableData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 删除
    deleteClassifyData () {
      req('deleteClassify', {
        classifyId: this.selectedNodeId
      }).then(data => {
        console.log(data)
        this.selectOneTableData()
      })
    },
    // 弹出框
    dialogBeforClose () {
      // console.log(this.$refs.form)
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogComfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('表单校验成功')
          if (this.dialogtitle === '新增分类') {
            this.addClassifyData()
          } else if (this.dialogtitle === '修改分类') {
            this.updateClassifyData()
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  margin: 10px;
  width: 90%;
  height: 400px;
  display: flex;
  border: 1px solid #dddddd;
  .left-box {
    text-align: center;
    width: 40%;
    border-right: 1px solid #dddddd;
    overflow: auto;
    .btn-list {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #dddddd;
    }

    .tree-list {
      padding-left: 30px;
      box-sizing: border-box;
    }
  }

  .right-box {
    width: 60%;
    text-align: center;
    .title {
      padding-left: 30px;
      box-sizing: border-box;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #dddddd;
    }
  }
}
// .el-dialog {
//   width: 200px;
// }
</style>
