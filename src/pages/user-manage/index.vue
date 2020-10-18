<template>
  <div>
    <!-- 搜索 -->
    <i-search
      ref="iSearch"
      :model="formData"
      @search="search"
      @reset="reset">

      <el-form-item label="用户名" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="用户账号" prop="userAcct">
        <el-input v-model="formData.userAcct"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select  v-model="formData.role" placeholder="请选择">
          <el-option
            v-for="(item, index) in roleOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
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

    <i-dialog
      v-model="dialogVisible"
      :title="dialogtitle"
      @dialog-cancel="dialogCancel"
      @dialog-comfirm="dialogComfirm"
      @dialog-befor-close="dialogBeforClose">

      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号" prop="userAcct">
              <el-input v-model="dialogFormData.userAcct" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="dialogFormData.userName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="sex">
              <el-select  v-model="dialogFormData.sex" placeholder="请选择">
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model.number="dialogFormData.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户邮箱" prop="mail">
              <el-input v-model="dialogFormData.mail" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="dialogFormData.idCard" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="userPassword">
              <el-input type="password" v-model="dialogFormData.userPassword" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户角色" prop="role">
              <el-select v-model="dialogFormData.role" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片上传" class="upImg" prop="imagePath">
              <i-file v-model="dialogFormData.imagePath"></i-file>
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

import req from '@/api/user-manage.js'

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
      imagePath: '',
      fileList: [],
      formData: {
        userAcct: '',
        userName: '',
        role: ''
      },
      dialogFormData: {
        // userId: []
      },
      rowsUserId: [],
      dialogVisible: false,
      selectNum: 0,
      dialogtitle: '',
      roleOptions: [
        {label: '管理员', value: '1'},
        {label: '店长', value: '2'},
        {label: '司机', value: '3'},
        {label: '客户', value: '4'}
      ],
      options: [
        {label: '管理员', value: '1'},
        {label: '店长', value: '2'},
        {label: '司机', value: '3'},
        {label: '客户', value: '4'}
      ],
      sexOptions: [
        {label: '男', value: 0},
        {label: '女', value: 1}
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
            this.dialogtitle = '新增用户'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.rowsUserId.length === 0) {
              this.$confirm('请选择要修改的数据').catch(() => {})
            } else if (this.rowsUserId.length !== 1) {
              this.$confirm('请不要选择多条数据').catch(() => {})
            } else {
              this.dialogtitle = '修改用户'
              this.dialogVisible = true
              this.selectUserData()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
              if (this.rowsUserId.length === 0) {
                this.$confirm('请至少选择一条数据').catch(() => {})
              } else {
                this.deleteUserData()
              }
            }).catch(() => {})
          }
        }
      ],
      columnList: [
        {label: '编号', prop: 'userId'},
        {label: '账号', prop: 'userAcct'},
        {label: '姓名', prop: 'userName'},
        {label: '角色', prop: 'role', distName: 'roleOptions'},
        {label: '性别', prop: 'sex', distName: 'sexOptions'},
        {label: '手机', prop: 'phone'},
        {label: '邮箱', prop: 'mail'},
        {label: '身份证', prop: 'idCard'}
      ],
      tableData: [],
      // 表单校验
      formRules: {
        // 用户账号
        userAcct: [
          {required: true, message: '请输入用户账号', trigger: 'change'}
        ],
        userName: [
          {required: true, message: '请输入用户名称', trigger: 'change'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        phone: [
          {required: true, message: '请输入正确的手机号', trigger: 'change'},
          {type: 'number', message: '请输入数字', trigger: 'change'}
        ],
        mail: [
          {required: true, message: '请输入正确的邮箱', trigger: 'change'}
        ],
        idCard: [
          {required: true, message: '请输入正确的身份证号码', trigger: 'change'},
          { validator: this.validateIdCard, trigger: 'change' }
        ],
        userPassword: [
          {required: true, message: '请输入密码', trigger: 'change'}
        ],
        role: [
          {required: true, message: '请选择角色', trigger: 'change'}
        ],
        imagePath: [
          {required: true, message: '请选择图片', trigger: 'change'}
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
    // 身份验证
    validateIdCard (rule, value, callback) {
      let reg = /\d+[0-9Xx]$/

      console.log(reg.test(value))

      if (!reg.test(value)) {
        callback(new Error('请输入正确格式的身份证号(数字+X/x)'))
      } else {
        callback()
      }
    },
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      // this.selectTableData()
    },
    // 查询用户
    selectTableData () {
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    // 查询用户详情
    selectUserData () {
      req('getUserData', {
        ...this.dialogFormData,
        userId: this.rowsUserId[0]
      }).then(data => {
        let tableList = data.data
        this.dialogFormData = Object.assign({}, tableList)
      })
    },
    // 新增用户
    addUserData () {
      console.log(this.dialogFormData)
      req('addTableData', {
        ...this.dialogFormData
      }).then(data => {
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
    // 修改用户
    updateUserData () {
      req('updateTableData', {
        ...this.dialogFormData
      }).then(data => {
        // console.log('updata:')
        // console.log(data)
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
    // 删除用户
    deleteUserData () {
      let tableUserIds = this.rowsUserId.map(item => {
        return item
      }).toString()
      req('deleteTableData', {
        userId: tableUserIds
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
    search () {
      console.log('search被点击')
      this.fetch()
      console.log(this.formData)
      this.selectTableData()
    },
    reset () {
      this.fetch()
      this.selectTableData()
    },
    handleSizeChange (pageSize) {
      this.pageInfo.pageSize = pageSize
      this.pageInfo.pageNum = 1
      this.selectTableData()
      console.log('每页条数：' + pageSize)
    },
    handleCurrentChange (pageNum) {
      this.pageInfo.pageNum = pageNum
      this.selectTableData()
      console.log('页数：' + pageNum)
    },
    handleselectionChange (rows) {
      this.rowsUserId = []
      if (rows.length !== 0) {
        for (let i = 0; i < rows.length; i++) {
          this.rowsUserId.push(rows[i].userId)
        }
      }
    },
    dialogBeforClose () {
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogComfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogtitle === '新增用户') {
            this.addUserData()
          } else {
            this.updateUserData()
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
.el-form {
  .el-row {
    .el-col {
      .el-form-item {
        .el-input {
          width: 100%;
        }
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>
