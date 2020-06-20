const express = require('express');
// const mongoose = require('mongoose');
const compression = require('compression')
const fs = require('fs');

const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const formidable = require('formidable');
const bodyParser = require('body-parser');
// const template = require('art-template');
// const dateFormat = require('dateformat');
// const session = require('express-session');
const app = express();

//连接数据库查询登录用户
const Admin = require('./admin.js')
const User = require('./user')
const Right = require('./right.js')
const Role = require('./role.js')
const Tree = require('./tree.js')
const Cate = require('./cate.js')
const Param = require('./params.js')
const Good = require('./goods.js')
const Order = require('./order.js')

// gzip静态资源，拦截参数,压缩代码
app.use(compression())

//设定可跨域
app.use(cors());
let jsonParser = bodyParser.json();
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    //将外源设为指定的域，比如：http://localhost:8080
    // res.header('Access-Control-Allow-Origin', "http://localhost:8080");
    //将Access-Control-Allow-Credentials设为true
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
//设定可跨域



//app.use(express.static('./dist'));
app.use(express.static(path.join(__dirname, './dist')));
//不设置这两行拿不到req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// 静态资源，拦截参数

//以下是登录功能
app.post('/login', async (req, res) => {
    // console.log(req.body)
    let ress = await User.findOne({ name: req.body.username })
        .then(result => { return result })
    if (ress) {
        if (ress.name == req.body.username && ress.password == req.body.password) {
            // console.log(req.body.username)
            //登录成功设置token
            let content = { name: req.body.name };
            let secretOrPrivateKey = "jwt";// 这是加密的key（密钥）
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 60 * 60 * 1  // 1小时过期
            })
            res.json({ status: 200, mess: '登录成功', token: token, user_name: req.body.name })
            // res.redirect('/login')
        } else {
            res.json({ mess: '登录失败' })
        }
    } else {
        res.json({ mess: '登录失败' })
    }
})

// 微信用户登录
app.post('/login/users', async (req, res) => {
    console.log(req.body)
    // console.log(req.query)
    let ress = await Admin.findOne({ username: req.body.username })
        .then(result => { return result })
    if (ress) {
        if (ress.username == req.body.username && ress.password == req.body.password) {
            // console.log(req.body.username)
            //登录成功设置token
            let content = { username: req.body.username };
            let secretOrPrivateKey = "jwt";// 这是加密的key（密钥）
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 60 * 60 * 1  // 1小时过期
            })
            res.json({ status: 200, mess: '登录成功', token: token, username: req.body.username, id: ress._id, userinfo: ress })
            // res.redirect('/login')
        } else {
            res.json({ mess: '登录失败1' })
        }
    } else {
        res.json({ mess: '登录失败2' })
    }
})

//侧边栏查询用户
app.get('/users', jsonParser, async (req, res) => {
    // ye等于要查询的页数乘要查询的条数，就是要跳过多少条数据
    let ys = (req.query.pagenum - 0 - 1) * req.query.pagesize
    // ts就是要查询多少条数据
    let ts = req.query.pagesize
    // console.log(typeof parseInt(ts))
    // query就是用户搜索的内容
    let query = req.query.query
    // console.log(query)
    // 如果搜索的内容为空，利用ts和ys查询数据给用户
    if (req.query.query == '') {
        let data = await Admin.find().skip(parseInt(ys)).limit(parseInt(ts)).then(result => { return result });
        //这是查询到的数据
        const users = data
        //查询数据库内一共有多少条数据totals
        const totals = await Admin.find().then(result => { return result.length });
        //ts是用户要查询多少条数据，数据库总数据除以ts,等于一个多少页
        const yeshu = parseInt(totals) / parseInt(ts)
        //返回查询到的数据，一共多少条，一共多少页
        res.json({ users, total: (totals - 0), pagenum: parseInt(yeshu) })
    } else {
        //如果搜索的内容不为空，req.query.query查询数据给用户
        // ye等于要查询的页数乘要查询的条数，就是要跳过多少条数据
        let ys = (req.query.pagenum - 0 - 1) * req.query.pagesize
        // ts就是要查询多少条数据
        let ts = req.query.pagesize
        //创建正则表达式
        var qs = new RegExp(req.query.query)
        //模糊大法搜索数据
        let data = await Admin.find({ username: { $in: qs } }).skip(parseInt(ys)).limit(parseInt(ts)).then(result => { return result })
        const users = data
        let totalls = await Admin.find({ username: { $in: qs } }).then(result => { return result })
        // console.log(data.length)
        const yeshu = parseInt(totalls.length) / parseInt(ts)
        res.json({ users, total: totalls.length, pagenum: parseInt(yeshu) })
        // let data = await Admin.find().skip(parseInt(ys)).limit(parseInt(ts)).then(result => { return result });
    }
})
//侧边栏查询用户

