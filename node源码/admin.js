const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('员工数据库连接成功'))
    .catch((err) => console.log('数据库连接失败', err))

const adminsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 7
    },
    mobile: {
        // required: true,
        type: Number,
        minlength: 0,
        default: null,
        maxlength: 12
    },

    avatar: {
        // required: true,
        type: String,
        default: null,
    },
    address: {
        type: String,
        default: null,
    },
    favorites: [],
    orders: [],
    trolley: [],
    sex: String,

    type: {
        type: Number,
        default: 1
    },
    email: {
        default: null,
        type: String
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    mg_state: {
        type: Boolean,
        default: true
    },
    role_name: {
        type: String,
        default: "普通用户"
    },
    password: {
        required: true,
        type: String,
        minlength: 0,
        maxlength: 12
    }
})

//使用集合规则创建集合
const Admin = mongoose.model('Admin', adminsSchema);



//   Admin.find().skip(0).limit(2).then(result=>console.log(result))
//插入数据
//   Admin.create({
//       username: "秀儿啊",
//       mobile: '18420196601',
//       type: 1,
//       email: '16770@.com',
//       mg_state: false,
//       role_name: '超级用户'
//   })
//       .then(result => console.log(result))
//       .catch(error => {
//           const err = error.errors;
//           for (var attr in err) {
//               console.log(err[attr]["message"]);
//           }
//       });
//把此注释放到其他地方插入数据库

//开放模块
module.exports = Admin;


//侧边栏用户修改
