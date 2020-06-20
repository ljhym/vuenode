const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('角色列表数据库连接成功'))
    .catch(() => console.log('数据库连接失败', err))

const paramSchema = new mongoose.Schema({
    attr_id: Number,
    attr_name: String,
    cat_id: Number,
    attr_sel: String,
    attr_write: String,
    attr_vals: {
        type: String,
        default: ''
    },
    delete_time: {
        type: Number,
        default: null
    }
})

const Param = mongoose.model('Param', paramSchema);

module.exports = Param;



goods_id: 924
cat_id: null
goods_name: "沿途（yantu）车载充电器车充一拖二usb转接口手机智能头多功能汽车点烟器"
goods_price: 0
goods_number: 100
goods_weight: 100
goods_state: 0
add_time: 1514259448
upd_time: 1514259448
hot_mumber: 0
is_promote: false
cat_one_id: null
cat_two_id: null
cat_three_id: null



