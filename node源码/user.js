const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('最高权限用户数据库连接成功'))
    .catch(() => console.log('数据库连接失败', err))

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
})

const User = mongoose.model('User', userSchema);
//设置连接数据库规则

//login登录页面所需账号
// User.create({
//     name: '欢子呀',
//     password: '123456',
// })
//     .then(result => console.log(result))
//     .catch(error => {
//         const err = error.errors;
//         for (var attr in err) {
//             console.log(err[attr]["message"]);
//         }
//     });
//把此注释放到其他地方插入数据库
// async function get() {
//     let ress = await User.findOne({ name: '李狗蛋' })
//         .then(result => { return result })
//     console.log(ress.name)
//     console.log(ress.password)
// }
// get()
// 以上是登录功能
// User.findOneAndUpdate({name : '李狗蛋'},{"$set":{password : "123456"}}).then(result=> console.log(result))
module.exports = User;

