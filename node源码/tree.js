const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('角色列表数据库连接成功'))
    .catch(() => console.log('数据库连接失败', err))
const treeSchema = new mongoose.Schema({
    id: Number,
    authName: String,
    path: String,
    pid: Number,
    children: [],
})

const Tree = mongoose.model('Tree', treeSchema);
module.exports = Tree;
// const data = await Tree.find().then(result => { return result })



