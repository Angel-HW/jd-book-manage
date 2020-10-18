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

      <div class="menu-list">
        <el-menu style="border: 0">
            <el-menu-item
              v-for="(item,index) in menuList"
              :index="item.menuUrl"
              :key="index"
              @click="getMenuId(item.menuId)"
              style="height: 30px; line-height: 30px">
              <span>{{item.menuName}}</span>
            </el-menu-item>
          </el-menu>
      </div>
    </div>

    <div class="right-box">
      <div class="title">菜单详情</div>
      <div class="menu-content">
        <el-form :inline="true">
          <el-form-item label="菜单名称" prop="menuName" label-width="70px">
            <el-input v-model="formData.menuName"></el-input>
          </el-form-item>
          <el-form-item label="菜单路由" prop="menuUrl" label-width="70px">
            <el-input v-model="formData.menuUrl"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="menuRemark" label-width="70px">
            <el-input v-model="formData.menuRemark"></el-input>
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
            <el-form-item label="名称" prop="menuName">
              <el-input v-model="dialogFormData.menuName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路径" prop="menuUrl">
              <el-input v-model="dialogFormData.menuUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="menuRemark">
              <el-input v-model="dialogFormData.menuRemark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import IDialog from '@/components/common/i-dialog.vue'

import req from '@/api/menu-manage.js'

export default {
  name: 'menu-manage',
  components: {
    IDialog
  },
  data () {
    return {
      dialogVisible: false,
      dialogtitle: '',
      dialogFormData: {
      },
      formData: {},
      testTwoOptions: [
        {label: '菜单', value: '1'},
        {label: '目录', value: '2'}
      ],
      menuId: '',
      options: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogtitle = '新增菜单'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            this.dialogtitle = '修改菜单'
            if (!this.menuId) {
              this.$confirm('请点击要修改的数据').catch(() => {})
            } else {
              this.dialogVisible = true
              this.getMenuData()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            console.log(this.pageInfo)
            this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
              this.deleteMenuData()
            }).catch(() => {})
          }
        },
        {
          btnName: '刷新',
          type: 'primary',
          func: () => {
            this.selectMenuData()
          }
        }
      ],
      menuData: [
        {}
      ],
      menuList: [
      ],
      // 表单验证
      formRules: {
        test1: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ],
        test2: [
          {required: true, message: '请输入活动名称', trigger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.selectMenuData()
  },
  methods: {
    getMenuId (value) {
      this.menuId = value
      this.getMenuData()
    },
    // 获取菜单
    selectMenuData () {
      req('getMenuTable', {
        ...this.formData
      }).then(data => {
        console.log(data)
        this.menuList = data.data
      })
    },
    // 获取详情
    getMenuData () {
      console.log(!this.menuId)
      req('getMenu', {
        menuId: this.menuId
      }).then(data => {
        // console.log(data)
        this.formData = data.data
        if (this.dialogtitle === '修改菜单') {
          this.dialogFormData = data.data
        }
      })
    },
    // 修改
    updateMenuData () {
      req('updateMenu', {
        ...this.formData,
        menuId: this.menuId
      }).then(data => {
        console.log(data)
        this.dialogVisible = false
        this.selectMenuData()
      })
    },
    // 新增
    addMenuData () {
      req('addMenu', {
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
          this.selectMenuData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 删除
    deleteMenuData () {
      console.log(this.menuId)
      req('deleteMenu', {
        menuId: this.menuId
      }).then(data => {
        // console.log(data)
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: data.msg
          })
          this.selectMenuData()
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 弹出框
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
          console.log('表单校验成功')
          if (this.dialogtitle === '新增菜单') {
            this.addMenuData()
          } else if (this.dialogtitle === '修改菜单') {
            this.updateMenuData()
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
  display: flex;
  border: 1px solid #dddddd;
  .left-box {
    text-align: center;
    width: 40%;
    border-right: 1px solid #dddddd;

    .btn-list {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #dddddd;
    }

    .menu-list {
      padding-left: 30px;
      box-sizing: border-box;
    }
  }

  .right-box {
    width: 60%;
    // text-align: center;
    .title {
      padding-left: 30px;
      box-sizing: border-box;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #dddddd;
    }
  }
}
</style>
