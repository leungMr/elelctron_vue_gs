/*
* 该模块是业务路由器，目前管理的业务有：登录、注册
* */

let {Router} = require('express')

//引入用户模型
let userModel = require('../model/userModel')


let router = new Router()

//业务路由----注册
router.post('/api/register', async (request, response) => {
  //1.获取用户的输入
  const {email, username, password, companyname} = request.body
  //2.校验数据的合法性
  //定义正则表达式
  const emailReg = /^[a-zA-Z0-9_]{2,16}@[a-zA-Z0-9]{2,16}\.com$/
  const usernameReg = /[\u4e00-\u9fa5]/gm
  const passwordReg = /^[a-zA-Z0-9_#]{6,16}$/
  const companynameReg = /[\u4e00-\u9fa5]/gm
  //定义一个收集错误信息的对象
  const errMsg = {}
  //使用正则进行校验
  if (!emailReg.test(email)) {
    //response.send('邮箱输入不合法！要求邮箱用户名2-16位不包含特殊字符，邮箱主机名2-16位')
    //return
    errMsg.emailErr = '邮箱输入不合法！要求邮箱用户名2-16位不包含特殊字符，邮箱主机名2-16位'
  }
  if (!usernameReg.test(companyname)) {
    errMsg.nickNameErr = '公司名输入不合法，应为中文'
  }
  if (!companynameReg.test(username)) {
    errMsg.nickNameErr = '用户名输入不合法，应为中文'
  }
  if (!passwordReg.test(password)) {
    // response.send('密码输入不合法，密码应为6-16位字符不包含特殊字符')
    // return
    errMsg.passwordErr = '密码输入不合法，密码应为6-16位字符不包含特殊字符'
  }

  //判断错误对象是否为空
  if (JSON.stringify(errMsg) !== '{}') {
    //若果进入该判断，意味着用户输入的数据存在不合法的
    response.send(200, {errMsg})
    return
  }

  //try里面放可能出现错误的代码，一旦出现错误，会携带着错误信息来到catch中。
  try {
    //3.检查该邮箱是否注册过
    let finResult = await userModel.findOne({email})
    if (finResult) {
      //response.send(`注册失败，${email}邮箱已经被注册了`)
      //return
      errMsg.emailErr = `注册失败，${email}邮箱已经被注册了`
      response.send(200, {errMsg})
    } else {
      await userModel.create({email, username, password,companyname})
      console.log(`邮箱为：${email}，昵称为:${username}的用户注册成功了！`)
      response.send(200, "成功")
    }
  } catch (err) {
    //1.计数 2.引入警报模块
    console.log(err)
    errMsg.networkErr = `阿偶，网络不稳定，稍后重试！`
    //response.send('阿偶，网络不稳定，稍后重试！')
    response.send(200, {errMsg})
  }
})

//业务路由 ---登录
router.post('/login', async (request, response) => {
  //1.获取用户的输入
  const {email, password} = request.body
  //定义正则表达式
  const emailReg = /^[a-zA-Z0-9_]{2,16}@[a-zA-Z0-9]{2,16}\.com$/
  const passwordReg = /^[a-zA-Z0-9_#]{6,16}$/
  const errMsg = {}
  //使用正则进行校验
  if (!emailReg.test(email)) {
    //response.send('邮箱输入不合法！要求邮箱用户名2-16位不包含特殊字符，邮箱主机名2-16位')
    //return
    errMsg.emailErr = '邮箱输入不合法！要求邮箱用户名2-16位不包含特殊字符，邮箱主机名2-16位'
  }
  if (!passwordReg.test(password)) {
    // response.send('密码输入不合法，密码应为6-16位字符不包含特殊字符')
    // return
    errMsg.passwordErr = '密码输入不合法，密码应为6-16位字符不包含特殊字符'
  }
  //判断错误对象是否为空
  if (JSON.stringify(errMsg) !== '{}') {
    response.send('login', {errMsg})
    return
  }

  try {
    let findResult = await userModel.findOne({email, password: md5(password)})
    if (findResult) {
      //1.在服务器中开辟一块内存，用于存储session
      //2.将用户的id存入上一步产生的session中
      //3.获取session的编号，放入一个cookie中
      //4.将上一步的cookie返回给客户端
      //以上四步可以通过一行代码搞定
      request.session._id = findResult._id
      response.redirect('/usercenter')
    } else {
      errMsg.loginErr = '登录失败，邮箱或密码输入错误！'
      //response.send('登录失败，邮箱或密码输入错误！')
      response.send('login', {errMsg})
    }
  } catch (err) {
    console.log(err)
    errMsg.networkErr = '阿偶，网络不稳定，稍后重试！'
    //response.send('阿偶，网络不稳定，稍后重试！')
    response.send('login', {errMsg})

  }


})


router.get('/api/test', async (request, response) => {
  let findResult = await userModel.findOne({email:"945029149@qq.com"})
  response.send(findResult)
})

module.exports = router
