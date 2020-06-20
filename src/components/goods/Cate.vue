<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddcatdialog">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen;"></i>
          <i style="color:lred;" class="el-icon-error" v-else></i>
        </template>
        <!-- 是否有效模板 -->
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="min" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="min" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag size="min" v-else type="warning">三级</el-tag>
        </template>
        <!-- 排序模板 -->
        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="min" icon="el-icon-edit" @click="editcate(scope.row)">编辑</el-button>
          <el-button
            type="danger"
            size="min"
            icon="el-icon-delete"
            @click="deletecate(scope.row)"
          >删除</el-button>
        </template>
        <!-- 操作模板 -->
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 分页区域 -->
    </el-card>
    <!-- 添加商品对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="addCatedialogvisible"
      width="50%"
      @close="addCatedialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            :change-on-select="true"
            @change="addCateChanged()"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="addCated()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加商品对话框 -->
    <!-- 商品编辑按钮对话框 -->
    <el-dialog title="编辑商品" :visible.sync="editCatedialogvisible" width="50%">
      <el-form>
        <el-form-item label="分类名称：">
          <el-input v-model="editcateinfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 商品开关 -->
          <template>
            <span class="spanmar">商品状态：</span>
            <br />
            <el-switch
              @change="abc()"
              v-model="editcateinfo.cat_deleted"
              active-color="#ff4949"
              inactive-color="#13ce66"
            ></el-switch>
          </template>
          <!-- 商品开关 -->
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCatedialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="editCated()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 商品编辑按钮对话框 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 3
      },
      // 商品分类默认为空
      catelist: [],
      //   总数据条数
      total: 0,
      //   总页数
      pagesnum: '',
      //   为table指定列名称
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //   把是否有效列定义为模板列
          type: 'template',
          //   定义模板名称
          template: 'isok'
        },
        {
          label: '排序',
          //   把是否有效列定义为模板列
          type: 'template',
          //   定义模板名称
          template: 'order'
        },
        {
          label: '操作',
          //   把是否有效列定义为模板列
          type: 'template',
          //   定义模板名称
          template: 'opt'
        }
      ],
      addCatedialogvisible: false,
      //   添加商品分类的数据表单
      addCateForm: {
        //   要添加的商品名称
        cat_name: '',
        // 要添加的父级ID
        cat_pid: 0,
        // 添加的分类等级，默认一级
        cat_level: 0
      },
      //   添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //   父级分类列表
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        cat_level: 'cat_level'
      },
      selectedKeys: [],
      // 编辑功能
      editcateinfo: {},
      ybeditcateinfo: {},
      editCatedialogvisible: false
      // 编辑功能
    }
  },
  created() {
    //   页面加载马上执行函数
    this.getCatelist()
  },
  methods: {
    //   执行函数获取商品分类
    async getCatelist() {
      const data = await this.$http.get('/categories', {
        params: this.queryInfo
      })
      console.log(this.queryInfo)
      console.log(data.data.data)
      console.log(data.data.total)
      this.total = data.data.total
      console.log(data.data.pagenum)
      this.pagesnum = data.data.pagenum
      console.log(data.status)
      this.catelist = data.data.data
    },
    // 监听pagesize变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCatelist()
    },
    // 当前页码值发生变化触发函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCatelist()
    },
    // 获取添加商品的父级
    async showAddcatdialog() {
      const data = await this.$http.get('/categories', {
        params: { type: 2 }
      })
      // console.log(data.data)
      //    data.data

      // 循环删除
      function removeZero(showlist) {
        if (typeof showlist === 'object') {
          // 如果showList是一个object，遍历showlist
          for (let i = 0; i < showlist.length; i++) {
            const element = showlist[i]
            if (element.cat_level === 1 && 'children' in element) {
              delete showlist[i].children
              i--
            } else {
              // 遍历其子节点
              removeZero(element.children)
            }
          }
        } else {
          // 子节点不存在则结束
          return 0
        }
      }
      const List = data.data
      removeZero(List)
      this.parentCateList = List
      // 循环删除

      this.addCatedialogvisible = true
    },
    // 选择父级商品触发函数
    addCateChanged() {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
        // return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    async addCated() {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('未输入商品分类')
        }
      })

      const data = await this.$http.post('/categories', {
        m: this.addCateForm,
        m1: this.selectedKeys
      })
      console.log(data)
      this.getCatelist()

      this.addCatedialogvisible = false
    },
    addCatedialogClosed() {
      // 表单的引用
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    async deletecate(info) {
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
      console.log(info)
      const data = await this.$http.post('/delete/categories', info)
      console.log(data)
      this.getCatelist()
    },
    editcate(role) {
      this.editcateinfo = role
      this.ybeditcateinfo = role
      this.editCatedialogvisible = true
      console.log(this.editcateinfo)
    },
    async editCated() {
      console.log(this.editcateinfo)
      console.log(this.ybeditcateinfo)
      console.log('确定编辑')

      const data = await this.$http.put('/edit/categories', this.editcateinfo)
      console.log(data)
      this.editCatedialogvisible = false
      this.getCatelist()
    },
    abc() {
      console.log(this.editcateinfo.cat_deleted)
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
.spanmar {
  margin-right: 15px;
}
</style>
