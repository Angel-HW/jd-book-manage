<template>
  <div>
    <el-container>
      <el-header height="70px">
        <router-link to="">行走书店管理页面</router-link>
        <div class="user-info">
          <el-popover
            placement="top"
            trigger="hover">
            <el-button size="mini" type="text" @click="signOut">退出登录</el-button>
            <div slot="reference">
              <img v-show="role.userImage" :src="role.userImage" alt="">
              <img v-show="!role.userImage" src="../assets/u18.jpg" alt="">
              <span>{{role.userName}}</span>
              <!-- <img src="../assets/u18.jpg" alt="">
              <span>admin</span> -->
            </div>
          </el-popover>

        </div>
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu @select="handlerSelect">
            <el-menu-item v-for="(item,index) in menuList" :index="item.menuUrl" :key="index">
              <span slot="title">{{item.menuName}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
import req from '@/api/home.js'

export default {
  name: 'home',
  data () {
    return {
      menuList: [
        {title: '用户管理', path: '/user-manage'},
        {title: '菜单管理', path: '/menu-manage'},
        {title: '商品管理', path: '/comm-manage'},
        {title: '首页轮播图管理', path: '/home-pic-manage'},
        {title: '商品分类管理', path: '/comm-classify-manage'},
        {title: '客户管理', path: '/client-manage'},
        {title: '订单管理', path: '/order-manage'},
        {title: '热门商品管理', path: '/hot-comm-manage'},
        {title: '门店信息管理', path: '/shop-info-manage'},
        {title: '司机信息管理', path: '/driver-info-manage'}
      ]
    }
  },
  mounted () {
    this.getMenu()
  },
  computed: {
    role () {
      return JSON.parse(sessionStorage.getItem('roleInfo'))
    }
  },
  methods: {
    // 获取菜单
    getMenu () {
      req('getMenu', {
        role: JSON.parse(sessionStorage.getItem('roleInfo')).role
      }).then(data => {
        // console.log('menu')
        // console.log(data)
        this.menuList = data.data
      })
    },
    // 退出登录
    signOut () {
      // sessionStorage.clear('roleInfo')
      this.$router.replace({path: 'login'})
      sessionStorage.clear('userInfo')
      sessionStorage.clear('roleInfo')
    },
    handlerSelect (key, path) {
      if (key !== this.$route.path) {
        this.$router.replace({path: key})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(238,238,238);
  .router-link-active {
    font-size: 25px;
    color: #409EFF;
    text-decoration: none;
  }
  .user-info {
    display: flex;
    align-items: center;
    height: 100%;
    img {
      margin-right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    .el-popover__reference {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
.el-main {
  padding: 0px;
}
</style>
