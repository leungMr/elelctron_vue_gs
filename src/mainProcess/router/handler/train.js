// try {
//   //3.检查该邮箱是否注册过
//   let finResult = await userModel.findOne({email})
//   if (finResult) {
//     //response.send(`注册失败，${email}邮箱已经被注册了`)
//     //return
//     errMsg.emailErr = `注册失败，${email}邮箱已经被注册了`
//     response.send(200, {errMsg})
//   } else {
//     await userModel.create({email, username, password, companyname})
//     console.log(`邮箱为：${email}，昵称为:${username}的用户注册成功了！`)
//     response.send(200, "成功")
//   }
// } catch (err) {
//   //1.计数 2.引入警报模块
//   console.log(err)
//   errMsg.networkErr = `阿偶，网络不稳定，稍后重试！`
//   //response.send('阿偶，网络不稳定，稍后重试！')
//   response.send(200, {errMsg})
// }
let userModel = require('../../model/userModel')

let findTrainListHandler = async (req, res) => {
  let findResult = await userModel.find({'name':'赵六'})
  console.log(findResult)
  res.status(200).send({
    data: null,
    meta: {
      msg: "444",
      code: 0
    }
  })
}

module.exports = findTrainListHandler
