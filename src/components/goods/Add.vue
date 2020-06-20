<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 -->
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 提示区域 -->
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 步骤条区域 -->

      <!-- tab区域 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_name">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_name">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_name">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="catelist"
                  expand-trigger="hover"
                  :props="cateProps"
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in manyTableDate"
              :key="index"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
              <!-- 复选框组 -->
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyTableDate"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 这个地址是图片上传的后台api接口 -->
            <el-upload
              :headers="headerobj"
              action="http://127.0.0.1:80/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="add" class="btnadd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- tab区域 -->
      <!-- 图片预览框 -->
      <el-dialog title="图片预览" :visible.sync="previewvisible" width="50%">
        <img :src="previewPath" alt class="previewimg" />
      </el-dialog>
      <!-- 图片预览框 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      //   添加商品的表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        goods_cat1: '',
        //   图片路径
        pics: [],
        // 商品详情
        goods_introduce: '',
        attrs: []
      },
      //   表单验证
      addFormrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      //   商品分类列表
      catelist: [],

      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //   动态参数列
      manyTableDate: [],
      // 静态参数
      onlyTableDate: [],
      //   图片上传组件请求头
      headerobj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewvisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const data = await this.$http.get('/categories')
      this.catelist = data.data.data
      console.log(this.catelist)
    },
    // 级联选择器选中项变化触发函数
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(act, old) {
      console.log(act)
      console.log(old)
      if (old === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClicked() {
      console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        const data = await this.$http.get('/categories/attr', {
          params: { sel: 'many', id: this.cateId }
        })

        data.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableDate = data.data
        console.log(data.data)
      } else if (this.activeIndex === '2') {
        const data = await this.$http.get('/categories/attr', {
          params: { sel: 'only', id: this.cateId }
        })
        console.log(data.data)
        this.onlyTableDate = data.data
      }
    },
    // 点击图片预览
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.url
      this.previewvisible = true
    },
    // 删除图片
    async handleRemove(file) {
      console.log(file)
      const filePath = file.response.tem_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      const data = await this.$http.post('/delete/avaters', {
        params: filePath
      })
      console.log(data)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    handleSuccess(res) {
      console.log(res)
      const picInfo = {
        pic: res.tem_path
      }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加按钮
    async add() {
      this.$refs.addFormref.validate(async vlid => {
        if (!vlid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 发送数据添加
        this.addForm.goods_cat1 = this.addForm.goods_cat.join(',')
        console.log(this.addForm.goods_cat1)
      })
      // 动态属性
      this.manyTableDate.forEach(item => {
        const newInfo = {
          _id: item._id,
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })
      // 静态参数
      this.onlyTableDate.forEach(item => {
        const newInfo = {
          _id: item._id,
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }

        this.addForm.attrs.push(newInfo)
      })
      console.log(this.manyTableDate)
      console.log(this.onlyTableDate)
      console.log(this.addForm)
      // 发送请求添加商品
      const res = await this.$http.post('/goods', this.addForm)
      this.$router.push('/goods')
      console.log(res)
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewimg {
  width: 100%;
}
.btnadd {
  margin-top: 15px !important;
}
</style>
