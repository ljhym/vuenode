<template>
  <div class="loginlei">
    <div class="loginbox">
      <div class="avatar">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginref"
        :model="loginform"
        :rules="loginrules"
        label-width="0px"
        class="loginf"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginform.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginform.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button @click="denlu" type="primary">登录</el-button>
          <el-button @click="czhi" type="info">重置</el-button>
        </el-form-item>
        <!-- 按钮 -->
      </el-form>
      <!-- 表单区域 -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginform: {
        username: '李狗蛋',
        password: '123456'
      },
      loginrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    denlu: function() {
      this.$refs.loginref.validate(
        async valid => {
          if (!valid) return
          const { data: res } = await this.$http.post('/login', this.loginform)
          // console.log(res)
          // console.log(res.mess)
          // console.log(res.token)
          if (res.mess === '登录失败') {
            return this.$message.error('登录失败')
          } else if (res.mess === '登录成功') {
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token', res.token)
            this.$router.push('/home')
          }
        },
        {
          withCredentials: true
        }
      )
    },
    czhi: function() {
      // console.log(this)
      this.$refs.loginref.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.loginlei {
  background-color: #ccc;
  height: 100%;
}
.loginbox {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  /* 绝对定位 */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  background-color: #fff;
}
.avatar .img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.loginf {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
