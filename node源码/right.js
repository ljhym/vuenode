 const mongoose = require('mongoose');

 mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => console.log('权限列表数据库连接成功'))
     .catch(() => console.log('数据库连接失败', err))

 const rightSchema = new mongoose.Schema({
     id: Number,
     authName: String,
     level: String,
     pid: Number,
     path: String,
 })

 const Right = mongoose.model('Right', rightSchema);

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

module.exports = Right;
