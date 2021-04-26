let {Router} = require('express')
let router = new Router()
// 导入训练接口处理器
let findTrainListHandler = require('./handler/train')

//业务路由----注册
router.post('/api/findTrainList', async (req, res) => {
  findTrainListHandler(req, res)
})
module.exports = router
