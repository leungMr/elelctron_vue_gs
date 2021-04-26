/*
* 该模块是UI路由器模块，用于管理UI路由，以后配置新页面，在这里定义路由即可
* */
let {Router} = require('express')



let router = new Router()




//UI路由--登录
router.get('/login',(request,response)=>{

  response.render('login')
})
//UI路由--注册
router.get('/register',(request,response)=>{
  response.render('register')
})


module.exports = router