// 微信用户头像上传
app.post('/users/avatar', async (req, res) => {
    // console.log(req.body)
    // console.log(req.query)
    // 头像处理
    const form = new formidable.IncomingForm();
    //保存文件位置
    form.uploadDir = path.join(__dirname, '/dist', '/public', 'avatar');
    //保留文件后缀 
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        console.log(files.name.path)
        // if (files.name.path == '') {
        //     var arr = 'avatar.png'
        // } else {
        const path = files.name.path.split('avatar\\')[1]
        //     var arr = path.split('avatar\\')[1]
        console.log(path)

        // } 
        res.send(path)
        // const dd = await Admin.findOneAndUpdate({ _id: Object.keys(files)[0] }, { "$set": { avatar: arr } }).then(res => { console.log('ok') })
    })
    // 头像处理


})
// 微信用户头像上传

// 收藏商品
app.put('/trolley', jsonParser, async (req, res) => {
    // console.log(req.query)
    var trolley = await Admin.findOne({ _id: req.body.uid }).then(res => {
        return res.trolley
    })
    console.log(trolley)
    var trolleyId = []
    var numId = []

    trolley.forEach(element => {
        trolleyId.push(element.id)
        numId.push(element.num)
    });
    if (trolleyId.indexOf(req.body.goodinfo.id) == -1) {
        Admin.findOneAndUpdate({ _id: req.body.uid }, { "$push": { trolley: req.body.goodinfo } }).then(result => console.log('用户修改成功'))
        res.send('ok2')
    } else {
        console.log(trolleyId.indexOf(req.body.goodinfo.id))
        console.log(numId)
        var newnum = numId[trolleyId.indexOf(req.body.goodinfo.id)] - 0 + req.body.goodinfo.num
        console.log(newnum)
        Admin.findOneAndUpdate({ _id: req.body.uid, 'trolley.id': req.body.goodinfo.id }, { "$set": { "trolley.$.num": newnum } }).then(result => console.log(result))
        res.send('ok1')
    }
    console.log(req.body)

})
// 收藏商品

// 以下是添加用户
app.post('/users', jsonParser, async (req, res) => {
    console.log(req.query)
    console.log(req.body)
    // console.log(req.body.address)


    const rese = await Admin.create({
        username: req.body.username,
        mobile: req.body.mobile,
        address: req.body.address,
        avatar: req.body.avatar,
        // favorites:[],
        // orders:[], 
        // trolley:[],
        sex: req.body.sex,
        type: 1,
        email: req.body.email,
        password: req.body.password,
        mg_state: false,
        role_name: '超级用户'
    }).then(result => { return result })

    res.send(rese)
    //.catch(error => {
    //     const err = error.errors;
    //     for (var attr in err) {
    //         console.log(err[attr]["message"]);
    //     }
    // });
    //把此注释放到其他地方插入数据库

    // console.log(req.url)

})
// 以上是添加用户


// 以下是编辑用户
app.get('/users/:id', jsonParser, async (req, res) => {
    //截取用户id
    var str = req.url
    var id = str.substring(7)
    const users = await Admin.find({ _id: id }).then(result => { return result })
    // console.log(users)
    res.json(users)
})
// 修改用户功能
app.put('/users/:id', jsonParser, async (req, res) => {
    // console.log(req.query)
    // console.log(req.body)
    // console.log(req.url)
    //截取用户id
    var str = req.url
    var id = str.substring(7)
    if (id = 'sc') {
        var uid = req.body.uid
        var isfav = req.body.isfavourites
        if (isfav == true) {
            Admin.findOneAndUpdate({ _id: uid }, { "$pull": { favorites: req.body.id } }).then(result => console.log('用户修改成功'))
            const users = await Admin.find({ _id: uid }).then(result => { return result })
            res.json({ userinfo: users })
            return
        } else if (isfav == false) {
            Admin.findOneAndUpdate({ _id: uid }, { "$push": { favorites: req.body.id } }).then(result => console.log('用户修改成功'))

            const users = await Admin.find({ _id: uid }).then(result => { return result })
            res.json({ userinfo: users })
            return
        } else {
            Admin.findOneAndUpdate({ _id: id }, { "$set": { email: req.body.email, mobile: req.body.mobile } }).then(result => console.log('用户修改成功'))
            // const users = await Admin.find({ _id: id }).then(result => { return result })
            // console.log(users)
            res.json('修改成功')
        }

    }

})
// 删除用户功能
app.delete('/users/:id', jsonParser, async (req, res) => {
    // console.log(req.query)
    // console.log(req.body)
    // console.log(req.url)
    //截取用户id
    var str = req.url
    var id = str.substring(7)
    Admin.findOneAndDelete({ _id: id }).then(result => console.log('用户删除成功'))
    // const users = await Admin.find({ _id: id }).then(result => { return result })
    // console.log(users)
    res.json('删除成功')
})
// 以上是编辑用户


