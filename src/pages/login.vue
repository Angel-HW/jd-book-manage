<template>
  <div class="main">
    <el-form class="form">
      <p>请登录</p>
      <div :model="formData">
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </div>
      <el-button type="primary" @click="login">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
const qs = require('qs')

export default {
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
      axios({
        method: 'post',
        url: 'http://309m2t0120.wicp.vip/uaa/auth/form',
        data: qs.stringify(this.formData),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;'
        }
      }).then(data => {
        console.log('login')
        console.log(data)
        if (data.data.code === 0) {
          this.$message({
            type: 'success',
            message: data.data.msg
          })

          sessionStorage.setItem('userInfo', JSON.stringify(data.data.data))
          this.getHeader(data.data.data.access_token)
          // setTimeout(() => {
          //   this.$router.push({path: '/home'})
          // }, 2000)
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    },
    getHeader (token) {
      axios({
        method: 'post',
        url: 'http://309m2t0120.wicp.vip/pc/topOfColumn/getTopOfColumn',
        data: qs.stringify({access_token: token}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;'
        }
      }).then(data => {
        console.log('getHeader')
        console.log(data)
        if (data.data.code === 0) {
          sessionStorage.setItem('roleInfo', JSON.stringify(data.data.data))
          if (data.data.data.role === '2') {
            this.$router.push({path: '/client-manage'})
          } else {
            this.$router.push({path: '/home'})
          }
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  width: 100%;
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: #5089fb;
  background: url("../assets/u0.jpg") no-repeat;
  background-size: 100% 100%;
}
.form {
  position: absolute;
  right: 50px;
  width: 400px;
  height: 250px;
  // border: 1px solid #000000;
  background-color: rgba(255,255,255,0.2);
  text-align: center;
}
.el-input {
  width: 80%;
  margin-bottom: 20px;
  /deep/ .el-input__inner {
    border-radius: 15px;
  }
}
.el-button {
  width: 150px;
  height: 35px;
  border-radius: 10px;
}
</style>
