<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-col>
        <el-button type="primary" @click="addtip=true,editrolesdialogVisible= true">添加角色</el-button>
      </el-col>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- el-roe栅格系统一共24列 -->
            <el-row
              :class="['vcenter', 'bdbottom', i1===0?'bdtop' : '']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              v-show="item1.falg"
            >
              <!-- 第一个el-col占5列渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  :iid1="1"
                  @close="removebtid(scope.row.id, iid1,  item1.id, item1.falg, scope.row.id, scope.row)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限占19列 -->
              <el-col :span="19">
                <!-- 二级三权限 -->
                <el-row
                  :class="[i2===0?'' : 'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  v-show="item2.falg"
                >
                  <!-- 二级权限占6列 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      :iid2="2"
                      @close="removebtid(scope.row.id, iid2,  item2.id, item2.falg, item1.id, scope.row)"
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限占18列 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      :iid3="3"
                      @close="removebtid(scope.row.id, iid3,  item3.id, item3.falg, item2.id, scope.row)"
                      type="warning"
                      :class="[i3===0?'' : 'bdtop']"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      v-show="item3.falg"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editroles(scope.row)"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteroles(scope.row)"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showsetrightdialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setrightdialogVisible" width="50%" @close="setdiaclose">
      <!-- 树形控件 -->
      <el-tree
        :data="rightstree"
        :props="treeprop"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="defkey"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setrightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 树形控件 -->
    <!-- 编辑用户对话框 -->
    <el-dialog
      :title="addtip === true ? '添加用户':'编辑用户'"
      :visible.sync="editrolesdialogVisible"
      width="50%"
      @close="editroleinfo = {},addtip = false"
    >
      <el-form :model="editroleinfo" label-width="90px">
        <el-form-item label="角色名称：">
          <el-input v-model="editroleinfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="editroleinfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editrolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureeditrole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <!-- 删除用户对话框 -->
    <el-dialog title="提示" :visible.sync="deleterolesdialogVisible" width="50%">
      <span>是否删除这个角色？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleterolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="suredeletrole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户对话框 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      iid1: 1,
      iid2: 2,
      iid3: 3,
      delerightiid: '',
      showrole: '',
      rightstree: '',
      treeprop: {
        label: 'authName',
        children: 'children'
      },
      setrightdialogVisible: false,
      // 默认选中的节点
      defkey: [],
      updateroleid: '',
      editrolesdialogVisible: false,
      deleterolesdialogVisible: false,
      deleteroleid: '',
      // 要修改用户的数据
      editroleinfo: {},
      // 对话框为添加用户
      addtip: '',
      // 编辑框文本
      title: ''
    }
  },
  created() {
    this.getrolelist()
  },
  methods: {
    // 打开页面调用接口获取权限数据
    async getrolelist() {
      const res = await this.$http.get('/roles')
      this.rolelist = res.data
      //   console.log(res.data)
    },
    // 根据ID删除权限
    async removebtid(roleid, iid, rightid2, itemfalg, father, scope) {
      console.log(scope.children)
      const resmv = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (resmv !== 'confirm') {
        return this.$message.info('取消删除')
      }
      this.delerightiid = { roleid, iid, rightid2, itemfalg, father }
      const data = await this.$http.get(
        '/roles/deletsrights',
        {
          params: this.delerightiid
        }
      )
      // this.getrolelist()
      console.log(data.data[0].children)
      scope.children = data.data[0].children
    },
    async showsetrightdialog(role) {
      const { data: res } = await this.$http.get(
        '/rights/tree'
      )
      this.rightstree = res
      // 三级节点Id
      this.getleafkey(role, this.defkey)
      this.setrightdialogVisible = true
      console.log(res)
      console.log(role)
      this.updateroleid = role.id
      console.log(res[0])
    },
    // 递归获取三级权限id
    getleafkey(node, arr) {
      if (!node.children) {
        if (node.falg === true) {
          return arr.push(node.id)
        } else {
          return
        }
      }
      node.children.forEach(item => this.getleafkey(item, arr))
    },
    setdiaclose() {
      this.defkey = []
      this.updateroleid = ''
    },
    // 为角色分配权限
    async allotRights(role) {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      // console.log(role)
      // const idStr = keys.join(',')
      const res = await this.$http.post('/rights/update', {
        id: keys,
        roid: this.updateroleid
      })
      console.log(this.updateroleid)
      console.log(res)
      this.setrightdialogVisible = false
      this.getrolelist()
    },
    editroles(scope) {
      console.log(scope)
      this.editroleinfo = scope
      this.editrolesdialogVisible = true
    },
    deleteroles(scope) {
      this.deleteroleid = scope._id
      this.deleterolesdialogVisible = true
    },
    async suredeletrole() {
      const res = await this.$http.post('/delete/role', {
        delroid: this.deleteroleid
      })
      console.log(res)
      this.getrolelist()
      this.deleterolesdialogVisible = false
    },
    async sureeditrole() {
      const res = await this.$http.put(
        '/edit/role',
        this.editroleinfo
      )
      console.log(res)
      console.log(this.editroleinfo)
      this.getrolelist()
      this.editroleinfo = ''
      this.editrolesdialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eeee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