// 更新用户开关状态
app.put('/upusers/:id/state/:type', jsonParser, async (req, res) => {
    // console.log(req.url)
    // console.log(req.query)
    // console.log(req.body)
    // console.log(req.body.params.userinfo)
    // console.log(req.body.params.id)
    Admin.findOneAndUpdate({ _id: req.body.params.id }, { "$set": { mg_state: req.body.params.userinfo } }).then(result => console.log("用户更新成功"))
    res.send('ok')
})
// 更新用户开关状态

//权限列表数据获取
app.get('/rights/:type', jsonParser, async (req, res) => {
    // console.log(req.url)
    // console.log(req.query)
    // console.log(req.body)
    // console.log(req.body.params.userinfo)
    // console.log(req.body.params.id)
    if (req.url == '/rights/list') {
        const resb = await Right.find().then(result => { return result })
        res.send(resb)
    }
    if (req.url == '/rights/tree') {
        const resb = await Tree.find().then(result => { return result })
        res.send(resb)
        // console.log(resb)
    }

})
//权限列表数据获取

//角色管理
app.get('/roles', jsonParser, async (req, res) => {
    // console.log(req.url)
    // console.log(req.query)
    // console.log(req.body)
    // console.log(req.body.params.userinfo)
    // console.log(req.body.params.id)
    const resb = await Role.find().then(result => { return result })
    res.send(resb)
})
//角色管理

// 删除权限功能
app.get('/roles/deletsrights', jsonParser, async (req, res) => {
    // console.log(req.body)
    console.log(req.query)
    console.log(req.query.roleid)
    console.log(req.query.rightid2)


    const List = await Role.find({ id: parseInt(req.query.roleid) }).then(result => {
        return result
    })

    function lisc(showlist) {
        if (typeof showlist == "object") {
            // 如果showList是一个object，遍历showlist
            for (var i = 0; i < showlist.length; i++) {
                const element = showlist[i]
                if (element.falg === true) {
                    // console.log(element.falg)
                    element.falg = false
                    // 注意删除了一项后，索引-1
                    i--
                } else {
                    // 遍历其子节点
                    lisc(element.children)
                }
            }
        } else {
            // 子节点不存在则结束
            return
        }
    }

    function lis(showlist, id, iid) {
        if (typeof showlist == "object") {
            // 如果showList是一个object，遍历showlist
            for (var i = 0; i < showlist.length; i++) {
                const element = showlist[i]
                if (element.id === id && element.falg === true) {
                    // console.log(element.falg)
                    element.falg = false
                    // 注意删除了一项后，索引-1
                    lisc(element.children)
                    i--
                } else if (iid === 2) {
                    // 遍历其子节点
                    lis(element.children, id)
                } else {
                    lis(element.children, id)
                }
            }
        } else {
            // 子节点不存在则结束
            return
        }
    }
    lis(List, parseInt(req.query.rightid2), req.query.iid)
    Role.replaceOne({ id: parseInt(req.query.roleid) }, List[0]).then(res => { console.log(res) })
    const resb = await Role.find({ id: parseInt(req.query.roleid) }).then(result => { return result })
    res.send(resb)

})
// 删除权限功能

