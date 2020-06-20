const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('角色列表数据库连接成功'))
    .catch(() => console.log('数据库连接失败', err))
const cateSchema = new mongoose.Schema({
    cat_id: Number,
    cat_name: String,
    cat_pid: Number,
    cat_level: Number,
    cat_deleted: Boolean,
    children: [],
})
const Cate = mongoose.model('Cate', cateSchema);

// Cate.findOneAndUpdate({ 'children.cat_id': 4 }, {
//     $pull: {
//         "children.$.children": {
//             cat_id:
//                 981972799
//         }
//     }
// }).then(res => { console.log(res) })

// Cate.update({ cat_id: 1 }, { $pull: { children: { cat_id: 3, cat_level: 1 } } }, { multi: true }).then(res => { console.log(res) })
// db.students.update({ _id: 5 }, { $push: { quizzes: { $each: [{ wk: 5, score: 8 }, { wk: 6, score: 7 }, { wk: 7, score: 6 }], $sort: { score: -1 }, $slice: 3 } } })
// Cate.update({ cat_id: 1 }, { $push: { children: { $each: [{ wk: 5, score: 8 }, { wk: 6, score: 7 }, { wk: 7, score: 6 }] } } }).then(res => { console.log(res) })
// Cate.findOneAndUpdate({ 'children.cat_id': 4 }, { $push: { "children.$.children": { parent_id: 1, kr_id: 1 } } }, { upsert: true, 'new': true }).then(res => { console.log(res) })


// Cate.update({ cat_id: 1 }, { $set: { 'children.':  } }).then(res => { console.log(res) })




module.exports = Cate;
