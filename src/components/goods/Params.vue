<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert show-icon title="注意：只允许为三级分类设置相关参数" type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            class="wid"
            v-model="selectedKeys"
            expand-trigger="hover"
            :options="catelist"
            :props="cascaderProps"
            @change="addCateChanged()"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtndisable"
            @click="adddialogvisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableDate" border stripe>
            <el-table-column type="expand">
              <!-- 循环渲染tag标签 -->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  :closable="true"
                  @close="handleclose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
                <!-- 输入文本框 -->
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- slot-scope="scope" -->
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editid = scope.row._id,showeditdialogvisible = true"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeparams(scope.row._id)"
                >删除</el-button>
                <!-- {{scope.row._id}} -->
              </template>
            </el-table-column>
          </el-table>
          <!-- 动态参数表格 -->
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtndisable"
            @click="adddialogvisible=true"
          >添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableDate" border stripe>
            <el-table-column type="expand">
              <!-- 循环渲染tag标签 -->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  :closable="true"
                  @close="handleclose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
                <!-- 输入文本框 -->
              </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editid = scope.row._id,showeditdialogvisible = true"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeparams(scope.row._id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 静态参数表格 -->
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 公用对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="adddialogvisible"
      width="50%"
      @close="closedialog"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addformref">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="addprams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 公用对话框 -->

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'编辑'+titleText"
      :visible.sync="showeditdialogvisible"
      width="50%"
      @close="closeeditdia"
    >
      <!-- 编辑参数 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editformref">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 编辑参数 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showeditdialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类默认为空
      catelist: [],
      // 级联选择框的配置属性
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定的数据
      selectedKeys: [],
      // 被激活的页签名称
      activeName: 'many',
      manyTableDate: [],
      onlyTableDate: [],
      // 对话框显示隐藏
      adddialogvisible: false,
      // 添加的属性名称
      addForm: {
        attr_name: ''
      },
      // 添加验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请传入参数名称', trigger: 'blur' }
        ]
      },
      editid: '',
      editForm: {
        attr_name: ''
      },
      // 修改验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请传入参数名称', trigger: 'blur' }
        ]
      },
      showeditdialogvisible: false
      // tag标签切换
      // inputVisible: false,
      // // tag标签文本框输入的内容
      // inputValue: ''
    }
  },
  created() {
    //   页面加载马上执行函数
    this.getCatelist()
  },
  methods: {
    //   执行函数获取商品分类
    async getCatelist() {
      const data = await this.$http.get('/categories', {})
      this.total = data.data.total
      this.catelist = data.data.data
      console.log(this.catelist)
    },
    // 级联选择框选中触发函数
    addCateChanged() {
      this.getparamsdata()
    },
    // 获取参数的列表数据
    async getparamsdata() {
      console.log(this.selectedKeys)
      // 选择的分类不是三级分类退出
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableDate = []
        this.onlyTableDate = []
        return 0
      }
      const data = await this.$http.get('/categories/attr', {
        params: { sel: this.activeName, id: this.cateId }
      })
      data.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(data.data)
      if (this.activeName === 'many') {
        this.manyTableDate = data.data
      } else {
        this.onlyTableDate = data.data
      }
      // console.log(data.data)
    },
    // 切换tab页签
    handleTabClick() {
      this.getparamsdata()
      console.log(this.activeName)
    },
    closedialog() {
      this.$refs.addformref.resetFields()
    },
    addprams() {
      this.$refs.addformref.validate(async valid => {
        if (!valid) {
          return 0
        }
        const data = await this.$http.post('/categories/attr', {
          id: this.cateId,
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(data)
      })
      this.getparamsdata()
      this.adddialogvisible = false
    },
    async editparams() {
      // 修改参数
      console.log('ok')
      const data = await this.$http.put('/categories/attr', {
        id: this.editid,
        // _id: this.addForm.attr_name,
        attr_name: this.editForm.attr_name,
        attr_sel: this.activeName
      })
      console.log(this.editid)
      console.log(data)
      this.getparamsdata()
      this.showeditdialogvisible = false
    },
    // 关闭清空编辑表单
    closeeditdia() {
      this.$refs.editformref.resetFields()
    },
    async removeparams(_id) {
      const res = await this.$confirm(
        '此操作将永久删除参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const data = await this.$http.delete('/categories/attr/' + _id)
      console.log(data)
      console.log(_id)
      this.getparamsdata()
    },
    async handleInputConfirm(row) {
      console.log(row)
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return 0
      }
      // row.inputVisible = false
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      const data = await this.$http.put('/categories/attr/', row)
      console.log(data)
    },
    showInput(row) {
      row.inputVisible = true
      // 文本框自动获取焦点
      // $nextTick页面元素被重新渲染后会执行代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag属性
    async handleclose(index, row) {
      row.attr_vals.splice(index, 1)
      const data = await this.$http.put('/categories/attr/', row)
      console.log(data)
    }
  },
  computed: {
    // 按钮是否禁用
    isBtndisable() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.wid {
  width: 300px;
}
.input-new-tag {
  width: 150px !important;
}
</style>