// 树形添加权限功能
app.post('/rights/update', jsonParser, async (req, res) => {
    function removeZero(showlist, item) {
        if (typeof showlist == "object") {
            for (let i = 0; i < showlist.length; i++) {
                let element = showlist[i]
                if (element.id === item && element.falg === false) {
                    element.falg = true
                    i--
                } else {
                    removeZero(element.children, item)
                }
            }
        } else {
            return
        }
    }
    const List = await Tree.find().then(res => { return res })
    req.body.id.forEach(item => removeZero(List, item))
    // res.send('成功')
    Role.findOneAndUpdate({ id: req.body.roid }, { "$set": { children: List } }).then(result => console.log('成功'))
    // 
    // sarr = [101, 102, 103, 125, 145]
    // sarr.forEach(async ites => {
    //     var List1 = await Role.find({ id: parseInt(req.body.roid) }).then(result => {
    //         return result
    //     })
    //     if (req.body.id.indexOf(ites) == -1) {

    //         function removeZero(showlist, id) {
    //             if (typeof showlist == "object") {
    //                 for (let i = 0; i < showlist.length; i++) {
    //                     let element = showlist[i]
    //                     if (element.id === id && element.falg === true) {
    //                         element.falg = false
    //                         i--
    //                     } else {
    //                         removeZero(element.children, id)
    //                     }
    //                 }
    //             } else {
    //                 return
    //             }
    //         }
    //         removeZero(List1, parseInt(ites))
    //         Role.replaceOne({ id: parseInt(req.body.roid) }, List1[0]).then(res => { console.log(res) })
    //     }
    // })


    var r1 = req.body.id.indexOf(101)
    const List1 = await Role.find({ id: parseInt(req.body.roid) }).then(result => {
        return result
    })
    if (r1 == -1) {
        function removeZero(showlist, id) {
            if (typeof showlist == "object") {
                for (let i = 0; i < showlist.length; i++) {
                    let element = showlist[i]
                    if (element.id === id && element.falg === true) {
                        element.falg = false
                        i--
                    } else {
                        removeZero(element.children, id)
                    }
                }
            } else {
                return
            }
        }
        removeZero(List1, parseInt(101))
        console.log(parseInt(req.body.roid))
        Role.replaceOne({ id: parseInt(req.body.roid) }, List1[0]).then(res => { console.log(res) })
    }
    var r1 = req.body.id.indexOf(102)
    var List2 = await Role.find({ id: parseInt(req.body.roid) }).then(result => {
        return result
    })
    if (r1 == -1) {
        function removeZero(showlist, id) {
            if (typeof showlist == "object") {
                for (let i = 0; i < showlist.length; i++) {
                    let element = showlist[i]
                    if (element.id === id && element.falg === true) {
                        element.falg = false
                        i--
                    } else {
                        removeZero(element.children, id)
                    }
                }
            } else {
                return
            }
        }
        removeZero(List2, parseInt(102))
        console.log(parseInt(req.body.roid))
        Role.replaceOne({ id: parseInt(req.body.roid) }, List2[0]).then(res => { console.log(res) })
    }
    var r1 = req.body.id.indexOf(103)
    var List3 = await Role.find({ id: parseInt(req.body.roid) }).then(result => {
        return result
    })
    if (r1 == -1) {
        function removeZero(showlist, id) {
            if (typeof showlist == "object") {
                for (let i = 0; i < showlist.length; i++) {
                    let element = showlist[i]
                    if (element.id === id && element.falg === true) {
                        element.falg = false
                        i--
                    } else {
                        removeZero(element.children, id)
                    }
                }
            } else {
                return
            }
        }
        removeZero(List3, parseInt(103))
        console.log(parseInt(req.body.roid))
        Role.replaceOne({ id: parseInt(req.body.roid) }, List3[0]).then(res => { console.log(res) })
    }
    var r1 = req.body.id.indexOf(125)
    var List4 = await Role.find({ id: parseInt(req.body.roid) }).then(result => {
        return result
    })
    if (r1 == -1) {
        function removeZero(showlist, id) {
            if (typeof showlist == "object") {
                for (let i = 0; i < showlist.length; i++) {
                    let element = showlist[i]
                    if (element.id === id && element.falg === true) {
                        element.falg = false
                        i--
                    } else {
                        removeZero(element.children, id)
                    }
                }
            } else {
                return
            }
        }
        removeZero(List4, parseInt(125))
        console.log(parseInt(req.body.roid))
        Role.replaceOne({ id: parseInt(req.body.roid) }, List4[0]).then(res => { console.log(res) })
    }
    var r1 = req.body.id.indexOf(145)
    var List5 = await Role.find({ id: parseInt(req.body.roid) }).then(result => {
        return result
    })
    if (r1 == -1) {
        function removeZero(showlist, id) {
            if (typeof showlist == "object") {
                for (let i = 0; i < showlist.length; i++) {
                    let element = showlist[i]
                    if (element.id === id && element.falg === true) {
                        element.falg = false
                        i--
                    } else {
                        removeZero(element.children, id)
                    }
                }
            } else {
                return
            }
        }
        removeZero(List5, parseInt(145))
        console.log(parseInt(req.body.roid))
        Role.replaceOne({ id: parseInt(req.body.roid) }, List5[0]).then(res => { console.log(res) })
    }

    res.send('ok')
})
// 树形添加权限功能

// 删除role
app.post('/delete/role', jsonParser, async (req, res) => {
    console.log(req.body.delroid)
    Role.findOneAndDelete({ _id: req.body.delroid }).then(result => console.log(result))
    res.send('ok')
})
// 删除role

// 编辑role
app.put('/edit/role', jsonParser, async (req, res) => {
    const arr = Object.keys(req.body)
    console.log(arr)
    if (arr.length == 2) {
        Role.create({
            id: Math.floor(Math.random() * 1000000000),
            roleName: req.body.roleName,
            roleDesc: req.body.roleDesc,
            children: [],
        })
            .then(result => console.log('用户添加成功'))
        res.send('role添加成功')
    } else {
        Role.findOneAndUpdate({ _id: req.body._id }, { roleName: req.body.roleName, roleDesc: req.body.roleDesc }).then(res => { console.log('role修改成功') })
        res.send('ok')
    }
})

