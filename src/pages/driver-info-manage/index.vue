<template>
  <div>
    <!-- 搜索 -->
    <i-search ref="iSearch" :model="formData" @search="search" @reset="reset">
      <div class="i-search-div">
        <el-form-item label="司机编号" prop="driverId">
          <el-input v-model="formData.driverId"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="司机姓名" prop="userName">
          <el-input v-model="formData.userName"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="所在省份" prop="provinceId">
          <el-select  v-model="formData.provinceId" @change="getListCityData">
            <el-option
              v-for="(item, index) in provinceOptions"
              :key="index"
              :label="item.areaName"
              :value="item.areaId">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="所在城市" prop="cityId">
          <el-select  v-model="formData.cityId" @change="getListAreaData">
            <el-option
              v-for="(item, index) in cityOptions"
              :key="index"
              :label="item.areaName"
              :value="item.areaId">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="所在区" prop="areaId">
          <el-select  v-model="formData.areaId">
            <el-option
              v-for="(item, index) in areaOptions"
              :key="index"
              :label="item.areaName"
              :value="item.areaId">
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
        align="center">
      </el-table-column>
    </i-table>
    <!-- 弹出框 -->
    <i-dialog
      v-model="dialogVisible"
      :title="dialogtitle"
      @dialog-cancel="dialogCancel"
      @dialog-comfirm="dialogComfirm"
      @dialog-befor-close="dialogBeforClose">

      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="司机姓名" prop="userName">
              <el-input v-model="dialogFormData.userName" :disabled="this.dialogtitle === '司机详情'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model.number="dialogFormData.phone" :disabled="this.dialogtitle === '司机详情'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="司机账号" prop="userAcct">
              <el-input v-model="dialogFormData.userAcct" :disabled="this.dialogtitle === '司机详情'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="userPassword">
              <el-input type="password" v-model="dialogFormData.userPassword" :disabled="this.dialogtitle === '司机详情'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="dialogFormData.idCard" :disabled="this.dialogtitle === '司机详情'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在省份" prop="provinceId">
              <el-select  v-model="dialogFormData.provinceId" @change="getListCityData" :disabled="this.dialogtitle === '司机详情'">
                <el-option
                  v-for="(item, index) in provinceOptions"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在城市" prop="cityId">
              <el-select  v-model="dialogFormData.cityId" @change="getListAreaData" :disabled="this.dialogtitle === '司机详情'">
                <el-option
                  v-for="(item, index) in cityOptions"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在区" prop="areaId">
              <el-select  v-model="dialogFormData.areaId" :disabled="this.dialogtitle === '司机详情'">
                <el-option
                  v-for="(item, index) in areaOptions"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaId">
                </el-option>
              </el-select>
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

