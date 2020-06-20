<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editById(scope.row)"></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格区域 -->
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
      <!-- 分页区域 -->
    </el-card>

    <!-- 编辑商品对话框 -->
    <el-dialog title="编辑商品" :visible.sync="editdialogVisible" width="50%">
      <!-- 编辑参数 -->
      <el-form :model="editinfo" ref="editinforef">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editinfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editinfo.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editinfo.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editinfo.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <!-- 编辑参数 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑商品对话框 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodlist: [],
      total: 0,
      // 编辑商品信息
      editdialogVisible: false,
      editinfo: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const res = await this.$http.get('/goods', {
        params: this.queryinfo
      })
      console.log(res)
      console.log(res.data)
      if (res.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.$message.success('商品列表获取成功')
      this.goodlist = res.data.goods
      this.total = res.data.total
    },
    // 显示条数发生变化
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize
      this.getGoodsList()
    },
    // 页码发生变化
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage
      this.getGoodsList()
    },
    // 编辑商品
    async editById(role) {
      console.log(role)
      this.editinfo = role
      this.editdialogVisible = true
      const res = await this.$http.put('goods/', role)
      console.log(res)
    },
    // 删除商品
    async removeById(id) {
      const tip = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (tip !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const res = await this.$http.delete('goods/' + id)
      console.log(id)
      console.log(res)
      this.getGoodsList()
    },
    goAddpage() {
      // 路由跳转
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