// 编辑role

// 分配角色功能
app.put('/user/up/role', jsonParser, async (req, res) => {
    // console.log(req.url)
    // console.log(req.query)
    // console.log(req.body)
    // console.log(req.body.params.userinfo)
    // console.log(req.body.params.id)
    const resb = await Admin.find({ _id: req.body.bid }).then(result => { return result })
    Admin.findOneAndUpdate({ _id: req.body.bid }, { "$set": { role_name: req.body.rid } }).then(result => console.log('分配角色成功'))
    res.send('ok')
})
// 分配角色功能


app.get('/categories', jsonParser, async (req, res) => {
    const type = parseInt(req.query.type)//1，2，3代表查几级
    let alltotals = await Cate.find().then(result => { return result })//直接查询数据库全部数据
    if (type === 2) {
        res.send(alltotals)
    } else {
        const pagenum = parseInt(req.query.pagenum)//查询的页数
        const pagesize = parseInt(req.query.pagesize)//每页的条数,就是要查的条数
        const skips = (pagenum - 1) * pagesize//查询的页数减一乘每页的条数，等于要跳过的条数

        const totals = parseInt(alltotals.length)//数据库里面一共多少条数据
        const allpages = totals / pagesize//数据库总条数除以每页的大小，等于一共多少页

        const data = await Cate.find().skip(skips).limit(pagesize).then(result => { return result })
        // console.log(data)
        res.json({ data, total: totals, pagenum: allpages })
    }
})

app.post('/categories', jsonParser, async (req, res) => {
    console.log(req.body)
    if (req.body.m1.length == 2) {
        var id = Math.floor(Math.random() * 1000000000)
        const data = {
            cat_id: id,
            cat_name: req.body.m.cat_name,
            cat_pid: parseInt(req.body.m.cat_pid),
            cat_level: req.body.m.cat_level,
            cat_deleted: false
        }
        Cate.findOneAndUpdate({ 'children.cat_id': parseInt(req.body.m.cat_pid) }, { $push: { "children.$.children": data } }, { upsert: true, 'new': true }).then(res => { console.log('三级商品添加成功') })
        res.send('三级')
    } else if (req.body.m1.length == 1) {
        var id = Math.floor(Math.random() * 1000000000)
        const data = {
            cat_id: id,
            cat_name: req.body.m.cat_name,
            cat_pid: parseInt(req.body.m.cat_pid),
            cat_level: req.body.m.cat_level,
            cat_deleted: false,
            children: []
        }
        Cate.update({ cat_id: parseInt(req.body.m.cat_pid) }, { $push: { children: { $each: [data] } } }).then(res => { console.log('二级商品添加成功') })
        res.send('二级')
    } else {
        var id = Math.floor(Math.random() * 1000000000)
        const data = await Cate.insertMany({
            cat_id: id,
            cat_name: req.body.m.cat_name,
            cat_pid: 0,
            cat_level: req.body.m.cat_level,
            cat_deleted: false,
            children: []
        }).then(result => { return result })



        // const data = Cate.find({ "children.cat_id": 45, "cat_id": 1 }, { "children": { $elemMatch: { "cat_id": 45 } } }).then(res => { return res })

        res.send(data)
    }

})


// 删除/delete/categories
app.post('/delete/categories', jsonParser, async (req, res) => {
    // 
    // console.log(req.body.cat_level)
    if (req.body.cat_level === 0) {
        Cate.findOneAndDelete({ _id: req.body._id }).then(result => console.log('ok'))
        res.send('ok')
    } else if (req.body.cat_level === 1) {
        // console.log(req.body)

        Cate.update({ cat_id: req.body.cat_pid }, { $pull: { children: { cat_id: req.body.cat_id, cat_level: 1 } } }, { multi: true }).then(res => { console.log('ok') })

        res.send('二级删除成功')
    } else {
        if (req.body.cat_level !== 2) {
            return
        }
        Cate.findOneAndUpdate({ 'children.cat_id': req.body.cat_pid }, { $pull: { "children.$.children": { cat_id: req.body.cat_id } } }).then(res => { console.log('ok') })
        console.log('3')
        res.send('三级删除成功')
    }
})
// 删除/delete/categories

// 编辑/edit/categories
app.put('/edit/categories', jsonParser, async (req, res) => {
    if (req.body.cat_level == 0) {
        Cate.update({ _id: req.body._id }, { cat_name: req.body.cat_name, cat_deleted: req.body.cat_deleted }).then(res => { console.log('ok') })
        res.send('ok')
    } else {
        console.log(req.body)
        res.send('修改失败')
    }

})
// 编辑/edit/categories

