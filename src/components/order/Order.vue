<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 -->
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox(scope.row._id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="progess(scope.row._id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 订单列表数据 -->
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
      <!-- 分页区域 -->
    </el-card>
    <!-- 表格区域 -->
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" @close="closeaddress" :visible.sync="addressdialogVisible" width="50%">
      <!-- 表单验证 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 表单验证 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureeditaddress">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改地址对话框 -->
    <!-- 物流进度 -->
    <el-dialog title="物流进度" :visible.sync="wldialogVisible" width="50%">
      <!-- time时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progessinfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <!-- time时间线 -->
    </el-dialog>
    <!-- 物流进度 -->
  </div>
</template>

<script>
// 导入城市数据
import cityData from './citydata.js'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      //   修改地址对话框
      addressdialogVisible: false,
      //   修改地址表单
      addressForm: {
        _id: '',
        address1: [],
        address2: ''
      },
      //   修改地址验证规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      //   城市数据源
      cityData: cityData,
      //   物流进度
      wldialogVisible: false,
      //   物流信息
      progessinfo: []
    }
  },
  created() {
    this.getorderlist()
  },
  methods: {
    async getorderlist() {
      const res = await this.$http.get('/orders', { params: this.queryInfo })
      console.log(res)
      this.orderlist = res.data.orders
      this.total = res.data.total
    },
    // 显示条数发生变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getorderlist()
    },
    // 页码发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getorderlist()
    },
    // 修改对话框
    showBox(id) {
      this.addressForm._id = id
      this.addressdialogVisible = true
    },
    // 关闭清空修改地址表单
    closeaddress() {
      this.$refs.addressFormRef.resetFields()
    },
    // 确认修改地址
    async sureeditaddress() {
      const res = await this.$http.put('/orders', this.addressForm)
      console.log(res)
      this.getorderlist()
      this.addressdialogVisible = false
    },
    // 查看物流对话框
    async progess(id) {
      const res = await this.$http.get('/kuaidi/' + id)
      console.log(res.data.data)
      this.progessinfo = res.data.data
      this.wldialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
