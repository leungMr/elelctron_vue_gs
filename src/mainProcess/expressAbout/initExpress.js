//引入express框架
let express = require('express')
//引入数据库连接模块
let db = require('../db/index')


//引入业务路由
let businessRouter = require('../router/businessRouter')




//创建app服务对象
let app = express()

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//使用内置中间件用于获取post请求体参数
let bodyParser = require('body-parser')

export default function () {
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())

//数据库连接成功后，注册路由
  db.then(() => {
    app.use(businessRouter)


  }).catch((err) => {
    console.log('数据库连接失败', err)
  })

//绑定端口监听
  app.listen(3000, (err) => {
    if (!err) console.log('服务器启动成功！！')
    else console.log(err)
  })
}