// 动态参数静态参数
app.get('/categories/attr', jsonParser, async (req, res) => {
    console.log(req.query.id)
    console.log(req.query.sel)
    const data = await Param.find({ attr_sel: req.query.sel, cat_id: req.query.id }).then(result => { return result })

    res.json(data)
})
// 动态参数静态参数
// 添加动态参数静态参数
app.post('/categories/attr', jsonParser, async (req, res) => {
    console.log(req.body)
    const write = req.body.attr_sel == 'only' ? 'manual' : 'list'
    const data = {
        attr_id: Math.floor(Math.random() * 1000000000),
        attr_name: req.body.attr_name,
        cat_id: req.body.id,
        attr_sel: req.body.attr_sel,
        attr_write: write,

    }
    Param.insertMany(data).then(result => { return result })
    res.json(data)
})
// 添加动态参数静态参数
// 编辑动态参数静态参数
app.put('/categories/attr', jsonParser, async (req, res) => {
    console.log(req.body)
    if (req.body.inputVisible === false) {
        const attr_vals = req.body.attr_vals.join(' ')
        Param.findOneAndUpdate({ _id: req.body._id, attr_sel: req.body.attr_sel }, { "$set": { attr_vals: attr_vals } }).then(res => { console.log('ok') })
        res.send('2ok')
    } else {
        Param.findOneAndUpdate({ _id: req.body.id, attr_sel: req.body.attr_sel }, { "$set": { attr_name: req.body.attr_name } }).then(res => { console.log('ok') })
        res.send('1ok')
    }
})
// 删除动态参数静态参数
app.delete('/categories/attr/:id', jsonParser, async (req, res) => {
    console.log(req.url.substring(17))
    console.log(req.body)
    console.log(req.query)

    Param.findOneAndDelete({ _id: req.url.substring(17) }).then(res => { console.log(res) })
    //    Param.insertMany(data).then(result => { return result })
    res.send('ok1')
})
// 删除动态参数静态参数

//获取goods列表
app.get('/goods', jsonParser, async (req, res) => {
    const pagenum = parseInt(req.query.pagenum)
    const pagesize = parseInt(req.query.pagesize)
    const query = req.query.query
    // 微信小程序查看商品接口
    if (req.query.id) {
        const goods = await Good.find({ _id: req.query.id }).then(result => { return result })
        res.send(goods)
        return 0
    }
    // 微信小程序查看商品接口
    // console.log(req.body)

    if (query === '') {
        console.log(req.query)
        const skip = (pagenum - 1) * pagesize
        // 跳过条数skip等于(pagenum - 1) * pagesize
        if (req.query.cid != 0) {
            const id2 = req.query.cid2 == 0 ? { $gt: 0 } : req.query.cid2
            const id3 = req.query.cid3 == 0 ? { $gt: 0 } : req.query.cid3
            // 按照分类id查询
            console.log(id2)
            console.log(id3)
            const goods = await Good.find({ cat_one_id: req.query.cid, cat_two_id: id2, cat_three_id: id3 }).skip(skip).limit(pagesize).then(result => { return result });
            //查询数据库内一共有多少条数据totals
            const totals = await Good.find({ cat_one_id: req.query.cid, cat_two_id: id2, cat_three_id: id3 }).then(result => { return result.length });
            //totals是用户要查询多少条数据，数据库总数据除以pagesize,等于一共多少页
            const allpagenum = parseInt(totals / pagesize)
            //返回查询到的数据，一共多少条，一共多少页
            res.json({ goods, total: totals, pagenum: Math.ceil(allpagenum) })
        } else {
            // 按照页码查询
            const goods = await Good.find().skip(skip).limit(pagesize).then(result => { return result });
            //查询数据库内一共有多少条数据totals
            const totals = await Good.find().then(result => { return result.length });
            //totals是用户要查询多少条数据，数据库总数据除以pagesize,等于一共多少页
            const allpagenum = parseInt(totals / pagesize)
            //返回查询到的数据，一共多少条，一共多少页
            res.json({ goods, total: totals, pagenum: Math.ceil(allpagenum) })
        }


    } else {
        console.log(query)
        //创建正则表达式
        var qinfo = new RegExp(query)
        // 跳过条数skip等于(pagenum - 1) * pagesize
        const skip = (pagenum - 1) * pagesize
        //模糊大法搜索数据
        const goods = await Good.find({ goods_name: { $in: qinfo } }).skip(skip).limit(pagesize).then(result => { return result })
        const totals = await Good.find({ goods_name: { $in: qinfo } }).then(result => { return result.length })
        //totals是用户要查询多少条数据，数据库总数据除以pagesize,等于一共多少页allpagenum
        const allpagenum = parseInt(totals / pagesize)
        //返回查询到的数据，一共多少条，一共多少页
        res.json({ goods, total: totals, pagenum: Math.ceil(allpagenum) })
    }

})
//获取goods列表

