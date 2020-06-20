<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索添加区域 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表展示区 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="userstatechange(scope.row.mg_state,scope.row._id)"
              :value="scope.row._id"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <div>
              <!-- 修改删除编辑按钮 -->
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showeditdialog(scope.row._id)"
              ></el-button>
              <!-- 删除用户按钮 -->
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="removeuserbyid(scope.row._id)"
              ></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-setting"
                  @click="setrole(scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="提添加用户" :visible.sync="dialogVisible" width="50%" @close="adddialogclose">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addformrules" ref="addFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 以上是添加用户对话框 -->
    <!-- 以下是修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editdialogvisible" width="50%" close="editdialogclose">
      <el-form :model="editform" :rules="editformrules" ref="editformref" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogvisible=false">取 消</el-button>
        <el-button type="primary" @click="edituserinfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 以上是修改用户对话框 -->
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setroledialogVisible" width="50%" @close="setroleclose">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectroid" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.roleName"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setroledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveroleinfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(1[0-9][0-9]|15[0123456789]|17[678]18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框隐藏
      dialogVisible: false,
      // 添加用户的表单数据集
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单验证规则
      addformrules: {
        // 失去焦点触发trigger: 'blur'
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '密码长度在6~12个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户对话框的隐藏和显示
      editdialogvisible: false,
      editform: {},
      editformrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色显示隐藏
      setroledialogVisible: false,
      // 分配角色的信息
      userInfo: {},
      rolesList: {},
      // 选着的ID
      selectroid: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList: async function() {
      const res = await this.$http.get('/users', {
        params: this.queryInfo
      })
      // console.log(res)
      // console.log(res.data)
      if (res.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userstatechange(userinfo, id) {
      const Params = { userinfo, id }
      const Response = await this.$http.put(
        `/upusers/${id}/state/${userinfo}`,
        { params: Params }
      )
      // console.log(Response)
      if (Response.status !== 200) {
        // userinfo = !userinfo
        return this.$message.error('用户更新失败')
      }
      this.$message.success('用户更新成功')
    },
    // 监听对话框是否关闭
    adddialogclose() {
      this.$refs.addFormref.resetFields()
    },
    // 点击添加新用户
    adduser() {
      this.$refs.addFormref.validate(async valid => {
        // console.log(valid)
        if (!valid) {
          return
        }
        const res = await this.$http.post(
          '/users',
          this.addForm
        )
        if (res.status !== 200) {
          return this.$message.error('用户添加失败！')
        }
        this.$message.success('用户添加成功！')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    async showeditdialog(id) {
      this.editdialogvisible = true
      // console.log(id)
      const res = await this.$http.get('/users/' + id)
      if (res.status !== 200) {
        return this.$message.error('用户查询失败！')
      }
      this.editform = res.data[0]
      // console.log(this.editform)
    },
    editdialogclose() {
      this.$refs.editformref.resetFields()
    },
    edituserinfo() {
      this.$refs.editformref.validate(async valid => {
        // console.log(valid)
        if (!valid) {
          return
        }
        const res = await this.$http.put(
          '/users/' + this.editform._id,
          { email: this.editform.email, mobile: this.editform.mobile }
        )
        // console.log(res)
        if (res.status !== 200) {
          return this.$message.error('用户更新失败！')
        }
        this.editdialogvisible = false
        this.getUserList()
        this.$message.success('用户更新成功！')
      })
    },
    async removeuserbyid(id) {
      // console.log(id)
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('用户已删除！')
      const data = await this.$http.delete('/users/' + id)
      // console.log(data)
      if (data.status !== 200) {
        return this.$message.error('用户删除失败！')
      }
      this.getUserList()
      this.$message.success('用户删除成功！')
    },
    // 分配用户角色功能
    async setrole(userinfo) {
      this.userInfo = userinfo
      console.log(userinfo)
      const data = await this.$http.get('/roles')
      // console.log(data)
      if (data.status !== 200) {
        return this.$message.error('用户获取失败！')
      }
      this.rolesList = data.data
      console.log(data.data)
      this.setroledialogVisible = true
    },
    async saveroleinfo() {
      if (!this.selectroid) {
        return this.$message.error('请选择角色！')
      }
      const data = await this.$http.put('/user/up/role', {
        rid: this.selectroid,
        bid: this.userInfo._id
      })
      if (data.status !== 200) {
        return this.$message.error('用户更新失败！')
      }
      // console.log(data)
      this.getUserList()
      this.setroledialogVisible = false
    },
    setroleclose() {
      this.selectroid = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
