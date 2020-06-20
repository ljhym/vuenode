<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/tpl.jpg" alt />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
      <!-- <el-button type="info" @click="checklogin">检测</el-button> -->
    </el-header>
    <!-- 头部区域 -->
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <div>
          <!-- default-active="users" -->
          <el-menu background-color="#333744" text-color="#fff" router>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="users">
                <i class="el-icon-menu"></i>
                <span slot="title">用户列表</span>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-tools"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="roles">
                <i class="el-icon-menu"></i>
                <span slot="title">角色列表</span>
              </el-menu-item>
              <el-menu-item index="rights">
                <i class="el-icon-menu"></i>
                <span slot="title">权限列表</span>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-shopping-cart-full"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="goods">
                <i class="el-icon-menu"></i>
                <span slot="title">商品列表</span>
              </el-menu-item>
              <el-menu-item index="params">
                <i class="el-icon-menu"></i>
                <span slot="title">商品参数</span>
              </el-menu-item>
              <el-menu-item index="categories">
                <i class="el-icon-menu"></i>
                <span slot="title">商品分类</span>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-edit-outline"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="order">
                <i class="el-icon-menu"></i>
                <span slot="title">订单列表</span>
              </el-menu-item>
            </el-submenu>

            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-s-data"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item index="report">
                <i class="el-icon-menu"></i>
                <span slot="title">数据报表</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <!-- 侧边栏 -->
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- welcome占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 页面主体 -->
  </el-container>
</template>

<script>
export default {
  created() {
    this.getmenulist()
  },
  methods: {
    loginout: function() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getmenulist: async function() {
      // const { data: res } = await this.$http.get('/menus')
      // console.log(res)
    },
    checklogin: async function() {
      const tsk = window.sessionStorage.getItem('token')
      const tts = { tbk: tsk }
      const { data: res } = await this.$http.post('/checklogin', tts)
      console.log(res)
      console.log(res.mess)
      console.log(tsk)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 30px;
  /* float: left; */
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-header div {
  display: flex;
  align-items: center;
  color: #fff;
}
.el-header div img {
  width: 60px;
  border-radius: 60px;
  margin-right: 15px;
}
</style>