// 修改goods
app.put('/goods', jsonParser, async (req, res) => {
    res.send('ok')
})
// 修改goods

// 删除goods
app.delete('/goods/:id', jsonParser, async (req, res) => {
    const id = req.url.substring(7)
    const good = await Good.findOneAndDelete({ goods_id: id }).then(res => { return res })
    console.log(id)
    res.send(good)
})
// 删除goods


// 图片上传
app.post('/upload', (req, res) => {
    // console.log(req.body)
    // console.log(req.query)
    // console.log(req.url)
    //创建formdata表单解析对象
    const form = new formidable.IncomingForm();
    //保存文件位置
    form.uploadDir = path.join(__dirname, 'dist', 'public', 'avatar');
    //保留文件后缀
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        console.log(files.file.path)
        const path = files.file.path
        var arr = path.split('avatar\\')[1]
        // arr[1]
        console.log(arr)
        res.send({ tem_path: arr, url: 'http://127.0.0.1:80/' + arr });

    })
})
// 图片上传

// 删除图片
app.post('/delete/avaters', (req, res) => {
    // console.log(req.body.params)
    // 
    //console.log(path.join(__dirname),'dist', 'public', 'avater')
    var url = req.body.params.split('avatar\\')[1]
    // console.log(url)
    const finalpath = path.join(__dirname, 'dist', 'public', 'avatar', url);
    // console.log(finalpath)
    fs.unlink(finalpath, function (error) {
        if (error) {
            console.log(error);
            return false;
        }
        console.log('删除文件成功');
    })

    res.send('ok')
})
// 删除图片

// 添加商品
app.post('/goods', jsonParser, async (req, res) => {
    console.log(req.body)
    const ids = []
    req.body.attrs.forEach(item => {
        console.log(item._id)
        // item._id.push(ids)
        ids.push(item._id)
    })
    console.log(ids)
    const sjc = new Date().getTime()
    Good.insertMany({
        goods_id: Math.floor(Math.random() * 1000000000),
        goods_name: req.body.goods_name,
        goods_price: req.body.goods_price,
        goods_number: req.body.goods_number,
        goods_weight: req.body.goods_weight,
        goods_state: 0,
        add_time: sjc,
        upd_time: sjc,
        hot_mumber: 0,
        is_promote: false,
        cat_one_id: req.body.goods_cat[0],
        cat_two_id: req.body.goods_cat[1],
        cat_three_id: req.body.goods_cat[2],
        pics: req.body.pics,
        goods_introduce: req.body.goods_introduce,
        attrs: ids
    }).then(result => { return result })
    res.send('ok')
})
// 添加商品

//订单查询
app.get('/orders', jsonParser, async (req, res) => {
    console.log(req.query)
    const pagenum = parseInt(req.query.pagenum)
    const pagesize = parseInt(req.query.pagesize)
    const query = req.query.query
    console.log(req.query)
    if (query === '') {
        const skip = (pagenum - 1) * pagesize
        // 跳过条数skip等于(pagenum - 1) * pagesize
        const orders = await Order.find().skip(skip).limit(pagesize).then(result => { return result });
        //查询数据库内一共有多少条数据totals
        const totals = await Order.find().then(result => { return result.length });
        //totals是用户要查询多少条数据，数据库总数据除以pagesize,等于一共多少页
        const allpagenum = parseInt(totals / pagesize)
        //返回查询到的数据，一共多少条，一共多少页
        res.json({ orders, total: totals, pagenum: Math.ceil(allpagenum) })
    } else {
        console.log(query)
        //创建正则表达式
        var qinfo = new RegExp(query)
        // 跳过条数skip等于(pagenum - 1) * pagesize
        const skip = (pagenum - 1) * pagesize
        //模糊大法搜索数据
        const orders = await Order.find({ orders_name: { $in: qinfo } }).skip(skip).limit(pagesize).then(result => { return result })
        const totals = await Order.find({ orders_name: { $in: qinfo } }).then(result => { return result.length })
        //totals是用户要查询多少条数据，数据库总数据除以pagesize,等于一共多少页allpagenum
        const allpagenum = parseInt(totals / pagesize)
        //返回查询到的数据，一共多少条，一共多少页
        res.json({ orders, total: totals, pagenum: Math.ceil(allpagenum) })
    }

})
//订单查询