import req from '@/api/driver-info-manage.js'

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
        areaId: '',
        userName: '',
        userCount: '',
        part: ''
      },
      dialogFormData: {
        cityId: '',
        areaId: ''
      },
      rowsDriverId: [],
      dialogVisible: false,
      dialogtitle: '',
      provinceOptions: [],
      cityOptions: [],
      areaOptions: [],
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
            this.dialogtitle = '司机详情'
            if (this.rowsDriverId.length === 0) {
              this.$confirm('请至少选择一条数据').catch(() => {})
            } else if (this.rowsDriverId.length !== 1) {
              this.$confirm('请不要多选').catch(() => {})
            } else {
              this.dialogVisible = true
              this.getDriverData()
            }
          }
        },
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogtitle = '新增司机'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            this.dialogtitle = '修改司机'
            if (this.rowsDriverId.length === 0) {
              this.$confirm('请至少选择一条数据').catch(() => {})
            } else if (this.rowsDriverId.length !== 1) {
              this.$confirm('请不要多选').catch(() => {})
            } else {
              this.getDriverData()
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
              // console.log(111)
              if (this.rowsDriverId.length === 0) {
                this.$confirm('请至少选择一条数据').catch(() => {})
              } else {
                console.log('delete')
                this.deleteDriverData()
              }
            }).catch(() => {})
          }
        }
      ],
      columnList: [
        {label: '司机编号', prop: 'driverId'},
        {label: '姓名', prop: 'userName'},
        {label: '手机', prop: 'phone'},
        {label: '身份证', prop: 'idCard'},
        {label: '账号', prop: 'userAcct'}
      ],
      tableData: [
        // {test1: '1', test2: '2', test3: '3', test4: '4', test5: '5', test6: '6'},
        // {test1: '1', test2: '2', test3: '3', test4: '4', test5: '5', test6: '6'},
        // {test1: '1', test2: '2', test3: '3', test4: '4', test5: '5', test6: '6'},
        // {test1: '1', test2: '2', test3: '3', test4: '4', test5: '5', test6: '6'},
        // {test1: '1', test2: '2', test3: '3', test4: '4', test5: '5', test6: '6'},
        // {test1: '1', test2: '2', test3: '3', test4: '4', test5: '5', test6: '6'},
        // {test1: '1', test2: '2', test3: '3', test4: '4', test5: '5', test6: '6'},
        // {test1: '1', test2: '2', test3: '3', test4: '4', test5: '5', test6: '6'}
      ],
      formRules: {
        userName: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        phone: [
          {required: true, message: '请输入活动名称', trigger: 'change'},
          {type: 'number', message: '请输入数字', trigger: 'change'}
        ],
        userAcct: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        userPassword: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        idCard: [
          {required: true, message: '请输入活动名称', trigger: 'change'},
          { validator: this.validateIdCard, trigger: 'change' }
        ],
        provinceId: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        cityId: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        areaId: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.selectTableData()
    this.getListProvinceData()
  },
  computed: {
  },
  methods: {
    // 身份验证
    validateIdCard (rule, value, callback) {
      let reg = /\d+[0-9Xx]$/
      // console.log(reg.test(value))
      if (!reg.test(value)) {
        callback(new Error('请输入正确格式的身份证号(数字+X/x)'))
      } else {
        callback()
      }
    },
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
    },
    // 获取省级下拉框
    getListProvinceData () {
      req('getArea', {
        areaId: 0
      }).then(data => {
        // console.log(data)
        this.provinceOptions = data.data.list.map(item => {
          return Object.assign({}, item)
        })
      })
    },
    // 获取市级下拉框
    getListCityData (value) {
      this.dialogFormData.cityId = ''
      this.dialogFormData.areaId = ''
      this.formData.cityId = ''
      this.formData.areaId = ''
      this.cityOptions = []
      this.areaOptions = []
      req('getArea', {
        areaId: value
      }).then(data => {
        console.log(data)
        this.cityOptions = data.data.list.map(item => {
          // console.log(item)
          return Object.assign({}, item)
        })
      })
    },
    // 获取区级下拉框
    getListAreaData (value) {
      this.dialogFormData.areaId = ''
      this.formData.areaId = ''
      this.areaOptions = []
      req('getArea', {
        areaId: value
      }).then(data => {
        console.log(data)
        this.areaOptions = data.data.list.map(item => {
          // console.log(item)
          return Object.assign({}, item)
        })
      })
    },
    // 分页信息
    selectTableData () {
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        // console.log(data)
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    // 新增
    addDriverData () {
      req('addDriver', {
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
    // 详情
    getDriverData () {
      req('getDriver', {
        driverId: this.rowsDriverId[0]
      }).then(data => {
        console.log('get:')
        console.log(data)
        this.getListCityData(data.data.provinceId)
        this.getListAreaData(data.data.cityId)
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    // 修改
    updateDriverData () {
      req('updateDriver', {
        ...this.dialogFormData,
        driverId: this.rowsDriverId[0]
      }).then(data => {
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
    // 删除
    deleteDriverData () {
      let tableDriverIds = this.rowsDriverId.map(item => {
        return item
      }).toString()
      console.log('delete2')
      req('deleteDriver', {
        driverId: tableDriverIds
      }).then(data => {
        // console.log(data)
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
      this.cityOptions = []
      this.areaOptions = []
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
      this.rowsDriverId = []
      if (rows.length !== 0) {
        for (let i = 0; i < rows.length; i++) {
          this.rowsDriverId.push(rows[i].driverId)
        }
      }
    },
    dialogBeforClose () {
      this.cityOptions = []
      this.areaOptions = []
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.cityOptions = []
      this.areaOptions = []
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogComfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('表单校验成功')
          if (this.dialogtitle === '司机详情') {
            this.$refs.form.resetFields()
            this.dialogVisible = false
          } else if (this.dialogtitle === '修改司机') {
            this.updateDriverData()
          } else if (this.dialogtitle === '新增司机') {
            this.addDriverData()
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
.i-search {
  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    .i-search-div {
      width: 30%;
    }
  }
}
.el-select {
  width: 100%;
}
</style>
