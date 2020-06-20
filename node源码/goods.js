const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('角色列表数据库连接成功'))
    .catch(() => console.log('数据库连接失败', err))

const goodSchema = new mongoose.Schema({
    goods_id: Number,
    cat_id: {
        type: Number,
        default: null
    },
    goods_name: String,
    goods_price: Number,
    goods_number: Number,
    goods_weight: Number,
    goods_state: Number,
    add_time: Number,
    upd_time: Number,
    hot_mumber: 0,
    is_promote: {
        type: Boolean,
        default: null
    },

    cat_one_id: {
        type: Number,
        default: null
    },

    cat_two_id: {
        type: Number,
        default: null
    },

    cat_three_id: {
        type: Number,
        default: null
    },

    pics: [],
    goods_introduce: String,
    attrs: []
})

const Good = mongoose.model('Good', goodSchema);

module.exports = Good;



// {
//     goods_name: '海尔洗衣机',
//     goods_price: '3000',
//     goods_weight: '100',
//     goods_number: '10',
//     goods_cat: [ 703229414, 205423447, 708719186 ],
//     goods_cat1: '703229414,205423447,708719186',
//     pics: [ { pic: 'avatar\\upload_f3199710e83cd9ecd42c395e943e63c6.png' } ],
//     goods_introduce: '<p>大功率洗衣机</p>',
//     attrs: [
//       {
//         _id: '5ec8987a43f34126bc24588c',
//         attr_id: 434479291,
//         attr_value: '1个'
//       },
//       {
//         _id: '5ec8988543f34126bc24588d',
//         attr_id: 652243918,
//         attr_value: '1个'
//       },
//       {
//         _id: '5ec898ad43f34126bc24588f',
//         attr_id: 763648867,
//         attr_value: '1000w'
//       }
//     ]
//   }

// goods_id:907
// cat_id:null
// goods_name:"风帆(sail) 蓄电池6-QW-60 迈锐宝英朗爱唯欧科鲁兹君威迈腾速腾捷达高尔夫汽车电瓶折旧价配送上门安装"
// goods_price:483
// goods_number:100
// goods_weight:100
// goods_state:0
// add_time:1514259387
// upd_time:1514259387
// hot_mumber:0
// is_promote:false
// cat_one_id:null
// cat_two_id:null
// cat_three_id:null