// 修改订单地址
app.put('/orders', jsonParser, async (req, res) => {
    var addr = ''
    var sjc = new Date().getTime()
    console.log(req.body)
    req.body.address1.forEach(item => {
        addr += item
    })
    addr += req.body.address2
    console.log(addr)
    Order.findOneAndUpdate({ _id: req.body._id }, { consignee_addr: addr, update_time: sjc }).then(res => {
        console.log(res)
    })
    res.send('ok')
})
// 修改订单地址

//物流
app.get('/kuaidi/:id', jsonParser, async (req, res) => {
    console.log(req.url.split('/')[2])
    var wl = {
        "data": [
            {
                "time": "2018-05-10 09:39:00",
                "ftime": "2018-05-10 09:39:00",
                "context": "已签收,感谢使用顺丰,期待再次为您服务",
                "location": ""
            },
            {
                "time": "2018-05-10 08:23:00",
                "ftime": "2018-05-10 08:23:00",
                "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                "location": ""
            },
            {
                "time": "2018-05-10 07:32:00",
                "ftime": "2018-05-10 07:32:00",
                "context": "快件到达 [北京海淀育新小区营业点]",
                "location": ""
            },
            {
                "time": "2018-05-10 02:03:00",
                "ftime": "2018-05-10 02:03:00",
                "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                "location": ""
            },
            {
                "time": "2018-05-09 23:05:00",
                "ftime": "2018-05-09 23:05:00",
                "context": "快件到达 [北京顺义集散中心]",
                "location": ""
            },
            {
                "time": "2018-05-09 21:21:00",
                "ftime": "2018-05-09 21:21:00",
                "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                "location": ""
            },
            {
                "time": "2018-05-09 13:07:00",
                "ftime": "2018-05-09 13:07:00",
                "context": "顺丰速运 已收取快件",
                "location": ""
            },
            {
                "time": "2018-05-09 12:25:03",
                "ftime": "2018-05-09 12:25:03",
                "context": "卖家发货",
                "location": ""
            },
            {
                "time": "2018-05-09 12:22:24",
                "ftime": "2018-05-09 12:22:24",
                "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                "location": ""
            },
            {
                "time": "2018-05-08 21:36:04",
                "ftime": "2018-05-08 21:36:04",
                "context": "商品已经下单",
                "location": ""
            }
        ],
        "meta": { "status": 200, "message": "获取物流信息成功！" }
    }
    res.send(wl)
})
//物流

// report
app.get('/report', jsonParser, async (req, res) => {
    var report = {
        "legend": {
            "data": [
                "华东",
                "华南",
                "华北",
                "西部",
                "其他"
            ]
        },
        "yAxis": [
            {
                "type": "value"
            }
        ],
        "xAxis": [
            {
                "data": [
                    "2017-12-27",
                    "2017-12-28",
                    "2017-12-29",
                    "2017-12-30",
                    "2017-12-31",
                    "2018-1-1"
                ]
            }
        ],
        "series": [
            {
                "name": "华东",
                "type": "line",
                "stack": "总量",
                "areaStyle": {
                    "normal": {}
                },
                "data": [
                    2999,
                    3111,
                    4100,
                    3565,
                    3528,
                    6000
                ]
            },
            {
                "name": "华南",
                "type": "line",
                "stack": "总量",
                "areaStyle": {
                    "normal": {}
                },
                "data": [
                    5090,
                    2500,
                    3400,
                    6000,
                    6400,
                    7800
                ]
            },
            {
                "name": "华北",
                "type": "line",
                "stack": "总量",
                "areaStyle": {
                    "normal": {}
                },
                "data": [
                    6888,
                    4000,
                    8010,
                    12321,
                    13928,
                    12984
                ]
            },
            {
                "name": "西部",
                "type": "line",
                "stack": "总量",
                "areaStyle": {
                    "normal": {}
                },
                "data": [
                    9991,
                    4130,
                    7777,
                    12903,
                    13098,
                    14028
                ]
            },
            {
                "name": "其他",
                "type": "line",
                "stack": "总量",
                "areaStyle": {
                    "normal": {}
                },
                "data": [
                    15212,
                    5800,
                    10241,
                    14821,
                    15982,
                    14091
                ]
            }
        ]
    }
    res.send(report)
})
// report


//微信购物车
app.post('/favorites', jsonParser, async (req, res) => {
    // console.log(req.body)
    console.log(req.body.id)

    const goods = await Good.find({ $or: req.body.id }).then(res => { return res })
    res.send(goods)
})
//微信购物车
app.listen(80, () => {
    console.log('server running at http://127.0.0.1:80')
})
// ljhmm.com,www.ljhmm.com
// 时间戳
// var sjc = new Date().getTime()

// function xh() {
//     setTimeout(() => {
//         console.log(sjc)
//         xh()
//     }, 1000);

// }
// xh()
// Math.floor(Math.random() * 1000000000)