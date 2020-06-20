const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('角色列表数据库连接成功'))
    .catch(() => console.log('数据库连接失败', err))

const roleSchema = new mongoose.Schema({
    id: Number,
    roleName: String,
    roleDesc: String,
    children: [],
})

const Role = mongoose.model('Role', roleSchema);

// Role.insertMany({_id:'5ebd66999d457774d39fcf60',id:'12',roleName:'21'}).then(result => { return result })
// Role.find({children: {$in : {'children'}}}).then(result=>console.log(result))
// Role.update({ id: 30 }, { $pull: { children: '2' } }).then(result => { console.log(result) })
// await Role.find().then(result => { return result })
//  Right.create({
//  id: 101,
//  authName: '商品管理',
//  level: 0,
//  path: 'goods',
//  pid: 0,
//  })
//  .then(result => console.log(result))
//  .catch(error => {
//  const err = error.errors;
//  for (var attr in err) {
//  console.log(err[attr]["message"]);
//  }
//  });
// id:104
// authName:"商品列表"
// level:"1"
// pid:101
// path:"goods"

module.exports = Role;
