

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('角色列表数据库连接成功'))
    .catch(() => console.log('数据库连接失败', err))

const orderSchema = new mongoose.Schema({
    order_id: Number,
    user_id: Number,
    order_number: String,
    order_price: Number,
    order_pay: String,
    is_send: String,
    trade_no: String,
    order_fapiao_title: String,
    order_fapiao_company: String,
    order_fapiao_content: String,
    consignee_addr: String,
    pay_status: String,
    create_time: Number,
    update_time: Number,
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


// order_id:55
// user_id:1
// order_number:"itcast-g7kmck6nyjauiell8"
// order_price:20
// order_pay:"0"
// is_send:"否"
// trade_no:""
// order_fapiao_title:"个人"
// order_fapiao_company:""
// order_fapiao_content:""
// consignee_addr:""
// pay_status:"0"
// create_time:1512531840
// update_time:1512531840
