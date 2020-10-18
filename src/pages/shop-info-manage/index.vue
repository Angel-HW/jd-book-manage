<template>
  <div>
    <!-- 搜索 -->
    <i-search ref="iSearch" :model="formData" @search="search" @reset="reset">
      <div class="i-search-div">
        <el-form-item label="门店编号" prop="storeId">
          <el-input v-model="formData.storeId"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="formData.storeName"></el-input>
        </el-form-item>
      </div>
      <div class="i-search-div">
        <el-form-item label="店长名称" prop="userName">
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

      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="110px" :disabled="false">
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店名称" prop="storeName">
              <el-input v-model="dialogFormData.storeName" :disabled="this.dialogtitle === '门店详情'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model.number="dialogFormData.phone" :disabled="this.dialogtitle === '门店详情'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店长编号" prop="userId">
              <el-input v-model="dialogFormData.userId" :disabled="this.dialogtitle === '门店详情'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照编码" prop="businessCode">
              <el-input v-model="dialogFormData.businessCode" :disabled="this.dialogtitle === '门店详情'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在省份" prop="provinceId">
              <el-select  v-model="dialogFormData.provinceId" @change="getListCityData" :disabled="this.dialogtitle === '门店详情'">
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
              <el-select  v-model="dialogFormData.cityId" @change="getListAreaData" :disabled="this.dialogtitle === '门店详情'">
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
              <el-select  v-model="dialogFormData.areaId" :disabled="this.dialogtitle === '门店详情'">
                <el-option
                  v-for="(item, index) in areaOptions"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="address">
              <el-input type="textarea" v-model="dialogFormData.address" :disabled="this.dialogtitle === '门店详情'"></el-input>
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

import req from '@/api/shop-info-manage.js'

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
        // storeId: []
      },
      rowsStoreId: [],
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
            this.dialogtitle = '门店详情'
            if (this.rowsStoreId.length === 0) {
              this.$confirm('请至少选择一条数据').catch(() => {})
            } else if (this.rowsStoreId.length !== 1) {
              this.$confirm('请不要多选').catch(() => {})
            } else {
              this.dialogVisible = true
              this.getStoreData()
            }
          }
        },
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogtitle = '新增门店'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            this.dialogtitle = '修改门店'
            if (this.rowsStoreId.length === 0) {
              this.$confirm('请至少选择一条数据').catch(() => {})
            } else if (this.rowsStoreId.length !== 1) {
              this.$confirm('请不要多选').catch(() => {})
            } else {
              this.dialogVisible = true
              this.getStoreData()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
              if (this.rowsStoreId.length === 0) {
                this.$confirm('请至少选择一条数据').catch(() => {})
              } else {
                this.deleteStoreData()
              }
            }).catch(() => {})
          }
        }
      ],
      columnList: [
        {label: '门店编号', prop: 'storeId'},
        {label: '门店名称', prop: 'storeName'},
        {label: '电话', prop: 'phone'},
        {label: '详细地址', prop: 'address'},
        {label: '店长姓名', prop: 'userName'},
        {label: '邀请码', prop: 'inviteCode'},
        {label: '门店账号', prop: 'userAcct'}
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
        storeName: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        phone: [
          {required: true, message: '请输入活动名称', trigger: 'change'},
          {type: 'number', message: '请输入数字', trigger: 'change'}
        ],
        userId: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        businessCode: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        provinceId: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        cityId: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        areaId: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        address: [
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
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
    },
    // 获取省级下拉框
    getListProvinceData () {
      req('getListArea', {
        areaId: 0
      }).then(data => {
        console.log(data)
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
      req('getListArea', {
        areaId: value
      }).then(data => {
        // console.log(data)
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
      req('getListArea', {
        areaId: value
      }).then(data => {
        // console.log(data)
        this.areaOptions = data.data.list.map(item => {
          return Object.assign({}, item)
        })
      })
    },
    // 分页查询
    selectTableData () {
      req('getTableData', {
        ...this.formData,
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
    // 门店详情
    getStoreData () {
      req('getStore', {
        storeId: this.rowsStoreId[0]
      }).then(data => {
        console.log(data)
        this.getListCityData(data.data.provinceId)
        this.getListAreaData(data.data.cityId)
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    // 修改
    updateStoreData () {
      console.log(this.dialogFormData)
      console.log(this.dialogFormData.version[0])
      console.log(this.rowsStoreId[0])
      req('updateStore', {
        ...this.dialogFormData
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
    // 新增
    addStoreData () {
      console.log(this.dialogFormData)
      req('addStore', {
        ...this.dialogFormData
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
    // 删除
    deleteStoreData () {
      let selectStoreIds = this.rowsStoreId.map(item => {
        return item
      }).toString()
      console.log(selectStoreIds)
      req('deleteStore', {
        storeId: selectStoreIds
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
      console.log(rows)
      this.rowsStoreId = []
      if (rows.length !== 0) {
        for (let i = 0; i < rows.length; i++) {
          this.rowsStoreId.push(rows[i].storeId)
        }
      }
    },
    dialogBeforClose () {
      console.log(this.$refs.form)
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
          if (this.dialogtitle === '修改门店') {
            this.updateStoreData()
          } else if (this.dialogtitle === '新增门店') {
            this.addStoreData()
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
